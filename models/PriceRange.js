
import mongoose from 'mongoose';

const PriceRangeSchema = new mongoose.Schema({
  min: { type: Number, required: true },
  max: { type: Number, required: true }
});

const PriceRange = mongoose.model('PriceRange', PriceRangeSchema);
export default PriceRange;