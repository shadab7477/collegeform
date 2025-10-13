import express from "express";
import {
  saveSearchFilters,
  trackCollegeView,
  getUserSearchHistoryById,
  getMySearchHistory
} from "../controllers/searchHistoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Save search filters - requires authentication
router.post("/save-filters", authMiddleware, saveSearchFilters);

// Track college view - requires authentication
router.post("/track-view", authMiddleware, trackCollegeView);

// Get current user's search history - requires authentication
router.get("/my-history", authMiddleware, getMySearchHistory);

// Get user search history by ID - requires admin access
router.get("/history/:userId", adminMiddleware, getUserSearchHistoryById);

export default router;