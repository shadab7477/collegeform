import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  number: String,
  dob: Date,
  gender: String,
  aadhar: String,
  course: String,
  college: {
    type: mongoose.Schema.Types.ObjectId,  // Reference College by ID
    ref: "College",  
    required: true,  // Ensure a student selects a college
  },

  userID: {
    type: mongoose.Schema.Types.ObjectId,  // Reference College by ID
    ref: "User",  
    required: true,  // Ensure a student selects a college
  },

collegeName:String,
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
  status: { type: Boolean, default: true }, // Active by default
  remarks: { type: String, default: "" },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
