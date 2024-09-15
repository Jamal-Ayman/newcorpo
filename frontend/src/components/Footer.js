import React from 'react';
import { Box, Container, Grid, Link, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#1976d2', color: 'white', padding: '20px 0' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Typography variant="body2">
              © 2024 JStatistics. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Links
            </Typography>
            <Link href="/dashboard/datasets" color="inherit" underline="none" sx={{ display: 'block', margin: '5px 0' }}>
              Datasets
            </Link>
            <Link href="/dashboard/images" color="inherit" underline="none" sx={{ display: 'block', margin: '5px 0' }}>
              Images
            </Link>
            <Link href="/dashboard/text_processing" color="inherit" underline="none" sx={{ display: 'block', margin: '5px 0' }}>
              Text Processing
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Link href="#" color="inherit" sx={{ marginRight: '10px' }}>
                <FacebookIcon />
              </Link>
              <Link href="#" color="inherit" sx={{ marginRight: '10px' }}>
                <TwitterIcon />
              </Link>
              <Link href="#" color="inherit" sx={{ marginRight: '10px' }}>
                <LinkedInIcon />
              </Link>
              <Link href="#" color="inherit" sx={{ marginRight: '10px' }}>
                <InstagramIcon />
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
