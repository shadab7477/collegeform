import College from "../models/College.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Add a new college
// @route   POST /api/colleges
export const addCollege = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { 
      name, location, description, minFees, maxFees, avgPackage, exams, 
      courses, specializations, rating, collegeType, category, isTopCollege,
      // New fields
      coursePricing, admissionProcess, importantDates, applicationDeadline,
      entranceExams, placementStats, placementCompanies, placementHighlights
    } = req.body;

    // Validate required fields
    if (!name || !location || !description) {
      return res.status(400).json({ 
        message: "Name, location, and description are required" 
      });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const imageUrl = req.file.path; 
    const publicId = req.file.filename;

    // Parse array fields safely
    const parseArray = (data, defaultValue = []) => {
      if (!data) return defaultValue;
      if (Array.isArray(data)) return data;
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Error parsing array:", error);
        return defaultValue;
      }
    };

    const newCollege = new College({
      name,
      location,
      description,
      minFees: Number(minFees) || 0,
      maxFees: Number(maxFees) || 0,
      avgPackage: Number(avgPackage) || 0,
      exams: parseArray(exams),
      courses: parseArray(courses),
      specializations: parseArray(specializations),
      rating: Number(rating) || 0,
      collegeType: parseArray(collegeType),
      category: category || "Default",
      isTopCollege: isTopCollege === 'true',
      image: imageUrl,
      imagePublicId: publicId,
      // New fields
      coursePricing: parseArray(coursePricing),
      admissionProcess: parseArray(admissionProcess),
      importantDates: parseArray(importantDates).map(date => ({
        ...date,
        date: new Date(date.date)
      })),
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      entranceExams: parseArray(entranceExams),
      placementStats: parseArray(placementStats),
      placementCompanies: parseArray(placementCompanies),
      placementHighlights: parseArray(placementHighlights)
    });

    console.log("Saving college:", newCollege);
    const savedCollege = await newCollege.save();
    console.log("College saved successfully:", savedCollege._id);
    
    res.status(201).json({
      success: true,
      message: "College added successfully",
      college: savedCollege
    });
  } catch (error) {
    console.error("Error adding college:", error);
    res.status(500).json({ 
      message: "Error adding college", 
      error: error.message,
      details: error.errors 
    });
  }
};

// @desc    Edit college details
// @route   PUT /api/colleges/:id
export const editCollege = async (req, res) => {
  try {
    const { 
      name, location, description, minFees, maxFees, avgPackage, 
      exams, courses, specializations, rating, collegeType, category, isTopCollege,
      // New fields
      coursePricing, admissionProcess, importantDates, applicationDeadline,
      entranceExams, placementStats, placementCompanies, placementHighlights
    } = req.body;

    // Parse array fields safely
    const parseArray = (data, defaultValue = []) => {
      if (!data) return defaultValue;
      if (Array.isArray(data)) return data;
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Error parsing array:", error);
        return defaultValue;
      }
    };

    let updateData = {
      name,
      location,
      description,
      minFees: Number(minFees) || 0,
      maxFees: Number(maxFees) || 0,
      avgPackage: Number(avgPackage) || 0,
      exams: parseArray(exams),
      courses: parseArray(courses),
      specializations: parseArray(specializations),
      rating: Number(rating) || 0,
      collegeType: parseArray(collegeType),
      category: category || "Default",
      isTopCollege: isTopCollege === 'true',
      // New fields
      coursePricing: parseArray(coursePricing),
      admissionProcess: parseArray(admissionProcess),
      importantDates: parseArray(importantDates).map(date => ({
        ...date,
        date: new Date(date.date)
      })),
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      entranceExams: parseArray(entranceExams),
      placementStats: parseArray(placementStats),
      placementCompanies: parseArray(placementCompanies),
      placementHighlights: parseArray(placementHighlights)
    };

    // Handle image update if new file is uploaded
    if (req.file && req.file.path) {
      const college = await College.findById(req.params.id);
      if (college && college.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(college.imagePublicId);
        } catch (cloudinaryError) {
          console.error("Error deleting old image from Cloudinary:", cloudinaryError);
        }
      }
      
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const updatedCollege = await College.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCollege) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json({
      success: true,
      message: "College updated successfully",
      college: updatedCollege
    });
  } catch (error) {
    console.error("Error updating college:", error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors 
    });
  }
};

// @desc    Get all colleges
// @route   GET /api/colleges
export const getColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: colleges.length,
      colleges
    });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({ 
      message: "Error fetching colleges", 
      error: error.message 
    });
  }
};

// @desc    Delete a college
// @route   DELETE /api/colleges/:id
export const deleteCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    // Delete image from Cloudinary
    if (college.imagePublicId) {
      try {
        const result = await cloudinary.uploader.destroy(college.imagePublicId);
        console.log("Cloudinary deletion result:", result);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }

    await College.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true,
      message: "College deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting college:", error);
    res.status(500).json({ 
      message: "Error deleting college", 
      error: error.message 
    });
  }
};

// @desc    Get college by ID
// @route   GET /api/colleges/id/:id
export const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }
    res.json(college);
  } catch (error) {
    console.error("Error fetching college:", error);
    res.status(500).json({ message: "Server error" });
  }
};