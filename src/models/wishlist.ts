import { Schema, model, Document, Types } from "mongoose";


export interface IWishlist extends Document {
    userId: Types.ObjectId;
    propertyId: Types.ObjectId;
    createdAt: Date;
}


const WishlistSchema = new Schema<IWishlist>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
}, { timestamps: true });

WishlistSchema.index({ userId: 1, propertyId: 1 }, { unique: true });


export default model<IWishlist>("Wishlist", WishlistSchema);


