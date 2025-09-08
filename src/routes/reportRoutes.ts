import { Router } from "express";
import { createReport } from "../controllers/reportController";



const router = Router();

// POST /api/reports
router.post("/properties/:propertyId/report", createReport);

// GET /api/reports/:propertyId
router.get("/properties/:propertyId/reports", createReport);

// DELETE /api/reports/:reportId
router.delete("/reports/:reportId", createReport);




export default router;