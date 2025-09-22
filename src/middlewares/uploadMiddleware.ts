import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

// Define storage strategy for profile images
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: any, file: any) => {
    const folder = process.env.CLOUDINARY_FOLDER || "realtyfinder/profiles";

    return {
      folder, // Cloudinary folder
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`, // unique name
      allowed_formats: ["jpg", "jpeg", "png", "webp"], // only allow these formats
      transformation: [{ width: 400, height: 400, crop: "fill" }], // resize/crop
    };
  },
});

// Initialize multer with the defined storage
export const uploadProfilePhoto = multer({ storage });
