import Banner from "../models/banner.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Add a new banner
// @route   POST /api/banners
export const addBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "college_banners",
    });

    const newBanner = new Banner({
      image: uploadedImage.secure_url, // Cloudinary URL
      publicId: uploadedImage.public_id, // Store public_id for deletion
    });

    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    console.error("Error adding banner:", error);
    res.status(500).json({ message: "Error adding banner", error: error.message });
  }
};

// @desc    Get all banners
// @route   GET /api/banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ message: "Error fetching banners", error: error.message });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
export const deleteBanner = async (req, res) => {
  try {

    console.log("delete hoga");
    
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    // Delete image from Cloudinary using stored publicId
    if (banner.publicId) {
      const result = await cloudinary.uploader.destroy(banner.publicId);
      console.log("Cloudinary Deletion Result:", result);

      if (result.result !== "ok") {
        return res.status(400).json({ message: "Failed to delete image from Cloudinary" });
      }
    }

    await banner.deleteOne();
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ message: "Error deleting banner", error: error.message });
  }
};
