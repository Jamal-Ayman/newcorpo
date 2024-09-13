import React, { useState } from 'react';
import { Container, Typography, Button, TextField, CircularProgress, Alert } from '@mui/material';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout'; // Import the layout

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // useNavigate hook for redirection

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    if (!file) {
      setError('Please select a file to upload');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('File uploaded successfully!');
      setFile(null);
      setLoading(false);
      
      // Redirect to datasets page after successful upload
      setTimeout(() => {
        navigate('/dashboard/datasets'); // Redirect after 1 second
      }, 1000);

    } catch (err) {
      setError('Failed to upload file.');
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload Dataset
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={handleUpload}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="file"
            onChange={handleFileChange}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </form>
      </Container>
    </Layout>
  );
};

export default UploadPage;
