// import mongoose from "mongoose";
// import slugify from "slugify";
// import College from "../models/College.js"; // adjust the path if different
// import dotenv from "dotenv";

// dotenv.config();

// // connect to DB
// await mongoose.connect(process.env.MONGO_URI,{
//      useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// console.log("Loaded MONGO_URI:", process.env.MONGO_URI);


// const colleges = await College.find({ slug: { $exists: false } });

// for (const college of colleges) {
//   college.slug = slugify(college.name, { lower: true, strict: true });
//   await college.save();
//   console.log(`✅ Added slug for ${college.name} → ${college.slug}`);
// }

// console.log("🎉 Slug migration completed!");
// mongoose.disconnect();




// scripts/add-slugs.js
import mongoose from "mongoose";
import slugify from "slugify";
import Blog from "../models/Blog.js"; // adjust the path if different
import dotenv from "dotenv";

dotenv.config();

const addSlugsToBlogs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Find all blogs without a slug
    const blogs = await Blog.find({ slug: { $exists: false } });

    console.log(`Found ${blogs.length} blogs without slugs`);

    // Add slugs to each blog
    for (const blog of blogs) {
      const slug = slugify(blog.title, { 
        lower: true, 
        strict: true,
        remove: /[*+~.()'"!:@]/g
      });
      
      // Check if slug already exists
      const existingBlog = await Blog.findOne({ slug });
      if (existingBlog) {
        // Add timestamp to make it unique if there's a conflict
        blog.slug = `${slug}-${Date.now()}`;
      } else {
        blog.slug = slug;
      }
      
      await blog.save();
      console.log(`✅ Added slug for "${blog.title}" → ${blog.slug}`);
    }

    console.log("🎉 Slug migration completed!");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
};

addSlugsToBlogs();