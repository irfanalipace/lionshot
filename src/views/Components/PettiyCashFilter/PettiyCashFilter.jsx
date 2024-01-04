
import React,{useState} from 'react'
import { Typography,Box, Paper, Divider } from '@mui/material'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const PettiyCashFilter = (props) => {
  const {accountDetails, createdTime, accountPrice}=props
    const [selectedFilter, setSelectedFilter] = useState('');

    const handleFilterChange = (event) => {
      setSelectedFilter(event.target.value);
    };

  return (
    <Box>
       
        <Select
        value={selectedFilter}
        onChange={handleFilterChange}
        displayEmpty
        sx={{
            '& fieldset': {
              border: 'none',
             
            },'& .MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation8 MuiMenu-paper MuiPopover-paper MuiMenu-paper css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper': {
                marginLeft:'244px'
              },
            }}
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
      
    </Box>
  )
}

export default PettiyCashFilter
