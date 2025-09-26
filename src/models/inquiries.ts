import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Define Typescript interface
export interface IInquiry extends Document {
    userId: mongoose.Types.ObjectId;
    propertyId: mongoose.Types.ObjectId;
    message: string;
    status: "pending" | "replied";
    createdAt: Date;
    updatedAt: Date;
}

// 2. Create Schema
const inquirySchema: Schema<IInquiry> = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
        message: { type: String, required: true },
        status: { type: String, enum: ["pending", "replied"], default: "pending" },
    },
    { timestamps: true } // auto add createdAt and updatedAt
);

// 3. Create Model
const Inquiry: Model<IInquiry> = mongoose.model<IInquiry>("Inquiry", inquirySchema);

export default Inquiry;
