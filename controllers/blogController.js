import Blog from "../models/Blog.js";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";

// @desc    Create a new blog
// @route   POST /api/blogs
export const createBlog = async (req, res) => {
    console.log("CHalrhi h");
    
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog_images",
    });

    // Generate excerpt from content
    const excerpt = req.body.content.substring(0, 160) + (req.body.content.length > 560 ? "..." : "");

    const newBlog = new Blog({
      title: req.body.title,
      content: req.body.content,
      image: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      category: req.body.category,
      author: req.body.author,
      excerpt: excerpt,
      isFeatured: req.body.isFeatured === 'true'
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ 
      message: "Error creating blog", 
      error: error.message 
    });
  }
};

// @desc    Get all blogs
// @route   GET /api/blogs
export const getAllBlogs = async (req, res) => {

  try {
    console.log("CHalrhi h");

    const { category, featured } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (featured) {
      query.isFeatured = true;
    }
    
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ 
      message: "Error fetching blogs", 
      error: error.message 
    });
  }
};

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(3);
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    res.status(500).json({ 
      message: "Error fetching featured blogs", 
      error: error.message 
    });
  }
};

// @desc    Get a single blog by slug
// @route   GET /api/blogs/:slug
// controllers/blogController.js
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ 
      message: "Error fetching blog", 
      error: error.message 
    });
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    let updateData = {
      title: req.body.title || blog.title,
      content: req.body.content || blog.content,
      category: req.body.category || blog.category,
      author: req.body.author || blog.author,
      isFeatured: req.body.isFeatured ? req.body.isFeatured === 'true' : blog.isFeatured,
      updatedAt: Date.now()
    };

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (blog.publicId) {
        await cloudinary.uploader.destroy(blog.publicId);
      }

      // Upload new image
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_images",
      });

      updateData.image = uploadedImage.secure_url;
      updateData.publicId = uploadedImage.public_id;
    }

    // Generate new excerpt if content changed
    if (req.body.content && req.body.content !== blog.content) {
      updateData.excerpt = req.body.content.substring(0, 160) + 
                         (req.body.content.length > 160 ? "..." : "");
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ 
      message: "Error updating blog", 
      error: error.message 
    });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete image from Cloudinary
    if (blog.publicId) {
      await cloudinary.uploader.destroy(blog.publicId);
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ 
      message: "Blog deleted successfully",
      deletedBlog: blog
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ 
      message: "Error deleting blog", 
      error: error.message 
    });
  }
};