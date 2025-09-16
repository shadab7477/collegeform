import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  explanation: String,
  marks: {
    type: Number,
    default: 1
  }
});

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  class: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number, // in minutes
    required: true
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  randomOrder: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const testAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestSeries',
    required: true
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TestSeries.questions'
    },
    selectedOption: Number, // index of the selected option
    isCorrect: Boolean
  }],
  score: {
    type: Number,
    default: 0
  },
  totalMarks: {
    type: Number,
    required: true
  },
  timeSpent: Number, // in minutes
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total marks before saving
testSchema.pre('save', function(next) {
  this.totalMarks = this.questions.reduce((total, question) => total + question.marks, 0);
  next();
});

export const TestSeries = mongoose.model('TestSeries', testSchema);
export const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);