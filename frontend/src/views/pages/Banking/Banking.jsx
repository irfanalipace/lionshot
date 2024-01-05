
import React,{useState} from 'react'
import { Typography,Box, Paper,Button, Divider, Stack } from '@mui/material'
import PettiyCashFilter from '../../Components/PettiyCashFilter/PettiyCashFilter'
import AddTransction from '../../Components/AddTransction/AddTransction'
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import PageLayout from '../../Components/PageLayout/PageLayout';
import CollectionsIcon from '@mui/icons-material/Collections';
import StackButton from '../../Components/MuiButton/StackButton';
const Banking = () => {

  return (
  //   <Box sx={{ padding: '4px', marginTop:'26px',marginBottom:'12px'
  // }}>
  //   <Paper>
  // <Box sx={{display:'flex', justifyContent:'space-between'}}>
  // <Typography>
  //  <PettiyCashFilter 
     
  //    accountDetails="Account Details"
  //    createdTime="Created Time"
  //    accountPrice="$3156,124.00"
  //    />
  //  </Typography>
  //   <Typography>
    
      
  //      <AddTransction />
 
  //     </Typography>
      
  // <Typography></Typography>
   
  // </Box>
  //   </Paper>
  //   </Box>
  <PageLayout>
    <Paper>
      {/* <Typography>
        <PettiyCashFilter />
      </Typography> */}
      <Typography>
        <StackButton 
        Title="Petty Cash"
          accountDetails="Account Details"
         createdTime="Created Time"
        accountPrice="$3156,124.00"
        
        />
       
        <Stack spacing={2} direction="row" sx={{padding:'11px'}}>
        
        <CollectionsIcon sx={{height:'40px', width:'2em'}}/>
        <Typography  >
         <Typography sx={{fontSize:'12px', color:'#837979'}}>
         Ammount in, IMS Books
         </Typography>
          <Typography>
           $7,34553,443.4
          </Typography>
        </Typography>
        
          </Stack>
      </Typography>
    </Paper>
  </PageLayout>
  )
}

export default Banking
