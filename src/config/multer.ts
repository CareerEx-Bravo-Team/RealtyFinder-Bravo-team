import multer from "multer";

// Use memory storage (no local uploads folder — compatible with Render & Cloudinary)
const storage = multer.memoryStorage();

// Allow only image files
const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

//  Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max per image
});

export default upload;
