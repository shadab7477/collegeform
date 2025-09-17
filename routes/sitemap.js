import express from 'express';
import College from '../models/College.js';  // Your College model

const router = express.Router();
const BASE_URL = 'https://collegeforms.in';

let cachedSitemap = null;
let lastGenerated = 0;

router.get('/sitemap.xml', async (req, res) => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;  // 24 hours

    if (cachedSitemap && (now - lastGenerated < oneDay)) {
        res.header('Content-Type', 'application/xml');
        return res.send(cachedSitemap);
    }

    try {
        const colleges = await College.find({}, 'slug updatedAt');

        const staticUrls = [
            `${BASE_URL}/`,
            `${BASE_URL}/about`,
            `${BASE_URL}/contact`
        ];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        staticUrls.forEach(url => {
            xml += `
    <url>
        <loc>${url}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
        });

        colleges.forEach(college => {
            xml += `
    <url>
        <loc>${BASE_URL}/college/${college.slug}</loc>
        <lastmod>${college.updatedAt.toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>`;
        });

        xml += `\n</urlset>`;

        cachedSitemap = xml;
        lastGenerated = now;

        res.header('Content-Type', 'application/xml');
        res.send(xml);

    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).send('Server error');
    }
});

export default router;
