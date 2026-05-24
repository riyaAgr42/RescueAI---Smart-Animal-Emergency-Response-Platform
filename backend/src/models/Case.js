import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    imageUrl: { type: String },
    description: { type: String, required: true, trim: true },
    animalType: {
      type: String,
      enum: ["dog", "cat", "cow", "bird", "other"],
      default: "other",
    },
    emergencyLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    reporterContact: { type: String, trim: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "en_route", "at_clinic", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    priorityScore: { type: Number, default: 0 },
    injuryDetected: { type: Boolean, default: false },
    aiAnalysis: {
      severity: { type: String, enum: ["mild", "medium", "critical"], default: "mild" },
      duplicateRisk: { type: String, enum: ["low", "review", "high"], default: "low" },
      suggestions: [{ type: String }],
    },
    timeline: [
      {
        at: { type: Date, default: Date.now },
        message: String,
        actor: { type: String },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const RescueCase = mongoose.model("Case", caseSchema);
export default RescueCase;
