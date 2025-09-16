import express from 'express';
import {
  getAllStudents,
  getStudentById,
  submitStudentForm,
  updateStudent,
  saveFormProgress,
  getFormProgress,
  clearFormProgress,
  getAllFormProgress,
  updateCollegeStatus,
  getApplicationsByCollege,
  getApplicationById
} from '../controllers/studentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import College from "../models/College.js"

const router = express.Router();

// Apply auth middleware to all routes that need authentication
router.use(authMiddleware);

// Student routes
router.post('/submit', submitStudentForm);
router.get('/students', getAllStudents);

// Form progress routes
router.get('/progress', getFormProgress);
router.get('/Allprogress', getAllFormProgress);
router.post('/save-progress', saveFormProgress);
router.delete('/clear-progress', clearFormProgress);

// College status routes
router.put('/update-college-status', updateCollegeStatus);
router.get('/college-applications/:collegeId', getApplicationsByCollege);

// Application ID route
router.get('/application/:applicationId', getApplicationById);

// Student by ID
router.get('/:id', getStudentById);
router.put('/update/:id', updateStudent);

// Course and college routes
router.get('/perticular-course', async (req, res) => {
  try {
    const courses = await College.distinct('courses');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error });
  }
});   

router.get('/colleges', async (req, res) => {
  try {
    const colleges = await College.find({}, 'name courses');
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching colleges', error });
  }
});

export default router;