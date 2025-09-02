import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import { sendEmail } from '../utils/sendEmail';
import { sendSms } from "../utils/sendSMS";
import validator from "validator";
import crypto from 'crypto';
import { channel } from 'process';



// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}



//otp generator
const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString(); 
};



// REGISTER function
export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, middleName, lastName, email, phone, password, confirmPassword, role, preferredChannel } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !password || !confirmPassword) {
      return res.status(400).json({ message: "First name, last name, password, and confirm password are required" });
    }

    // Check confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Validate email if provided
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Validate phone if provided
    if (phone && !validator.isMobilePhone(phone, "any", { strictMode: true })) {
      return res.status(400).json({ message: "Invalid phone number. Use format +234806xxxxxxx" });
    }

    // At least one of email or phone is required
    if (!email && !phone) {
      return res.status(400).json({ message: "Either email or phone number is required" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists by email or phone
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or phone already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate role
    const validRoles = ["individual", "property_owner", "real_estate_agent", "admin"];
    const userRole = validRoles.includes(role) ? role : "individual";

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save user
    const newUser = await User.create({
      firstName,
      middleName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: userRole,
      otp,
      otpExpiry,
      isVerified: false,
    });


    // Decide where to send OTP
  let sentVia: "email" | "phone" | null = null;

  if (preferredChannel === "phone" && phone) {
    await sendSms(phone, `Hello ${firstName}, your OTP is: ${otp}. Valid for 10 minutes.`);
    sentVia = "phone";
    } else if (preferredChannel === "email" && email) {
      await sendEmail(
        email,
        "Verify your account",
        `<p>Hello ${firstName}, your OTP is: <strong>${otp}</strong>. Valid for 10 minutes.</p>`
      );
      sentVia = "email";

      
    } else if (phone) {
      // fallback if email not available
      await sendSms(phone, `Hello ${firstName}, your OTP is: ${otp}. Valid for 10 minutes.`);
      sentVia = "phone";
    } else if (email) {
      // fallback if phone not available
      await sendEmail(
        email,
        "Verify your account",
        `<p>Hello ${firstName}, your OTP is: <strong>${otp}</strong>. Valid for 10 minutes.</p>`
      );
      sentVia = "email";
    } else {
      throw new Error("No valid contact method available for sending OTP.");
    }


    // Create JWT
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: `User registered. Please verify the OTP sent to your ${sentVia}.`,
      user: {
        firstName: newUser.firstName,
        middleName: newUser.middleName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
      token,
    });
  } catch (error: any) {
  console.error("❌ Registration error:", error);

  return res.status(500).json({
    message: "Server error",
    error: error.message || "Unknown error",
    stack: error.stack, // optional: shows exactly where error happened
  });
}

};



//Verify OTP b4 login
export const verifyOTP = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Check if OTP is valid
    if (String(user.otp) !== String(otp) || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }


    // OTP is valid, verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};




//RESEND OTP function
export const resendOTP = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Generate new OTP and expiry
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send email
    await sendEmail(
      user.email,
      "Resend OTP Verification",
      `Hello ${user.firstName},\n\nYour new OTP code is: ${otp}\nIt expires in 10 minutes.`
    );

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};






// Login function
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;


    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }


    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your account first" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, 
      process.env.JWT_SECRET as string, {
      expiresIn: "1d"
    });

    res.status(200).json({ 
      message: "Login successful",
      user: {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token });

  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};








// Forgot password function
export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Hello ${user.firstName},\n\nYour OTP for password reset is: ${otp}\nIt expires in 10 minutes.`
    );

    return res.status(200).json({ message: "Password reset OTP sent to email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};




// Reset password function
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (String(user.otp) !== String(otp) || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};




// Dashboard (Protected Route)

export const dashboard = async (req: Request, res: Response): Promise<Response> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (req.user.role) {
    case "admin":
      return res.status(200).json({ message: `Welcome Admin ${req.user.firstName}, manage the system.` });
    case "real_estate_agent":
      return res.status(200).json({ message: `Welcome Agent ${req.user.firstName}, here is your agent dashboard.` });
    case "property_owner":
      return res.status(200).json({ message: `Welcome Owner ${req.user.firstName}, manage your properties here.` });
    case "individual":
    default:
      return res.status(200).json({ message: `Welcome ${req.user.firstName}, here is your individual user dashboard.` });
  }
};

