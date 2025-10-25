import express from "express";
import {
  approvePropertyRequest,
  createPropertyRequest,
  rejectPropertyRequest,
  getAllPropertyRequests
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

export default router;
