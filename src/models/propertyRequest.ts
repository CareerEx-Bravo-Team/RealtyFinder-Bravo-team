import mongoose, { Schema, Document } from "mongoose";

export interface IPropertyRequest extends Document {
  user: mongoose.Types.ObjectId;
  email: string;
  propertyType: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertyRequestSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    propertyType: { type: String, required: true },
    location: { type: String, required: true },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

const PropertyRequest = mongoose.model<IPropertyRequest>("PropertyRequest", PropertyRequestSchema);
export default PropertyRequest;
