import React, { useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Box, IconButton, Avatar, Typography } from '@mui/material';
import DatasetIcon from '@mui/icons-material/Storage';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box
      sx={{
        width: collapsed ? 70 : 240,
        backgroundColor: '#1976d2', // Match the navbar color
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        transition: 'width 0.3s',
        paddingTop: '64px', // Align with navbar height
        color: 'white', // Text color to match
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
        {/* Profile */}
        {!collapsed && (
          <Box display="flex" alignItems="center" ml={2}>
            <Avatar sx={{ bgcolor: '#ffffff', color: '#1976d2' }}>
              <AccountCircle />
            </Avatar>
            <Typography variant="body1" ml={2}>User</Typography>
          </Box>
        )}
        <IconButton onClick={toggleCollapse} sx={{ color: 'white' }}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      <List component="nav">
        <ListItem 
          button 
          component={Link} 
          to="/dashboard/datasets"
          sx={{ '&:hover': { backgroundColor: '#1976d2'  } }}
        >
          <ListItemIcon>
            <DatasetIcon style={{ color: 'white' }} />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Datasets" style={{ color: 'white' }} />}
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/dashboard/images"
          sx={{ '&:hover': { backgroundColor: '#1976d2' } }}
        >
          <ListItemIcon>
            <ImageIcon style={{ color: 'white' }} />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Images" style={{ color: 'white' }}/>}
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/dashboard/text_processing"
          sx={{ '&:hover': { backgroundColor: '#1565c0' } }}
        >
          <ListItemIcon>
            <TextFieldsIcon style={{ color: 'white' }} />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Text Processing" style={{ color: 'white' }}/>}
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/dashboard/tsne"
          sx={{ '&:hover': { backgroundColor: '#1565c0' } }}
        >
          <ListItemIcon>
            <BarChartIcon style={{ color: 'white' }} />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="TSNE" style={{ color: 'white' }}/>}
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/dashboard/text_analysis"
          sx={{ '&:hover': { backgroundColor: '#1565c0' } }}
        >
          <ListItemIcon>
            <TextFieldsIcon style={{ color: 'white' }} />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Text Analysis" style={{ color: 'white' }}/>}
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
