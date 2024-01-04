import React from 'react';
import {  MenuItem} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


const LogoutProfile = () => {


  return (

        <MenuItem value="">
          <ExitToAppIcon fontSize="small" style={{ marginRight: '8px' }} />
          Log Out
        </MenuItem>
 
  );
};

export default LogoutProfile;
