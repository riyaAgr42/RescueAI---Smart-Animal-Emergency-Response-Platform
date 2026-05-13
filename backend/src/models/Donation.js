import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    message: { type: String },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    animal: { type: mongoose.Schema.Types.ObjectId, ref: "Animal" },
    status: {
      type: String,
      enum: ["pledged", "received"],
      default: "pledged",
    },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;
