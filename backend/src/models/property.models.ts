import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for a Property document in MongoDB

export interface Iproperty extends Document {
    title: string;
    description: string;
    price: number;
    location: string;
    type: string; // e.g., apartment, house, land
    images?: string[];
    createdAt: Date;
}

// Define the schema (MongoDB structure)

const PropertySchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    images: { type: [String], default: [] }  // optional array of image URLs
}, { timestamps: true });

// Export the model so it can be used in controllers
export default mongoose.model<Iproperty>("Property", PropertySchema)

// Can also use a named export like this
// const Property = mongoose.model<Iproperty>("Property",PropertySchema)
// export Property.   but the default one above allows me to import this model with any name.