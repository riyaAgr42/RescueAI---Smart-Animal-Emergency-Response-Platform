import express from "express";
import auth, { allowRoles } from "../middleware/auth.js";
import Animal from "../models/Animal.js";

const router = express.Router();

// Create a simple animal record (admin or volunteer)
router.post("/", auth, allowRoles("admin", "volunteer"), async (req, res) => {
  try {
    const animal = await Animal.create(req.body);
    res.status(201).json(animal);
  } catch (err) {
    res.status(400).json({ message: "Could not create animal", error: err.message });
  }
});

// List all animals, optional status filter
router.get("/", auth, async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const animals = await Animal.find(filter).sort("-createdAt");
  res.json(animals);
});

// Quick status change (volunteer/admin)
router.put("/:id/status", auth, allowRoles("admin", "volunteer"), async (req, res) => {
  const { status } = req.body;
  const allowed = ["rescued", "rehab", "adoptable", "adopted"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });
  const animal = await Animal.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!animal) return res.status(404).json({ message: "Animal not found" });
  res.json(animal);
});

// Add a health update
router.post("/:id/health", auth, allowRoles("admin", "volunteer"), async (req, res) => {
  const animal = await Animal.findById(req.params.id);
  if (!animal) return res.status(404).json({ message: "Animal not found" });
  animal.healthUpdates.unshift(req.body);
  await animal.save();
  res.json(animal);
});

// Add a doctor appointment suggestion
router.post("/:id/appointment", auth, allowRoles("admin", "volunteer"), async (req, res) => {
  const animal = await Animal.findById(req.params.id);
  if (!animal) return res.status(404).json({ message: "Animal not found" });
  animal.doctorAppointments.unshift(req.body);
  await animal.save();
  res.json(animal);
});

export default router;
