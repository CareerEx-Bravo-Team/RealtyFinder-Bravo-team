import { Router } from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  toggleVerifyBadge,
} from "../controllers/propertyController";
import { upload } from "../middlewares/propertyUploadMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();



// Create property (only logged-in users, ideally admins/agents)
router.post("/", authMiddleware, upload.array("images", 5), createProperty);

// Update property (only owner or admin)
router.put("/:id", authMiddleware, upload.array("images", 5), updateProperty);

// Delete property (only owner or admin)
router.delete("/:id", authMiddleware, deleteProperty);

// Toggle Verified Badge (only admin)
router.patch("/:id/toggle-verify", authMiddleware, toggleVerifyBadge);

// USERS ROUTES
// Get properties (public endpoint, with filters & pagination)
router.get("/", getProperties);

// Get property by ID (public endpoint)
router.get("/:id", getPropertyById);

export default router;
