import { Router } from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  toggleVerifyBadge,
  getUserApprovedProperties,
  getUserPendingProperties,
  getUserRejectedProperties
} from "../controllers/propertyController";
import { upload } from "../middlewares/propertyUploadMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Create property (logged-in users)
router.post("/", authMiddleware, upload.array("images", 5), createProperty);

// Update property (only owner/admin)
router.put("/:id", authMiddleware, upload.array("images", 5), updateProperty);

// Delete property (only owner/admin)
router.delete("/:id", authMiddleware, deleteProperty);

// Toggle verified badge (admin only)
router.patch("/:id/toggle-verify", authMiddleware, toggleVerifyBadge);

// Get all properties (public)
router.get("/", getProperties);

// Get property by ID (public)
router.get("/:id", getPropertyById);

// Get approved properties (admin only)
router.get("/user/approved", authMiddleware, getUserApprovedProperties);

// Get pending properties (admin only)
router.get("/user/pending", authMiddleware, getUserPendingProperties);

// Get rejected properties (admin only)
router.get("/user/rejected", authMiddleware, getUserRejectedProperties);



export default router;
