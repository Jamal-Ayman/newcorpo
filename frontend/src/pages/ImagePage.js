import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, Button, CircularProgress, Alert, Slider, IconButton, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Crop, ExpandMore, Delete } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import api from '../utils/api'; // Axios setup for API calls
import { useNavigate } from 'react-router-dom'; // To handle navigation
import { motion } from 'framer-motion'; // Import motion from framer-motion

const ImagePage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedImage, setExpandedImage] = useState(null);
  const [resizeValue, setResizeValue] = useState({}); // Default resize values for each image
  const [maxResizeValue, setMaxResizeValue] = useState({}); // Store max resize value for each image
  const [minResizeValue, setMinResizeValue] = useState({}); // Store min resize value for each image
  const [resizedImages, setResizedImages] = useState({}); // Store the resized images
  const [cropper, setCropper] = useState(null); // Reference to cropper instance
  const [croppedImages, setCroppedImages] = useState({});
  const [histogramImages, setHistogramImages] = useState({});
  const [segmentationImages, setSegmentationImages] = useState({});
  const [convertedImages, setConvertedImages] = useState({});
  const [format, setFormat] = useState('jpg'); // Default format for conversion
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Hook to navigate between routes

  // Fetch images on mount
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await api.get('/images');
      setImages(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch images');
      setLoading(false);
    }
  };

  // Handle crop button click
  const handleCrop = (id) => {
    if (cropper) {
      setCroppedImages((prev) => ({
        ...prev,
        [id]: cropper.getCroppedCanvas().toDataURL('image/jpeg')
      }));
    }
  };

  // Handle expand/collapse
  const handleExpand = (id) => {
    if (expandedImage === id) {
      setExpandedImage(null); // Collapse if already expanded
    } else {
      setExpandedImage(id); // Expand the clicked image
    }
  };

  // Search images by ID or filename
  const handleSearch = () => {
    if (searchQuery) {
      const filteredImages = images.filter((image) =>
        image.id.toString().includes(searchQuery) ||
        image.imagename.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setImages(filteredImages);
    } else {
      fetchImages(); // Reset search
    }
  };

  // Calculate max and min resize based on image dimensions
  const calculateResizeLimits = (img) => {
    const maxResize = 200; // Max resize to 200% of the original size
    const minResize = 50; // Min resize to 50% of the original size
    return { maxResize, minResize };
  };

  // Handle resize live and set the resized image URL for download
  const handleResizeLive = (url, id, resizePercentage) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width * (resizePercentage / 100);
      canvas.height = img.height * (resizePercentage / 100);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      setResizedImages((prev) => ({
        ...prev,
        [id]: canvas.toDataURL('image/jpeg')
      }));
    };

    img.onerror = () => {
      console.error('Failed to load image for resizing.');
    };
  };

  // Handle fetching histogram
  const handleHistogram = async (id) => {
    try {
      const response = await api.get(`/image/${id}/histogram`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      setHistogramImages((prev) => ({
        ...prev,
        [id]: url,
      }));
    } catch (err) {
      console.error('Failed to fetch histogram', err);
    }
  };

  // Handle fetching segmentation
  const handleSegmentation = async (id) => {
    try {
      const response = await api.get(`/image/${id}/segmentation`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      setSegmentationImages((prev) => ({
        ...prev,
        [id]: url,
      }));
    } catch (err) {
      console.error('Failed to fetch segmentation', err);
    }
  };

  // Handle converting image format
  const handleConvert = async (id) => {
    try {
      const response = await api.post(`/image/${id}/convert`, { format }, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      setConvertedImages((prev) => ({
        ...prev,
        [id]: url,
      }));
    } catch (err) {
      console.error('Failed to convert image', err);
    }
  };

  // Handle delete image
  const handleDelete = async (id) => {
    try {
      await api.delete(`/image/${id}`);
      // Update the UI after successful deletion
      setImages((prev) => prev.filter((image) => image.id !== id));
    } catch (err) {
      console.error('Failed to delete image', err);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Images
      </Typography>

      {/* Search Field */}
      <TextField
        label="Search by ID or Filename"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {/* Upload Button */}
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '20px' }}
        onClick={() => {
          navigate('/upload_image'); // Navigate to the image upload page
        }}
      >
        Upload New Image
      </Button>

      <Grid container spacing={2}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.id} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: expandedImage === image.id ? '80%' : '100%', maxWidth: expandedImage === image.id ? 800 : 300 }}>
              <CardContent>
                {/* Show image ID and filename */}
                <Typography variant="h6">Image ID: {image.id}</Typography>
                <Typography variant="subtitle1">{image.imagename}</Typography>

                {/* Display the image using the URL */}
                {image.imagename && (
                  <img
                    src={`http://127.0.0.1:5000/uploads/images/${image.imagename}`} // Use the endpoint to get the image
                    alt={image.imagename}
                    style={{
                      width: `${resizeValue[image.id] || 100}%`,
                      height: 'auto',
                      marginTop: '10px',
                      borderRadius: 4,
                      maxWidth: 'none', // Allow resize beyond container width
                      maxHeight: 'none',
                    }}
                    ref={(img) => {
                      // Calculate max and min resize values
                      if (img && !maxResizeValue[image.id]) {
                        const { maxResize, minResize } = calculateResizeLimits(img);
                        setMaxResizeValue((prev) => ({
                          ...prev,
                          [image.id]: maxResize,
                        }));
                        setMinResizeValue((prev) => ({
                          ...prev,
                          [image.id]: minResize,
                        }));
                      }
                    }}
                  />
                )}

                {/* Expand/Collapse Button */}
                <IconButton
                  onClick={() => handleExpand(image.id)}
                  style={{ marginTop: '10px' }}
                >
                  <ExpandMore />
                </IconButton>

                {/* Delete Button */}
                <IconButton
                  onClick={() => handleDelete(image.id)}
                  color="secondary"
                  style={{ marginTop: '10px' }}
                >
                  <Delete />
                </IconButton>

                {/* If the image is expanded, show additional options */}
                {expandedImage === image.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ marginTop: '20px' }}
                  >
                    {/* Resize Image */}
                    <Typography variant="subtitle1">Resize Image</Typography>
                    <Slider
                      value={resizeValue[image.id] || 100}
                      onChange={(e, newValue) => {
                        setResizeValue({ ...resizeValue, [image.id]: newValue });
                        handleResizeLive(`http://127.0.0.1:5000/uploads/images/${image.imagename}`, image.id, newValue);
                      }}
                      aria-labelledby="resize-slider"
                      min={minResizeValue[image.id] || 50} // Use the calculated min resize
                      max={maxResizeValue[image.id] || 200} // Use the calculated max resize
                    />

                    {/* Show the download link for resized image */}
                    {resizedImages[image.id] && (
                      <div style={{ marginTop: '10px' }}>
                        <a href={resizedImages[image.id]} download={`resized_${image.imagename}`} style={{ display: 'block', marginTop: '10px' }}>
                          Download Resized Image
                        </a>
                      </div>
                    )}

                    {/* Histogram Button */}
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleHistogram(image.id)}
                      style={{ marginTop: '10px', marginRight: '10px' }}
                    >
                      Get Histogram
                    </Button>
                    {histogramImages[image.id] && (
                      <div style={{ marginTop: '10px' }}>
                        <img src={histogramImages[image.id]} alt="Histogram" style={{ maxWidth: '100%' }} />
                        <a href={histogramImages[image.id]} download={`histogram_${image.imagename}`} style={{ display: 'block', marginTop: '10px' }}>
                          Download Histogram
                        </a>
                      </div>
                    )}

                    {/* Segmentation Button */}
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleSegmentation(image.id)}
                      style={{ marginTop: '10px', marginRight: '10px' }}
                    >
                      Get Segmentation
                    </Button>
                    {segmentationImages[image.id] && (
                      <div style={{ marginTop: '10px' }}>
                        <img src={segmentationImages[image.id]} alt="Segmentation" style={{ maxWidth: '100%' }} />
                        <a href={segmentationImages[image.id]} download={`segmentation_${image.imagename}`} style={{ display: 'block', marginTop: '10px' }}>
                          Download Segmentation
                        </a>
                      </div>
                    )}

                    {/* Convert Image Format */}
                    <FormControl fullWidth style={{ marginTop: '10px' }}>
                      <InputLabel>Format</InputLabel>
                      <Select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                      >
                        <MenuItem value="jpg">JPG</MenuItem>
                        <MenuItem value="png">PNG</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleConvert(image.id)}
                      style={{ marginTop: '10px' }}
                    >
                      Convert Format
                    </Button>
                    {convertedImages[image.id] && (
                      <div style={{ marginTop: '10px' }}>
                        <a href={convertedImages[image.id]} download={`converted_${image.imagename}`} style={{ display: 'block', marginTop: '10px' }}>
                          Download Converted Image
                        </a>
                      </div>
                    )}

                    {/* Crop Image */}
                    <Cropper
                      src={`http://127.0.0.1:5000/uploads/images/${image.imagename}`}
                      style={{ height: 200, width: '100%' }}
                      aspectRatio={1}
                      guides={false}
                      viewMode={1}
                      onInitialized={(instance) => setCropper(instance)}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<Crop />}
                      onClick={() => handleCrop(image.id)}
                      style={{ marginTop: '10px' }}
                    >
                      Crop
                    </Button>
                    {croppedImages[image.id] && (
                      <div style={{ marginTop: '10px' }}>
                        <img src={croppedImages[image.id]} alt="Cropped" style={{ maxWidth: '100%' }} />
                        <a href={croppedImages[image.id]} download={`cropped_${image.imagename}`} style={{ display: 'block', marginTop: '10px' }}>
                          Download Cropped Image
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ImagePage;
