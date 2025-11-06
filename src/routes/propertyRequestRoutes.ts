import express from "express";
import {
  approveBuyerPropertyRequest,
  createPropertyRequest,
  rejectBuyerPropertyRequest,
  getAllPropertyRequests,
  getPendingPropertyRequests,
  deletePropertyRequest,
  getRejectedPropertyRequests,
  getApprovedPropertyRequests
} from "../controllers/propertyRequestController";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware";


const router = express.Router();

// Buyer creates property request
router.post("/create", authMiddleware, createPropertyRequest);

// Admin approves request
router.put("/approve/:id", authMiddleware, adminMiddleware, approveBuyerPropertyRequest);

// Admin rejects request
router.put("/reject/:id", authMiddleware, adminMiddleware, rejectBuyerPropertyRequest);

// Get all property requests
router.get("/", authMiddleware, getAllPropertyRequests);

// Get pending property requests
router.get("/pending", authMiddleware, getPendingPropertyRequests);

// Delete property request
router.delete("/:id", authMiddleware, adminMiddleware, deletePropertyRequest);

// Get rejected property requests
router.get("/rejected", authMiddleware, getRejectedPropertyRequests);

// Get approved property requests
router.get("/approved", authMiddleware, getApprovedPropertyRequests);

export default router;
