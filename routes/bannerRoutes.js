import express from "express";
import { uploadImage } from '../config/cloudinary.js';
import { addBanner, getBanners, deleteBanner } from "../controllers/bannerController.js";

const router = express.Router();

// Use the same Cloudinary upload middleware
router.post("/", uploadImage.single("image"), addBanner);
router.get("/", getBanners);
router.delete("/:id", deleteBanner);

export default router;
