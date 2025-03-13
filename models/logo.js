import mongoose from "mongoose";

const logoSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  
  publicId: { type: String, required: true }, // Cloudinary public_id
}, { timestamps: true });

const Logo = mongoose.model("Logo", logoSchema);

export default Logo;
