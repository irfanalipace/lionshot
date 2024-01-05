import React, { useState } from 'react';
import ActivityTimeLine from '../../../Components/ActivityTimeLine/ActivityTimeLine';
import Paper from '@mui/material/Paper';

const ViewHistory = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="vertical-stepper">
      <Paper>
        <ActivityTimeLine />
      </Paper>
    </div>
  );
};

export default ViewHistory;
