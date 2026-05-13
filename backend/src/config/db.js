import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not set in environment");
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Mongo connection error", error.message);
    console.error(
      "If using Atlas, verify: Network Access allows your IP (or 0.0.0.0/0), username/password are correct, and SRV connection string matches your cluster."
    );
    process.exit(1);
  }
};

export default connectDB;
