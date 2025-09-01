// scripts/add-slugs.js
import mongoose from "mongoose";
import slugify from "slugify";
import College from "../models/College.js"; // adjust the path if different
import dotenv from "dotenv";

dotenv.config();

// connect to DB
await mongoose.connect(process.env.MONGO_URI,{
     useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);


// find all colleges without slug
const colleges = await College.find({ slug: { $exists: false } });

for (const college of colleges) {
  college.slug = slugify(college.name, { lower: true, strict: true });
  await college.save();
  console.log(`✅ Added slug for ${college.name} → ${college.slug}`);
}

console.log("🎉 Slug migration completed!");
mongoose.disconnect();
