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

console.log("Cloudinary configured successfully");

// Create storage for college images
const createCollegeStorage = () => new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'college_images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\.[^/.]+$/, ""); // Remove extension
      return `college-${timestamp}-${originalName}`;
    },
  },
});

// ✅ Fixed: Create separate upload instances for different field configurations
export const uploadCollegeImages = multer({
  storage: createCollegeStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// For single image upload (backward compatibility)
export const uploadImage = multer({ 
  storage: createCollegeStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

// Document storage
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'college_documents',
    allowed_formats: ['pdf', 'jpg', 'png', 'jpeg', 'webp', 'avif'],
    resource_type: 'auto',
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

// Blog image storage
const blogImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog_images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
    public_id: (req, file) => `blog_${Date.now()}-${file.originalname}`,
  },
});

// Blog content storage
const blogContentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog_content',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
    public_id: (req, file) => `blog_content_${Date.now()}-${file.originalname}`,
  },
});

export const uploadDocument = multer({ storage: documentStorage });
export const uploadBlogImage = multer({ storage: blogImageStorage });
export const uploadBlogContent = multer({ 
  storage: blogContentStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

export { cloudinary };