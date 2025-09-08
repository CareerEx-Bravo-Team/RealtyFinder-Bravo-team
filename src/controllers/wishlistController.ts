import { Response } from "express";
import { Request } from "express";
import Wishlist from "../models/wishlist";
import { success } from "zod";





// Add to wishlist
export async function addToWishlist(req: Request, res: Response) {
  try {
    const userId = req.user?._id;   // ✅ use _id
    const { propertyId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const newItem = await Wishlist.create({ userId, propertyId });
    return res.status(201).json({ success: true, message: "Item added to wishlist", data: newItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: (error as Error).message });
  }
}


// Get wishlist for logged-in user
export async function getWishlist(req: Request, res: Response) {
  try {
    const userId = req.user?._id;   // ✅ use _id

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const items = await Wishlist.find({ userId }).populate("propertyId");
    return res.status(200).json({ success: true, message: "Wishlist fetched successfully", data: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: (error as Error).message });
  }
}



// Remove from wishlist
export async function removeFromWishlist(req: Request, res: Response) {
  try {
    const userId = req.user?._id;   // ✅ use _id
    const { id } = req.params; // wishlist item ID

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const deleted = await Wishlist.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ success: false, message: "Item not found" });

    return res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: (error as Error).message });
  }
}
