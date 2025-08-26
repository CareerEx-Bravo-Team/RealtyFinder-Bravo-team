import { Request, Response } from "express";
import Property from "../models/property";
import { escapeLocation } from "../utils/helpers";

// ---------------------- CREATE PROPERTY ----------------------
export const createProperty = async (req: Request, res: Response) => {
  try {
    const { title, description, price, location, type } = req.body;

    // Collect uploaded image paths
    const imagePaths = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.path)
      : [];

    // Use logged-in admin's ID
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const property = new Property({
      title,
      description,
      price: Number(price),
      location,
      type,
      images: imagePaths,
      user: req.user._id, // Link to the user creating the property
    });

    await property.save();

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });
  } catch (error: any) {
    console.error("❌ Error creating property:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};






// ---------------------- GET PROPERTIES ----------------------
export const getProperties = async (req: Request, res: Response) => {
  try {
    const filter: Record<string, any> = {};

    // Apply filters if provided
    if (req.query.location) {
      const safe = escapeLocation(req.query.location as string);
      filter.location = { $regex: safe, $options: "i" };
    }

    // Filter by property type
    if (req.query.type) {
      filter.type = req.query.type;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // Pagination
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Property.find(filter).skip(skip).limit(limit).exec(),
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

