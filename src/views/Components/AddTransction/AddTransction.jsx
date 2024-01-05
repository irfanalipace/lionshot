import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { ArrowDropDown, Close } from '@mui/icons-material';
import { Box } from '@mui/material';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import CloseIcon from '@mui/icons-material/Close';
const AddTransaction = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const options = ['Option 1', 'Option 2', 'Option 3'];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setSidebarOpen(true);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSelectedOption(null);
  };

  return (
    <Box >
      <Button variant="contained" onClick={handleClick}>
        ADD TRANSACTION <ArrowDropDown />
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {options.map((option) => (
          <MenuItem key={option} onClick={() => handleOptionSelect(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
      <Drawer anchor="right" open={isSidebarOpen} onClose={closeSidebar}>
        <Box sx={{ width: 300, padding: '20px' }}>
          <IconButton
            edge="end"
            color="inherit"
            onClick={closeSidebar}
            sx={{ float: 'right' }}
          >
            <Close />
          </IconButton>
          {selectedOption && (
            <form>
              {/* Your form fields go here */}
              <h3>Selected Option: {selectedOption}</h3>
              {/* Example form fields */}
              <label>
                Field 1:
                <input type="text" />
              </label>
              <label>
                Field 2:
                <input type="text" />
              </label>
              <Button variant="contained" onClick={closeSidebar} sx={{color:''}}>
                Close
              </Button>
            </form>
          )}
        </Box>
      </Drawer>
      {/* <Button>
        <BrightnessLowIcon />
      </Button> */}
   
    </Box>
  );
};

export default AddTransaction;
