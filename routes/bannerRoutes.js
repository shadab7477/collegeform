import express from "express";
import { uploadImage } from '../config/cloudinary.js';
import { 
  addBanner, 
  getBanners, 
  deleteBanner, 
  updateBanner,
  updateBannerImage,
  getBannersByCategory,
  getCategories 
} from "../controllers/bannerController.js";

const router = express.Router();

router.post("/", uploadImage.single("image"), addBanner);
router.get("/", getBanners);
router.get("/category/:category", getBannersByCategory);
router.get("/categories/all", getCategories);
router.delete("/:id", deleteBanner);
router.put("/:id", updateBanner);
router.put("/:id/image", uploadImage.single("image"), updateBannerImage);

export default router;