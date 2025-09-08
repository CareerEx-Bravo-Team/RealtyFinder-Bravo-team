import { Router } from "express";
import { processPayment } from "../controllers/paymentController";



const router = Router();

// POST /api/payments/process
router.post("/process-payment", processPayment);




export default router;
