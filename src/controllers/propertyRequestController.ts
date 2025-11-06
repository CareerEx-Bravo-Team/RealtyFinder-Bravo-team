
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
export const approveBuyerPropertyRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 🔍 Find request by ID
    const propertyRequest = await PropertyRequest.findById(id).populate("user");
    if (!propertyRequest) {
      return res.status(404).json({ success: false, message: "Property request not found" });
    }

    // 🟢 Approve the request
    propertyRequest.status = "approved";
    propertyRequest.rejectionReason = "";
    await propertyRequest.save();

    const user = propertyRequest.user as any;

    // 📧 Send email notification
    if (user && user.email) {
      await sendEmail(
        user.email,
        "Your Property Request Has Been Approved",
        `
          <h3>Good news!</h3>
          <p>Your property request for a <strong>${propertyRequest.propertyType}</strong> in <strong>${propertyRequest.location}</strong> has been approved.</p>
          <p>We’ll notify you when a matching property becomes available.</p>
        `
      );
    }

    // 🔔 Create in-app notification
    await Notification.create({
      user: user._id,
      message: `Your property request for ${propertyRequest.propertyType} in ${propertyRequest.location} has been approved.`,
    });

    return res.status(200).json({
      success: true,
      message: "Property request approved successfully.",
      data: propertyRequest,
    });
  } catch (error: any) {
    console.error("❌ Error approving property request:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while approving property request",
      error: error.message,
    });
  }
};


// Reject Property (Admin only)
export const rejectBuyerPropertyRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // ✅ Find the property request
    const propertyRequest = await PropertyRequest.findById(id).populate("user");
    if (!propertyRequest) {
      return res.status(404).json({ success: false, message: "Property request not found" });
    }

    // ✅ Update request status
    propertyRequest.status = "rejected";
    (propertyRequest as any).rejectionReason = reason || "No reason provided";
    await propertyRequest.save();

    const user = propertyRequest.user as any;

    // ✅ Notify requester via email
    if (user && user.email) {
      await sendEmail(
        user.email,
        "Property Request Rejected",
        `
          <h3>Your property request has been rejected.</h3>
          <p><strong>Property Type:</strong> ${propertyRequest.propertyType}</p>
          <p><strong>Location:</strong> ${propertyRequest.location}</p>
          <p><strong>Reason:</strong> ${reason || "No reason provided"}</p>
          <p>If you believe this was an error, you may contact our support team.</p>
        `
      );
    }

    // ✅ Save in-app notification
    await Notification.create({
      user: user._id,
      message: `Your property request for a ${propertyRequest.propertyType} in ${propertyRequest.location} was rejected. Reason: ${reason || "No reason provided"}`,
    });

    // ✅ Response to admin
    return res.json({
      success: true,
      message: `Property request for "${propertyRequest.propertyType}" rejected successfully.`,
      data: propertyRequest,
    });
  } catch (error: any) {
    console.error("❌ Error rejecting property request:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while rejecting property request",
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


// Get approved property requests
export const getApprovedPropertyRequests = async (req: Request, res: Response) => {
  try {
    const propertyRequests = await PropertyRequest.find({ status: "approved" }).populate("user");
    res.json(propertyRequests);
  } catch (error: any) {
    console.error("❌ Error getting approved property requests:", error);
    res.status(500).json({
      success: false,
      message: "Server error while getting approved property requests",
      error: error.message,
    });
  }
};

