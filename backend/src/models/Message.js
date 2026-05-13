import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toRole: { type: String, enum: ["admin", "volunteer"], default: "admin" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
