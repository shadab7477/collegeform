import College from "../models/College.js";
import { v2 as cloudinary } from "cloudinary";  // Import Cloudinary properly
import { fileURLToPath } from "url";
import path from "path";

// @desc    Add a new college
// @route   POST /api/colleges
export const addCollege = async (req, res) => {
  try {
    const { name, location, description, minFees, maxFees, avgPackage, exams, courses, rating, specializations } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const imageUrl = req.file.path; // Save the Cloudinary URL in DB

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
      image: imageUrl,
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

    // Extract correct Public ID from Cloudinary URL
    if (college.image) {
      const parts = college.image.split("/");
      const publicId = parts[parts.length - 1].split(".")[0]; // Extract ID before file extension

      console.log("Deleting Cloudinary Image:", publicId);

      // Delete from Cloudinary (No need for callback)
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Cloudinary Deletion Result:", result);
    }

    // Delete college from MongoDB
    await college.deleteOne();
    res.json({ message: "College deleted successfully" });
  } catch (error) {
    console.error("Error deleting college:", error);
    res.status(500).json({ message: "Error deleting college", error: error.message });
  }
};
