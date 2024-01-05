import React,{useState } from 'react';
import Card from '@mui/material/Card'; 
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Button, Divider, LinearProgress , Paper } from '@mui/material';
import { Add } from '@mui/icons-material';
import HelpIcon from '@mui/icons-material/Help';
import { color } from '@mui/system';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,ReferenceLine } from 'recharts';

const data = [
    { name: '0', year: 2022, uv: 400, pv: 0, amt: 2400 },
    { name: 'Aug', year: 2022, uv: 400, pv: 200, amt: 2400 },
    { name: 'Sep', year: 2022, uv: 300, pv: 300, amt: 2210 },
    { name: 'Oct', year: 2022, uv: 200, pv: 500, amt: 2290 },
    { name: 'Nov', year: 2022, uv: 278, pv: 700, amt: 2000 },
    { name: 'Dec', year: 2022, uv: 189, pv: 900, amt: 2181 },
    { name: 'Jan', year: 2023, uv: 239, pv: 1100, amt: 2500 },
    { name: 'Feb', year: 2023, uv: 349, pv: 1300, amt: 2100 },
    { name: 'Mar', year: 2023, uv: 239, pv: 1500, amt: 2500 },
    { name: 'Apr', year: 2023, uv: 349, pv: 1700, amt: 2100 },
    { name: 'May', year: 2023, uv: 239, pv: 1800, amt: 2500 },
    { name: 'Jun', year: 2023, uv: 349, pv: 2000, amt: 2100 }, 
    { name: 'Jul', year: 2023, uv: 349, pv: 2200, amt: 2100 },
    { name: 'Aug', year: 2023, uv: 500, pv: 2400, amt: 2100 },
  ];
  
export default function BankingOverView(props) {
 
const {title, last12Month, lastDate, inActiveAccounts, activeAccount}=props

    const [anchorEl, setAnchorEl] = useState(null);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    const formatYAxisTick = (tickValue) => {
        if (tickValue >= 1000000) {
          return `${tickValue / 1000000}m`;
        } else if (tickValue >= 1000) {
          return `${tickValue / 1000}k`;
        } else {
          return tickValue;
        }
      };
      
     
      
      
  return (
    <Box>
    <Paper sx={{padding:'120px'}}>
      <Card variant="outlined" sx={{width:'95%'}}>
        <CardContent >
          <Typography variant="div" sx={{display:'flex', justifyContent:'space-between', paddingBottom:'18px'}}>
            <Typography variant="h6">
             {title}<ArrowDropDownIcon onClick={handleClick} sx={{paddingTop:'8px'}}/> 
            </Typography>
         
         <Typography> {lastDate}  <ArrowDropDownIcon onClick={handleClick} sx={{paddingTop:'8px'}}/> </Typography>
            <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>{lastDate}</MenuItem>
        <MenuItem onClick={handleClose}> {last12Month}</MenuItem>
       
         </Menu>
          </Typography>
         <Divider></Divider>
          <Typography variant="body2" color="text.secondary" sx={{marginTop:'10px', marginBottom:'8px'}}>
   
          </Typography>
        
        </CardContent>
       
   <Typography sx={{padding:'23px'}}>
   {/* <CleanHandsIcon sx={{width:'33px',height:'44px'}}/>  */}
   Cash in Hand
    <Typography>
      $233,43,4332.3
    </Typography>
   </Typography>

  <Box sx={{display:'flex', paddingTop:'34px'}}>
  <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
      
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={formatYAxisTick} />

        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="black" fill="transparent" dot={false} />

      </LineChart>
      
    </ResponsiveContainer>

  
  </Box>
 
   
      </Card>

     <Typography sx={{marginTop:"33px"}}>
     <Typography variant="h6"> {activeAccount}  <ArrowDropDownIcon onClick={handleClick} sx={{paddingTop:'8px'}}/> </Typography>
            <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>{title}</MenuItem>
        <MenuItem onClick={handleClose}>{activeAccount}</MenuItem>
        <MenuItem onClick={handleClose}> {inActiveAccounts}</MenuItem>
       
         </Menu>
     </Typography>
      </Paper>
    </Box>
  );
}
