import SearchHistory from "../models/SearchHistory.js";
import College from "../models/College.js";

// Save user search filters
export const saveSearchFilters = async (req, res) => {
  try {
    const { filters } = req.body;
    const userId = req.user.id;

    const newSearch = new SearchHistory({
      user: userId,
      filters
    });

    await newSearch.save();

    res.status(201).json({
      success: true,
      message: "Search filters saved successfully",
      search: newSearch
    });
  } catch (error) {
    console.error("Error saving search filters:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save search filters"
    });
  }
};

// Track college views
export const trackCollegeView = async (req, res) => {
  try {
    const { collegeId } = req.body;
    const userId = req.user.id;

    // Find the user's most recent search or create a new one
    let searchHistory = await SearchHistory.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!searchHistory) {
      searchHistory = new SearchHistory({
        user: userId,
        filters: {}
      });
    }

    // Check if college is already in viewed list
    const alreadyViewed = searchHistory.collegesViewed.some(
      view => view.collegeId.toString() === collegeId
    );

    if (!alreadyViewed) {
      searchHistory.collegesViewed.push({
        collegeId,
        viewedAt: new Date()
      });
      await searchHistory.save();
    }

    res.status(200).json({
      success: true,
      message: "College view tracked successfully"
    });
  } catch (error) {
    console.error("Error tracking college view:", error);
    res.status(500).json({
      success: false,
      message: "Failed to track college view"
    });
  }
};

// Get user search history
export const getUserSearchHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const searchHistory = await SearchHistory.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('collegesViewed.collegeId');

    res.status(200).json({
      success: true,
      searchHistory
    });
  } catch (error) {
    console.error("Error fetching search history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch search history"
    });
  }
};