import express from "express";
import passport from "../config/passport";
import jwt from "jsonwebtoken";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyOTP,
  resendOTP,
  dashboard,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { IUser } from "../models/user";

const router = express.Router();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// ---------------------- Auth ---------------------- //
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);

// ---------------------- Google OAuth ---------------------- //
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${frontendUrl}/login` }),
  (req, res) => {
    if (!req.user) return res.status(400).json({ message: "Authentication failed" });

    const user = req.user as IUser;
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    const redirectUrl = `${frontendUrl}/oauth-success?token=${token}`;
    return res.redirect(redirectUrl);
  }
);

// ---------------------- Password Management ---------------------- //
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ---------------------- Protected Routes ---------------------- //
router.get("/dashboard", authMiddleware, dashboard);

export default router;
