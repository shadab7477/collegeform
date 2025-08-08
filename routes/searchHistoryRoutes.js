import express from "express";
import {
  saveSearchFilters,
  trackCollegeView,
  getUserSearchHistory
} from "../controllers/searchHistoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Save search filters - requires authentication
router.post("/save-filters", authMiddleware, saveSearchFilters);

// Track college view - requires authentication
router.post("/track-view", authMiddleware, trackCollegeView);

// Get user search history - requires authentication
router.get("/history", authMiddleware, getUserSearchHistory);

export default router;