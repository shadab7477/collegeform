import express from 'express';
import Specialization from '../models/Specialization.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const specializations = await Specialization.find();
    res.json(specializations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {

  try {
    
    const newSpecialization = new Specialization(req.body);
    await newSpecialization.save();
    res.status(201).json(newSpecialization);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Specialization.findByIdAndDelete(req.params.id);
    res.json({ message: 'Specialization deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;