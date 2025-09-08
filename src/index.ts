import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import passport from "passport";
import paymentRoutes from "./routes/paymentRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import reportRoutes from "./routes/reportRoutes";
import alertRoutes from "./routes/alertRoutes";

dotenv.config();

const app = express();
app.use(express.json());

//Dynamic CORS configuration
const allowedOrigin = [
  "http://localhost:5173",
  process.env.FRONTEND_URL || "https://realty-finder.vercel.app"
]

// Enable CORS for frontend (adjust in production)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigin.includes(origin)) {
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

const PORT = process.env.PORT || 8000;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/alerts", alertRoutes);

// Serve uploads
app.use("/uploads", express.static("uploads"));

// Initialize Passport
app.use(passport.initialize());

app.get("/", (req: Request, res: Response) => {
  res.send("RealityFinder API is running");
});

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => console.log(`✅ MongoDB Connected`))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
