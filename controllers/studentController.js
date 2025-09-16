import Student from "../models/Student.js";
import FormProgress from "../models/FormProgress.js";
import mongoose from "mongoose";

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    console.log('User making request:', req.user);
    const students = await Student.find()
      .populate('selectedColleges', 'name')
      .populate('collegeStatuses.college', 'name');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student data', error });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    console.log('User ID from params:', req.params.id);
    
    // Find students by userId, not by their own _id
    const students = await Student.find({ userId: req.params.id })
      .populate('selectedColleges', 'name')
      .populate('collegeStatuses.college', 'name')
      .populate('userId', 'name email');
    
    console.log('Found students:', students);
    
    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No applications found for this user' });
    }
    
    res.json(students);
  } catch (err) {
    console.error('Error fetching student data:', err);
    res.status(500).json({ message: 'Error fetching student data', error: err.message });
  }
};

// Submit student form
// Submit student form
export const submitStudentForm = async (req, res) => {
  try {
    console.log('User submitting form:', req.user);
    console.log('Form data:', req.body);
    
    const {
      name, number, dob, gender, aadhar, course, selectedColleges,
      fatherName, fatherNumber, email, occupation, motherName, motherNumber,
      schoolName10, board10, passingYear10, percentage10, cgpa10,
      schoolName12, board12, passingYear12, percentage12, cgpa12,
      graduationUniversity, graduationCourse, passingYearGraduation, 
      percentageGraduation, cgpaGraduation, isGraduation
    } = req.body;

    // Generate a unique application ID
    const generateApplicationId = () => {
      const prefix = 'CF';
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
      return `${prefix}${timestamp}${random}`;
    };

    // Create a single student record with all selected colleges
    const newStudent = new Student({ 
      name,
      number,
      dob,
      gender,
      aadhar,
      course,
      selectedColleges, // Store all selected colleges
      fatherName,
      fatherNumber,
      email,
      occupation,
      motherName,
      motherNumber,
      schoolName10,
      board10,
      passingYear10,
      percentage10: percentage10 || null,
      cgpa10: cgpa10 || null,
      schoolName12,
      board12,
      passingYear12,
      percentage12: percentage12 || null,
      cgpa12: cgpa12 || null,
      graduationUniversity: graduationUniversity || '',
      graduationCourse: graduationCourse || '',
      passingYearGraduation: passingYearGraduation || '',
      percentageGraduation: percentageGraduation || null,
      cgpaGraduation: cgpaGraduation || null,
      isGraduation: isGraduation || false,
      userId: req.user.id || req.user._id,
      applicationId: generateApplicationId(), // Add the generated application ID
      // Add college-specific status tracking
      collegeStatuses: selectedColleges.map(collegeId => ({
        college: collegeId,
        status: 'pending', // Default status
        remarks: ''
      }))
    });

    await newStudent.save();
    
    res.status(201).json({ 
      message: `Student data submitted successfully to ${selectedColleges.length} college(s)!`,
      studentId: newStudent._id,
      applicationId: newStudent.applicationId // Return the unique application ID
    });
  } catch (error) {
    console.error('Error saving student data:', error);
    res.status(500).json({ 
      message: 'Error saving student data', 
      error: error.message 
    });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  const { status, remarks } = req.body;
  console.log('User updating student:', req.user);

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { 
        ...(status !== undefined && { status }), 
        ...(remarks !== undefined && { remarks }) 
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student', error });
  }
};

// Save form progress
export const saveFormProgress = async (req, res) => {
  try {
    console.log('User saving progress:');
    
    const userId = req.user.id || req.user._id;
    const { formData, activeStep } = req.body;
    
    const progress = await FormProgress.findOneAndUpdate(
      { userId },
      { 
        formData,
        activeStep,
        userId,
      },
      { upsert: true, new: true }
    );
    
    res.status(200).json({ message: 'Progress saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving progress', error });
  }
};

// Get form progress
export const getFormProgress = async (req, res) => {
  try {
    console.log("hit nhi horhi");
    
    const userId = req.user.id || req.user._id;
    
    const progress = await FormProgress.findOne({ userId });
    
    if (!progress) {
      return res.status(404).json({ message: 'No saved progress found' });
    }
    
    res.status(200).json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ message: 'Error fetching progress', error });
  }
};

export const getAllFormProgress = async (req, res) => {
  try {
    console.log("hit nhi horhi");
    
    const userId = req.user.id || req.user._id;
    console.log("howhi h bawa");
    
    const progress = await FormProgress.find({ userId });
    
    if (!progress) {
      return res.status(404).json({ message: 'No saved progress found' });
    }
    
    res.status(200).json(progress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ message: 'Error fetching progress', error });
  }
};

// Clear form progress
export const clearFormProgress = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    await FormProgress.findOneAndUpdate(
      { userId },
      {
        $set: {
          selectedColleges: [],
          college: '',
          course: '',
          activeStep: 2,
        },
      },
      { new: true }
    );

    res.status(200).json({ message: 'Selected colleges, course, and college cleared. Active step set to 3.' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing fields', error });
  }
};

// Function to update status for a specific college application
export const updateCollegeStatus = async (req, res) => {
  try {
    const { studentId, collegeId, status, remarks } = req.body;
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Find the college status entry
    const collegeStatus = student.collegeStatuses.find(
      cs => cs.college.toString() === collegeId
    );
    
    if (!collegeStatus) {
      return res.status(404).json({ message: 'College application not found' });
    }
    
    // Update the status
    collegeStatus.status = status;
    collegeStatus.remarks = remarks || '';
    collegeStatus.updatedAt = new Date();
    
    await student.save();
    
    res.status(200).json({ 
      message: `College application status updated to ${status}`,
      student 
    });
  } catch (error) {
    console.error('Error updating college status:', error);
    res.status(500).json({ 
      message: 'Error updating college status', 
      error: error.message 
    });
  }
};

// Function to get all applications for a specific college
export const getApplicationsByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    
    const applications = await Student.find({
      'collegeStatuses.college': collegeId
    })
    .populate('userId', 'name email')
    .populate('selectedColleges', 'name')
    .populate('collegeStatuses.college', 'name');
    
    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ 
      message: 'Error fetching applications', 
      error: error.message 
    });
  }
};

// Get application by application ID
export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await Student.findOne({ applicationId })
      .populate('selectedColleges', 'name')
      .populate('collegeStatuses.college', 'name')
      .populate('userId', 'name email');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.status(200).json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ 
      message: 'Error fetching application', 
      error: error.message 
    });
  }
};