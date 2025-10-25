import { Router } from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  toggleVerifyBadge,
  approvePropertyListing,
  getUserApprovedProperties,
  getUserPendingProperties,
  getUserRejectedProperties
} from "../controllers/propertyController";
import { upload } from "../middlewares/propertyUploadMiddleware";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// -------------------- PROPERTY CREATION --------------------
// ✅ Create property (logged-in users)
router.post("/", authMiddleware, upload.array("images", 5), createProperty);

// -------------------- PROPERTY ADMIN ACTIONS --------------------
// ✅ Approve property (Admin only)
router.put("/approve/:id", authMiddleware, adminMiddleware, approvePropertyListing);

// ✅ Toggle verified badge (Admin only)
router.patch("/:id/toggle-verify", authMiddleware, adminMiddleware, toggleVerifyBadge);

// ✅ Delete property (Owner or Admin)
router.delete("/:id", authMiddleware, deleteProperty);

// ✅ Update property (Owner or Admin)
router.put("/:id", authMiddleware, upload.array("images", 5), updateProperty);

// -------------------- PROPERTY VIEWS --------------------
// ✅ Get all properties (public)
router.get("/", getProperties);

// ✅ Get property by ID (public)
router.get("/:id", getPropertyById);

// ✅ User’s Approved, Pending, Rejected (Logged-in only)
router.get("/user/approved", authMiddleware, getUserApprovedProperties);
router.get("/user/pending", authMiddleware, getUserPendingProperties);
router.get("/user/rejected", authMiddleware, getUserRejectedProperties);

export default router;
