import React, { useState } from 'react';
import api from '../utils/api';

const ImageManipulation = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    const res = await api.post('/image/upload', formData);
    setResult(res.data);  // Modify based on the response structure
  };

  return (
    <div className="mb-6">
      <h3 className="text-2xl mb-4">Image Manipulation</h3>
      <input type="file" onChange={(e) => setImage(e.target.files[0])}      />
      <button className="bg-green-500 text-white p-2 mt-2" onClick={handleUpload}>Upload and Process Image</button>
      
      {result && (
        <div className="mt-4">
          <h4 className="text-xl">Processed Image Result</h4>
          <img src={`data:image/png;base64,${result.processed_image}`} alt="Processed" className="w-full" />
          {/* Add more fields based on your API response, e.g., cropped, resized, etc. */}
        </div>
      )}
    </div>
  );
};

export default ImageManipulation;

