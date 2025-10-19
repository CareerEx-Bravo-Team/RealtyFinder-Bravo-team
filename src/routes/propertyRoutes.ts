import { Router } from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  toggleVerifyBadge,
  getApprovedProperties,
  getPendingProperties,
  getRejectedProperties
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
router.get("/admin/approved", authMiddleware, getApprovedProperties);

// Get pending properties (admin only)
router.get("/admin/pending", authMiddleware, getPendingProperties);

// Get rejected properties (admin only)
router.get("/admin/rejected", authMiddleware, getRejectedProperties);



export default router;
