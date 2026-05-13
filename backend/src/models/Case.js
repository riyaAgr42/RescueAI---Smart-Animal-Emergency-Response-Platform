import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    imageUrl: { type: String },
    description: { type: String, required: true },
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
