import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "college_images", // Folder in Cloudinary
    allowedFormats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Unique file name
  },
});

const upload = multer({ storage });

export default upload;
