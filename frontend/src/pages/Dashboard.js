import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Typography, Button } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
  const location = useLocation(); // Get the current path
  const [imageCount, setImageCount] = useState(0);
  const [datasetsCount, setDatasetsCount] = useState(0);
  const [error, setError] = useState('');

  // Fetch counts from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const imagesResponse = await api.get('/images_count');
        setImageCount(imagesResponse.data.image_count);

        const datasetsResponse = await api.get('/datasets_count');
        setDatasetsCount(datasetsResponse.data.datasets_count);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Static Sidebar */}
      <Sidebar />
      {/* Main content adjusted for the sidebar */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          backgroundColor: '#f4f4f4',
          minHeight: '100vh',
          paddingLeft: '260px',  // Adjusting for the static sidebar width
        }}
      >
        <Navbar />
        <Container>
          {/* Conditionally render only on the /dashboard route */}
          {location.pathname === '/dashboard' && (
            <Grid container spacing={3}>
              {/* Summary Cards */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ padding: '20px', textAlign: 'center' }}>
                  <Typography variant="h6">Total Images</Typography>
                  <Typography variant="h4">{imageCount}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ padding: '20px', textAlign: 'center' }}>
                  <Typography variant="h6">Total Datasets</Typography>
                  <Typography variant="h4">{datasetsCount}</Typography>
                </Paper>
              </Grid>

              {/* Quick Actions */}
              <Grid item xs={12}>
                <Paper sx={{ padding: '20px' }}>
                  <Typography variant="h6">Quick Actions</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '10px', marginTop: '10px' }}
                    onClick={() => window.location.href = '/upload'}
                  >
                    Upload Dataset
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: '10px' }}
                    onClick={() => window.location.href = '/upload_image'}
                  >
                    Upload Image
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          )}
          {/* Outlet for rendering page-specific content */}
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
