import express from 'express';
import Document from '../models/Document.js';
import { uploadDocument, cloudinary } from '../config/cloudinary.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// Get all documents for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Only get documents uploaded by the current user
    const documents = await Document.find({ 
      'uploadedBy.userId': req.user._id 
    }).populate('uploadedBy.userId', 'name email');
    
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




router.get('/all',  async (req, res) => {
  try {
    // Only get documents uploaded by the current user
    const documents = await Document.find();
    console.log(documents);
    
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Create a new document (protected)
router.post('/', authMiddleware, uploadDocument.single('file'), async (req, res) => {
  try {
    const { name, fileType, status } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'File upload failed' });
    }

    const newDocument = new Document({
      name,
      fileUrl: req.file.path,
      fileType,
      status: status || 'pending',
      publicId: req.file.filename || req.file.public_id,
      uploadedBy: {
        userId: req.user._id,
        userName: req.user.name
      }
    });

    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a document (protected - user can delete their own, admin can delete any)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user owns the document or is admin
    if (document.uploadedBy.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }

    if (document.publicId) {
      await cloudinary.uploader.destroy(document.publicId);
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: error.message });
  }
});
router.delete('/admin/:id', adminMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

   

    if (document.publicId) {
      await cloudinary.uploader.destroy(document.publicId);
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: error.message });
  }
});
// Admin patch to update document status
router.patch('/:id/status', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;