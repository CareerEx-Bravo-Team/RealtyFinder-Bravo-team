import express from "express";
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
import passport from "../config/passport";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user";


const router = express.Router();

// Auth
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback route after Google authentication
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    // Successful authentication, generate JWT and redirect or respond
    if (!req.user) {
      return res.status(400).json({ message: "Authentication failed" });
    }
    const user = req.user as IUser;
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    // Redirect to frontend with token (you can change this to suit your frontend)
    const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?token=${token}`;
    return res.redirect(redirectUrl);
  }
);



// Password management
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected route (requires JWT)
router.get("/dashboard", authMiddleware, dashboard);


export default router;

