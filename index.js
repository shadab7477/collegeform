import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";
import LogoRoutes from "./routes/LogoRoutes.js"; 
import courseRoutes from './routes/courses.js';
import userauth from './routes/userauth.js';
import locationRoutes from './routes/locations.js';
import studentrouter from './routes/studentrouter.js';
import specializationRoutes from "./routes/specializationRoutes.js";
import priceRangeRoutes from "./routes/priceRangeRoutes.js";
import applicationRoutes from './routes/applicationRoutes.js';
import password from "./routes/password.js";
import adminUroutes from "./routes/adminUroutes.js";
import mbanner from "./routes/mbanner.js";
import blogRoutes from "./routes/blogRoutes.js";
import searchHistoryRoutes from "./routes/searchHistoryRoutes.js";

// Load environment variables
dotenv.config();

// Database connection
connectDB();

const app = express();

// Enhanced CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3036",
  "https://collegeforms.in",
  "https://www.collegeforms.in",
  // Add any staging or testing environments if needed
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => 
      origin === allowed || 
      origin.startsWith(allowed) ||
      new RegExp(`^https?://(.*\.)?${allowed.replace(/^https?:\/\//, '')}$`).test(origin)
    )) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
    "X-CSRF-Token"
  ],
  exposedHeaders: [
    "Content-Range",
    "X-Content-Range",
    "Content-Disposition",
    "Authorization",
    "X-Total-Count"
  ],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicit OPTIONS handler for all routes
app.options('*', cors(corsOptions));

// Body parser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ 
  extended: true,
  limit: '50mb',
  parameterLimit: 100000
}));

// Serve static files
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// API Routes
app.use("/api/colleges", collegeRoutes);


app.use("/api/banners", bannerRoutes);

app.use("/api/blogs", blogRoutes);

app.use("/api/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/locations", locationRoutes);
app.use("/api/logos", LogoRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/mbanner", mbanner);
app.use('/specializations', specializationRoutes);
app.use('/priceRanges', priceRangeRoutes);
app.use("/api", userauth);
app.use("/api", password);
app.use("/api/admin", adminUroutes);
app.use('/api/students', studentrouter);

// Health check endpoint



app.get("/start", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Default Route
app.get("/", (req, res) => {
  res.json({
    message: "College API Running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Policy',
      message: 'Cross-origin requests are not allowed from this domain',
      allowedOrigins
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});



// ... other imports and setup

app.use("/api/search", searchHistoryRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested resource ${req.originalUrl} was not found`
  });
});

// Server configuration
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${ENV} mode on port ${PORT}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
});