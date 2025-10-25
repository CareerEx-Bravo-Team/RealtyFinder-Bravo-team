import { Request, Response } from "express";
import Notification from "../models/notification";



// Get all notifications for a logged-in user
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = (req.user as any)._id;
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: notifications });

    } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
    }

};


// Mark a notification as read
export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
        return res.status(404).json({ success: false, message: "Notification not found" });     
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ success: true, message: "Notification marked as read", data: notification });

    } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
    }   

};



// Delete a notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
        return res.status(404).json({ success: false, message: "Notification not found" });     
    }

    res.status(200).json({ success: true, message: "Notification deleted successfully" });

    } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Server error" });
    }

};

