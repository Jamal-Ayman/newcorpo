import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
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
        <Outlet />  {/* Render the selected page content */}
      </Box>
    </Box>
  );
};

export default Dashboard;
