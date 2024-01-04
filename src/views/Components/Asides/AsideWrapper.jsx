import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import React, { Suspense } from 'react';

const AsideWrapper = ({ children }) => {
  return (
    <Grid item sm={1.9} xs>
      <Box
        sx={{
          backgroundColor: 'white',
          height: 'calc(100vh - 72px)',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px'
          }
        }}>
        <Suspense>{children}</Suspense>
      </Box>
    </Grid>
  );
};

export default AsideWrapper;
