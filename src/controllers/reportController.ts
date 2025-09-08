import { Request, Response, NextFunction } from "express";
import Report from "../models/report";




// Create a new report
export const createReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, propertyId, reason, details } = req.body;
        if (!userId || !propertyId || !reason) {
            return res.status(400).json({ message: "userId, propertyId, and reason required" });
        }

        const report = await Report.create({ userId, propertyId, reason, details });
        return res.status(201).json({ message: "Report created", data: report });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

// Get reports for a property
export const getReportsForProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const propertyId = req.params.propertyId;
        const reports = await Report.find({ propertyId });
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};


