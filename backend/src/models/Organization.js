import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["ngo", "government_hospital", "private_hospital"],
      default: "ngo",
    },
    phone: { type: String, required: true },
    email: { type: String },
    website: { type: String },
    address: { type: String },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    services: [{ type: String }],
  },
  { timestamps: true }
);

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;
