import express from "express";
import auth, { allowRoles } from "../middleware/auth.js";
import Message from "../models/Message.js";

const router = express.Router();

// Send a message to admins/volunteers
router.post("/", auth, async (req, res) => {
  const { content, toRole = "admin" } = req.body;
  if (!content) return res.status(400).json({ message: "Content required" });
  const msg = await Message.create({ content, toRole, from: req.user._id });
  res.status(201).json(msg);
});

// List messages visible to the user
router.get("/", auth, async (req, res) => {
  const role = req.user.role;
  let filter = {};
  if (role === "admin" || role === "volunteer") {
    filter = { toRole: role };
  } else {
    filter = { from: req.user._id };
  }
  const msgs = await Message.find(filter)
    .sort("-createdAt")
    .limit(50)
    .populate("from", "name role");
  res.json(msgs);
});

export default router;
