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

const requiredDocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isRequired: { type: Boolean, default: true },
  description: { type: String }
});

const keyHighlightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const placementStatsSchema = new mongoose.Schema({
  year: { type: Number },
  averagePackage: { type: Number },
  highestPackage: { type: Number },
  placementPercentage: { type: Number }
});

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
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
    isRequestcallback: { type: Boolean, default: false },
    
    // Image fields
    image: { type: String, required: true },
    additionalImages: [{ type: String }],
    imagePublicId: { type: String, required: true },
    additionalImagesPublicIds: [{ type: String }],
    
    // New fields
    coursePricing: [coursePricingSchema],
    admissionProcess: [admissionProcessSchema],
    importantDates: [importantDatesSchema],
    applicationDeadline: { type: Date },
    entranceExams: [{ type: String }],
    placementStats: [placementStatsSchema],
    placementCompanies: [placementCompanySchema],
    placementHighlights: [{ type: String }],
    
    // New requested fields
    keyHighlights: [keyHighlightSchema],
    requiredDocuments: [requiredDocumentSchema]
  },
  { timestamps: true }
);

// Default required documents
collegeSchema.pre("save", function (next) {
  if (this.isNew && (!this.requiredDocuments || this.requiredDocuments.length === 0)) {
    this.requiredDocuments = [
      { name: "10th Mark Sheet", isRequired: true, description: "10th standard mark sheet" },
      { name: "12th Mark Sheet", isRequired: true, description: "12th standard mark sheet" },
      { name: "Graduation Mark Sheets (for PG courses)", isRequired: false, description: "Graduation mark sheets for postgraduate courses" },
      { name: "Transfer Certificate", isRequired: true, description: "Transfer certificate from previous institution" },
      { name: "Migration Certificate", isRequired: true, description: "Migration certificate" },
      { name: "Character Certificate", isRequired: true, description: "Character certificate" },
      { name: "Category Certificate (if applicable)", isRequired: false, description: "Category certificate for reserved categories" },
      { name: "Passport Size Photographs", isRequired: true, description: "Recent passport size photographs" },
      { name: "Identity Proof (Aadhar Card/Passport)", isRequired: true, description: "Government issued identity proof" }
    ];
  }
  next();
});

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