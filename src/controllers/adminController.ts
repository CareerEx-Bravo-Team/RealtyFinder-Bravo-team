import { Request, Response } from "express";
import User from "../models/user";
import Property from "../models/property";
import { property, success } from "zod";
import Activity from "../models/activity";
import { sendEmail } from "../utils/sendEmail";
import PropertyRequest from "../models/propertyRequest";
import Notification from "../models/notification";




//Dashboard Statistics
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalListings = await Property.countDocuments();
        const activeListings = await Property.countDocuments({ verifiedBadge: true });
        const agents = await User.countDocuments({ role: "real_estate_agent" });
        const buyers = await User.countDocuments({ role: "individual" });


        res.status(200).json({
            success: true, totalListings, activeListings, agents, buyers
        });
    } catch (error) {
        console.error("Dashboard stats error", error);
        res.status(500).json({ message: "Error fetching dashboard stats:", error });
    }
};



// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { role, isVerified } = req.query;

        // Build filter object based on query parameters
        const filter: any = {};
        if (role) filter.role = role;
        if (isVerified) filter.isVerified = isVerified === "true";


        // Fetch users based on filter
        const users = await User.find(filter).select("-password -otp -otpExpiry");
        res.status(200).json({ success: true, users });

    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: "Error fetching users", error });
    }
};


// Get user details by ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select("-password -otp -otpExpiry");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Get user by ID error:", error);
        res.status(500).json({ message: "Error fetching user", error });
    }
};




//Update user (role, isVerified, profilePhoto, socials)
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { firstName, middleName, lastName, companyName, address, role, isVerified, profilePhoto, socials } = req.body;

        const userId = req.params.id;
        const user = await User.findById(userId);
        
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields if provided
        if (firstName) user.firstName = firstName;
        if (middleName) user.middleName = middleName;
        if (lastName) user.lastName = lastName;
        if (companyName) user.companyName = companyName;
        if (address) user.address = address;
        if (role) user.role = role;
        if (isVerified !== undefined) user.isVerified = isVerified;
        if (profilePhoto) user.profilePhoto = profilePhoto;
        if (socials) user.socials = socials;


        await user.save();

        res.status(200).json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ message: "Error updating user", error });
    }
};



// Delete user by ID
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Error deleting user", error });
    }   
};



// Get recent activities
export const getRecentActivities = async (req: Request, res: Response) => {
    try {
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .populate("user", "firstName lastName email role");

        res.status(200).json({ success: true, activities });

    } catch (error) {
        console.error("Get recent activities error:", error);
        res.status(500).json({ message: "Error fetching activities", error });
    }
};





// Reject Property Listing
export const rejectPropertyListing = async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        const { rejectionReason } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        property.isApproved = false;
        property.approvalStatus = "rejected";
        property.rejectionReason = rejectionReason || "No reason provided";
        await property.save();
        // Notify the owner
        const owner = property.user as any;
        if (owner && owner.email) {
            await sendEmail(
                owner.email,
                "❌ Notice: Your property listing has been rejected",
                `<p>Dear ${owner.firstName},</p>
                <p>We regret to inform you that your property listing titled "<strong>${property.title}</strong>" has been rejected.</p>
                <p>Reason for rejection: ${property.rejectionReason}</p>
                <p>Please review the reason provided and consider making the necessary adjustments before resubmitting your listing.</p>
                <p>Best regards,<br/>The RealtyFinder Team</p>`
            );
        }

        res.status(200).json({ success: true, message: "Property listing rejected", property });
    } catch (error) {
        console.error("Reject property listing error:", error);
        res.status(500).json({ message: "Error rejecting property listing", error });
    }

};


// Get properties pending approval
export const getPendingProperties = async (req: Request, res: Response) => {
    try {
        const pending = await Property.find({ approvalStatus: "pending" })
            .populate("property_owner", "firstName lastName email");
        res.status(200).json({ success: true, pending });

    } catch (error) {
        console.error("Get pending properties error:", error);
        res.status(500).json({ message: "Error fetching pending properties", error });
    }   
};


// Get Approved Properties
export const getApprovedProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find({ isApproved: true })
      .populate("property_owner", "firstName lastName email");
    res.status(200).json({ success: true, data: properties });

    } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};


// Get Rejected Properties
export const getRejectedProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find({ approvalStatus: "rejected" })
      .populate("property_owner", "firstName lastName email");
    res.status(200).json({ success: true, data: properties });

    } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};



// updated Property requets status
export const updatePropertyRequestStatus = async (req: Request, res: Response) => {
    try {
        const { requestId } = req.params;
        const { status, rejectionReason } = req.body;

        const propertyRequest = await PropertyRequest.findById(requestId).populate('user');
        if (!propertyRequest) {
            return res.status(404).json({ success: false, message: "Property request not found" });
        }

        propertyRequest.status = status;
        propertyRequest.rejectionReason = status === "rejected" ? rejectionReason : "";
        await propertyRequest.save();

        // Ensure the populated user is treated as an object (cast from ObjectId)
        const user = (propertyRequest.user as any) || { email: "", firstName: "" };

        //notify user via email
        if (status === "approved") {
            await sendEmail(
                user.email,
                "✅ Your property request has been approved",
                `<p>Dear ${user.firstName},</p>
                <p>Your property request for a ${propertyRequest.propertyType} in ${propertyRequest.location} has been approved.</p>
                <p>We will notify you with suitable listings soon.</p>
                <p>Best regards,<br/>The RealtyFinder Team</p>`
            );
        }


        if (status === "rejected") {
            await sendEmail(
                user.email,
                "❌ Your property request has been rejected",
                `<p>Dear ${user.firstName},</p>
                <p>We regret to inform you that your property request for a ${propertyRequest.propertyType} in ${propertyRequest.location} has been rejected.</p>
                <p>Reason: ${rejectionReason}</p>
                <p>Please feel free to submit a new request with different criteria.</p>
                <p>Best regards,<br/>The RealtyFinder Team</p>`
            );
        }


        res.json({ success: true, message: "Property request status updated", propertyRequest });
    } catch (error) {
        console.error("Update property request status error:", error);
        res.status(500).json({ message: "Error updating property request status", error });
    }
};



// Get all users by role
export const getAllUsersByRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.query; // e.g. ?role=buyer

    // If no role is provided, get all users
    const filter = role ? { role } : {};

    const users = await User.find(filter)
      .select("-password") // hide sensitive info
      .sort({ createdAt: -1 });

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: role
          ? `No users found with role '${role}'`
          : "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
      error: error.message,
    });
  }
};







