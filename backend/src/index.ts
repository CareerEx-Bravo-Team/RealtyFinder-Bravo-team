import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes"; // ✅ import the router
import propertyRoutes from "./routes/propertyRoutes";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ use the imported router
app.use("/api/auth", authRoutes);

//This serve the frontend the uploads image, useful to show the uploaded peoperty images
app.use("/uploads", express.static("uploads"));

// Import property routes
app.use("/api/properties", propertyRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("RealityFinder API is running");
});

mongoose
  .connect(process.env.MONGODB_URL || "")
  .then(() => console.log(`✅ MongoDB Connected`))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
