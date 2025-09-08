import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for a Property document in MongoDB
export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  type: string; // e.g., apartment, house, land
  images: string[];
  user: mongoose.Types.ObjectId; // reference to User collection
  verifiedBadge: boolean;
  landlordBadge: boolean;
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
    type: { type: String, required: true, enum: ["apartment", "house", "land"] },
    images: { type: [String], default: [] },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    verifiedBadge: { type: Boolean, default: false },
    landlordBadge: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Export the model
const Property = mongoose.model<IProperty>("Property", PropertySchema);
export default Property;
