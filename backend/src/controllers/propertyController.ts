import { Request, Response } from "express";
import Property from "../models/property";
import upload from "../config/multer";

export const createProperty = async (req: Request, res: Response) => {
  // Running multer inside controller
  upload.array("images", 5)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { title, description, price, location } = req.body;

      // Collect uploaded image paths
      const imagePaths = req.files
        ? (req.files as Express.Multer.File[]).map((file) => file.path)
        : [];

      // Temporary mock user ID (It will be replace with req.user.id later)
      const mockUserId = "64f2b3c9abc1234567890def";

      const property = new Property({
        title,
        description,
        price,
        location,
        images: imagePaths,
        user: mockUserId, // if schema has user field
      });

      await property.save();

      return res.status(201).json({
        message: "Property created successfully",
        property,
      });
    } catch (error: any) {
      console.error("❌ Error creating property:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};
