// routes/reviewRoutes.js
import express from "express";
import {
  createReview,
  getAllReviews,
  getReviewsByCourse,
  getReviewStats,
  updateReview,
  deleteReview,
  getPendingReviews
} from "../controllers/reviewController.js";

const router = express.Router();

// Public routes
router.post("/", createReview);
router.get("/", getAllReviews);

// Admin routes (you might want to add authentication middleware)
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;