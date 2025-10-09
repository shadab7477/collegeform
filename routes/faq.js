import express from "express";
import Faq from "../models/Faq.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Add new FAQ
router.post("/", adminMiddleware, async (req, res) => {
  try {
    const { question, answer } = req.body;
    console.log(req.body);
    
    const faq = new Faq({ 
      question, 
      answer, 
    });
    
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all FAQs
router.get("/", async (req, res) => {
  try {
    const { category, active } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (active !== undefined) filter.isActive = active === 'true';
    
    const faqs = await Faq.find(filter).sort({ createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get FAQ by ID
router.get("/:id", async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update FAQ

// Delete FAQ
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export default router;