import mongoose, { Schema, Document } from "mongoose";



export interface IActivity extends Document {
    user: mongoose.Types.ObjectId; // reference to User collection
    action: string; // e.g., "login", "property_added"
    status: string; // e.g., "success", "failure"
    timestamp: Date;
}



const ActivitySchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        action: { type: String, required: true },
        status: { type: String, required: true, enum: ["Approved", "Pending", "Rejected"], default: "Approved" },
    },
    { timestamps: { createdAt: 'timestamp', updatedAt: false } }
);   




const Activity = mongoose.model<IActivity>("Activity", ActivitySchema);
export default Activity;
