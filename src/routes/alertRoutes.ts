import { Router } from "express";
import { createAlert, getAlertsForUser, updateAlert, deleteAlert } from "../controllers/alertControllers";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Create alert
router.post("/", authMiddleware, createAlert);

// Get alerts for a user
router.get("/:userId", authMiddleware, getAlertsForUser);

// Update alert
router.patch("/:id", authMiddleware, updateAlert);

// Delete alert
router.delete("/:id", authMiddleware, deleteAlert);

export default router;
