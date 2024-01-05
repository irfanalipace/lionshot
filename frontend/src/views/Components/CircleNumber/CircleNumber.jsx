import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";

const CircleNumber = ({ number, borderColor, backgroundColor, color }) => {
  return (
    <Box>
      <Paper
        sx={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `2px solid ${borderColor}`, 
          backgroundColor: backgroundColor,
          color:color,
          marginLeft:'16px'
        }}
      >
        <Typography variant="h5" >
          {number}
        </Typography>
      </Paper>
    </Box>
  );
};

export default CircleNumber;
