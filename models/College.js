import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
      enum: ["Default", "Overseas Education", "Vocational Education", "Scholarship Based Education", "Government Colleges"],
      default: "Default"
    }
  },
  { timestamps: true }
);

const College = mongoose.model("College", CollegeSchema);

export default College;