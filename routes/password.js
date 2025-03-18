import express from "express";
import { changePassword } from "../controllers/passwordController.js";
import userMiddleware from "../middleware/userMiddleware.js";

const router = express.Router();

router.post("/change-password", userMiddleware, changePassword);

export default router;
