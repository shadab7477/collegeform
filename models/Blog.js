import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  publicId: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  faqs: [{
    question: String,
    answer: String
  }]
}, {
  timestamps: true
});

// Generate slug before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;