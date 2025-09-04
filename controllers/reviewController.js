// controllers/reviewController.js
import Review from "../models/Review.js";

// @desc    Create a new review
// @route   POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { name, course, review, rating } = req.body;
console.log(req.body);

    // Validate required fields
    if (!name || !course || !review || !rating) {
      return res.status(400).json({ 
        message: "Please provide name, course, review, and rating" 
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: "Rating must be between 1 and 5" 
      });
    }

    const newReview = new Review({
      name,
      course,
      review,
      rating,
      isApproved: false // Reviews need approval before showing
    });

    const savedReview = await newReview.save();
    res.status(201).json({
      message: "Review submitted successfully. It will be visible after approval.",
      review: savedReview
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ 
      message: "Error creating review", 
      error: error.message 
    });
  }
};

// @desc    Get all reviews (with optional filtering)
// @route   GET /api/reviews
export const getAllReviews = async (req, res) => {
  try {
    
    
    const reviews = await Review.find()
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ 
      message: "Error fetching reviews", 
      error: error.message 
    });
  }
};

// @desc    Get reviews for a specific course
// @route   GET /api/reviews/course/:courseName
export const getReviewsByCourse = async (req, res) => {
  try {
    const { courseName } = req.params;
    const reviews = await Review.find({ 
      course: new RegExp(courseName, 'i'),
      isApproved: true 
    }).sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching course reviews:", error);
    res.status(500).json({ 
      message: "Error fetching course reviews", 
      error: error.message 
    });
  }
};

// @desc    Get review statistics for a course
// @route   GET /api/reviews/stats/:courseName
export const getReviewStats = async (req, res) => {
  try {
    const { courseName } = req.params;
    const reviews = await Review.find({ 
      course: new RegExp(courseName, 'i'),
      isApproved: true 
    });
    
    if (reviews.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);
    
    const ratingDistribution = {
      1: reviews.filter(r => r.rating === 1).length,
      2: reviews.filter(r => r.rating === 2).length,
      3: reviews.filter(r => r.rating === 3).length,
      4: reviews.filter(r => r.rating === 4).length,
      5: reviews.filter(r => r.rating === 5).length
    };
    
    res.json({
      averageRating,
      totalReviews: reviews.length,
      ratingDistribution
    });
  } catch (error) {
    console.error("Error fetching review stats:", error);
    res.status(500).json({ 
      message: "Error fetching review stats", 
      error: error.message 
    });
  }
};

// @desc    Update a review (approve/edit)
// @route   PUT /api/reviews/:id
export const updateReview = async (req, res) => {
  try {
    const { name, course, review, rating, isApproved } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (course) updateData.course = course;
    if (review) updateData.review = review;
    if (rating) updateData.rating = rating;
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    res.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ 
      message: "Error updating review", 
      error: error.message 
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    res.json({ 
      message: "Review deleted successfully",
      deletedReview 
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ 
      message: "Error deleting review", 
      error: error.message 
    });
  }
};

// @desc    Get pending reviews for admin approval
// @route   GET /api/reviews/pending
export const getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: false }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    res.status(500).json({ 
      message: "Error fetching pending reviews", 
      error: error.message 
    });
  }
};