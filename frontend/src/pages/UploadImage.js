import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Alert } from '@mui/material';
import api from '../utils/api'; // Axios setup for API calls
import { useNavigate } from 'react-router-dom'; // For navigation

const UploadImagePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const navigate = useNavigate(); // Hook to navigate between routes

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await api.post('/upload_image', formData);
      setUploadSuccess(true);
      setUploadError('');
      // Redirect to the images page
      setTimeout(() => {
        navigate('/dashboard/images');
      }, 1000); // Delay to show success message
    } catch (error) {
      setUploadError('Failed to upload image. Please try again.');
      setUploadSuccess(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Upload New Image
      </Typography>

      <TextField
        type="file"
        fullWidth
        margin="normal"
        onChange={handleFileChange}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        style={{ marginTop: '20px' }}
      >
        Upload Image
      </Button>

      {uploadError && <Alert severity="error" style={{ marginTop: '20px' }}>{uploadError}</Alert>}
      {uploadSuccess && <Alert severity="success" style={{ marginTop: '20px' }}>Image uploaded successfully! Redirecting...</Alert>}
    </Container>
  );
};

export default UploadImagePage;
