import { Request, Response, NextFunction } from "express";
import Alert from "../models/alert";

export async function createAlert(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, filter, channels, active } = req.body;
        if (!userId || !filter) return res.status(400).json({ message: "userId and filter are required" });
        
        const a = await Alert.create({ userId, filter, channels, active });
        return res.status(201).json({ message: "Alert created", data: a });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};



// Get alerts for a user
export async function getAlertsForUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.userId;
        const alerts = await Alert.find({ userId });
        return res.status(200).json(alerts);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
}



// update alert by id
export const updateAlert = async (req: Request, res: Response, next: NextFunction) => {
    const alertId = req.params.id;
    try {
        const updated = await Alert.findByIdAndUpdate(alertId, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: "Alert not found" });
        }
        return res.status(200).json({ message: "Alert updated", data: updated });
  
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};



// delete alert by id
export const deleteAlert = async (req: Request, res: Response, next: NextFunction) => {
    const alertId = req.params.id;
    try {
        const deleted = await Alert.findByIdAndDelete(alertId);

        if (!deleted) {
            return res.status(404).json({ message: "Alert not found" });
        }
        return res.status(200).json({ message: "Alert deleted", data: deleted });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};




