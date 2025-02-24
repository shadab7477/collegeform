import express from "express";
import multer from "multer";
import { addCollege, getColleges, deleteCollege } from "../controllers/collegeController.js";

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Define Routes
router.post("/", upload.single("image"), addCollege);
router.get("/", getColleges);
router.delete("/:id", deleteCollege);

export default router;
