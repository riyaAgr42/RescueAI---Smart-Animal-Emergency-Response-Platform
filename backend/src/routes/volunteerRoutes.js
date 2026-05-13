import express from "express";
import auth, { allowRoles } from "../middleware/auth.js";
import RescueCase from "../models/Case.js";
import User from "../models/User.js";

const routerFactory = (io) => {
  const router = express.Router();

  // Accept a case
  router.post("/accept/:id", auth, allowRoles("volunteer", "admin"), async (req, res) => {
    const rescueCase = await RescueCase.findById(req.params.id);
    if (!rescueCase) return res.status(404).json({ message: "Case not found" });
    rescueCase.status = "accepted";
    rescueCase.assignedTo = req.user._id;
    rescueCase.timeline.push({
      message: `Accepted by ${req.user.name}`,
      actor: req.user.name,
    });
    await rescueCase.save();
    io.emit("case:update", rescueCase);
    res.json(rescueCase);
  });

  // Reject/unassign a case (return to pending)
  router.post("/reject/:id", auth, allowRoles("volunteer", "admin"), async (req, res) => {
    const rescueCase = await RescueCase.findById(req.params.id);
    if (!rescueCase) return res.status(404).json({ message: "Case not found" });
    rescueCase.status = "pending";
    rescueCase.assignedTo = null;
    rescueCase.timeline.push({
      message: `Rejected by ${req.user.name}`,
      actor: req.user.name,
    });
    await rescueCase.save();
    io.emit("case:update", rescueCase);
    res.json(rescueCase);
  });

  // Mark as rescued/completed
  router.post("/complete/:id", auth, allowRoles("volunteer", "admin"), async (req, res) => {
    const rescueCase = await RescueCase.findById(req.params.id);
    if (!rescueCase) return res.status(404).json({ message: "Case not found" });
    rescueCase.status = "completed";
    rescueCase.timeline.push({
      message: `Marked rescued by ${req.user.name}`,
      actor: req.user.name,
    });
    await rescueCase.save();
    io.emit("case:update", rescueCase);
    res.json(rescueCase);
  });

  // Mark volunteer en route
  router.post("/enroute/:id", auth, allowRoles("volunteer", "admin"), async (req, res) => {
    const rescueCase = await RescueCase.findById(req.params.id);
    if (!rescueCase) return res.status(404).json({ message: "Case not found" });
    rescueCase.status = "en_route";
    rescueCase.timeline.push({
      message: `${req.user.name} is en route`,
      actor: req.user.name,
    });
    await rescueCase.save();
    io.emit("case:update", rescueCase);
    res.json(rescueCase);
  });

  // Mark animal at clinic/hospital
  router.post("/atclinic/:id", auth, allowRoles("volunteer", "admin"), async (req, res) => {
    const rescueCase = await RescueCase.findById(req.params.id);
    if (!rescueCase) return res.status(404).json({ message: "Case not found" });
    rescueCase.status = "at_clinic";
    rescueCase.timeline.push({
      message: `${req.user.name} reached clinic/hospital`,
      actor: req.user.name,
    });
    await rescueCase.save();
    io.emit("case:update", rescueCase);
    res.json(rescueCase);
  });

  // Update volunteer live location for matching
  router.post("/location", auth, allowRoles("volunteer", "admin"), async (req, res) => {
    const { latitude, longitude } = req.body;
    const volunteer = req.user;
    volunteer.location = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      updatedAt: new Date(),
    };
    await volunteer.save();
    res.json({ message: "Location updated" });
  });

  // Return volunteers nearest to a case
  router.get("/nearby/:caseId", auth, allowRoles("admin", "volunteer"), async (req, res) => {
    const rescueCase = await RescueCase.findById(req.params.caseId);
    if (!rescueCase) return res.status(404).json({ message: "Case not found" });
    const volunteers = await User.find({
      role: "volunteer",
      "location.latitude": { $exists: true },
    });

    const withDistance = volunteers.map((v) => {
      const dLat = ((v.location.latitude - rescueCase.location.latitude) * Math.PI) / 180;
      const dLon = ((v.location.longitude - rescueCase.location.longitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(rescueCase.location.latitude * (Math.PI / 180)) *
          Math.cos(v.location.latitude * (Math.PI / 180)) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = 6371 * c;
      return { volunteer: v, distanceKm };
    });

    withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
    res.json(withDistance.slice(0, 5));
  });

  return router;
};

export default routerFactory;
