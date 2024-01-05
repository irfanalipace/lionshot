import React from 'react';
import Grid from '@mui/material/Grid';
import { useLocation } from 'react-router-dom';

export default function TableGrid({
  sm,
  children,
  height = 87,
  scrollable = false
}) {
  const loc = useLocation();
  window.location.hash = loc.hash;
  return (
    <Grid
      item
      sm={sm}
      sx={
        !scrollable
          ? {
              height: `calc(100vh - ${height}px)`, // setting fix height for table grid columns so that avoid page overflow(it creates extra scroll bar on page if height not fixed)
              overflow: 'hidden'
            }
          : {}
      }>
      {children}
    </Grid>
  );
}
