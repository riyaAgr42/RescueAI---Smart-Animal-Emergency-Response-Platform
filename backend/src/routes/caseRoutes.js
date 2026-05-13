import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import auth, { allowRoles } from "../middleware/auth.js";
import RescueCase from "../models/Case.js";
import { inferPriority } from "../utils/priority.js";
import Organization from "../models/Organization.js";
import { haversineDistanceKm } from "../utils/geo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "..", "..", "uploads")),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});
const upload = multer({ storage });

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadToCloud = async (filePath) => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return { url: null };
  }
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder: "rescueai/cases",
    });
    return { url: res.secure_url };
  } catch (err) {
    console.error("Cloudinary upload failed, using local file", err.message);
    return { url: null };
  }
};

const routerFactory = (io) => {
  const router = express.Router();

  router.post("/", auth, upload.single("image"), async (req, res) => {
    try {
      const { description, latitude, longitude } = req.body;
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      let imageUrl = null;
      if (req.file) {
        const uploaded = await uploadToCloud(req.file.path);
        const localUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        imageUrl = uploaded.url || localUrl; // served via static in server.js
      }
      const { priority, injuryDetected, score } = inferPriority(description);
      const rescueCase = await RescueCase.create({
        description,
        imageUrl,
        injuryDetected,
        priorityScore: score,
        location: { latitude: lat, longitude: lon },
        priority,
        createdBy: req.user._id,
        timeline: [
          { message: "Case reported", actor: req.user.name },
          injuryDetected
            ? { message: "AI injury detection flagged this case", actor: "RescueAI" }
            : null,
          { message: `Smart priority set to ${priority}`, actor: "RescueAI" },
        ].filter(Boolean),
      });
      const partners = await Organization.find();
      const nearbyPartners = partners
        .map((org) => ({
          org,
          distanceKm: haversineDistanceKm(
            { latitude: lat, longitude: lon },
            { latitude: org.location.latitude, longitude: org.location.longitude }
          ),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 5)
        .map(({ org, distanceKm }) => ({
          id: org._id,
          name: org.name,
          type: org.type,
          phone: org.phone,
          address: org.address,
          distanceKm: Number(distanceKm.toFixed(2)),
        }));

      const response = rescueCase.toObject();
      response.nearbyPartners = nearbyPartners;

      io.emit("case:new", rescueCase);
      res.status(201).json(response);
    } catch (err) {
      console.error("Case create failed", err);
      res.status(500).json({ message: "Could not create case", error: err.message || err });
    }
  });

  router.get("/", auth, async (req, res) => {
    const { status, priority } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    const cases = await RescueCase.find(filters)
      .populate("createdBy", "name role")
      .populate("assignedTo", "name role")
      .sort("-createdAt");
    res.json(cases);
  });

  // Cases created by the logged-in user
  router.get("/mine", auth, async (req, res) => {
    const cases = await RescueCase.find({ createdBy: req.user._id })
      .sort("-createdAt");
    res.json(cases);
  });

  router.get("/:id", auth, async (req, res) => {
    const rescueCase = await RescueCase.findById(req.params.id)
      .populate("createdBy", "name role")
      .populate("assignedTo", "name role");
    if (!rescueCase) return res.status(404).json({ message: "Case not found" });
    res.json(rescueCase);
  });

  router.put("/:id", auth, allowRoles("volunteer", "admin"), async (req, res) => {
    const { status, assignedTo } = req.body;
    const rescueCase = await RescueCase.findById(req.params.id);
    if (!rescueCase) return res.status(404).json({ message: "Case not found" });
    const allowed = ["pending", "accepted", "en_route", "at_clinic", "completed"];
    if (status) {
      if (!allowed.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      rescueCase.status = status;
    }
    if (assignedTo) rescueCase.assignedTo = assignedTo;
    rescueCase.timeline.push({
      message: `Status updated to ${rescueCase.status}`,
      actor: req.user.name,
    });
    await rescueCase.save();
    io.emit("case:update", rescueCase);
    res.json(rescueCase);
  });

  router.delete("/:id", auth, allowRoles("admin"), async (req, res) => {
    const rescueCase = await RescueCase.findById(req.params.id);
    if (!rescueCase) return res.status(404).json({ message: "Case not found" });
    await rescueCase.deleteOne();
    io.emit("case:delete", { id: req.params.id });
    res.json({ message: "Case removed" });
  });

  return router;
};

export default routerFactory;
