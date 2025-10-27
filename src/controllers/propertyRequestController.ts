
import { Request, Response } from "express";
import PropertyRequest from "../models/propertyRequest";
import user, { IUser } from "../models/user";
import Notification from "../models/notification";
import { sendEmail } from "../utils/sendEmail";
import Property from "../models/property";
import User from "../models/user";
import { logActivity } from "../utils/activityLogger";


// Property requests by Buyer

export const createPropertyRequest = async (req: Request, res: Response) => {
  try {
    // Implementation for creating a property request
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

    const userId = (req.user as IUser)._id;
    const { propertyType, location, minPrice, maxPrice, bedrooms, bathrooms } = req.body; 

    if ( !propertyType || !location || !minPrice || !maxPrice) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const newRequest = await PropertyRequest.create({
      user: userId,
      email: (req.user as IUser).email,
      propertyType,
      location,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      status: "pending",
    });

    await newRequest.save();

   
    return res.status(201).json({
      success: true,
      message: "Property request created successfully",
      data: newRequest,
    });

  } catch (error: any) {
    console.error("Error creating property request:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while creating property request",
      error: error.message,
    });
  }
};




// Approved Property Requests
export const approvePropertyRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log("Property ID received:", id);


    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }   

    property.isApproved = true;
    property.approvalStatus = "approved";
    property.rejectionReason = "";
    await property.save();

    // Find all buyer request that match this property
    const matchingRequests = await PropertyRequest.find({
        status: "approved",
        propertyType: property.type,
        location: property.location,
        minPrice: { $lte: property.price },
        maxPrice: { $gte: property.price },
    }).populate("user");

    
    for (const reqItem of matchingRequests) {
      const user = reqItem.user as any; // Ensure user is treated as a populated document
      if (user && user.email) {
        // Send email
        await sendEmail(
          user.email,
          "New Property Alert",
          `<p>A new ${property.type} in ${property.location} matches your saved request. Check it out on RealtyFinder!</p>`
        );

        //save notification
        await Notification.create({
          user: user._id,
          message: `New ${property.type} available in ${property.location} that matches your request.`,
        });
      }
    }

    res.json({
      success: true,
      message: "Property approved and alerts sent to matching users.",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// Reject Property (Admin only)
export const rejectPropertyRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Use consistent param name like /property/reject/:id
    const { reason } = req.body;

    // Find property
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Update status
    property.isApproved = false;
    property.approvalStatus = "rejected";
    property.rejectionReason = reason || "No reason provided";
    await property.save();

    // Find property owner
    const owner = await User.findById(property.user);
    if (owner && owner.email) {
      // Send email notification
      await sendEmail(
        owner.email,
        "Property Listing Rejected",
        `<p>Your property listing titled <strong>${property.title}</strong> has been rejected.</p>
         <p><strong>Reason:</strong> ${property.rejectionReason}</p>`
      );

      // Save in-app notification
      await Notification.create({
        user: owner._id,
        message: `Your property "${property.title}" was rejected. Reason: ${property.rejectionReason}`,
      });
    }

    // Response to admin
    res.json({
      success: true,
      message: `Property "${property.title}" rejected successfully.`,
    });

  } catch (error: any) {
    console.error("❌ Error rejecting property:", error);
    res.status(500).json({
      success: false,
      message: "Server error while rejecting property",
      error: error.message,
    });
  }
};

// Get all property requests
export const getAllPropertyRequests = async (req: Request, res: Response) => {
  try {
    const propertyRequests = await PropertyRequest.find().populate("user");
    res.json(propertyRequests);
  } catch (error: any) {
    console.error("❌ Error getting all property requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting all property requests",
      error: error.message,
    });
  }
};


// Get all pending property requests
export const getPendingPropertyRequests = async (req: Request, res: Response) => {
  try {
    const propertyRequests = await PropertyRequest.find({ status: "pending" }).populate("user");
    res.json(propertyRequests);
  } catch (error: any) {
    console.error("❌ Error getting pending property requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting pending property requests",
      error: error.message,
    });
  }
};


//Delete property request
export const deletePropertyRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const propertyRequest = await PropertyRequest.findByIdAndDelete(id);
    if (!propertyRequest) {
      return res.status(404).json({ success: false, message: "Property request not found" });
    }
    res.json({ success: true, message: "Property request deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error deleting property request:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting property request",
      error: error.message,
    });
  }
};

// Get rejected property requests
export const getRejectedPropertyRequests = async (req: Request, res: Response) => {
  try {
    const propertyRequests = await PropertyRequest.find({ status: "rejected" }).populate("user");
    res.json(propertyRequests);
  } catch (error: any) {
    console.error("❌ Error getting rejected property requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting rejected property requests",
      error: error.message,
    });
  }
};

