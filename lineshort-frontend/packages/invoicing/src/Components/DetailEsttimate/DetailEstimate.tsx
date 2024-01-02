import React from 'react';
import { Button, Grid, Stack, Typography } from '@mui/material';
import LockOpenIcon from "@mui/icons-material/LockOpen";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import MUIButton from '../../Components/Button/MUIButton';

const DetailEstimate: React.FC = () => {
  return (
    <>
      <Grid container marginY=".9rem" alignItems='center'>
        <Grid item xs={6} display="flex">
          <Stack
            direction="row"
            spacing={2}
            display="flex"
            alignItems="center">
            <LockOpenIcon fontSize='small' color='primary' />
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: ".7rem", md: "1rem" } }}>
              Show Estimate Detail
            </Typography>
          </Stack>
        </Grid>
        <Grid
          item
          xs={6}
          display="flex"
          justifyContent="flex-end"
          alignItems="center">
          <MUIButton
            startIcon={<NewspaperIcon />}
          >
            Download PDF
          </MUIButton>
        </Grid>{" "}
      </Grid>
    </>
  );
}

export default DetailEstimate;
