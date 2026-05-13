import mongoose from "mongoose";

const healthUpdateSchema = new mongoose.Schema(
  {
    note: { type: String, required: true },
    doctorName: { type: String },
    checkupDate: { type: Date, default: Date.now },
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    scheduledFor: { type: Date, required: true },
    doctorName: { type: String },
    recommendation: { type: String },
    suggestedBy: { type: String },
  },
  { _id: false }
);

const animalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String, default: "dog" },
    breed: { type: String },
    ageYears: { type: Number },
    status: {
      type: String,
      enum: ["rescued", "rehab", "adoptable", "adopted"],
      default: "rescued",
    },
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
    foodPreferences: [String],
    dietNotes: { type: String },
    healthUpdates: [healthUpdateSchema],
    doctorAppointments: [appointmentSchema],
  },
  { timestamps: true }
);

const Animal = mongoose.model("Animal", animalSchema);
export default Animal;
