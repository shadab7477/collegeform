import College from "../models/College.js";
import { v2 as cloudinary } from "cloudinary";  // Import Cloudinary properly
import { fileURLToPath } from "url";
import path from "path";

// @desc    Add a new college
// @route   POST /api/colleges
export const addCollege = async (req, res) => {
  try {
    const { name, location, description, minFees, maxFees, avgPackage, exams, courses, rating, specializations } = req.body;

    // Check if file is uploaded
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    // Extract image details from Cloudinary response
    const imageUrl = req.file.path; // Cloudinary URL
    const publicId = req.file.filename; // Cloudinary Public ID

    console.log("Uploaded Image URL:", imageUrl);
    console.log("Stored Public ID:", publicId);

    const newCollege = new College({
      name,
      location,
      description,
      minFees: Number(minFees),
      maxFees: Number(maxFees),
      avgPackage: Number(avgPackage),
      exams: JSON.parse(exams),
      courses: JSON.parse(courses),
      specializations: JSON.parse(specializations),
      rating: Number(rating),
      image: imageUrl, // Cloudinary URL
      imagePublicId: publicId, // Cloudinary Public ID
    });

    const savedCollege = await newCollege.save();
    res.status(201).json(savedCollege);
  } catch (error) {
    console.error("Error adding college:", error);
    res.status(500).json({ message: "Error adding college", error: error.message });
  }
};

// @desc    Get all colleges
// @route   GET /api/colleges
export const getColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    const formattedColleges = colleges.map((college) => ({
      ...college._doc,
      courses: Array.isArray(college.courses) ? college.courses : [],
      exams: Array.isArray(college.exams) ? college.exams : [],
    }));

    res.json(formattedColleges);
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({ message: "Error fetching colleges", error: error.message });
  }
};

// @desc    Delete a college
// @route   DELETE /api/colleges/:id
export const deleteCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });

    // Delete image from Cloudinary using stored public_id
    if (college.imagePublicId) {
      console.log("Deleting Cloudinary Image:", college.imagePublicId);

      const result = await cloudinary.uploader.destroy(college.imagePublicId);
      console.log("Cloudinary Deletion Result:", result);

      if (result.result !== "ok") {
        return res.status(400).json({ message: "Failed to delete image from Cloudinary" });
      }
    }

    // Delete college from MongoDB
    await college.deleteOne();
    res.json({ message: "College deleted successfully" });
  } catch (error) {
    console.error("Error deleting college:", error);
    res.status(500).json({ message: "Error deleting college", error: error.message });
  }
};
