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

console.log("storing image");

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

// Blog images storage setup (for blog cover images)
const blogImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog_images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
    public_id: (req, file) => `blog_${Date.now()}-${file.originalname}`,
  },
});

// Blog content images storage setup (for images uploaded in Tiptap editor)
const blogContentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog_content',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
    public_id: (req, file) => `blog_content_${Date.now()}-${file.originalname}`,
  },
});

export const uploadImage = multer({ storage: imageStorage });
export const uploadDocument = multer({ storage: documentStorage });
export const uploadBlogImage = multer({ storage: blogImageStorage });
export const uploadBlogContent = multer({ 
  storage: blogContentStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// ✅ Proper export of cloudinary instance
export { cloudinary };