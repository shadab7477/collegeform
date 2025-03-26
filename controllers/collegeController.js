import College from "../models/College.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Add a new college
// @route   POST /api/colleges
export const addCollege = async (req, res) => {
  try {
    const { name, location, description, minFees, maxFees, avgPackage, exams, courses, specializations, rating, collegeType } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const imageUrl = req.file.path; 
    const publicId = req.file.filename;

    const newCollege = new College({
      name,
      location,
      description,
      minFees: Number(minFees),
      maxFees: Number(maxFees),
      avgPackage: Number(avgPackage),
      exams: exams ? JSON.parse(exams) : [],
      courses: courses ? JSON.parse(courses) : [],
      specializations: specializations ? JSON.parse(specializations) : [],
      rating: Number(rating),
      collegeType,
      image: imageUrl,
      imagePublicId: publicId,
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
    res.json(colleges);
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({ message: "Error fetching colleges", error: error.message });
  }
};

// @desc    Edit college details
// @route   PUT /api/colleges/:id
export const editCollege = async (req, res) => {
  try {
    // First validate the request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ message: "Invalid request body" });
    }

    // Convert string values to arrays if needed
    const updateData = {
      ...req.body,
      exams: Array.isArray(req.body.exams) ? req.body.exams : [req.body.exams],
      courses: Array.isArray(req.body.courses) ? req.body.courses : [req.body.courses],
      specializations: Array.isArray(req.body.specializations) ? req.body.specializations : [req.body.specializations]
    };

    const updatedCollege = await College.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCollege) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json(updatedCollege);
  } catch (err) {
    console.error("Error updating college:", err);
    res.status(400).json({ 
      message: err.message,
      details: err.errors 
    });
  }
};

// @desc    Delete a college
// @route   DELETE /api/colleges/:id
export const deleteCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });

    if (college.imagePublicId) {
      const result = await cloudinary.uploader.destroy(college.imagePublicId);
      if (result.result !== "ok") {
        return res.status(400).json({ message: "Failed to delete image from Cloudinary" });
      }
    }

    await college.deleteOne();
    res.json({ message: "College deleted successfully" });
  } catch (error) {
    console.error("Error deleting college:", error);
    res.status(500).json({ message: "Error deleting college", error: error.message });
  }
};
