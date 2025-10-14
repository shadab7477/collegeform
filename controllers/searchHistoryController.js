import SearchHistory from "../models/SearchHistory.js";

// Save user search filters
export const saveSearchFilters = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    console.log("User ID:", req.user.id);

    const { filters } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!filters) {
      return res.status(400).json({
        success: false,
        message: "Filters are required"
      });
    }

    // Generate search query string
    const searchQuery = generateSearchQuery(filters);

    // Create new search history entry
    const newSearch = new SearchHistory({
      user: userId,
      filters: {
        course: filters.course || '',
        specialization: filters.specialization || '',
        currentCity: filters.currentCity || '',
        preferredCity: filters.preferredCity || '',
        examAccepted: filters.examAccepted || '',
        educationLevel: filters.educationLevel || '',
        educationMode: filters.educationMode || '',
      },
      searchQuery: searchQuery
    });

    await newSearch.save();

    console.log("Search filters saved successfully:", newSearch._id);

    res.status(201).json({
      success: true,
      message: "Search filters saved successfully",
      search: newSearch
    });
  } catch (error) {
    console.error("Error saving search filters:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save search filters",
      error: error.message
    });
  }
};

// NEW FUNCTION: Save college to user's history
export const saveCollegeHistory = async (req, res) => {
  try {
    console.log("Saving college to history:", req.body);
    
    const { 
      collegeId, 
      collegeName, 
      collegeImage, 
      location, 
      courses, 
      minFees, 
      maxFees, 
      avgPackage 
    } = req.body;
    
    const userId = req.user.id;

    if (!collegeId || !collegeName) {
      return res.status(400).json({
        success: false,
        message: "College ID and name are required"
      });
    }

    // Find user's most recent search history or create a new one
    let searchHistory = await SearchHistory.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!searchHistory) {
      searchHistory = new SearchHistory({
        user: userId,
        filters: {},
        searchQuery: "College view without search",
        collegesViewed: []
      });
    }

    // Check if college is already in viewed list
    const existingCollegeIndex = searchHistory.collegesViewed.findIndex(
      college => college.collegeId && college.collegeId.toString() === collegeId
    );

    if (existingCollegeIndex !== -1) {
      // Update existing entry with new view
      searchHistory.collegesViewed[existingCollegeIndex].lastViewedAt = new Date();
      searchHistory.collegesViewed[existingCollegeIndex].viewCount += 1;
      
      // Update college details if they changed
      searchHistory.collegesViewed[existingCollegeIndex].collegeName = collegeName;
      searchHistory.collegesViewed[existingCollegeIndex].collegeImage = collegeImage || '';
      searchHistory.collegesViewed[existingCollegeIndex].location = location || '';
      searchHistory.collegesViewed[existingCollegeIndex].courses = courses || [];
      searchHistory.collegesViewed[existingCollegeIndex].minFees = minFees || 0;
      searchHistory.collegesViewed[existingCollegeIndex].maxFees = maxFees || 0;
      searchHistory.collegesViewed[existingCollegeIndex].avgPackage = avgPackage || 0;
    } else {
      // Add new college to history
      searchHistory.collegesViewed.push({
        collegeId,
        collegeName,
        collegeImage: collegeImage || '',
        location: location || '',
        courses: courses || [],
        minFees: minFees || 0,
        maxFees: maxFees || 0,
        avgPackage: avgPackage || 0,
        firstViewedAt: new Date(),
        lastViewedAt: new Date(),
        viewCount: 1
      });
    }

    await searchHistory.save();

    console.log("College saved to history successfully");

    res.status(200).json({
      success: true,
      message: "College saved to history successfully",
      searchHistory
    });
  } catch (error) {
    console.error("Error saving college to history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save college to history",
      error: error.message
    });
  }
};

// Track college views
export const trackCollegeView = async (req, res) => {
  try {
    console.log("Tracking college view:", req.body);
    
    const { collegeId } = req.body;
    const userId = req.user.id;

    if (!collegeId) {
      return res.status(400).json({
        success: false,
        message: "College ID is required"
      });
    }

    // Find the user's most recent search or create a new one
    let searchHistory = await SearchHistory.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!searchHistory) {
      searchHistory = new SearchHistory({
        user: userId,
        filters: {},
        searchQuery: "College view without search"
      });
    }

    // Check if college is already in viewed list
    const alreadyViewed = searchHistory.collegesViewed.some(
      view => view.collegeId && view.collegeId.toString() === collegeId
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
      message: "Failed to track college view",
      error: error.message
    });
  }
};

// Get user search history by ID (admin access)
export const getUserSearchHistoryById = async (req, res) => {
  try {
    const { userId } = req.params;

    const searchHistory = await SearchHistory.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('collegesViewed.collegeId', 'name city state')
      .limit(50);

    res.status(200).json({
      success: true,
      count: searchHistory.length,
      searchHistory
    });
  } catch (error) {
    console.error("Error fetching search history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch search history",
      error: error.message
    });
  }
};

// Get current user's search history
export const getMySearchHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const searchHistory = await SearchHistory.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('collegesViewed.collegeId', 'name city state')
      .limit(50);

    res.status(200).json({
      success: true,
      count: searchHistory.length,
      searchHistory
    });
  } catch (error) {
    console.error("Error fetching user search history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch search history",
      error: error.message
    });
  }
};

// Helper function to generate a readable search query
const generateSearchQuery = (filters) => {
  const parts = [];
  
  if (filters.course) parts.push(filters.course);
  if (filters.specialization) parts.push(`in ${filters.specialization}`);
  if (filters.preferredCity) parts.push(`near ${filters.preferredCity}`);
  if (filters.educationLevel) parts.push(`(${filters.educationLevel})`);
  
  return parts.join(' ') || 'General college search';
};