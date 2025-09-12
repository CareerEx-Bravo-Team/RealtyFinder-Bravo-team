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
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://realty-finder.vercel.app"
];

//
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle opttions globally
app.options("*", cors());


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
