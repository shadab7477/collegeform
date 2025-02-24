import Banner from "../models/banner.js";
import fs from "fs";

// @desc    Add a new banner
// @route   POST /api/banners
export const addBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const image = `/uploads/${req.file.filename}`; // Save image path

    const newBanner = new Banner({ image });
    const savedBanner = await newBanner.save();

    res.status(201).json(savedBanner); // Return the banner object with image path
  } catch (error) {
    res.status(500).json({ message: "Error adding banner", error });
  }
};

// @desc    Get all banners
// @route   GET /api/banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners); // Return all banners
  } catch (error) {
    res.status(500).json({ message: "Error fetching banners", error });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    // Delete image from server
    const imagePath = `.${banner.image}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await banner.deleteOne();
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting banner", error });
  }
};
