import express from "express";
import { sendMessage, getConversation } from "../controllers/messageController";

const router = express.Router();

router.post("/send-message", sendMessage);
router.get("/get-conversation/:conversationId", getConversation);

export default router;
