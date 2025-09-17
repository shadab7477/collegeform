import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image storage setup
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'college_images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

// Document storage setup
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'college_documents',
    allowed_formats: ['pdf', 'jpg', 'png', 'jpeg', 'webp', 'avif'],
    resource_type: 'auto',
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

export const uploadImage = multer({ storage: imageStorage });
export const uploadDocument = multer({ storage: documentStorage });

// ✅ Proper export of cloudinary instance
export { cloudinary };
