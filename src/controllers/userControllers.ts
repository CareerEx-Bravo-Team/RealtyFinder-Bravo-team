
import User from "../models/user";
import { Request, Response } from "express";



// Get individual users
export const getUsersByIndividual = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ role: "individual" }).select("-password -otp -otpExpiry");
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: "Error fetching users", error });
    }

};


// Get property owners
export const getUsersByPropertyOwner = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ role: "property_owner" }).select("-password -otp -otpExpiry");
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: "Error fetching users", error });
    }
};


// Get real estate agents
export const getUsersByRealEstateAgent = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ role: "real_estate_agent" }).select("-password -otp -otpExpiry");
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: "Error fetching users", error });
    }
};