import express from "express";
import upload from "../config/cloudinary.js";

import { addMobileBanner, getMobileBanners, deleteMobileBanner } from "../controllers/mobileBannerController.js";

const router = express.Router();


// Routes
router.post("/", upload.single("image"), addMobileBanner);
router.get("/", getMobileBanners);
router.delete("/:id", deleteMobileBanner);

export default router;
