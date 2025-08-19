import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Slider = mongoose.model("Slider", sliderSchema);
export default Slider;