import { Request, Response, NextFunction} from "express";
import User, { IUser } from "../models/user";



// Middleware to track user activity
export const activityTracker = async (req: Request & { user?: IUser }, res: Response, next: NextFunction) => {
    try {
        if (req.user && req.user._id) {
            const user = await User.findById(req.user._id);
            if (user) {
                user.lastActivity = new Date();
                await user.save();
                console.log(`User ${user.email} activity at ${user.lastActivity}`);
            }
        }
        next();

    } catch (error) {
        console.error("❌ Error in activity tracker middleware:", error);
        next(); // Proceed even if there's an error
    }
};

        
