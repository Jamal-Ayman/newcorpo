import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import UploadIcon from '@mui/icons-material/Upload';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: 240, backgroundColor: '#2a3f54', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
      <List component="nav" style={{ paddingTop: '64px' }}>  {/* Adjust for navbar height */}
        <Divider />
        <ListItem button component={Link} to="/dashboard/statistics">
          <ListItemIcon>
            <BarChartIcon style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Statistics" style={{ color: 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/graph">
          <ListItemIcon>
            <AssessmentIcon style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Graph" style={{ color: 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/images">
          <ListItemIcon>
            <InsertPhotoIcon style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Image Manipulation" style={{ color: 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/uploads">
          <ListItemIcon>
            <UploadIcon style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Uploads" style={{ color: 'white' }} />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
