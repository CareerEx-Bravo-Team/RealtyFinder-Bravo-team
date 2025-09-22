import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { updateProfile } from "../controllers/profileController";
import { uploadProfilePhoto } from "../middlewares/uploadMiddleware";


const router = Router();


// Update user profile
router.put("/update-profile", authMiddleware, uploadProfilePhoto.single("profilePhoto"), updateProfile);




export default router;
