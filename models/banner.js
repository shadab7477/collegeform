import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  
  publicId: { type: String, required: true }, // Cloudinary public_id
  
  link: { type: String }, // Optional link field
  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Banner", BannerSchema);
