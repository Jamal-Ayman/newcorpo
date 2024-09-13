import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, Button, CircularProgress, Collapse, Alert, Slider } from '@mui/material';
import api from '../utils/api'; // Axios setup for API calls
import { motion } from 'framer-motion'; // For animations

const ImagePage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedImage, setExpandedImage] = useState(null); // Track which image is expanded
  const [histogramImage, setHistogramImage] = useState({}); // Store histogram images
  const [segmentedImage, setSegmentedImage] = useState({}); // Store segmented images
  const [resizedImage, setResizedImage] = useState(null); // Store the resized image URL
  const [resizeValue, setResizeValue] = useState(100); // Default resize to 100%

  // Fetch images on mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await api.get('/images'); // Assuming /images returns a list of images with URLs
        setImages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch images');
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Fetch histogram for an image
  const fetchHistogram = async (id) => {
    try {
      const response = await api.get(`/image/${id}/histogram`, {
        responseType: 'blob', // Important for receiving images
      });
      const imageURL = URL.createObjectURL(response.data); // Create a URL for the image
      setHistogramImage((prevImages) => ({
        ...prevImages,
        [id]: imageURL, // Store the image URL in state
      }));
      setExpandedImage(id); // Expand this image for details
    } catch (err) {
      console.error('Failed to fetch histogram image', err);
    }
  };

  // Fetch segmentation for an image
  const fetchSegmentation = async (id) => {
    try {
      const response = await api.get(`/image/${id}/segmentation`, {
        responseType: 'blob', // Important for receiving images
      });
      const imageURL = URL.createObjectURL(response.data); // Create a URL for the image
      setSegmentedImage((prevImages) => ({
        ...prevImages,
        [id]: imageURL, // Store the image URL in state
      }));
      setExpandedImage(id); // Expand this image for details
    } catch (err) {
      console.error('Failed to fetch segmented image', err);
    }
  };

  // Delete an image
  const deleteImage = async (id) => {
    try {
      await api.delete(`/image/${id}`);
      setImages((prevImages) => prevImages.filter((image) => image.id !== id)); // Remove image from the list
      alert('Image deleted successfully!');
    } catch (err) {
      alert('Failed to delete image');
      console.error('Delete error:', err);
    }
  };

  // Handle resizing the image
  const handleResize = (url) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width * (resizeValue / 100);
      canvas.height = img.height * (resizeValue / 100);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setResizedImage(canvas.toDataURL());
    };
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Images
      </Typography>

      <Grid container spacing={2}>
        {images.map((image) => (
          <Grid item xs={12} key={image.id} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: expandedImage === image.id ? '80%' : '100%', maxWidth: expandedImage === image.id ? 800 : 300 }}>
              <CardContent>
                {/* Show image ID and filename */}
                <Typography variant="h6">Image ID: {image.id}</Typography>
                <Typography variant="subtitle1">{image.filename}</Typography>

                {/* Display the image */}
                {image.url && (
                  <img
                    src={image.url}
                    alt={image.filename}
                    style={{ width: '100%', height: 'auto', marginTop: '10px' }}
                  />
                )}

                <div style={{ marginTop: '10px' }}>
                  {/* Show Histogram Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => fetchHistogram(image.id)}
                    sx={{ mr: 2 }}
                  >
                    Show Histogram
                  </Button>

                  {/* Show Segmentation Button */}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => fetchSegmentation(image.id)}
                    sx={{ mr: 2 }}
                  >
                    Show Segmentation
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteImage(image.id)}
                  >
                    Delete
                  </Button>
                </div>

                {/* Resize Image */}
                <div style={{ marginTop: '20px' }}>
                  <Typography variant="subtitle1">Resize Image</Typography>
                  <Slider
                    value={resizeValue}
                    onChange={(e, newValue) => setResizeValue(newValue)}
                    aria-labelledby="resize-slider"
                    min={10}
                    max={200}
                  />
                  <Button variant="contained" color="primary" onClick={() => handleResize(image.url)}>
                    Resize
                  </Button>
                  {resizedImage && (
                    <div style={{ marginTop: '10px' }}>
                      <img src={resizedImage} alt="Resized" style={{ maxWidth: '100%' }} />
                      <a href={resizedImage} download={`resized_${image.filename}`} style={{ display: 'block', marginTop: '10px' }}>
                        Download Resized Image
                      </a>
                    </div>
                  )}
                </div>

                {/* Collapse to show histogram or segmented image */}
                <Collapse in={expandedImage === image.id}>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ marginTop: '20px' }}
                  >
                    {/* Show histogram if available */}
                    {histogramImage[image.id] && (
                      <div style={{ marginTop: '20px' }}>
                        <Typography variant="h6">Image Histogram</Typography>
                        <img src={histogramImage[image.id]} alt="Histogram" style={{ maxWidth: '100%' }} />
                      </div>
                    )}
                    
                    {/* Show segmented image if available */}
                    {segmentedImage[image.id] && (
                      <div style={{ marginTop: '20px' }}>
                        <Typography variant="h6">Image Segmentation</Typography>
                        <img src={segmentedImage[image.id]} alt="Segmented" style={{ maxWidth: '100%' }} />
                      </div>
                    )}
                  </motion.div>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ImagePage;
