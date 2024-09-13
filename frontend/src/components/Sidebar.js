import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DatasetIcon from '@mui/icons-material/Storage';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: 240, backgroundColor: '#ffffff', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
      <List component="nav" style={{ paddingTop: '64px' }}>
        <ListItem button component={Link} to="/dashboard/datasets">
          <ListItemIcon>
            <DatasetIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Datasets" style={{ color: '#ffffff' }} />
        </ListItem>
        {/* Other sidebar items */}
        <ListItem button component={Link} to="/dashboard/images">
          <ListItemIcon>
            <DatasetIcon style={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Images" style={{ color: '#ffffff' }} />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
