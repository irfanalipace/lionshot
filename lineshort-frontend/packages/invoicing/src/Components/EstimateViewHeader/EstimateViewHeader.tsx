import { Grid, Typography } from '@mui/material';
import React, { FC } from 'react'; // Import FC type for functional component
import CloseBtn from '../../Components/closeBtn/CloseBtn';

interface EstimateHeaderProps {
  onClose: () => void;
  title: string;
}

const EstimateHeader: FC<EstimateHeaderProps> = ({ onClose, title }) => {
  return (
    <>
      <Grid item xs={6} >
        <Typography
          variant="h6"
          sx={{ fontSize: { xs: ".7rem", md: "1.2rem" } , fontWeight: 650 }}>
          {title}
        </Typography>
      </Grid>
      <Grid item  xs={6} display='flex' justifyContent='flex-end'>
        <CloseBtn onClose={onClose}/>
      </Grid>
    </>
  );
};

export default EstimateHeader;
