import { Router } from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  toggleVerifyBadge,
  approvePropertyListing,
  rejectPropertyListing,
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

// ✅ Reject property (Admin only)
router.put("/reject/:id", authMiddleware, adminMiddleware, rejectPropertyListing);

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


// public access for approved properties
router.get("/user/approved", (req, res, next) => {
  const allowedOrigins = [
    "https://realty-finder.vercel.app",
    "http://localhost:5173", // optional for local testing
  ];

  const requestOrigin = req.headers.origin;

  if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message:
        "Access denied. This endpoint can only be accessed from the official RealtyFinder website.",
    });
  }
}, getUserApprovedProperties);



router.get("/user/pending", authMiddleware, getUserPendingProperties);
router.get("/user/rejected", authMiddleware, getUserRejectedProperties);

export default router;
