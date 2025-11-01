import Banner from "../models/banner.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Add a new banner
// @route   POST /api/banners
export const addBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const { link, category = "Default" } = req.body;

    // Validate category
    const validCategories = [
      "Default",
      "OnlineEducation",
      "OverseasEducation",
      "vocational-institutes",
      "ScholarshipBasedEducation",
      "government-colleges",
      "career-assessments",
      "education-loan",
      "accommodation"
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "college_banners",
    });

    const newBanner = new Banner({
      image: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      link: link || null,
      category: category
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
    const { category } = req.query;
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }

    const banners = await Banner.find(query).sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ 
      message: "Error fetching banners", 
      error: error.message 
    });
  }
};

// @desc    Get banners by category
// @route   GET /api/banners/category/:category
export const getBannersByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const banners = await Banner.find({ category }).sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    console.error("Error fetching banners by category:", error);
    res.status(500).json({ 
      message: "Error fetching banners by category", 
      error: error.message 
    });
  }
};

// @desc    Get all categories
// @route   GET /api/banners/categories/all
export const getCategories = async (req, res) => {
  try {
    const categories = [
      "Default",
      "OnlineEducation",
      "OverseasEducation",
      "vocational-institutes",
      "ScholarshipBasedEducation",
      "government-colleges",
      "career-assessments",
      "education-loan",
      "accommodation"
    ];
    
    // Get counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await Banner.countDocuments({ category });
        return {
          name: category,
          count: count
        };
      })
    );

    res.json(categoriesWithCounts);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ 
      message: "Error fetching categories", 
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

// @desc    Update a banner
// @route   PATCH /api/banners/:id
export const updateBanner = async (req, res) => {
  try {
    const { link, category } = req.body;
    const updateData = {};
    
    if (link !== undefined) updateData.link = link;
    if (category !== undefined) updateData.category = category;

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json(banner);
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ 
      message: "Error updating banner", 
      error: error.message 
    });
  }
};



// @desc    Update a banner
// @route   PUT /api/banners/:id


// @desc    Update banner image
// @route   PUT /api/banners/:id/image
export const updateBannerImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Delete old image from Cloudinary
    if (banner.publicId) {
      await cloudinary.uploader.destroy(banner.publicId);
    }

    // Upload new image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "college_banners",
    });

    // Update banner with new image
    const updatedBanners = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        image: uploadedImage.secure_url,
        publicId: uploadedImage.public_id
      },
      { new: true }
    );

    res.json({
      message: "Banner image updated successfully",
      banner: updatedBanners
    });
  } catch (error) {
    console.error("Error updating banner image:", error);
    res.status(500).json({ 
      message: "Error updating banner image", 
      error: error.message 
    });
  }
};