import express from "express";
import { addCollege, getColleges, deleteCollege } from "../controllers/collegeController.js";
import upload from "../config/cloudinary.js"; // Import the new upload middleware

const router = express.Router();

// Routes
router.post("/", upload.single("image"), addCollege);
router.get("/", getColleges);
router.delete("/:id", deleteCollege);

export default router;
