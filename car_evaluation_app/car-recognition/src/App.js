import { useState } from 'react';

function App() {
  const [image, setImage] = useState(null);
  const [carModel, setCarModel] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('/api/recognizeCar', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setCarModel(data.carModel);
  };

  return (
    <div className="App">
      <h1>Car Model Recognition</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Recognize Car Model</button>
      </form>
      {carModel
