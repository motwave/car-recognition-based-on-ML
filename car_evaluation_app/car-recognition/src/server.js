const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/api/recognizeCar', upload.single('image'), async (req, res) => {
  // Process the image with the machine learning model here
  // and return the car model name
  res.json({ carModel: 'Car Model Name' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
