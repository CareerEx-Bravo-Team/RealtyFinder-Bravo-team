import express from "express";
import passport from "../config/passport";
import { register, login, verifyOTP, forgotPassword, resetPassword, verifyResetOtp, resendOTP, dashboard} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { googleAuthCallback } from "../controllers/authController";



const router = express.Router();


// LOCAL AUTH
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);



//GOOGLE AUTH
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));


router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("👉 Entered /google/callback route");
    next();
  },
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  googleAuthCallback
);




// Password Management
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);



// Protected route
router.get("/dashboard", authMiddleware, dashboard);


export default router;
