import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Alert } from '@mui/material';
import api from '../utils/api';

const TSNEPage = () => {
  const [texts, setTexts] = useState('');
  const [tsneImage, setTsneImage] = useState(null);
  const [error, setError] = useState('');

  // Handle T-SNE visualization
  const handleTsneVisualization = async () => {
    try {
      // Split the texts input by new lines into an array
      const textArray = texts.split('\n').filter(text => text.trim() !== '');

      if (textArray.length < 2) {
        setError('Please provide at least two text entries for T-SNE visualization.');
        return;
      }

      const response = await api.post('/tsne', { texts: textArray }, { responseType: 'blob' });
      const imageBlob = response.data;
      const imageUrl = URL.createObjectURL(imageBlob);
      setTsneImage(imageUrl);
      setError('');
    } catch (err) {
      setError('Failed to generate T-SNE visualization');
      console.error(err);
    }
  };

  // Handle image download
  const handleDownload = () => {
    if (tsneImage) {
      const link = document.createElement('a');
      link.href = tsneImage;
      link.download = 'tsne_visualization.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        T-SNE Visualization
      </Typography>

      <TextField
        label="Enter text entries (one per line)"
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        rows={8}
        value={texts}
        onChange={(e) => setTexts(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleTsneVisualization}
        style={{ marginTop: '20px', marginRight: '10px' }}
      >
        Generate T-SNE
      </Button>

      {tsneImage && (
        <>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDownload}
            style={{ marginTop: '20px' }}
          >
            Download Image
          </Button>
          <div style={{ marginTop: '20px' }}>
            <Typography variant="h6">T-SNE Visualization Result</Typography>
            <img src={tsneImage} alt="T-SNE Visualization" style={{ width: '100%', maxWidth: '600px', marginTop: '10px' }} />
          </div>
        </>
      )}

      {error && <Alert severity="error" style={{ marginTop: '20px' }}>{error}</Alert>}
    </Container>
  );
};

export default TSNEPage;
