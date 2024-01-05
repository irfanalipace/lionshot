import React, { useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Typography, Box, Divider } from '@mui/material';

import { display } from '@mui/system';

const Filter = (props) => {
  const {title, accountDetails, createdTime, accountPrice}=props
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  return (
    <div>
      <Select
        value={selectedFilter}
        onChange={handleFilterChange}
        displayEmpty
    
         

      >
          <MenuItem value="" disabled sx={{ width:'355px'}}>
        Petty Cash
        </MenuItem>
      <Box sx={{display:'flex', justifyContent:'space-between'}}>
        <Typography sx={{padding:'12px'}}>{accountDetails}</Typography>
        <Typography sx={{padding:'12px'}}>{createdTime}</Typography>
      </Box>
      <Divider></Divider>
        <Box sx={{display:'flex', justifyContent:'space-between'}}>
        <Typography sx={{padding:'12px'}}>{accountDetails}</Typography>
        <Typography sx={{padding:'12px'}}>{accountPrice}</Typography>
      </Box>
      
      </Select>
    </div>
  );
};

export default Filter;
