import express from "express";
import upload from "../config/cloudinary.js";
import { 
  createBlog, 
  getAllBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog,
  getFeaturedBlogs,
  getBlogBySlug
} from "../controllers/blogController.js";

const router = express.Router();

// Create a new blog
router.post("/", upload.single("image"), createBlog);

// Get all blogs
router.get("/", getAllBlogs);

// Get featured blogs
router.get("/featured", getFeaturedBlogs);

// Get a single blog by slug
router.get("/slug/:slug", getBlogBySlug);

// Get a single blog by ID
router.get("/id/:id", getBlogById);

// Update a blog
router.put("/:id", upload.single("image"), updateBlog);

// Delete a blog
router.delete("/:id", deleteBlog);

export default router;