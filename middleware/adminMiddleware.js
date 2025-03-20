import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const adminMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    
    // Ensure token is for admin
    if (decoded.username !== process.env.FIXED_USERNAME) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    req.username = decoded; // Store admin info in request

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export default adminMiddleware;
