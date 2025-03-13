import express from "express";
import { addLogo, getLogos, deleteLogo } from "../controllers/logoController.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

// Define Routes for logo management
router.post("/", upload.single("image"), addLogo); // Add logo
router.get("/", getLogos); // Get all logos
router.delete("/:id", deleteLogo); // Delete a logo

export default router;
