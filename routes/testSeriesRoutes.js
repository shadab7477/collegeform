import express from "express";
import { TestSeries, TestAttempt } from "../models/TestSeries.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all test series (with filtering)
router.get("/", async (req, res) => {
  try {
    const { class: studentClass, subject, page = 1, limit = 10 } = req.query;
    let filter = { isActive: true };
    
    if (studentClass) filter.class = studentClass;
    if (subject) filter.subject = subject;
    
    const tests = await TestSeries.find(filter)
      .select("-questions.options.isCorrect")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await TestSeries.countDocuments(filter);
    
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

// Get single test (without correct answers)
router.get("/:id", async (req, res) => {
  try {
    const test = await TestSeries.findById(req.params.id)
      .select("-questions.options.isCorrect");
    
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit test attempt
router.post("/:id/attempt", auth, async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    const test = await TestSeries.findById(req.params.id);
    
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    
    // Calculate score
    let score = 0;
    const detailedAnswers = answers.map(answer => {
      const question = test.questions.id(answer.questionId);
      const isCorrect = question.options[answer.selectedOption].isCorrect;
      
      if (isCorrect) {
        score += question.marks;
      }
      
      return {
        question: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect
      };
    });
    
    // Save attempt
    const attempt = new TestAttempt({
      student: req.user.id,
      test: req.params.id,
      answers: detailedAnswers,
      score,
      totalMarks: test.totalMarks,
      timeSpent
    });
    
    await attempt.save();
    
    // Return results with correct answers
    const results = {
      score,
      totalMarks: test.totalMarks,
      percentage: ((score / test.totalMarks) * 100).toFixed(2),
      answers: detailedAnswers.map(answer => ({
        question: answer.question,
        selectedOption: answer.selectedOption,
        isCorrect: answer.isCorrect
      }))
    };
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's test attempts
router.get("/user/attempts", auth, async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ student: req.user.id })
      .populate("test", "title subject class")
      .sort({ completedAt: -1 });
    
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get test analytics (admin only)
router.get("/:id/analytics", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const testId = req.params.id;
    const attempts = await TestAttempt.find({ test: testId })
      .populate("student", "name email");
    
    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0 
      ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts 
      : 0;
    
    res.json({
      totalAttempts,
      averageScore: averageScore.toFixed(2),
      attempts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;