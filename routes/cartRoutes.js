import express from 'express';
import Cart from '../models/Cart.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

// Get cart items for user
router.get('/items', authMiddleware, async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id }).sort({ addedAt: -1 });
    res.json({
      success: true,
      data: cartItems,
      count: cartItems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart items'
    });
  }
});

// Add item to cart
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const {
      collegeId,
      collegeName,
      collegeLocation,
      collegeImage,
      courseName,
      originalFees,
      discountedFees,
      slug
    } = req.body;

    // Check if item already exists in cart
    const existingItem = await Cart.findOne({
      userId: req.user.id,
      collegeId,
      courseName
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Item already in cart'
      });
    }

    const newCartItem = new Cart({
      userId: req.user.id,
      collegeId,
      collegeName,
      collegeLocation,
      collegeImage,
      courseName,
      originalFees,
      discountedFees,
      slug
    });

    await newCartItem.save();

    const cartItems = await Cart.find({ userId: req.user.id });
    
    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: newCartItem,
      count: cartItems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart'
    });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', authMiddleware, async (req, res) => {
  try {
    const item = await Cart.findOne({
      _id: req.params.itemId,
      userId: req.user.id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    await Cart.findByIdAndDelete(req.params.itemId);

    const cartItems = await Cart.find({ userId: req.user.id });
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      count: cartItems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart'
    });
  }
});

// Clear cart
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user.id });
    
    res.json({
      success: true,
      message: 'Cart cleared successfully',
      count: 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart'
    });
  }
});

// Get cart count
router.get('/count', authMiddleware, async (req, res) => {
  try {
    const count = await Cart.countDocuments({ userId: req.user.id });
    
    res.json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting cart count'
    });
  }
});

export default router;