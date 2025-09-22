import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";

// Route imports
import authRoutes from "./routes/authRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import reportRoutes from "./routes/reportRoutes";
import alertRoutes from "./routes/alertRoutes";
import profileRoutes from "./routes/profileRoutes";




dotenv.config();

const app = express();
app.use(express.json());

// ------------------ CORS Setup ------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://realty-finder.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


// Handle preflight requests
app.options("*", cors());


// ------------------ Routes ------------------
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/profile", profileRoutes);



//Handle undefined routes
app.use((req: Request, res: Response) => {
    res.status(404).json({
        message: `The URL ${req.originalUrl} doesn't exist`
    });
});


//Health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "API is healthy" });
});





// Serve uploads folder
app.use("/uploads", express.static("uploads"));

// Initialize Passport
app.use(passport.initialize());

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("RealityFinder API is running");
});




// ------------------ MongoDB ------------------
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------ Start Server ------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
