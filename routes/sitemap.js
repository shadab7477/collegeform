import express from "express";
import path from "path";
import generateSitemap from "../scripts/generate-sitemap.js";

const router = express.Router();

// pehle sitemap generate kardo (optional, ya cron job me bhi chala sakte ho)
generateSitemap();

// sitemap serve kardo
router.get("/sitemap.xml", (req, res) => {
  res.sendFile(path.resolve("./frontend/public/sitemap.xml"));
});

export default router;
