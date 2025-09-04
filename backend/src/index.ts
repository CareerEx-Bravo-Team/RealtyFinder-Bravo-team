import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes"; // ✅ import the router

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT: string = process.env.PORT ?? "5000";

// ✅ use the imported router
app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("RealityFinder API is running");
});

const mongoUri: string = process.env.MONGODB_URI || "mongodb://localhost:27017/mydb";

mongoose
  .connect(mongoUri).then(() => {
    console.log(`✅ MongoDB Connected`)
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT ?? "unknown"}`)
  })
}).catch((error) => {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1);
});
