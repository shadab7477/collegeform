import express from "express";
import multer from "multer";
import { addBanner, getBanners, deleteBanner } from "../controllers/bannerController.js";

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Define Routes for banners
router.post("/", upload.single("image"), addBanner);
router.get("/", getBanners);
router.delete("/:id", deleteBanner);

export default router;
