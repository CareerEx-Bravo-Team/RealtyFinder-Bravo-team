import { Request, Response } from "express";
import User from "../models/user";
import Property from "../models/property";
import { success } from "zod";
import Activity from "../models/activity";
import { sendEmail } from "../utils/sendEmail";




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


// Approve or Reject Property Listing
export const approvePropertyListing = async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }
        property.isApproved = true;
        property.approvalStatus = "approved";
        property.rejectionReason = "";

        await property.save();

        //Notify the owner
        const owner = property.user as any;
        if (owner && owner.email) {
            await sendEmail(
                owner.email,
                "✅ Congratulations! Your property listing has been approved",
                `<p>Dear ${owner.firstName},</p>
                <p>We are pleased to inform you that your property listing titled "<strong>${property.title}</strong>" has been approved and is now live on our platform.</p>
                <p>Thank you for choosing our platform to list your property.</p>
                <p>Best regards,<br/>The RealtyFinder Team</p>`
            );
        }

        res.status(200).json({ success: true, message: "Property listing approved", property });
    } catch (error) {
        console.error("Approve property listing error:", error);
        res.status(500).json({ message: "Error approving property listing", error });
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
            .populate("user", "firstName lastName email");
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
      .populate("user", "firstName lastName email");
    res.status(200).json({ success: true, data: properties });

    } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};


// Get Rejected Properties
export const getRejectedProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find({ approvalStatus: "rejected" })
      .populate("user", "firstName lastName email");
    res.status(200).json({ success: true, data: properties });

    } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};