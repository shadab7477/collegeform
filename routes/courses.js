import express from 'express';
import Course from '../models/course.js';

const router = express.Router();

// Create a new course
router.post('/', async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).send(course);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.send(courses);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a course by ID
router.delete('/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }
        res.send({ message: 'Course deleted successfully', course });
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
