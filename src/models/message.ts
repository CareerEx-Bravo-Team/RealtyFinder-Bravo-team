import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  fromUserId: string;
  toUserId: string;
  propertyId: string;
  message: string;
  conversationId: string;
}

const messageSchema = new Schema<IMessage>(
  {
    fromUserId: { type: String, required: true },
    toUserId: { type: String, required: true },
    propertyId: { type: String, required: true },
    message: { type: String, required: true },
    conversationId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", messageSchema);
