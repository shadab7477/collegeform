import College from "../models/College.js";
import fs from "fs";
import { fileURLToPath } from 'url';
import path from 'path';

// @desc    Add a new college
// @route   POST /api/colleges
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const addCollege = async (req, res) => {
  try {
    const { name, location, description, minFees, maxFees, avgPackage, exams, courses, rating,specializations } = req.body;

    // Handle image upload
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    // Parse JSON arrays for courses and exams
    const parsedCourses = JSON.parse(courses);
    const parsedExams = JSON.parse(exams);
    const parsedspecializations = JSON.parse(specializations);


    const newCollege = new College({
      name,
      location,
      description,
      minFees: Number(minFees),
      maxFees: Number(maxFees),
      avgPackage: Number(avgPackage),
      exams: parsedExams,
      courses: parsedCourses,
      specializations: parsedspecializations,
      rating: Number(rating),
      image,
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

    // Format colleges to ensure courses and exams are arrays
    const formattedColleges = colleges.map((college) => {
      return {
        ...college._doc,
        courses: Array.isArray(college.courses) ? college.courses : [],
        exams: Array.isArray(college.exams) ? college.exams : [],
      };
    });

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

    // Delete image from server
    if (college.image) {
      const imagePath = path.join(__dirname, "..", college.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await college.deleteOne();
    res.json({ message: "College deleted successfully" });
  } catch (error) {
    console.error("Error deleting college:", error);
    res.status(500).json({ message: "Error deleting college", error: error.message });
  }
};
