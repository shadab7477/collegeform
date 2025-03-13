import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// Route to handle form submission (POST request)
router.post('/submit', async (req, res) => {
  const {
    name,
    number,
    dob,
    gender,
    aadhar,
    course,
    fatherName,
    fatherNumber,
    email,
    occupation,
    motherName,
    motherNumber,
    schoolName10,
    board10,
    passingYear10,
    percentage10,
    cgpa10,
    schoolName12,
    board12,
    passingYear12,
    percentage12,
    cgpa12,
    graduationUniversity,
    graduationCourse,
    passingYearGraduation,
    percentageGraduation,
    cgpaGraduation,
    college,
    collegeName,
    userID
  } = req.body;

  try {
    const newStudent = new Student({
      name,
      number,
      dob,
      gender,
      aadhar,
      course,
      fatherName,
      fatherNumber,
      email,
      occupation,
      motherName,
      motherNumber,
      schoolName10,
      board10,
      passingYear10,
      percentage10,
      cgpa10,
      schoolName12,
      board12,
      passingYear12,
      percentage12,
      cgpa12,
      graduationUniversity,
      graduationCourse,
      passingYearGraduation,
      percentageGraduation,
      cgpaGraduation,
      college,
    collegeName,
    userID

    });

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


export default router;
