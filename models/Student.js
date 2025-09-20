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
  applicationId: {
    type: String,
    unique: true
  },
  name: String,
  number: String,
  dob: Date,
  gender: String,
  aadhar: String,
  course: String,
  
  selectedColleges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "College"
  }],
  
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
  if (this.isNew && !this.applicationId) {
    const generateApplicationId = () => {
      const prefix = 'CF';
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(1000 + Math.random() * 9000);
      return `${prefix}${timestamp}${random}`;
    };
    
    let isUnique = false;
    let applicationId;
    
    while (!isUnique) {
      applicationId = generateApplicationId();
      const existing = await mongoose.model('Student').findOne({ applicationId });
      if (!existing) {
        isUnique = true;
      }
    }
    
    this.applicationId = applicationId;
  }
  next();
});

const Student = mongoose.model("Student", studentSchema);

export default Student;