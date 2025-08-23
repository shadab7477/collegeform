import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// Route to handle form submission (POST request)
router.post('/submit', async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    console.log(token);
    


    // Attach userID from decoded token
    const newStudent = new Student({ ...req.body  });

    console.log(newStudent);

    await newStudent.save();
    res.status(201).json({ message: 'Student data submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving student data', error });
  }
});

// Route to fetch all students (GET request)
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
    console.log(students);
    
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student data', error });
  }
});




router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student data', error: err });
  }
});


router.put('/update/:id', async (req, res) => {
  const { status, remarks } = req.body;
console.log(req.body);

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { 
        ...(status !== undefined && { status }), 
        ...(remarks !== undefined && { remarks }) 
      },
      { new: true } // Return updated document
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student', error });
  }
});



// Add to your backend routes (students.js)

// Save progress
router.post('/save-progress', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    
    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    // Find and update or create progress document
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
});

// Get progress
router.get('/progress', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    
    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    // Find progress document
    const progress = await FormProgress.findOne({ userId });
    
    if (!progress) {
      return res.status(404).json({ message: 'No saved progress found' });
    }
    
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error });
  }
});

// Clear progress after submission
router.delete('/clear-progress', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    
    // Verify token and get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    // Delete progress document
    await FormProgress.findOneAndDelete({ userId });
    
    res.status(200).json({ message: 'Progress cleared successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing progress', error });
  }
});

export default router;
