// routes/documents.js
import express from 'express';
import Document from '../models/Document.js';
import {uploadDocument} from '../config/cloudinary.js';

const router = express.Router();

// Get all documents
router.get('/', async (req, res) => {
  try {
    
    const documents = await Document.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new document
router.post('/', uploadDocument.single('file'), async (req, res) => {
  try {
    const { name, fileType, status } = req.body;
    console.log(req.body);
    
    if (!req.file) {
      return res.status(400).json({ message: 'File upload failed' });
    }

    const newDocument = new Document({
      name,
      fileUrl: req.file.path,
      fileType,
      status: status || 'pending'
    });

    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a document
router.delete('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete from Cloudinary if needed
    // await cloudinary.uploader.destroy(document.publicId);

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;