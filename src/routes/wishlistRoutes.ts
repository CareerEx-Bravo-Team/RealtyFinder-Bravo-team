import { Router } from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistController";
import { authMiddleware } from "../middlewares/authMiddleware";


const router = Router();


// POST /api/wishlist
router.post("/", authMiddleware, addToWishlist);

// GET /api/wishlist/:userId
router.get("/:userId", authMiddleware, getWishlist);

// DELETE /api/wishlist/:id
router.delete("/:id", authMiddleware, removeFromWishlist);



export default router;
