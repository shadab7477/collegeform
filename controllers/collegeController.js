import College from "../models/College.js";
import { cloudinary } from '../config/cloudinary.js';

// Helper function to parse JSON fields safely
const parseJSONField = (field, defaultValue = []) => {
  if (!field) return defaultValue;
  try {
    return typeof field === 'string' ? JSON.parse(field) : field;
  } catch (error) {
    console.error('Error parsing JSON field:', error);
    return defaultValue;
  }
};

// Helper function to parse number fields safely
const parseNumberField = (field, defaultValue = 0) => {
  if (!field && field !== 0) return defaultValue;
  const parsed = parseFloat(field);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Helper function to parse boolean fields safely
const parseBooleanField = (field, defaultValue = false) => {
  if (field === 'true') return true;
  if (field === 'false') return false;
  return defaultValue;
};

// Add new college
export const addCollege = async (req, res) => {
  try {
    console.log("Request files:", req.files);
    console.log("Request body:", req.body);

    // Check for main image
    if (!req.files || !req.files.image || !req.files.image[0]) {
      return res.status(400).json({ 
        success: false, 
        message: "Main college image is required" 
      });
    }

    const {
      name, location, description, shortDescription, minFees, maxFees, avgPackage,
      exams, courses, specializations, collegeType, category, rating, isTopCollege,isRequestcallback,
      coursePricing, admissionProcess, importantDates, applicationDeadline,
      entranceExams, placementCompanies, placementHighlights, keyHighlights, requiredDocuments
    } = req.body;

    // Upload main image
    const imageUrl = req.files.image[0].path;
    const imagePublicId = req.files.image[0].filename;

    // Handle additional images
    let additionalImages = [];
    let additionalImagesPublicIds = [];
    
    if (req.files.additionalImages) {
      additionalImages = req.files.additionalImages.map(file => file.path);
      additionalImagesPublicIds = req.files.additionalImages.map(file => file.filename);
    }

    // Parse all fields safely
    const collegeData = {
      name: name?.trim(),
      location: location?.trim(),
      description: description?.trim(),
      shortDescription: shortDescription?.trim(),
      minFees: parseNumberField(minFees),
      maxFees: parseNumberField(maxFees),
      avgPackage: parseNumberField(avgPackage),
      exams: parseJSONField(exams),
      courses: parseJSONField(courses),
      specializations: parseJSONField(specializations),
      collegeType: parseJSONField(collegeType),
      category: category?.trim() || "Default",
      rating: parseNumberField(rating),
      isTopCollege: parseBooleanField(isTopCollege),
      isRequestcallback: parseBooleanField(isRequestcallback),

      image: imageUrl,
      imagePublicId,
      additionalImages,
      additionalImagesPublicIds,
      coursePricing: parseJSONField(coursePricing),
      admissionProcess: parseJSONField(admissionProcess),
      importantDates: parseJSONField(importantDates),
      applicationDeadline: applicationDeadline || null,
      entranceExams: parseJSONField(entranceExams),
      placementCompanies: parseJSONField(placementCompanies),
      placementHighlights: parseJSONField(placementHighlights),
      keyHighlights: parseJSONField(keyHighlights),
      requiredDocuments: parseJSONField(requiredDocuments)
    };

    // Validate required fields
    if (!collegeData.name || !collegeData.location || !collegeData.description || !collegeData.shortDescription) {
      return res.status(400).json({
        success: false,
        message: "Name, location, description, and short description are required fields"
      });
    }

    console.log("Creating college with data:", collegeData);

    const college = new College(collegeData);
    await college.save();
    
    res.status(201).json({ 
      success: true, 
      message: "College added successfully",
      college 
    });
  } catch (error) {
    console.error('Error adding college:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A college with this name already exists"
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Edit college
export const editCollege = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Editing college ID:", id);
    console.log("Request files:", req.files);
    console.log("Request body:", req.body);

    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ 
        success: false, 
        message: "College not found" 
      });
    }

    const {
      name, location, description, shortDescription, minFees, maxFees, avgPackage,
      exams, courses, specializations, collegeType, category, rating, isTopCollege,isRequestcallback,
      coursePricing, admissionProcess, importantDates, applicationDeadline,
      entranceExams, placementCompanies, placementHighlights, keyHighlights, requiredDocuments
    } = req.body;

    // Update basic fields
    college.name = name?.trim() || college.name;
    college.location = location?.trim() || college.location;
    college.description = description?.trim() || college.description;
    college.shortDescription = shortDescription?.trim() || college.shortDescription;
    college.minFees = parseNumberField(minFees, college.minFees);
    college.maxFees = parseNumberField(maxFees, college.maxFees);
    college.avgPackage = parseNumberField(avgPackage, college.avgPackage);
    college.exams = parseJSONField(exams, college.exams);
    college.courses = parseJSONField(courses, college.courses);
    college.specializations = parseJSONField(specializations, college.specializations);
    college.collegeType = parseJSONField(collegeType, college.collegeType);
    college.category = category?.trim() || college.category;
    college.rating = parseNumberField(rating, college.rating);
    college.isTopCollege = parseBooleanField(isTopCollege, college.isTopCollege);
    college.isRequestcallback = parseBooleanField(isRequestcallback, college.isRequestcallback);

    college.applicationDeadline = applicationDeadline || college.applicationDeadline;
    college.entranceExams = parseJSONField(entranceExams, college.entranceExams);
    college.placementHighlights = parseJSONField(placementHighlights, college.placementHighlights);

    // Update complex fields
    college.coursePricing = parseJSONField(coursePricing, college.coursePricing);
    college.admissionProcess = parseJSONField(admissionProcess, college.admissionProcess);
    college.importantDates = parseJSONField(importantDates, college.importantDates);
    college.placementCompanies = parseJSONField(placementCompanies, college.placementCompanies);
    college.keyHighlights = parseJSONField(keyHighlights, college.keyHighlights);
    college.requiredDocuments = parseJSONField(requiredDocuments, college.requiredDocuments);

    // Handle main image update
    if (req.files && req.files.image && req.files.image[0]) {
      // Delete old main image from Cloudinary if exists
      if (college.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(college.imagePublicId);
        } catch (error) {
          console.error("Error deleting old main image:", error);
        }
      }
      
      college.image = req.files.image[0].path;
      college.imagePublicId = req.files.image[0].filename;
    }

    // Handle additional images update
    if (req.files && req.files.additionalImages) {
      // Delete old additional images from Cloudinary
      if (college.additionalImagesPublicIds && college.additionalImagesPublicIds.length > 0) {
        try {
          await Promise.all(
            college.additionalImagesPublicIds.map(publicId => 
              cloudinary.uploader.destroy(publicId)
            )
          );
        } catch (error) {
          console.error("Error deleting old additional images:", error);
        }
      }
      
      college.additionalImages = req.files.additionalImages.map(file => file.path);
      college.additionalImagesPublicIds = req.files.additionalImages.map(file => file.filename);
    }

    await college.save();
    
    res.json({ 
      success: true, 
      message: "College updated successfully",
      college 
    });
  } catch (error) {
    console.error('Error updating college:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get all colleges
export const getColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });
    res.json(
      colleges 
    );
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get college by ID
export const getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await College.findById(id);
    
    if (!college) {
      return res.status(404).json({ 
        success: false, 
        message: "College not found" 
      });
    }
    
    res.json(
      data
    );
  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete college
export const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const college = await College.findById(id);
    
    if (!college) {
      return res.status(404).json({ 
        success: false, 
        message: "College not found" 
      });
    }

    // Delete images from Cloudinary
    try {
      // Delete main image
      if (college.imagePublicId) {
        await cloudinary.uploader.destroy(college.imagePublicId);
      }
      
      // Delete additional images
      if (college.additionalImagesPublicIds && college.additionalImagesPublicIds.length > 0) {
        await Promise.all(
          college.additionalImagesPublicIds.map(publicId => 
            cloudinary.uploader.destroy(publicId)
          )
        );
      }
    } catch (error) {
      console.error("Error deleting images from Cloudinary:", error);
    }

    await College.findByIdAndDelete(id);
    
    res.json({ 
      success: true, 
      message: "College deleted successfully" 
    });
  } catch (error) {
    console.error('Error deleting college:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};