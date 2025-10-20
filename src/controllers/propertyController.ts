import { Request, Response } from "express";
import Property from "../models/property";
import { escapeLocation } from "../utils/helpers";
import { IUser } from "../models/user";
import { logActivity } from "../utils/activityLogger";



// ---------------------- CREATE PROPERTY ----------------------
export const createProperty = async (req: Request, res: Response) => {
  try {
    // ✅ Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = (req.user as IUser)._id;
    const { title, description, price, location, type, address, state, country, postalCode, area, bedrooms, bathrooms, } = req.body;

    // ✅ Validate input
    if (!title || !description || !price || !location || !type || !address || !state || !country || !postalCode || !area || !bedrooms || !bathrooms) {
      return res.status(400).json({
        success: false,
        message: "All fields (title, description, price, location, type) are required",
      });
    }

    // ✅ Handle uploaded images
    let imagePaths: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      imagePaths = req.files.map((file: any) => file.path);
    } else if (req.file) {
      imagePaths = [(req.file as any).path];
    }

    // ✅ Create property
    const property = new Property({
      title,
      description,
      price: Number(price),
      location,
      type,
      address,
      state,
      country,
      postalCode,
      area,
      rooms: Number(bedrooms),
      features: bathrooms,
      images: imagePaths,
      user: userId,
      isApproved: false,
      approvalStatus: "pending",
    });

    await property.save();

    // ✅ Log user activity
    await logActivity(
      String(userId),
      `Added new property: ${property.title}`,
      "success"
    );

    // ✅ Send response
    return res.status(201).json({
      success: true,
      message: "Property submitted successfully and is pending admin approval",
      property,
    });

  } catch (error: any) {
    console.error("❌ Error creating property:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while creating property",
      error: error.message,
    });
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

    await logActivity(String(user?._id), `Deleted property: ${property.title}`, "success");

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





// Get approved properties
export const getUserApprovedProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find({ isApproved: true })
      .populate("property_owner", "firstName lastName email");

    res.status(200).json({ success: true, data: properties });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }

};


// Get pending properties
export const getUserPendingProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find({ isApproved: false, approvalStatus: "pending" })
      .populate("property_owner", "firstName lastName email");
    res.status(200).json({ success: true, data: properties });
    
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  } 
};

// Get rejected properties
export const getUserRejectedProperties = async (req: Request, res: Response) => {
  try { 
    const properties = await Property.find({ approvalStatus: "rejected" })
      .populate("property_owner", "firstName lastName email");
    res.status(200).json({ success: true, data: properties });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};



    
  