import express from "express";
import { addLogo, getLogos, deleteLogo } from "../controllers/logoController.js";
import { uploadImage } from '../config/cloudinary.js';

const router = express.Router();

// Define Routes for logo management
router.post("/", uploadImage.single("image"), addLogo); // Add logo
router.get("/", getLogos); // Get all logos
router.delete("/:id", deleteLogo); // Delete a logo

export default router;
