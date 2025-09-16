// models/Student.js
import mongoose from "mongoose";

const collegeStatusSchema = new mongoose.Schema({
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  remarks: {
    type: String,
    default: ""
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const studentSchema = new mongoose.Schema({
  // Add unique application ID
  applicationId: {
    type: String,
    unique: true,
    required: true
  },
  name: String,
  number: String,
  dob: Date,
  gender: String,
  aadhar: String,
  course: String,
  
  // Store all selected colleges
  selectedColleges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "College"
  }],
  
  // Track status for each college
  collegeStatuses: [collegeStatusSchema],
  
  fatherName: String,
  fatherNumber: String,
  email: String,
  occupation: String,
  motherName: String,
  motherNumber: String,
  schoolName10: String,
  board10: String,
  passingYear10: String,
  percentage10: Number,
  cgpa10: Number,
  schoolName12: String,
  board12: String,
  passingYear12: String,
  percentage12: Number,
  cgpa12: Number,
  graduationUniversity: String,
  graduationCourse: String,
  passingYearGraduation: String,
  percentageGraduation: Number,
  cgpaGraduation: Number,
  isGraduation: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
  remarks: { type: String, default: "" },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

// Generate unique application ID before saving
studentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await mongoose.model('Student').countDocuments();
    this.applicationId = `APP${year}${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

const Student = mongoose.model("Student", studentSchema);

export default Student;