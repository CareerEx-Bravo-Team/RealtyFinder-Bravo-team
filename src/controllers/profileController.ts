import { Request, Response} from "express";
import User from "../models/user";



//update user profile details
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as { _id: string })._id;
        const { firstName, middleName, lastName, companyName, address, email, phone, socials } = req.body;

        //find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        //Build update object dynamically
        const updates: any = {};

        //update fields if provided
        if (firstName) updates.firstName = firstName;
        if (middleName) updates.middleName = middleName;
        if (lastName) updates.lastName = lastName;
        if (companyName) updates.companyName = companyName;
        if (address) updates.address = address;
        if (email) updates.email = email;
        if (phone) updates.phone = phone;
        
        //handles socials
        if (socials) {
            updates.socials = {
                facebook: socials.facebook || user.socials?.facebook,
                twitter: socials.twitter || user.socials?.twitter,
                linkedin: socials.linkedin || user.socials?.linkedin,
                instagram: socials.instagram || user.socials?.instagram,
            };
        }

        // Handle profile photo upload if a file is provided
        if (req.file) {
            user.profilePhoto = (req.file as any).path 
        }

        //apply updates
        Object.assign(user, updates);
        await user.save();

        res.json({ success: true, message: "Profile updated successfully", data: user });
    } catch (err: any) {
        console.error("❌ Error updating profile:", err);
        res.status(500).json({ success: false, message: err.message || "Server error" });
    }
};   



