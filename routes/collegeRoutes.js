import express from "express";
import { 
  addCollege, 
  getColleges, 
  deleteCollege, 
  editCollege, 
  getCollegeById 
} from "../controllers/collegeController.js";
import { uploadImage } from '../config/cloudinary.js';
import College from "../models/College.js";

const router = express.Router();

// Routes
router.post("/", uploadImage.single("image"), addCollege);
router.get("/", getColleges);
router.delete("/:id", deleteCollege);
router.put("/:id", uploadImage.single("image"), editCollege);
router.get("/id/:id", getCollegeById);

// Get college by slug (SEO-friendly)
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const college = await College.findOne({ slug });

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json(college);
  } catch (error) {
    console.error("Error fetching college:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;