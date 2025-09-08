import { Router } from "express";
import { createAlert, getAlertsForUser, updateAlert, deleteAlert } from "../controllers/alertControllers";
import { authMiddleware } from "../middlewares/authMiddleware";


const router = Router();



// POST /api/alerts
router.post("/", authMiddleware, createAlert);

// GET /api/alerts/:userId
router.get("/:userId", authMiddleware, getAlertsForUser);

// PUT /api/alerts/:id
router.patch("/:id", authMiddleware, updateAlert);

// DELETE /api/alerts/:id
router.delete("/:id", authMiddleware, deleteAlert);



export default router;