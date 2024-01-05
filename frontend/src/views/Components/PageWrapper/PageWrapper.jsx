import React, { Suspense } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/system/Box';
import ComponentLoader from '../Loaders/ComponentLoader';

const PageWrapper = ({ children, isSidebar }) => {
  return (
    <Grid item sm={isSidebar ? 10.1 : 12}>
      <Box
        sx={{
          height: isSidebar ? 'calc(100vh - 80px)' : '100%',
          overflow: 'auto',
          marginTop: '.6rem'
        }}>
        <Suspense fallback={<ComponentLoader />}>
          <Box padding='0 .6rem'>{children}</Box>
        </Suspense>
      </Box>
    </Grid>
    // </Grid>
  );
};

export default PageWrapper;
