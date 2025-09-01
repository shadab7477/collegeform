// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendOtpEmail, sendPasswordResetEmail, sendPasswordChangedEmail } from "../utils/emailService.js";
const router = express.Router();

// Generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for registration
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if OTP was sent recently (prevent spam)
    const recentOtpUser = await User.findOne({ 
      email, 
      lastOtpSent: { $gt: new Date(Date.now() - 2 * 60 * 1000) } // 2 minutes cooldown
    });

    if (recentOtpUser) {
      return res.status(429).json({ 
        message: "Please wait before requesting another OTP" 
      });
    }

    // Generate OTP
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save or update OTP details
    await User.findOneAndUpdate(
      { email },
      { 
        otp, 
        otpExpires, 
        lastOtpSent: new Date(),
        isVerified: false 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send OTP email
    const emailSent = await sendOtpEmail(email, otp);
    
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP and complete registration
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, name, phone, password } = req.body;

    // Find user with matching OTP
    const user = await User.findOne({ 
      email, 
      otp,
      otpExpires: { $gt: new Date() } // OTP not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with verified status and remove OTP
    user.name = name;
    user.phone = phone;
    user.password = hashedPassword;
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user info (excluding password)
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
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
    const { email } = req.body;

    // Check if OTP was sent recently
    const recentOtpUser = await User.findOne({ 
      email, 
      lastOtpSent: { $gt: new Date(Date.now() - 2 * 60 * 1000) } // 2 minutes cooldown
    });

    if (recentOtpUser) {
      return res.status(429).json({ 
        message: "Please wait before requesting another OTP" 
      });
    }

    // Generate new OTP
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update OTP details
    await User.findOneAndUpdate(
      { email },
      { 
        otp, 
        otpExpires, 
        lastOtpSent: new Date() 
      }
    );

    // Send OTP email
    const emailSent = await sendOtpEmail(email, otp);
    
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login User (existing route)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and is verified
    const user = await User.findOne({ email, isVerified: true });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user info
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        address: user.address,
        education: user.education
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Edit Profile
router.put('/edit-profile', authMiddleware, async (req, res) => {
    try {
        const { name, phone, dob, address, education } = req.body;
        const userId = req.user.id;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (dob) user.dob = new Date(dob);
        if (address) user.address = address;
        if (education) user.education = education;

        // Save updated user
        await user.save();

        // Return updated user info (excluding password)
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




router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ message: "If the email exists, a reset link will be sent" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken);
    
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send reset email" });
    }

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset Password - Verify token and show reset form
router.get("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    res.status(200).json({ message: "Token is valid", email: user.email });
  } catch (error) {
    console.error("Reset Password Token Check Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset Password - Update password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Send confirmation email
    await sendPasswordChangedEmail(user.email);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Change Password (for logged-in users)
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Send confirmation email
    await sendPasswordChangedEmail(user.email);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;