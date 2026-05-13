import express from "express";
import auth, { allowRoles } from "../middleware/auth.js";
import Donation from "../models/Donation.js";

const router = express.Router();

// Create a donation pledge
router.post("/", auth, async (req, res) => {
  try {
    const donation = await Donation.create({ ...req.body, donor: req.user._id });
    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ message: "Could not create donation", error: err.message });
  }
});

// List donations (admin sees all; user sees own)
router.get("/", auth, async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { donor: req.user._id };
  const list = await Donation.find(filter)
    .populate("donor", "name email")
    .populate("animal", "name species status");
  res.json(list);
});

// Mark received (admin only)
router.put("/:id/receive", auth, allowRoles("admin"), async (req, res) => {
  const donation = await Donation.findByIdAndUpdate(
    req.params.id,
    { status: "received" },
    { new: true }
  );
  if (!donation) return res.status(404).json({ message: "Donation not found" });
  res.json(donation);
});

export default router;
