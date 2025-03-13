import express from "express";
import { addCollege, getColleges, deleteCollege, editCollege } from "../controllers/collegeController.js"; // Import editCollege
import upload from "../config/cloudinary.js"; // Import Cloudinary upload middleware

const router = express.Router();

// Routes
router.post("/", upload.single("image"), addCollege);
router.get("/", getColleges);
router.delete("/:id", deleteCollege);
router.put("/:id", upload.single("image"), editCollege); // ✅ Add Edit College Route

export default router;
  