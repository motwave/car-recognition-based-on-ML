import React, { useState } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [carModel, setCarModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('/api/recognizeCar', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setCarModel(data.carModel);
    } catch (error) {
      console.error('Error recognizing car model:', error);
      setCarModel('Error recognizing car model');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Car Model Recognition</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} />
        <button type="submit" disabled={!image || loading}>
          {loading ? 'Recognizing...' : 'Recognize Car Model'}
        </button>
      </form>
      {previewImage && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={previewImage} alt="Uploaded car" style={{ maxWidth: '100%' }} />
        </div>
      )}
      {carModel && (
        <div>
          <h2>Car Model:</h2>
          <p>{carModel}</p>
        </div>
      )}
    </div>
  );
}

export default App;
