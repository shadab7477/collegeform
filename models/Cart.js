import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collegeId: {
    type: String,
    required: true
  },
  collegeName: {
    type: String,
    required: true
  },
  collegeLocation: {
    type: String,
    required: true
  },
  collegeImage: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  originalFees: {
    type: Number,
    required: true
  },
  discountedFees: {
    type: Number,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const Cart = mongoose.model('Cart', cartItemSchema);
export default Cart;