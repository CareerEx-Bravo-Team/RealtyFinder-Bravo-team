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


// ---------------------- GET PROPERTY BY ID ----------------------
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id).populate("user", "-password");
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.status(200).json({ success: true, data: property });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};




// ---------------------- UPDATE PROPERTY ----------------------
interface AuthUser {
  _id: string;
  role: string;
  // add other fields if needed
}

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    // Only the owner or admin can update
    const user = req.user as AuthUser | undefined;
    if (user?._id.toString() !== property.user.toString() && user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const { title, description, price, location, type } = req.body;

    // Collect new uploaded image paths
    const newImagePaths = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.path)
      : [];
    // If new images are uploaded, replace the old ones
    if (newImagePaths.length > 0) {
      property.images = newImagePaths;
    }
    property.title = title || property.title;
    property.description = description || property.description;
    property.price = price ? Number(price) : property.price;
    property.location = location || property.location;
    property.type = type || property.type;

    await property.save();

    res.status(200).json({ success: true, message: "Property updated", data: property });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};



// ---------------------- DELETE PROPERTY ----------------------
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    // Only the owner or admin can delete
    const user = req.user as AuthUser | undefined;
    if (user?._id.toString() !== property.user.toString() && user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await property.deleteOne();
    res.status(200).json({ success: true, message: "Property deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};







// TOGGLE VERIFIED BADGE
export const toggleVerifyBadge = async (req: Request, res: Response) => {
  try {
    const propertyId = req.params.id;

    // Only admin can toggle badges
    const user = req.user as AuthUser | undefined;
    if (user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // Find the property first
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Toggle badges automatically
    property.verifiedBadge = !property.verifiedBadge;
    property.landlordBadge = !property.landlordBadge;

    // Save the changes
    await property.save();

    res.status(200).json({
      success: true,
      message: "Badge status toggled",
      data: property,
    });

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};






  