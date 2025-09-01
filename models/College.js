import mongoose from "mongoose";
import slugify from "slugify";

const CollegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    minFees: {
      type: Number,
      required: true,
    },
    maxFees: {
      type: Number,
      required: true,
    },
    avgPackage: {
      type: Number,
      required: true,
    },
    exams: {
      type: [String],
      default: [],
    },
    courses: {
      type: [String],
      required: true,
    },
    specializations: {
      type: [String],
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
    },
    collegeType: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Default",
        "Online-Education",
        "OverseasEducation",
        "vocational-institutes",
        "ScholarshipBasedEducation",
        "government-colleges",
      ],
      default: "Default",
    },
    isTopCollege: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Automatically generate slug from name
CollegeSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const College = mongoose.model("College", CollegeSchema);
export default College;
