// models/Logo.js
import mongoose from "mongoose";

const logoSchema = new mongoose.Schema({
  image: { type: String, required: true },
  publicId: { type: String, required: true },
  collegeName: { type: String, required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  discount: { type: String },
}, { timestamps: true });

export default mongoose.model("Logo", logoSchema);