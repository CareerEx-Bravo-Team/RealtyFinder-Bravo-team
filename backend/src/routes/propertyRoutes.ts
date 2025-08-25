import express from "express";
import { createProperty } from "../controllers/propertyController";

const router = express.Router();

// POST /api/properties
router.post("/", createProperty);

export default router;
