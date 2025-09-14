import { Router } from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Add item to wishlist
router.post("/", authMiddleware, addToWishlist);

// Get wishlist for a user
router.get("/:userId", authMiddleware, getWishlist);

// Remove item from wishlist
router.delete("/:id", authMiddleware, removeFromWishlist);

export default router;
