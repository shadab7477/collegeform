import mongoose from "mongoose";

const logoSchema = new mongoose.Schema({
  image: { type: String, required: true },
  publicId: { type: String, required: true },
  collegeName: { type: String, required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  discount: { type: String },
}, { timestamps: true });

const Logo = mongoose.model("Logo", logoSchema);

export default Logo;