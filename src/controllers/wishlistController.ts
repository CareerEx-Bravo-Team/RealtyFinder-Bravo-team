import { Request, Response } from "express";
import Wishlist from "../models/wishlist";
import { IUser } from "../models/user";




// Add to wishlist
export async function addToWishlist(req: Request, res: Response) {
  try {
    const user = req.user as IUser | undefined; // ✅ Cast req.user to IUser
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { propertyId } = req.body;
    if (!propertyId) {
      return res.status(400).json({ success: false, message: "Property ID is required" });
    }

    const newItem = await Wishlist.create({ user: user._id, property: propertyId });
    return res.status(201).json({ success: true, message: "Item added to wishlist", data: newItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: (error as Error).message });
  }
}

// Get wishlist for logged-in user
export async function getWishlist(req: Request, res: Response) {
  try {
    const user = req.user as IUser | undefined; // ✅ Cast req.user to IUser
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const items = await Wishlist.find({ user: user._id }).populate("propertyId");
    return res.status(200).json({ success: true, message: "Wishlist fetched successfully", data: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: (error as Error).message });
  }
}

// Remove from wishlist
export async function removeFromWishlist(req: Request, res: Response) {
  try {
    const user = req.user as IUser | undefined; // ✅ Cast req.user to IUser
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params; // wishlist item ID
    const deleted = await Wishlist.findOneAndDelete({ _id: id, user: user._id });
    if (!deleted) return res.status(404).json({ success: false, message: "Item not found" });

    return res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: (error as Error).message });
  }
}
