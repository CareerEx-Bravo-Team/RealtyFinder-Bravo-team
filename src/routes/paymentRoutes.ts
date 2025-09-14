import { Router } from "express";
import { processPayment } from "../controllers/paymentController";

const router = Router();

// Process payment
router.post("/process-payment", processPayment);

export default router;
