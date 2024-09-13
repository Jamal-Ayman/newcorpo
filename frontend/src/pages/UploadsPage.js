import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const UploadsPage = () => {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const fetchUploads = async () => {
      const res = await api.get('/uploads');  // Replace with your actual endpoint
      setUploads(res.data);
    };
    fetchUploads();
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">Uploaded Files</h2>
      <ul>
        {uploads.map((upload, index) => (
          <li key={index}>{upload.filename}</li>
        ))}
      </ul>
    </div>
  );
};

export default UploadsPage;
