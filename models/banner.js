import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  publicId: { type: String, required: true },
  link: { type: String },
  category: { 
    type: String, 
    required: true,
    enum: [
      "Default",
      "OnlineEducation",
      "OverseasEducation",
      "vocational-institutes",
      "ScholarshipBasedEducation",
      "government-colleges",
      "career-assessments",
      "education-loan",
      "accommodation"
    ],
    default: "Default"
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Banner", BannerSchema);