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
      folder: "college_images",
      allowedFormats: ["jpg", "png", "jpeg", "webp",'avif'],
      public_id: (req, file) => {
        console.log("Uploading file:", file.originalname); // Debugging log
        return `${Date.now()}-${file.originalname}`;
      },
    },
  });

  const documentStorage = new CloudinaryStorage({
    
  cloudinary,
  params: {
    folder: "college_documents",
    allowedFormats: ["pdf", "jpg", "png", "jpeg", "webp", "avif"],
    resource_type: "auto",
    public_id: (req, file) => {
      return `${Date.now()}-${file.originalname}`;
    },
  },
});


export const uploadDocument = multer({ storage: documentStorage });
  
const upload = multer({ storage });

export default upload;
