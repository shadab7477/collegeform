
import MobileBanner from "../models/mobileb.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Add a new mobile banner
// @route   POST /api/mobile-banners
export const addMobileBanner = async (req, res) => {
    console.log("yes");
    
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "college_mobile_banners",
    });

    const newMobileBanner = new MobileBanner({
      image: uploadedImage.secure_url, // Cloudinary URL
      publicId: uploadedImage.public_id, // Store public_id for deletion
    });

    const savedMobileBanner = await newMobileBanner.save();
    res.status(201).json(savedMobileBanner);
  } catch (error) {
    console.error("Error adding mobile banner:", error);
    res.status(500).json({ message: "Error adding mobile banner", error: error.message });
  }
};

// @desc    Get all mobile banners
// @route   GET /api/mobile-banners
export const getMobileBanners = async (req, res) => {
  try {
    const mobileBanners = await MobileBanner.find();
    res.json(mobileBanners);
  } catch (error) {
    console.error("Error fetching mobile banners:", error);
    res.status(500).json({ message: "Error fetching mobile banners", error: error.message });
  }
};

// @desc    Edit mobile banner
// @route   PUT /api/mobile-banners/:id
export const editMobileBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const mobileBanner = await MobileBanner.findById(id);
    if (!mobileBanner) return res.status(404).json({ message: "Mobile banner not found" });

    // If a new image is uploaded, replace the old one
    if (req.file) {
      await cloudinary.uploader.destroy(mobileBanner.publicId);
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "college_mobile_banners",
      });
      mobileBanner.image = uploadedImage.secure_url;
      mobileBanner.publicId = uploadedImage.public_id;
    }

    const updatedBanner = await mobileBanner.save();
    res.json(updatedBanner);
  } catch (error) {
    console.error("Error editing mobile banner:", error);
    res.status(500).json({ message: "Error editing mobile banner", error: error.message });
  }
};

// @desc    Delete a mobile banner
// @route   DELETE /api/mobile-banners/:id
export const deleteMobileBanner = async (req, res) => {
  try {
    const mobileBanner = await MobileBanner.findById(req.params.id);
    if (!mobileBanner) return res.status(404).json({ message: "Mobile banner not found" });

    // Delete image from Cloudinary using stored publicId
    if (mobileBanner.publicId) {
      const result = await cloudinary.uploader.destroy(mobileBanner.publicId);
      console.log("Cloudinary Deletion Result:", result);

      if (result.result !== "ok") {
        return res.status(400).json({ message: "Failed to delete image from Cloudinary" });
      }
    }

    await mobileBanner.deleteOne();
    res.json({ message: "Mobile banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting mobile banner:", error);
    res.status(500).json({ message: "Error deleting mobile banner", error: error.message });
  }
};
