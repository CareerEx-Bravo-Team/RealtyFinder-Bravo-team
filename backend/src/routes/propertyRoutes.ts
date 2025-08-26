import { Router } from "express";
import { createProperty, getProperties } from "../controllers/propertyController";
import { upload } from "../middlewares/propertyUploadMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Create property (only logged-in users, ideally admins/agents)
router.post(
  "/create-property",
  authMiddleware,
  upload.array("images", 5),
  createProperty
);

// Get properties (public endpoint, with filters & pagination)
router.get("/get-properties", getProperties);

export default router;