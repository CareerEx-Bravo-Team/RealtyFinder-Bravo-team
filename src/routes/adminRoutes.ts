import { Router } from "express";
import { getDashboardStats, getAllUsers, getUserById, updateUser, deleteUser, getRecentActivities, rejectPropertyListing, getPendingProperties, getApprovedProperties, getRejectedProperties, getAllUsersByRole } from "../controllers/adminController";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware";



const router = Router();


// Admin Dashboard Stats Route
router.get("/admin/dashboard-stats", authMiddleware, adminMiddleware, getDashboardStats);


// User Management Routes
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, adminMiddleware, getUserById);
router.put("/users/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);
router.get("/activities", authMiddleware, adminMiddleware, getRecentActivities);
router.get("/users/:role", authMiddleware, adminMiddleware, getAllUsersByRole);


// Property Management Routes
router.put("/reject-property/:id", authMiddleware, adminMiddleware, rejectPropertyListing);
router.get("/properties/pending", authMiddleware, adminMiddleware, getPendingProperties);
router.get("/properties/approved", authMiddleware, adminMiddleware, getApprovedProperties);
router.get("/properties/rejected", authMiddleware, adminMiddleware, getRejectedProperties);






export default router;