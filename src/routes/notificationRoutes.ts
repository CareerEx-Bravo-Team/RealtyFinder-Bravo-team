import expess from "express";
import { deleteNotification, getUserNotifications, markNotificationAsRead } from "../controllers/notificationCcontroller";
import { authMiddleware} from "../middlewares/authMiddleware";



const router = expess.Router();


router.get("/", authMiddleware, getUserNotifications);
router.put("/read/:id", authMiddleware, markNotificationAsRead);
router.delete("/delete/:id", authMiddleware, deleteNotification);




export default router;
