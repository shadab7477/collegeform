import express from 'express';
import PriceRange from '../models/PriceRange.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const priceRanges = await PriceRange.find();
    res.json(priceRanges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
    console.log(req.body);
  
    try {
      const newPriceRange = new PriceRange(req.body);
      const savedPriceRange = await newPriceRange.save();
      console.log('Saved Price Range:', savedPriceRange);
      res.status(201).json(savedPriceRange);
    } catch (err) {
      console.error('Error saving price range:', err);
      res.status(500).json({ error: err.message });
    }
  });

router.delete('/:id', async (req, res) => {
  try {
    await PriceRange.findByIdAndDelete(req.params.id);
    res.json({ message: 'Price Range deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
