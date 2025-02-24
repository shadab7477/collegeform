import express from "express";
import multer from "multer";
import { addLogo, getLogos, deleteLogo } from "../controllers/logoController.js";

const router = express.Router();

// Multer Config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Define Routes for logo management
router.post("/", upload.single("image"), addLogo); // Add logo
router.get("/", getLogos); // Get all logos
router.delete("/:id", deleteLogo); // Delete a logo

export default router;
