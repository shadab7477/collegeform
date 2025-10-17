import express from "express";
import { 
  addCollege, 
  getColleges, 
  deleteCollege, 
  editCollege, 
  getCollegeById 
} from "../controllers/collegeController.js";
import { uploadCollegeImages } from '../config/cloudinary.js';
import College from "../models/College.js";

const router = express.Router();

// Fixed: Use the correct upload middleware with proper field names
router.post("/", uploadCollegeImages.fields([
  { name: 'image', maxCount: 1 },
  { name: 'additionalImages', maxCount: 3 }
]), addCollege);

router.get("/", getColleges);
router.delete("/:id", deleteCollege);

// Fixed: Use the same field configuration for PUT route
router.put("/:id", uploadCollegeImages.fields([
  { name: 'image', maxCount: 1 },
  { name: 'additionalImages', maxCount: 3 }
]), editCollege);

router.get("/id/:id", getCollegeById);

// Get college by slug (SEO-friendly)
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const college = await College.findOne({ slug });

    if (!college) {
      return res.status(404).json({ 
        success: false,
        message: "College not found" 
      });
    }

    res.json({
      success: true,
      college 
    });
  } catch (error) {
    console.error("Error fetching college:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

export default router;