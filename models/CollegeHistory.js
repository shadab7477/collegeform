import mongoose from "mongoose";

const collegeHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  viewedColleges: [{
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true
    },
    collegeName: {
      type: String,
      required: true
    },
    collegeImage: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    courses: [{
      type: String
    }],
    minFees: {
      type: Number,
      default: 0
    },
    maxFees: {
      type: Number,
      default: 0
    },
    avgPackage: {
      type: Number,
      default: 0
    },
    firstViewedAt: {
      type: Date,
      default: Date.now
    },
    lastViewedAt: {
      type: Date,
      default: Date.now
    },
    viewCount: {
      type: Number,
      default: 1
    }
  }]
}, {
  timestamps: true
});

// Index for better performance
collegeHistorySchema.index({ user: 1 });
collegeHistorySchema.index({ 'viewedColleges.lastViewedAt': -1 });

const CollegeHistory = mongoose.model('CollegeHistory', collegeHistorySchema);

export default CollegeHistory;