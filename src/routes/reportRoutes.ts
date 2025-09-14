import { Router } from "express";
import { createReport, getReportsForProperty, deleteReport } from "../controllers/reportController";



const router = Router();

// POST /api/reports
router.post("/properties/:propertyId/report", createReport);

// GET /api/reports/:propertyId
router.get("/properties/:propertyId/reports", getReportsForProperty);

// DELETE /api/reports/:reportId
router.delete("/reports/:reportId", deleteReport);




export default router;