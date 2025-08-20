import { Request, Response } from "express";
import Property from "../models/property.models";



// Escape everything that isn't a letter or digit (keeps A–Z, a–z, 0–9)
function escapeLocation(text: string): string {
    return text.replace(/[^A-Za-z0-9]/g, "\\$&");
}

// GET /api/properties
// Supports filters: location, type, minPrice, maxPrice
// Supports pagination: page, limit
export const getProperties = async (req: Request, res: Response) => {
    try {
        const filter: Record<string, any> = {};

        // Location (case-insensitive, safely escaped)
        if (req.query.location) {
            const safe = escapeLocation(req.query.location as string);
            filter.location = { $regex: safe, $options: "i" };
        }

        // Type (exact mathvbjch)
        if (req.query.type) {
            filter.type = req.query.type;
        }

        // Price range
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
        }

        // Pagination
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        // Query
        const [data, total] = await Promise.all([
            Property.find(filter).skip(skip).limit(limit),
            Property.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message || "Server error" });
    }
};

