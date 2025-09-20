import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import College from "../models/College.js"; // path check karo
    import fs from "fs";

mongoose.set('strictQuery', true);

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const colleges = await College.find({}, "slug updatedAt");
    console.log(`Fetched ${colleges.length} colleges`);

    // Sitemap generation code
    const BASE_URL = "https://collegeforms.in";
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const staticUrls = ["/", "/about", "/contact", "/contactus", "/studyabroad", "/events"];
    staticUrls.forEach(u => {
      xml += `<url><loc>${BASE_URL}${u}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    });

    colleges.forEach(c => {
      xml += `<url><loc>${BASE_URL}/college/${c.slug}</loc><lastmod>${c.updatedAt.toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>\n`;
    });

    xml += "</urlset>";
    fs.writeFileSync("../frontend/public/sitemap.xml", xml);
    console.log("✅ Sitemap generated in frontend/public/sitemap.xml");

    process.exit(0); // exit script
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();
