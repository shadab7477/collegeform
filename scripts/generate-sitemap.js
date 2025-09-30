import fs from "fs";
import College from "../models/College.js";

async function generateSitemap() {
  const colleges = await College.find({}, "slug updatedAt");
  const BASE_URL = "https://collegeforms.in";

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // ✅ All main static URLs
  const staticUrls = [
    "/",                 // homepage
    "/studyabroad",
    "/contactus",
    "/events",
    "/students/tests",
    "/colleges",
    "/offer",
    "/step",
    "/blogs",            // blog listing
    "/myaccount",
    "/video",
    "/change-password",
    "/user/login",
    "/user/signup",
    "/user/forgot-password",
    "/privacy-policy",   // agar PrivacyPage ke liye unique slug bana ho
    "/terms",            // (agar terms page ho future me)
  ];

  staticUrls.forEach(u => {
    xml += `<url><loc>${BASE_URL}${u}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
  });

  // ✅ Colleges dynamic pages
  colleges.forEach(c => {
    xml += `<url><loc>${BASE_URL}/college/${c.slug}</loc><lastmod>${c.updatedAt.toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>\n`;
  });

  xml += "</urlset>";

  fs.writeFileSync("../frontend/public/sitemap.xml", xml);
  console.log("✅ Sitemap generated in frontend/public/sitemap.xml");
}

export default generateSitemap;
