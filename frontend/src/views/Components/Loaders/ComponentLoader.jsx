import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import logo from '../../../assets/images/logos/computer.png';
import Box from '@mui/material/Box';

function ComponentLoader() {
  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <img style={{ maxWidth: '90%' }} src={logo} />
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <CircularProgress
            sx={{
              width: '250px',
              height: '250px',
              '& svg': {
                strokeWidth: '24px'
              }
            }}
          />
        </div>
      </div>
    </Box>
  );
}

export default ComponentLoader;
