import mongoose, { Schema, Document } from "mongoose";


export interface IUser extends Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  otp?: string;
  otpExpiry?: Date; 
  isVerified: boolean;
  verifiedBy: "email" | "phone";
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
    phone: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please fill a valid phone number"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    confirmPassword: { type: String, required: false },
    otp: { type: String, default: undefined },
    otpExpiry: { type: Date, default: undefined },
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: String, enum: ["email", "phone"], default: "email"},
    
    role: {
      type: String,
      enum: ["individual", "property_owner", "real_estate_agent", "admin"],
      default: "individual",
    },
  },
  { timestamps: true }
);


const User = mongoose.model<IUser>("User", userSchema);
export default User;

