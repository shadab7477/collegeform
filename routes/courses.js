import express from 'express';
import Course from '../models/course.js';

const router = express.Router();

// Create a new course
router.post('/', async (req, res) => {
    try {
        const courseData = {
            name: req.body.name,
            type: req.body.type || 'UG',
            specializations: req.body.specializations || []
        };
        
        const course = new Course(courseData);
        await course.save();
        res.status(201).send(course);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all courses with populated specializations
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('specializations')
            .sort({ createdAt: -1 });
        res.send(courses);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a course
router.put('/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                type: req.body.type || 'UG',
                specializations: req.body.specializations || []
            },
            { new: true }
        ).populate('specializations');
        
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }
        res.send(course);
    } catch (error) {
        res.status(400).send(error);
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


// Get specializations for specific courses
router.get('/specializations', async (req, res) => {
  try {
    const { courseIds } = req.query;
    if (!courseIds) {
      return res.status(400).json({ message: "Course IDs are required" });
    }

    const ids = Array.isArray(courseIds) ? courseIds : [courseIds];
    const courses = await Course.find({ _id: { $in: ids } }).populate('specializations');
    
    const specializationIds = [];
    courses.forEach(course => {
      if (course.specializations) {
        course.specializations.forEach(spec => {
          if (!specializationIds.includes(spec._id.toString())) {
            specializationIds.push(spec._id.toString());
          }
        });
      }
    });

    res.json(specializationIds);
  } catch (error) {
    console.error("Error fetching course specializations:", error);
    res.status(500).json({ message: "Error fetching specializations", error: error.message });
  }
});
export default router;