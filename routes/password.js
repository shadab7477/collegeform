import express from "express";
import { changePassword } from "../controllers/passwordController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/change-password", authMiddleware, changePassword);

export default router;
