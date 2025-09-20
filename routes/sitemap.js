import fs from "fs";
import College from "./models/College.js";  // apna model

async function generateSitemap() {
  const colleges = await College.find({}, "slug updatedAt");
  const BASE_URL = "https://collegeforms.in";

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static URLs
  const staticUrls = ["/", "/about", "/contact"];
  staticUrls.forEach(u => {
    xml += `<url><loc>${BASE_URL}${u}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
  });

  // Colleges
  colleges.forEach(c => {
    xml += `<url><loc>${BASE_URL}/college/${c.slug}</loc><lastmod>${c.updatedAt.toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>\n`;
  });

  xml += "</urlset>";

  // Save as file
  fs.writeFileSync("../frontend/public/sitemap.xml", xml);
  console.log("✅ Sitemap generated in frontend/public/sitemap.xml");
}

generateSitemap();
