import express from "express";
import { uploadImage } from '../config/cloudinary.js';

import { addMobileBanner, getMobileBanners, deleteMobileBanner } from "../controllers/mobileBannerController.js";

const router = express.Router();


// Routes
router.post("/", uploadImage.single("image"), addMobileBanner);
router.get("/", getMobileBanners);
router.delete("/:id", deleteMobileBanner);

export default router;
