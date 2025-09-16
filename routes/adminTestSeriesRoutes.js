import express from "express";
import { TestSeries } from "../models/TestSeries.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin middleware
router.use(adminAuth);

// Create new test series
router.post("/", async (req, res) => {
  try {
    const testSeries = new TestSeries({
      ...req.body,
      createdBy: "Admin"
    });
    
    await testSeries.save();
    res.status(201).json(testSeries);
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(400).json({ message: error.message });
  }
});

// Get specific test with all details (including correct answers)
router.get("/:id", async (req, res) => {
  try {
    const test = await TestSeries.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({ message: "Test series not found" });
    }
    
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add question to test
router.post("/:id/questions", async (req, res) => {
  try {
    const test = await TestSeries.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({ message: "Test series not found" });
    }
    
    test.questions.push(req.body);
    await test.save();
    
    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update question in test
router.put("/:id/questions/:questionId", async (req, res) => {
  try {
    const test = await TestSeries.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({ message: "Test series not found" });
    }
    
    const question = test.questions.id(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    question.set(req.body);
    await test.save();
    
    res.json(test);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete question from test
router.delete("/:id/questions/:questionId", async (req, res) => {
  try {
    const test = await TestSeries.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: "Test series not found" });
    }

    // Remove the question by its ID
    test.questions = test.questions.filter(
      (q) => q._id.toString() !== req.params.questionId
    );

    await test.save();

    res.json({
      message: "Question deleted successfully",
      test: test
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: error.message });
  }
});


// Update test series
router.put("/:id", async (req, res) => {
  try {
    const testSeries = await TestSeries.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!testSeries) {
      return res.status(404).json({ message: "Test series not found" });
    }
    
    res.json(testSeries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete test series
router.delete("/:id", async (req, res) => {
  try {
    const testSeries = await TestSeries.findByIdAndDelete(req.params.id);
    
    if (!testSeries) {
      return res.status(404).json({ message: "Test series not found" });
    }
    
    res.json({ message: "Test series deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all test series (admin view)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const tests = await TestSeries.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await TestSeries.countDocuments();
    
    res.json({
      tests,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;