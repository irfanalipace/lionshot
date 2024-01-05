import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Paper, Typography } from '@mui/material';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DropDown from '../../Components/DropDown/DropDown';
import Filter from '../../Components/FilterButton/Filter';
import PageLayout from '../PageLayout/PageLayout';
import CloseIcon from '@mui/icons-material/Close';
import AddTransaction from '../AddTransction/AddTransction';


const StackButton = ({ iconFir, labelFir }) => {
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
  
    <Paper sx={{ padding: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'18px','& fieldset': {
            border: 'none', // Remove the border from the fieldset
          }, }}>
       <Filter 
      title="Petty Cash"
      accountDetails="Account Details"
     createdTime="Created Time"
    accountPrice="$3156,124.00"
       
       />
        <Stack spacing={2} direction="row">
         <Typography>
          <AddTransaction />
         </Typography>
        
        <Typography>
        <Button
            sx={{
              backgroundColor: '#E5E4E2',
              padding:'8px',
              color: 'black',
              '&:hover': { backgroundColor: 'transparent' },
            }}
            size="small"
            variant="contained"
            startIcon={<BrightnessLowIcon sx={{ fontSize: 44 }} />}
          ></Button>
        </Typography>
        <Typography >
           <Button sx={{color:'black'}}>
           <CloseIcon />
           </Button>
          </Typography>
          <Menu
            id="dots-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Option 1</MenuItem>
            <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
            <MenuItem onClick={handleMenuClose}>Option 3</MenuItem>
          </Menu>
        </Stack>
      </Paper>
  
    </div>
  );
};

export default StackButton;
