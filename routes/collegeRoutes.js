import express from "express";
import multer from "multer";
import { addCollege, getColleges, deleteCollege } from "../controllers/collegeController.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Configure Multer to Use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "college_images",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// Define Routes
router.post("/", upload.single("image"), addCollege);
router.get("/", getColleges);
router.delete("/:id", deleteCollege);

export default router;
