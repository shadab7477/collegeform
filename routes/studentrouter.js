import express from 'express';
import {
  getAllStudents,
  submitStudentForm,
  saveFormProgress,
  getFormProgress,
  clearFormProgress,
  getAllFormProgress,
  updateCollegeStatus,
  getApplicationsByCollege,
  getApplicationById,
  getUserApplications
} from '../controllers/studentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import College from "../models/College.js"
import adminMiddleware from '../middleware/adminMiddleware.js';
const router = express.Router();

// Apply auth middleware to all routes that need authentication

// Student routes
router.post('/submit',authMiddleware, submitStudentForm);
router.get('/students', getAllStudents);
router.get('/my-applications', authMiddleware, getUserApplications);

// Form progress routes
router.get('/progress',authMiddleware, getFormProgress);
router.get('/Allprogress', authMiddleware, getAllFormProgress);
router.post('/save-progress',authMiddleware, saveFormProgress);
router.delete('/clear-progress',authMiddleware, clearFormProgress);

// College status routes
router.put('/update-college-status',adminMiddleware, updateCollegeStatus);
router.get('/college-applications/:collegeId',authMiddleware, getApplicationsByCollege);

// Application ID route
router.get('/application/:applicationId',authMiddleware, getApplicationById);

// Student by ID

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