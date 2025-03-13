import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  
  publicId: { type: String, required: true }, // Cloudinary public_id
});

export default mongoose.model("Banner", BannerSchema);
