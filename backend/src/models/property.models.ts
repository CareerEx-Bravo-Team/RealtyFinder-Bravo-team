import mongoose, { Schema, Document } from "mongoose";

// 1. Define the TypeScript interface for a Property document in MongoDB

export interface Iproperty extends Document {
    title: string;
    description: string;
    price: number;
    location: string;
    type: string; // e.g., apartment, house, land
    images?: string[];
    createdAt: Date;
}

// 2. Define the schema (MongoDB structure)

const PropertySchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: { type: String, required: String },
    images: { type: [String], default: [] }  // optional array of image URLs
}, { timestamps: true });

// 3. Export the model so it can be used in controllers
export default mongoose.model<Iproperty>("Property", PropertySchema)

// Can also use a named export like this
// const Property = mongoose.model<Iproperty>("Property",PropertySchema)
// export Property.   but the default one above allows me to import this model with any name.