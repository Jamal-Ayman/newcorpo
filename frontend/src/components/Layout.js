import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px', // Adjust for navbar height
          paddingLeft: '240px', // Adjust for sidebar width
          backgroundColor: '#ffffff',
          minHeight: '100vh',
        }}
      >
        {/* Navbar */}
        <Navbar />
        {/* Page Content */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
