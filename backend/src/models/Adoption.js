import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema(
  {
    animal: { type: mongoose.Schema.Types.ObjectId, ref: "Animal", required: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Adoption = mongoose.model("Adoption", adoptionSchema);
export default Adoption;
