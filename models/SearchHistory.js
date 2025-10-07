import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filters: {
    course: String,
    specialization: String,
    location: String,
    examAccepted: String,
    educationMode: String,
    feesRange: String,
    feesPaymentMode: String
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
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

export default SearchHistory;