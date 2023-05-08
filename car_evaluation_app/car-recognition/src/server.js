const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { PythonShell } = require('python-shell');

const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post('/api/recognizeCar', upload.single('image'), async (req, res) => {
  const imagePath = req.file.path;
  try {
    const carModel = await recognizeCarModel(imagePath);
    res.json({ carModel });
  } catch (error) {
    res.status(500).json({ error: 'Error recognizing car model' });
  } finally {
    // Clean up the uploaded image file
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Error deleting image file:', err);
    });
  }
});

async function recognizeCarModel(imagePath) {
  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: './',
    args: [imagePath],
  };

  return new Promise((resolve, reject) => {
    PythonShell.run('recognize_car_model.py', options, (err, results) => {
      if (err) {
        console.error('Error running Python script:', err);
        reject(err);
      } else {
        const carModel = results[0]; // Assuming the script prints only the car model name
        resolve(carModel);
      }
    });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
