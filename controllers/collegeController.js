import College from "../models/College.js";
import cloudinary from "../config/cloudinary.js"; // Import Cloudinary config

// @desc    Add a new college
// @route   POST /api/colleges
export const addCollege = async (req, res) => {
  try {
    const { name, location, description, minFees, maxFees, avgPackage, exams, courses, rating, specializations } = req.body;

    // Upload Image to Cloudinary
    let imageUrl = "";
    let imageId = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "college_images",
      });
      imageUrl = result.secure_url;
      imageId = result.public_id;
    }

    // Parse JSON arrays for courses, exams, and specializations
    const parsedCourses = JSON.parse(courses);
    const parsedExams = JSON.parse(exams);
    const parsedSpecializations = JSON.parse(specializations);

    const newCollege = new College({
      name,
      location,
      description,
      minFees: Number(minFees),
      maxFees: Number(maxFees),
      avgPackage: Number(avgPackage),
      exams: parsedExams,
      courses: parsedCourses,
      specializations: parsedSpecializations,
      rating: Number(rating),
       image : imageUrl,  // Store Cloudinary image URL
      imageId,   // Store Cloudinary public ID for deletion
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

    // Delete Image from Cloudinary if it exists
    if (college.imageId) {
      await cloudinary.uploader.destroy(college.imageId);
    }

    await college.deleteOne();
    res.json({ message: "College deleted successfully" });
  } catch (error) {
    console.error("Error deleting college:", error);
    res.status(500).json({ message: "Error deleting college", error: error.message });
  }
};
