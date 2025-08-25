import express from 'express';
import {
  getAllStudents,
  getStudentById,
  submitStudentForm,
  updateStudent,
  saveFormProgress,
  getFormProgress,
  clearFormProgress,
  getAllFormProgress
} from '../controllers/studentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes that need authentication
router.use(authMiddleware);

// Student routes
// Student routes
router.post('/submit', submitStudentForm);
router.get('/students', getAllStudents);

// Form progress routes (specific before dynamic)
router.get('/progress', getFormProgress);
router.get('/Allprogress', getAllFormProgress);

router.post('/save-progress', saveFormProgress);
router.delete('/clear-progress', clearFormProgress);

// Student by ID (must come last)
router.get('/:id', getStudentById);
router.put('/update/:id', updateStudent);


export default router;