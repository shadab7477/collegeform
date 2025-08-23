import express from 'express';
import {
  getAllStudents,
  getStudentById,
  submitStudentForm,
  updateStudent,
  saveFormProgress,
  getFormProgress,
  clearFormProgress
} from '../controllers/studentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes that need authentication
router.use(authMiddleware);

// Student routes
router.post('/submit', submitStudentForm);
router.get('/students', getAllStudents);
router.get('/:id', getStudentById);
router.put('/update/:id', updateStudent);

// Form progress routes
router.post('/save-progress', saveFormProgress);
router.get('/progressing', getFormProgress);
router.delete('/clear-progress', clearFormProgress);

export default router;