import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth, { allowRoles } from "../middleware/auth.js";

const router = express.Router();

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });
    const user = await User.create({ name, email, password, role, phone });
    const token = generateToken(user._id, user.role);
    res.status(201).json({ user: { ...user.toObject(), password: undefined }, token });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await user.matchPassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = generateToken(user._id, user.role);
    res.json({ user: { ...user.toObject(), password: undefined }, token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// Let a logged-in user become a volunteer without admin help
router.post("/become-volunteer", auth, async (req, res) => {
  if (req.user.role === "volunteer") {
    return res.json({ message: "Already a volunteer", user: req.user });
  }
  req.user.role = "volunteer";
  await req.user.save();
  res.json({ message: "Role updated to volunteer", user: req.user });
});

router.get("/users", auth, allowRoles("admin"), async (req, res) => {
  const filter = req.query.role ? { role: req.query.role } : {};
  const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
  res.json(users);
});

router.get("/volunteers", auth, allowRoles("admin"), async (req, res) => {
  const volunteers = await User.find({ role: "volunteer" }).select("-password").sort({ createdAt: -1 });
  res.json(volunteers);
});

export default router;
