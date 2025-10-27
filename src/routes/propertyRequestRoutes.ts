import express from "express";
import {
  approvePropertyRequest,
  createPropertyRequest,
  rejectPropertyRequest,
  getAllPropertyRequests,
  getPendingPropertyRequests,
  deletePropertyRequest,
  getRejectedPropertyRequests
} from "../controllers/propertyRequestController";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware";


const router = express.Router();

// Buyer creates property request
router.post("/create", authMiddleware, createPropertyRequest);

// Admin approves request
router.put("/approve/:id", authMiddleware, adminMiddleware, approvePropertyRequest);

// Admin rejects request
router.put("/reject/:id", authMiddleware, adminMiddleware, rejectPropertyRequest);

// Get all property requests
router.get("/", authMiddleware, adminMiddleware, getAllPropertyRequests);

// Get pending property requests
router.get("/pending", authMiddleware, adminMiddleware, getPendingPropertyRequests);

// Delete property request
router.delete("/:id", authMiddleware, adminMiddleware, deletePropertyRequest);

// Get rejected property requests
router.get("/rejected", authMiddleware, adminMiddleware, getRejectedPropertyRequests);

export default router;
