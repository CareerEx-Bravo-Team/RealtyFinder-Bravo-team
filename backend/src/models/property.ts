import mongoose, { Schema } from "mongoose";

export interface IProperty {
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Property = mongoose.model<IProperty>("Property", propertySchema);

export default Property;
