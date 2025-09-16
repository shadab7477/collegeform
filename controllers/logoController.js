import Logo from "../models/logo.js";
import { v2 as cloudinary } from "cloudinary";
import College from "../models/College.js";
// @desc    Add a new logo
// @route   POST /api/logos

export const addLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });
    if (!req.body.collegeId) return res.status(400).json({ message: "College ID is required" });

    // Find the college by ID (not slug)
    const college = await College.findById(req.body.collegeId);
    if (!college) return res.status(404).json({ message: "College not found" });

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "college_logos",
    });

    const newLogo = new Logo({
      image: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      collegeName: college.name,
      collegeId: college._id, // Store the ObjectId, not slug
      discount: req.body.discount,
    });

    const savedLogo = await newLogo.save();
    res.status(201).json(savedLogo);
  } catch (error) {
    console.error("Error adding logo:", error);
    res.status(500).json({ message: "Error adding logo", error: error.message });
  }
};

// @desc    Get all logos
// @route   GET /api/logos
export const getLogos = async (req, res) => {
  try {
    const logos = await Logo.find();
    res.json(logos);
  } catch (error) {
    console.error("Error fetching logos:", error);
    res.status(500).json({ message: "Error fetching logos", error: error.message });
  }
};

// @desc    Delete a logo
// @route   DELETE /api/logos/:id
export const deleteLogo = async (req, res) => {
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) return res.status(404).json({ message: "Logo not found" });

    // Check if publicId is stored correctly
    console.log("Stored Public ID:", logo.publicId);

    // Delete image from Cloudinary using publicId
    if (logo.publicId) {
      const result = await cloudinary.uploader.destroy(logo.publicId, { invalidate: true });
      console.log("Cloudinary Deletion Result:", result);

      if (result.result !== "ok") {
        return res.status(400).json({ message: "Failed to delete logo from Cloudinary" });
      }
    }

    await logo.deleteOne();
    res.json({ message: "Logo deleted successfully" });
  } catch (error) {
    console.error("Error deleting logo:", error);
    res.status(500).json({ message: "Error deleting logo", error: error.message });
  }
};

