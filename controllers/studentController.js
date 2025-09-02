import Student from "../models/Student.js";
import FormProgress from "../models/FormProgress.js";

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    console.log('User making request:', req.user);
    const students = await Student.find();
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
      .populate('college') // Populate college data if needed
      .populate('userId', 'name email'); // Populate user data if needed
    
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
export const submitStudentForm = async (req, res) => {
  try {
    console.log('User submitting form:', req.user);
    const newStudent = new Student({ 
      ...req.body,
      userId: req.user.id || req.user._id // Handle both cases
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student data submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving student data', error });
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
// Save form progress - modified to include collegeId
export const saveFormProgress = async (req, res) => {
  try {
    console.log('User saving progress:', req.user);
    
    const userId = req.user.id || req.user._id;
    const { formData, activeStep, collegeId } = req.body; // Add collegeId
    
    const progress = await FormProgress.findOneAndUpdate(
      { userId, collegeId }, // Include collegeId in the query
      { 
        formData,
        activeStep,
        userId,
        collegeId // Store collegeId
      },
      { upsert: true, new: true }
    );
    
    res.status(200).json({ message: 'Progress saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving progress', error });
  }
};

// Get form progress - modified to include collegeId
export const getFormProgress = async (req, res) => {
  try {
    console.log("hit nhi horhi");
    
    const userId = req.user.id || req.user._id;
    const collegeId = req.query.collegeId; // Get collegeId from query params
    console.log(collegeId);
    
    const progress = await FormProgress.findOne({ userId, collegeId });
    
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

// Clear form progress - modified to include collegeId
export const clearFormProgress = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const collegeId = req.query.collegeId; // Get collegeId from query params
    
    await FormProgress.findOneAndDelete({ userId, collegeId });
    
    res.status(200).json({ message: 'Progress cleared successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing progress', error });
  }
};