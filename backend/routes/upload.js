const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Configure multer for file uploads (version 2.x)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../frontend/public/uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Upload single image
router.post('/image', authenticate, requireAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return URL that works with both local development and production
    const isProduction = process.env.NODE_ENV === 'production';
    let imageUrl;
    if (isProduction) {
      imageUrl = `${process.env.BACKEND_URL || 'https://riders-galaxy-backend.onrender.com'}/riders-galaxy/uploads/${req.file.filename}`;
    } else {
      imageUrl = `/riders-galaxy/uploads/${req.file.filename}`;
    }
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Upload multiple images
router.post('/images', authenticate, requireAdmin, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    console.log('Uploaded files:', req.files.map(f => ({
      originalname: f.originalname,
      filename: f.filename,
      path: f.path,
      size: f.size
    })));

    // Return full URLs that work with the frontend's base path
    const imageUrls = req.files.map(file => {
      // For local development, use relative path that works with Vite base config
      // For production, use full backend URL
      const isProduction = process.env.NODE_ENV === 'production';
      if (isProduction) {
        return `${process.env.BACKEND_URL || 'https://riders-galaxy-backend.onrender.com'}/riders-galaxy/uploads/${file.filename}`;
      } else {
        // For local development, return the path as-is since Vite handles the base path
        return `/riders-galaxy/uploads/${file.filename}`;
      }
    });
    
    console.log('Generated image URLs:', imageUrls);
    
    res.json({
      success: true,
      imageUrls: imageUrls,
      filenames: req.files.map(file => file.filename)
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Delete image
router.delete('/image/:filename', authenticate, requireAdmin, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../frontend/public/uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;