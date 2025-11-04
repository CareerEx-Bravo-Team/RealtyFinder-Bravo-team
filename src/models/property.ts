import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for a Property document in MongoDB
export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  area: string;
  rooms: number;
  address: string;
  city: string;
  country: string;
  state: string;
  postalCode: string;
  features: string[];
  name: string;
  email: string;
  phone: string;
  images: string[];
  user: mongoose.Types.ObjectId; // reference to User collection
  verifiedBadge: boolean;
  landlordBadge: boolean;
  isApproved: boolean;
  bathrooms: number;
  approvalStatus: "pending" | "approved" | "rejected";
  rejectionReason: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema (MongoDB structure)
const PropertySchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    location: { type: String, required: true },
    type: { type: String, required: true, enum: ["apartment", "house", "land"], set: (v: string) => v.toLowerCase()},
    images: { type: [String], default: [] },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    area: { type: String },
    rooms: { type: Number },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
    features: { type: [String], default: [] },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    bathrooms: { type: Number },
    verifiedBadge: { type: Boolean, default: false },
    landlordBadge: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    rejectionReason: { type: String, default: ""},
    
    
  },
  { timestamps: true }
);

// Export the model
const Property = mongoose.model<IProperty>("Property", PropertySchema);
export default Property;
