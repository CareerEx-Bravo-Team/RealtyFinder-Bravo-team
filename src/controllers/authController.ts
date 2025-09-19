import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import { sendEmail } from '../utils/sendEmail';
import { sendSms } from "../utils/sendSMS";
import validator from "validator";
import crypto from 'crypto';





//otp generator
const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString(); 
};



// REGISTER function
export const register = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      role,
      preferredChannel,
    } = req.body;

    // -------------------- Validations --------------------
    if (!firstName || !lastName || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, password, and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }

    if (phone && !validator.isMobilePhone(phone, "any", { strictMode: true })) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. Use format +234806xxxxxxx",
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Either email or phone number is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // -------------------- Check for existing user --------------------
    const query: any = {};
    if (email) query.email = email;
    if (phone) query.phone = phone;

    const existingUser = await User.findOne({
      $or: Object.entries(query).map(([key, value]) => ({ [key]: value })),
    });

    
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: "User with this email or phone already exists",
        });
      } else {
        // Not verified → allow re-register
        await User.deleteOne({ _id: existingUser._id });
      }
    }

    // -------------------- Hash password --------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // -------------------- Role validation --------------------
    const validRoles = ["individual", "property_owner", "real_estate_agent", "admin"];
    const userRole = validRoles.includes(role) ? role : "individual";

    // -------------------- Generate OTP --------------------
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // -------------------- Save new user --------------------
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

    // -------------------- Send OTP --------------------
    let sentVia: "email" | "phone" | null = null;

    try {
      if (email) {
        // Prefer email first
        await sendEmail(
          email,
          "Verify your account",
          `<p>Hello ${firstName}, your OTP is: <strong>${otp}</strong>. Valid for 10 minutes.</p>`
        );
        sentVia = "email";
      } else if (phone) {
        await sendSms(phone, `Hello ${firstName}, your OTP is: ${otp}. Valid for 10 minutes.`);
        sentVia = "phone";
      } else {
        throw new Error("No valid contact method available for sending OTP.");
      }
    } catch (error) {
      console.warn("⚠ OTP sending failed:", error);
      sentVia = null; // We still register the user
    }


    // -------------------- Create JWT --------------------
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
      stack: error.stack,
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




//GOOGLE AUTH CONTROLLER
const frontendUrl = process.env.FRONTEND_URL;

export const googleAuthCallback = (req: Request, res: Response) => {
  if (!req.user) return res.status(400).json({ message: "Authentication failed" });
  
  const user = req.user as IUser;

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  // Redirect to frontend with token
  const redirectUrl = `${frontendUrl}/oauth-success?token=${token}`;
  return res.redirect(redirectUrl);
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
        _id: user._id,
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


    // Generate short-lived reset token
    const resetToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );



    return res.status(200).json({ message: "Password reset OTP sent to email", resetToken });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};





//verify OTP for reset password
export const verifyResetOtp = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { otp, resetToken } = req.body;
    if (!otp || !resetToken) {
      return res.status(400).json({ message: "OTP and resetToken are required" });
    }

    // Decode token to get email
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET as string) as { email: string };
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if OTP is valid
    if (String(user.otp) !== String(otp) || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify Reset OTP Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};





// Reset password function
export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { newPassword, resetToken } = req.body;
    if (!newPassword || !resetToken) {
      return res.status(400).json({ message: "New password and resetToken are required" });
    }

    // Decode token to get email
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET as string) as { email: string };
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired or not verified" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP after reset
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
  const user = req.user as IUser;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (user.role) {
    case "admin":
      return res.status(200).json({ message: `Welcome Admin ${user.firstName}, manage the system.` });
    case "real_estate_agent":
      return res.status(200).json({ message: `Welcome Agent ${user.firstName}, here is your agent dashboard.` });
    case "property_owner":
      return res.status(200).json({ message: `Welcome Owner ${user.firstName}, manage your properties here.` });
    case "individual":
    default:
      return res.status(200).json({ message: `Welcome ${user.firstName}, here is your individual user dashboard.` });
  }
};

