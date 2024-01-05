import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const HeaderDropDown = () => {
  const [selectedValue, setSelectedValue] = useState('option1');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
  <div>
   
   <FormControl>
      <Select
        value={selectedValue}
        onChange={handleChange}
     sx={{
      
            // border: 'none',
            color: 'white',
            marginRight:'14px',
            border: '1px solid #1976d2',
            '&:before': {
              display: 'none',
            },
            '&:after': {
              display: 'none',
            },
            '& .MuiSelect-icon': {
              color: 'white',
            },
            '& .MuiInputBase-root': {
              padding: 0,
              color: 'white',
            },
            '& fieldset': {
              border: 'none', // This removes the border of the fieldset
            },
            '& .MuiButtonBase-root': {
              backgroundColor: 'transparent', // This makes the button background transparent
            },
            
        }}
        // disableUnderline
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="option1">Organization</MenuItem>
        <MenuItem value="option2">Option 2</MenuItem>
        <MenuItem value="option3">Option 3</MenuItem>
      </Select>
    </FormControl>
  </div>
     
   
  );
};

export default HeaderDropDown;
