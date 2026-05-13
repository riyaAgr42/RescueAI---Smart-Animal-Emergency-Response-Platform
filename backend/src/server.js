import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import animalRoutes from "./routes/animalRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const rawAllowed = (process.env.CLIENT_URL || "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const allowAll = process.env.NODE_ENV !== "production" && rawAllowed.includes("*");
const allowedOrigins = allowAll ? true : rawAllowed;

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: allowedOrigins === true ? "*" : allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Socket wiring (minimal)
io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
  socket.on("disconnect", () => console.log("Socket disconnected", socket.id));
});

// Middlewares
app.use(
  cors({
    origin: allowAll ? true : allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes(io));
app.use("/api/volunteer", volunteerRoutes(io));
app.use("/api/messages", messageRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/partners", partnerRoutes());
app.use("/api/animals", animalRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/donations", donationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "RescueAI API is running" });
});

// Start
const PORT = process.env.PORT || 5000;
const start = async () => {
  await connectDB();
  httpServer.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
};

start();
