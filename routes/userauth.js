// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendSmsOtp } from "../utils/smsService.js";

const router = express.Router();

// Generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for login/registration
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Check if OTP was sent recently (prevent spam)
    const recentOtpUser = await User.findOne({ 
      phone, 
      lastOtpSent: { $gt: new Date(Date.now() - 2 * 60 * 1000) } // 2 minutes cooldown
    });

    if (recentOtpUser) {
      return res.status(429).json({ 
        message: "Please wait before requesting another OTP" 
      });
    }

    // Generate OTP
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save or update OTP details
    await User.findOneAndUpdate(
      { phone },
      { 
        otp, 
        otpExpires, 
        lastOtpSent: new Date(),
        isVerified: false 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send OTP via SMS
    const smsSent = await sendSmsOtp(phone, otp);
    
    if (!smsSent.success) {
      return res.status(500).json({ message: "Failed to send OTP via SMS" });
    }

    res.status(200).json({ 
      message: "OTP sent successfully to your phone",
      phone: phone 
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP and login/register
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp, name, email, city, course } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }
console.log(req.body);

    // Find user with matching OTP
    const user = await User.findOne({ 
      phone, 
      otp,
      otpExpires: { $gt: new Date() } // OTP not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check if this is a new user (registration) or existing user (login)
    const isNewUser = !user.name;

    // Update user with verified status and remove OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    
    // For new users, set additional fields
    if (isNewUser) {
      if (!name) {
        return res.status(400).json({ message: "Name is required for registration" });
      }
      user.name = name;
      user.email = email || '';
      user.city = city || '';
      user.course = course || '';
    }

    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1000d",
    });

    // Return user info
    res.status(200).json({
      message: isNewUser ? "User registered successfully" : "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        course: user.course,
        dob: user.dob,
        address: user.address,
        education: user.education
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Check if OTP was sent recently
    const recentOtpUser = await User.findOne({ 
      phone, 
      lastOtpSent: { $gt: new Date(Date.now() - 2 * 60 * 1000) } // 2 minutes cooldown
    });

    if (recentOtpUser) {
      return res.status(429).json({ 
        message: "Please wait before requesting another OTP" 
      });
    }

    // Generate new OTP
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); //   15 minutes

    // Update OTP details
    await User.findOneAndUpdate(
      { phone },
      { 
        otp, 
        otpExpires, 
        lastOtpSent: new Date() 
      }
    );

    // Send OTP via SMS
    const smsSent = await sendSmsOtp(phone, otp);
    
    if (!smsSent.success) {
      return res.status(500).json({ message: "Failed to send OTP via SMS" });
    }

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Edit Profile
router.put('/edit-profile', authMiddleware, async (req, res) => {
    try {
        const { name, email, phone, dob, address, education } = req.body;
        const userId = req.user.id;
console.log(req.body)
console.log(req.user.id);
;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (dob) user.dob = new Date(dob);
        if (address) user.address = address;
        if (education) user.education = education;

        // Save updated user
        await user.save();

        // Return updated user info
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                dob: user.dob,
                address: user.address,
                education: user.education
            }
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Error updating profile" });
    }
});

// Get User Data
router.get('/get-user', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return user info
        res.status(200).json({
            message: "User data retrieved successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                dob: user.dob,
                address: user.address,
                education: user.education
            }
        });
    } catch (error) {
        console.error("User data retrieval error:", error);
        res.status(500).json({ message: "Error retrieving user data" });
    }
});

// Cleanup expired OTPs
const cleanupExpiredOtps = async () => {
  try {
    const result = await User.updateMany(
      {
        otpExpires: { $lt: new Date() }
      },
      {
        $set: {
          otp: null,
          otpExpires: null
        }
      }
    );
    console.log(`Cleaned up expired OTPs for ${result.modifiedCount} users`);
  } catch (error) {
    console.error("Cleanup Error:", error);
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredOtps, 60 * 60 * 1000);

export default router;