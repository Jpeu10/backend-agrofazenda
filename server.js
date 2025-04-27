const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Healthcheck route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// Setup multer for image uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }
  }
});

// Route for image processing (AI simulation)
app.post('/process-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided.' });
  }

  console.log('Received image for processing:', req.file.originalname);

  // Simulate AI processing result
  const result = {
    success: true,
    message: 'Image processed successfully.',
    detectedIssues: [
      { plantId: '123', issue: 'Fungus detected' },
      { plantId: '456', issue: 'Nutrient deficiency' }
    ]
  };

  res.status(200).json(result);
});

// Route to start drone mission
app.post('/start-drone-mission', (req, res) => {
  console.log('Drone mission start requested');
  res.status(200).json({ success: true, message: 'Drone mission started.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
