import mongoose, { Schema, Document } from "mongoose";


export interface IUser extends Document {
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  otp?: string;
  otpExpiry?: Date;   // ✅ matches schema field
  isVerified: boolean;
  role: "individual" | "property_owner" | "real_estate_agent" | "admin";
}

const userSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    otp: { type: String, default: undefined },
    otpExpiry: { type: Date, default: undefined }, // ✅ consistent with interface
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["individual", "property_owner", "real_estate_agent", "admin"],
      default: "individual",
    },
  },
  { timestamps: true }
);


const User = mongoose.model<IUser>("User", userSchema);
export { User };

