import MobileBanner from "../models/mobileb.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Add a new mobile banner with optional link
// @route   POST /api/mobile-banners
export const addMobileBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No image uploaded" 
      });


    }


    
    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "college_mobile_banners",
      quality: "auto:good" // Optimize image quality
    });

    const newMobileBanner = new MobileBanner({
      image: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      link: req.body.link || null, // Optional link
      altText: req.body.altText || "Mobile Banner" // Accessibility improvement
    });

    const savedMobileBanner = await newMobileBanner.save();
    
    res.status(201).json({
      success: true,
      data: savedMobileBanner
    });
    
  } catch (error) {
    console.error("Error adding mobile banner:", error);
    res.status(500).json({ 
      success: false,
      message: "Error adding mobile banner",
      error: error.message 
    });
  }
};

// @desc    Get all mobile banners sorted by creation date
// @route   GET /api/mobile-banners
export const getMobileBanners = async (req, res) => {
  try {
    const mobileBanners = await MobileBanner.find()
      .sort({ createdAt: -1 }) // Newest first
      .lean(); // Better performance
    
    res.json({
      success: true,
      count: mobileBanners.length,
      data: mobileBanners
    });
    
  } catch (error) {
    console.error("Error fetching mobile banners:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching mobile banners",
      error: error.message 
    });
  }
};

// @desc    Update mobile banner (image and/or metadata)
// @route   PUT /api/mobile-banners/:id
export const editMobileBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { link, altText } = req.body;
    
    const mobileBanner = await MobileBanner.findById(id);
    if (!mobileBanner) {
      return res.status(404).json({ 
        success: false,
        message: "Mobile banner not found" 
      });
    }

    // Handle image update if new file provided
    if (req.file) {
      // Delete old image from Cloudinary
      if (mobileBanner.publicId) {
        await cloudinary.uploader.destroy(mobileBanner.publicId);
      }
      
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "college_mobile_banners",
        quality: "auto:good"
      });
      
      mobileBanner.image = uploadedImage.secure_url;
      mobileBanner.publicId = uploadedImage.public_id;
    }

    // Update other fields
    if (link !== undefined) mobileBanner.link = link;
    if (altText !== undefined) mobileBanner.altText = altText;

    const updatedBanner = await mobileBanner.save();
    
    res.json({
      success: true,
      data: updatedBanner
    });
    
  } catch (error) {
    console.error("Error editing mobile banner:", error);
    res.status(500).json({ 
      success: false,
      message: "Error editing mobile banner",
      error: error.message 
    });
  }
};

// @desc    Delete a mobile banner
// @route   DELETE /api/mobile-banners/:id
export const deleteMobileBanner = async (req, res) => {
  try {
    const mobileBanner = await MobileBanner.findById(req.params.id);
    if (!mobileBanner) {
      return res.status(404).json({ 
        success: false,
        message: "Mobile banner not found" 
      });
    }

    // Delete image from Cloudinary
    if (mobileBanner.publicId) {
      await cloudinary.uploader.destroy(mobileBanner.publicId);
    }

    await mobileBanner.deleteOne();
    
    res.json({
      success: true,
      message: "Mobile banner deleted successfully",
      deletedId: req.params.id
    });
    
  } catch (error) {
    console.error("Error deleting mobile banner:", error);
    res.status(500).json({ 
      success: false,
      message: "Error deleting mobile banner",
      error: error.message 
    });
  }
};

// @desc    Toggle mobile banner active status
// @route   PATCH /api/mobile-banners/:id/toggle-active
export const toggleBannerActive = async (req, res) => {
  try {
    const mobileBanner = await MobileBanner.findById(req.params.id);
    if (!mobileBanner) {
      return res.status(404).json({ 
        success: false,
        message: "Mobile banner not found" 
      });
    }

    mobileBanner.isActive = !mobileBanner.isActive;
    const updatedBanner = await mobileBanner.save();
    
    res.json({
      success: true,
      data: updatedBanner
    });
    
  } catch (error) {
    console.error("Error toggling banner status:", error);
    res.status(500).json({ 
      success: false,
      message: "Error toggling banner status",
      error: error.message 
    });
  }
};