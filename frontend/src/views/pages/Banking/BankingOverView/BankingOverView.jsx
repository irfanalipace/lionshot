import React from 'react'
import { Box, Paper, Typography, Button } from '@mui/material'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import BankingOverViewGraph from "../../../Components/BankingOverViewGraph/BankingOverViewGraph"

const BankingOverView = () => {
  return (
    <Box sx={{marginTop:'23px'}}>
      <Paper>
      <Typography  sx={{display:'flex', justifyContent:'space-between', padding:'15px', marginBottom:'12px'}}>
      <Typography  variant="h6">
        Banking Overview
      </Typography>
      <Typography>
       <Button variant="contained" sx={{marginRight:'7px'}}>
        Add To Bank Account 
       </Button>
       <QuestionMarkIcon />
      </Typography>
      
      </Typography>
      </Paper>
      <Box>
      
       <BankingOverViewGraph 
       title="All Accounts"
       lastDate="Last 30 days"
       last12Month="Last 12 Month"
       activeAccount="Active Accounts"
       inActiveAccounts="Inactive Accounts"
       AllactiveTitle="All Active"
       />

      
      </Box>
    </Box>
  )
}

export default BankingOverView
