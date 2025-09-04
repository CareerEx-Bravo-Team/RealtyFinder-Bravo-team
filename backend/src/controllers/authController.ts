import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { sendUserWelcomeEmail, sendAgentWelcomeEmail, sendEmail, sendPropertyOwnerWelcomeEmail } from '../utils/sendEmail'; // Assuming you have a utility to send emails
import validator from "validator";
import dotenv from 'dotenv';

dotenv.config();




export const register = async (req: Request, res: Response) => {

    try {
        const { firstName, lastName, email, password, role } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || "user" // Default to 'user' if no role is provided
        });

        if (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.toLowerCase().includes(email.toLowerCase())) {
            newUser.role = "admin";
        }

        //save the user
        await newUser.save();

        // Create JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "secret", {
            expiresIn: "7d"
        });

        // Send welcome email
        if (newUser.role === "user") {
            await sendUserWelcomeEmail(
            newUser.email,
            newUser.firstName,
            token 
          )
        }

        if (newUser.role === "agent") {
            await sendAgentWelcomeEmail(
            newUser.email,
            newUser.firstName,
            token 
          )
        }

        if (newUser.role === "propertyOwner") {
            await sendPropertyOwnerWelcomeEmail(
            newUser.email,
            newUser.firstName,
            token 
          )
        }

        if (newUser.role === "admin") {
            await sendEmail(
                newUser.email,
                newUser.firstName,
                token
            );
        }

        res.status(201).json({
            message: "User registered successfully",
            user: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            },
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};



// Login function
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }


    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "7d"
    });

    res.status(200).json({ message: "Login successful", token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// Forgot password function
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Create reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });


    // Send email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail(
      email,
      "Password Reset",
      `<p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>`
    );

    res.status(200).json({ message: "Password reset email sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//reset password function
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};