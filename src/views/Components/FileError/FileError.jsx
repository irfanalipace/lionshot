import { Grid, Typography } from "@mui/material";
import React from "react";

const FileError = ({ errors }) => {
  return (
    <>
      {errors?.length > 0 &&
        errors?.map((error, index) => (
          <Grid item container display='flex' justifyContent='flex-end' paddingX={2}>
          <Grid mt={1} item sm={12} display='flex' justifyContent='start'>
            <Typography
              key={"error-" + index}
              color={"error"}
              sx={{ fontSize: "14px" }}>
              {error}
            </Typography>
          </Grid>
          </Grid>

        ))}
    </>
  );
};

export default FileError;
