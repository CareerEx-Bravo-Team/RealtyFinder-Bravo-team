import { Request, Response } from "express";
import Message from "../models/message";

// POST /api/messages → send message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { fromUserId, toUserId, propertyId, message } = req.body;

    // Always generate a consistent conversationId (order matters!)
    const conversationId =
      fromUserId < toUserId
        ? `${fromUserId}-${toUserId}`
        : `${toUserId}-${fromUserId}`;

    const newMessage = new Message({
      fromUserId,
      toUserId,
      propertyId,
      message,
      conversationId,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// GET /api/messages/:conversationId → fetch chat
export const getConversation = async (req: Request, res: Response) => {
  try {
    let { conversationId } = req.params;

    const trimmedConversationId = conversationId.trim();

    const messages = await Message.find({
      conversationId: trimmedConversationId,
    }).sort({ createdAt: 1 });

    res.status(201).json(messages);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};
