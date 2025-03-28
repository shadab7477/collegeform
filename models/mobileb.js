import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  
  publicId: { type: String, required: true }, // Cloudinary public_id
  
  link: { type: String }, // Optional redirect URL
  altText: { type: String, default: "Mobile Banner" }, // Accessibility
  isActive: { type: Boolean, default: true }, // Display toggle
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("MobileBanner", BannerSchema);
