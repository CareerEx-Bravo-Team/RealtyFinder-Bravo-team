import { Schema, model, Document, Types } from "mongoose";


export interface IReport extends Document {
    userId: Types.ObjectId;
    propertyId: Types.ObjectId;
    reason: string;
    details?: string;
    createdAt: Date;
    updatedAt: Date;
}


const ReportSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    reason: { type: String, required: true },
    details: { type: String },
}, { timestamps: true });


export default model<IReport>("Report", ReportSchema);