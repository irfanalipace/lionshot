import { Grid } from "@mui/material"
import React from 'react'

function GridRow({ children , style, sx, ...rest}) {
  return (
    <>
      <Grid container rowSpacing={1} {...rest} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{mb:'15px',display:'flex',...sx}} style={style}>
          {children}
      </Grid>
    </>
  )
}

export default GridRow
