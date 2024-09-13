import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, Button, CircularProgress, Collapse, Alert, TextField } from '@mui/material';
import api from '../utils/api'; // Axios setup
import { useNavigate } from 'react-router-dom'; // Import for navigation
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'; // For charts
import { motion } from 'framer-motion'; // For animations
import { Box } from '@mui/system'; // For layout

const DatasetsPage = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState(''); // For search by ID
  const [expandedDataset, setExpandedDataset] = useState(null); // Track expanded dataset
  const [statistics, setStatistics] = useState({});
  const [graphImages, setGraphImages] = useState({}); // Store graph images for each dataset
  const navigate = useNavigate(); // useNavigate hook for redirection

  // Fetch datasets on mount
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await api.get('/datasets');
        setDatasets(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch datasets');
        setLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  // Fetch dataset by ID for search
  const searchDatasetById = async () => {
    if (!searchId) {
      setError('Please enter a valid dataset ID');
      return;
    }

    try {
      const response = await api.get(`/dataset/${searchId}`);
      setDatasets([response.data]); // Update with the searched dataset
      setError(''); // Clear error
    } catch (err) {
      setError('Dataset not found');
    }
  };

  // Trigger search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchDatasetById(); // Trigger search when Enter is pressed
    }
  };

  // Fetch statistics for a dataset
  const fetchStatistics = async (id) => {
    try {
      const response = await api.get(`/tabular_data/${id}/statistics`);
      setStatistics((prevStats) => ({
        ...prevStats,
        [id]: response.data,
      }));
      setExpandedDataset(expandedDataset === id ? null : id); // Toggle expanded dataset
    } catch (err) {
      console.error('Failed to fetch statistics', err);
    }
  };

  // Fetch graph for a dataset
  const fetchGraph = async (id) => {
    try {
      const response = await api.get(`/dataset/${id}/graph`, {
        responseType: 'blob', // Important for receiving images
      });
      const imageURL = URL.createObjectURL(response.data); // Create a URL for the image
      setGraphImages((prevImages) => ({
        ...prevImages,
        [id]: imageURL, // Store the image URL in state
      }));
      setExpandedDataset(expandedDataset === id ? null : id); // Toggle expanded dataset
    } catch (err) {
      console.error('Failed to fetch graph image', err);
    }
  };

  // Update dataset
  const updateDataset = async (id) => {
    try {
      await api.put(`/dataset/${id}`, {
        // You can include the data you want to update here
        filename: `Updated_Dataset_${id}`,
      });
      alert('Dataset updated successfully!');
    } catch (err) {
      alert('Failed to update dataset');
      console.error('Update error:', err);
    }
  };

  // Delete dataset
  const deleteDataset = async (id) => {
    try {
      await api.delete(`/dataset/${id}`);
      setDatasets((prevDatasets) => prevDatasets.filter((dataset) => dataset.id !== id)); // Remove dataset from the list
      alert('Dataset deleted successfully!');
    } catch (err) {
      alert('Failed to delete dataset');
      console.error('Delete error:', err);
    }
  };

  // Helper function to create chart data for visualization
  const createChartData = (statistics) => {
    if (!statistics) return [];
    return [
      { name: 'Mean', value: statistics.mean.id },
      { name: 'Median', value: statistics.median.id },
      { name: 'Mode', value: statistics.mode.id },
      { name: 'Q1 (25%)', value: statistics.quartiles['0.25'] },
      { name: 'Q2 (50%)', value: statistics.quartiles['0.5'] },
      { name: 'Q3 (75%)', value: statistics.quartiles['0.75'] },
    ];
  };

  // Redirect to the upload page
  const redirectToUpload = () => {
    navigate('/upload'); // Redirect to upload page
  };

  if (loading) return <CircularProgress />;
  if (error && !datasets.length) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Datasets
      </Typography>

      {/* Search by dataset ID */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Search Dataset by ID"
          variant="outlined"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyPress={handleKeyPress} // Handle Enter key press
          sx={{ mr: 2 }}
        />
        <Button
          variant="contained"
          size="small" // Make the button smaller
          color="primary"
          onClick={searchDatasetById}
        >
          Search
        </Button>
      </Box>

      {/* Create button to redirect to upload page */}
      <Button variant="contained" color="primary" sx={{ mb: 4 }} onClick={redirectToUpload}>
        Create / Upload Dataset
      </Button>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        {datasets.map((dataset) => (
          <Grid item xs={12} key={dataset.id} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: '100%', maxWidth: 900 }}>
              <CardContent>
                {/* Show dataset ID and filename */}
                <Typography variant="h6">Dataset ID: {dataset.id}</Typography>
                <Typography variant="subtitle1">{dataset.filename}</Typography>

                {/* Show / Hide Statistics Button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => fetchStatistics(dataset.id)}
                  sx={{ mt: 2, mr: 2 }}
                >
                  {expandedDataset === dataset.id ? 'Hide Statistics' : 'Show Statistics'}
                </Button>

                {/* Show / Hide Graph Button */}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => fetchGraph(dataset.id)}
                  sx={{ mt: 2, mr: 2 }}
                >
                  {expandedDataset === dataset.id ? 'Hide Graph' : 'Show Graph'}
                </Button>

                {/* Update and Delete Buttons */}
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => updateDataset(dataset.id)}
                  sx={{ mt: 2, mr: 2 }}
                >
                  Update
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteDataset(dataset.id)}
                  sx={{ mt: 2 }}
                >
                  Delete
                </Button>

                {/* Collapse to show statistics and graph */}
                <Collapse in={expandedDataset === dataset.id}>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ marginTop: '20px' }}
                  >
                    {/* Show statistics if available */}
                    {statistics[dataset.id] ? (
                      <>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                          Mean: {statistics[dataset.id].mean.id}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          Median: {statistics[dataset.id].median.id}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          Mode: {statistics[dataset.id].mode.id}
                        </Typography>

                        {/* Chart to display statistics */}
                        <BarChart width={500} height={300} data={createChartData(statistics[dataset.id])}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8fbcd4" />
                        </BarChart>
                      </>
                    ) : (
                      <Typography>Loading statistics...</Typography>
                    )}

                    {/* Show graph if available */}
                    {graphImages[dataset.id] ? (
                      <div style={{ marginTop: '20px' }}>
                        <Typography variant="h6">Dataset Graph</Typography>
                        <img src={graphImages[dataset.id]} alt="Dataset Graph" style={{ maxWidth: '100%' }} />
                      </div>
                    ) : (
                      <Typography>Loading graph...</Typography>
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

export default DatasetsPage;
