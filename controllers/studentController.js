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
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student data', error: err });
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
export const saveFormProgress = async (req, res) => {
  try {
    console.log('User saving progress:', req.user);
    
    const userId = req.user.id || req.user._id; // Handle both cases
    
    const progress = await FormProgress.findOneAndUpdate(
      { userId },
      { 
        formData: req.body.formData,
        activeStep: req.body.activeStep,
        userId
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
    const userId = req.user.id || req.user._id; // Handle both cases
    console.log("Fetching progress for user:", userId);
    
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

// Clear form progress
export const clearFormProgress = async (req, res) => {
  try {
    console.log('User clearing progress:', req.user);
    const userId = req.user.id || req.user._id; // Handle both cases
    
    await FormProgress.findOneAndDelete({ userId });
    
    res.status(200).json({ message: 'Progress cleared successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing progress', error });
  }
};