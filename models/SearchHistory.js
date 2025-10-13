import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filters: {
    course: {
      type: String,
      default: ''
    },
    specialization: {
      type: String,
      default: ''
    },
    currentCity: {
      type: String,
      default: ''
    },
    preferredCity: {
      type: String,
      default: ''
    },
    examAccepted: {
      type: String,
      default: ''
    },
    educationLevel: {
      type: String,
      default: ''
    },
    educationMode: {
      type: String,
      default: ''
    }
  },
  searchQuery: {
    type: String,
    required: true
  },
  collegesViewed: [{
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better performance
searchHistorySchema.index({ user: 1, createdAt: -1 });
searchHistorySchema.index({ createdAt: -1 });

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

export default SearchHistory;