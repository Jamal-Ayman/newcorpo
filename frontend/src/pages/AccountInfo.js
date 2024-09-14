import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Checkbox, FormControlLabel } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const AccountInfo = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/account-info'); // Endpoint to get current user info
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/update-account-info', { username, email, password }); // Endpoint to update user info
      setMessage(response.data.message || 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating user data', error);
      setMessage('Failed to update profile');
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ padding: '20px', marginTop: '30px' }}>
            <Typography variant="h5" gutterBottom>
              Account Information
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                disabled={!isEditing}
              />
              <FormControlLabel
                control={<Checkbox checked={isEditing} onChange={() => setIsEditing(!isEditing)} />}
                label="Edit Account Information"
              />
              {/* Conditionally render password field */}
              {isEditing && (
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  required
                />
              )}
              <Box mt={2}>
                <Button variant="contained" color="primary" type="submit" disabled={!isEditing}>
                  Save Changes
                </Button>
              </Box>
            </form>
            {message && (
              <Typography variant="body2" color="textSecondary" sx={{ marginTop: '10px' }}>
                {message}
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AccountInfo;
