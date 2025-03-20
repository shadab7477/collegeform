import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js"; // Database connection setup
import collegeRoutes from "./routes/collegeRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";
import LogoRoutes from "./routes/LogoRoutes.js"; 
import courseRoutes from './routes/courses.js';
import userauth from './routes/userauth.js';
import locationRoutes from './routes/locations.js';
import studentrouter from './routes/studentrouter.js';

import  specializationRoutes from "./routes/specializationRoutes.js"
import priceRangeRoutes from "./routes/priceRangeRoutes.js"
import applicationRoutes from './routes/applicationRoutes.js'; // Import new application routes
import password from "./routes/password.js"
import adminUroutes from "./routes/adminUroutes.js"

dotenv.config();
connectDB();

const app = express();



const allowedOrigins = [
  "http://localhost:3000",    
  "http://localhost:3036",        // Development (React local server)
  //     // Development (React local server)
  "https://collegeforms.in",     
  //  // Production frontend (Hostinger)
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow requests from allowed origins
      } else {
        callback(new Error("Not allowed by CORS")); // Block disallowed origins
      }
    },
    credentials: true, // Allow cookies and authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow common HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

// Handle preflight requests explicitly (optional but helpful)
app.options("*", cors());






// Handle OPTIONS preflight requests explicitly (important for complex requests)


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// API Routes
app.use("/api/colleges", collegeRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/locations", locationRoutes);
app.use("/api/logos", LogoRoutes); // Add logo routes
app.use("/api/applications", applicationRoutes); // Route to handle application submissions

app.use('/specializations', specializationRoutes);
app.use('/priceRanges', priceRangeRoutes);
app.use("/api", userauth); // Route to handle application submissions

app.use("/api",password ); // Route to handle application submissions

app.use("/api/admin", adminUroutes);
console.log("yes api is heating");

app.get("/ping", (req, res) => {
  res.status(200).send("Server is active");
});

app.use('/api/students', studentrouter);

// Default Route
app.get("/", (req, res) => {
  res.send("College API Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
