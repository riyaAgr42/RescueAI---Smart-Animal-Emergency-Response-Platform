import express from "express";
import auth, { allowRoles } from "../middleware/auth.js";
import Adoption from "../models/Adoption.js";

const router = express.Router();

// User requests adoption
router.post("/", auth, async (req, res) => {
  try {
    const payload = { ...req.body, requester: req.user._id };
    const adoption = await Adoption.create(payload);
    res.status(201).json(adoption);
  } catch (err) {
    res.status(400).json({ message: "Could not submit adoption", error: err.message });
  }
});

// List requests (admin can see all; user sees own)
router.get("/", auth, async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { requester: req.user._id };
  const list = await Adoption.find(filter)
    .populate("animal", "name species breed status")
    .populate("requester", "name email");
  res.json(list);
});

// Admin decision
router.put("/:id", auth, allowRoles("admin"), async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "approved", "rejected"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });
  const updated = await Adoption.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Adoption not found" });
  res.json(updated);
});

export default router;
