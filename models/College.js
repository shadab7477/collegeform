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
      type: [String], // Array of exam names
      default: [],
    },
    courses: {
      type: [String], // Array of course names
      required: true,
    },
    specializations: {
      type: [String], // Array of course names
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5, // Assuming rating is out of 5
    },
    image: {
      type: String, // Path to image
      default: "",
    },
    imagePublicId:{
      type:String,
    }

  },
  { timestamps: true }
);

const College = mongoose.model("College", CollegeSchema);

export default College;
