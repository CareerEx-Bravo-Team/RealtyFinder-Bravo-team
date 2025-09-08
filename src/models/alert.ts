import { Schema, model, Document, Types } from "mongoose";

type Channels = {
    email: boolean;
    sms: boolean;
    push: boolean;
};


export interface IAlert extends Document {
    userId: Types.ObjectId;
    filters: Record<string, any>;
    channels: Channels;
    active: boolean;
    createdAt: Date;
}


const AlertSchema = new Schema<IAlert>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    filters: { type: Schema.Types.Mixed, required: true },
    channels: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
    },
    active: { type: Boolean, default: true },
}, { timestamps: true });

export default model<IAlert>("Alert", AlertSchema);


