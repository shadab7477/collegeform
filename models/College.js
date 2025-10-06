import mongoose from "mongoose";

const coursePricingSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  originalFees: { type: Number, required: true },
  discountedFees: { type: Number, required: true },
  discountPercentage: { type: Number },
  duration: { type: String, required: true },
  eligibility: { type: String, required: true },
  seatsAvailable: { type: Number, required: true }
});

const admissionProcessSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true }
});

const importantDatesSchema = new mongoose.Schema({
  event: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true }
});

const placementCompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  avgPackage: { type: Number },
  studentsPlaced: { type: Number }
});

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    minFees: { type: Number, required: true },
    maxFees: { type: Number, required: true },
    avgPackage: { type: Number },
    exams: [{ type: String }],
    courses: [{ type: String, required: true }],
    specializations: [{ type: String, required: true }],
    rating: { type: Number, default: 0 },
    collegeType: [{ type: String }],
    category: { type: String, default: "Default" },
    isTopCollege: { type: Boolean, default: false },
    image: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    
    // New fields
    coursePricing: [coursePricingSchema],
    admissionProcess: [admissionProcessSchema],
    importantDates: [importantDatesSchema],
    applicationDeadline: { type: Date },
    entranceExams: [{ type: String }],
    placementStats: [{
      year: { type: Number },
      averagePackage: { type: Number },
      highestPackage: { type: Number },
      placementPercentage: { type: Number }
    }],
    placementCompanies: [placementCompanySchema],
    placementHighlights: [{ type: String }]
  },
  { timestamps: true }
);

// Generate slug before saving
collegeSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

// Handle duplicate slug errors
collegeSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("Slug must be unique"));
  } else {
    next(error);
  }
});

export default mongoose.model("College", collegeSchema);