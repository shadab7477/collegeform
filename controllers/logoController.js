import Logo from "../models/logo.js"; // Assuming Logo model is defined in models/logo.js
import fs from "fs";

// @desc    Add a new logo
// @route   POST /api/logos
export const addLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const image = `/uploads/${req.file.filename}`; // Save image path

    const newLogo = new Logo({ image });
    const savedLogo = await newLogo.save();

    res.status(201).json(savedLogo); // Return the logo object with image path
  } catch (error) {
    res.status(500).json({ message: "Error adding logo", error });
  }
};

// @desc    Get all logos
// @route   GET /api/logos
export const getLogos = async (req, res) => {
  try {
    const logos = await Logo.find();
    res.json(logos); // Return all logos
  } catch (error) {
    res.status(500).json({ message: "Error fetching logos", error });
  }
};

// @desc    Delete a logo
// @route   DELETE /api/logos/:id
export const deleteLogo = async (req, res) => {
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) return res.status(404).json({ message: "Logo not found" });

    // Delete image from server
    const imagePath = `.${logo.image}`;
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await logo.deleteOne();
    res.json({ message: "Logo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting logo", error });
  }
};
