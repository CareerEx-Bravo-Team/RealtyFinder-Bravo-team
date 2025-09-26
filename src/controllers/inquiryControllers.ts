import { Request, Response } from "express";
import mongoose from "mongoose";
import Inquiry from "../models/inquiries"
import { IUser } from "../models/user"

// Define input type for body
interface IPostInquiry {
    message: string;
}

// POST inquiry function
export const postInquiry = async (
    req: Request<{ propertyId: string }, {}, IPostInquiry>,
    res: Response
) => {
    try {
        const userId = (req.user as IUser)._id;
        const { propertyId } = req.params;
        const { message } = req.body;

        if (!message) {
            return res
                .status(400)
                .json({ success: false, msg: "Message field is required" });
        }

        if (!mongoose.isValidObjectId(propertyId) || !mongoose.isValidObjectId(userId)) {
            return res
                .status(400)
                .json({ success: false, msg: "Invalid property or user ID" });
        }

        const inquiry = new Inquiry({
            userId,
            propertyId,
            message,
        });

        await inquiry.save();

        return res.status(201).json({
            success: true,
            msg: "Your inquiry has been sent successfully. You will be notified by email of our feedback soon.",
            inquiry,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message,
            msg: "Your property inquiry wasn't sent. Keep calm, the issues is not from your end. Please try again later.",
        });
    }
};
