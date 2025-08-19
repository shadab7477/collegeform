import express from "express";
import Slider from "../models/Slider.js";
import  adminMiddleware  from "../middleware/adminMiddleware.js";

const router = express.Router();

// Add new slider item
router.post("/", adminMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const slider = new Slider({ content });
    await slider.save();
    res.status(201).json(slider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all slider items
router.get("/", async (req, res) => {
  try {
    const sliderItems = await Slider.find().sort({ createdAt: -1 });
    res.json(sliderItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete slider item
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    const sliderItem = await Slider.findByIdAndDelete(req.params.id);
    if (!sliderItem) return res.status(404).json({ message: "Slider item not found" });
    res.json({ message: "Slider item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;