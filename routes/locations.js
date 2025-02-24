import express from 'express';
import Location from '../models/location.js';

const router = express.Router();

// Create a new location
router.post('/', async (req, res) => {
    try {
        const location = new Location({ name: req.body.name });
        await location.save();
        res.status(201).send(location);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all locations
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find();
        res.send(locations);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a location by ID
router.delete('/:id', async (req, res) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) {
            return res.status(404).send({ message: 'Location not found' });
        }
        res.send({ message: 'Location deleted successfully', location });
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
