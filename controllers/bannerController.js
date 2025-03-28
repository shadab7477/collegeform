import Banner from "../models/banner.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Add a new banner
// @route   POST /api/banners
export const addBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "college_banners",
    });

    const newBanner = new Banner({
      image: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      link: req.body.link || null // Add link field from request body
    });

    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    console.error("Error adding banner:", error);
    res.status(500).json({ 
      message: "Error adding banner", 
      error: error.message 
    });
  }
};

// @desc    Get all banners
// @route   GET /api/banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ 
      message: "Error fetching banners", 
      error: error.message 
    });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Delete image from Cloudinary
    if (banner.publicId) {
      await cloudinary.uploader.destroy(banner.publicId);
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.json({ 
      message: "Banner deleted successfully",
      deletedBanner: banner
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ 
      message: "Error deleting banner", 
      error: error.message 
    });
  }
};

// @desc    Update a banner's link
// @route   PATCH /api/banners/:id
export const updateBannerLink = async (req, res) => {
  try {
    const { link } = req.body;
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { link },
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json(banner);
  } catch (error) {
    console.error("Error updating banner link:", error);
    res.status(500).json({ 
      message: "Error updating banner link", 
      error: error.message 
    });
  }
};