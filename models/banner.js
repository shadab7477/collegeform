import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
});

export default mongoose.model("Banner", BannerSchema);
