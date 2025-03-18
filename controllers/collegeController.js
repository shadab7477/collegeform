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
    let { page = 1, limit = 10 } = req.query; // Get page & limit from query params
    page = parseInt(page);
    limit = parseInt(limit);

    const totalColleges = await College.countDocuments(); // Get total number of colleges
    const colleges = await College.find()
      .skip((page - 1) * limit) // Skip previous pages' data
      .limit(limit); // Limit to `limit` colleges

    res.json({
      colleges,
      totalPages: Math.ceil(totalColleges / limit), // Calculate total pages
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({ message: "Error fetching colleges", error: error.message });
  }
};



// @desc    Edit college details
// @route   PUT /api/colleges/:id
export const editCollege = async (req, res) => {
  try {
    const { name, location, description, minFees, maxFees, avgPackage, exams, courses, specializations, rating, collegeType } = req.body;
    
    let college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ message: "College not found" });

    let imageUrl = college.image;
    let publicId = college.imagePublicId;

    // If a new image is uploaded, update Cloudinary image
    if (req.file && req.file.path) {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
      imageUrl = req.file.path;
      publicId = req.file.filename;
    }

    college = await College.findByIdAndUpdate(
      req.params.id,
      {
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
      },
      { new: true }
    );

    res.json(college);
  } catch (error) {
    console.error("Error updating college:", error);
    res.status(500).json({ message: "Error updating college", error: error.message });
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
