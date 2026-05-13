import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import auth from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "..", "..", "uploads")),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const upload = multer({ storage });
const router = express.Router();

router.post("/chat", auth, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});

export default router;
