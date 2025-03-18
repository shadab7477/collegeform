import express from "express";
import { addCollege, getColleges, deleteCollege, editCollege } from "../controllers/collegeController.js"; // Import editCollege
import upload from "../config/cloudinary.js"; // Import Cloudinary upload middleware
import College from "../models/College.js";
const router = express.Router();

// Routes
router.post("/", upload.single("image"), addCollege);
router.get("/", getColleges);
router.delete("/:id", deleteCollege);
router.put("/:id", upload.single("image"), editCollege); // ✅ Add Edit College Route
router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const college = await College.findById(id);
  
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
  