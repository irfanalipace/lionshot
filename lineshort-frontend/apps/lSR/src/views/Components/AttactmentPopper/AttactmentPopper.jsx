import * as React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import { Grid, Typography } from '@mui/material';
// import { DropzoneAreaBase } from 'material-ui-dropzone';
import './dropzone.css';
export default function TransitionsPopper() {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
    setOpen(previousOpen => !previousOpen);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;

  return (
    <div>
      <button aria-describedby={id} type='button' onClick={handleClick}>
        Toggle Popper
      </button>
      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Typography sx={{ p: 2 }}>The content of the Popper.</Typography>
              <Grid container>
                <Grid item xs={4} aria-labelled='here'>
                  {/* <DropzoneAreaBase 
                                        onAdd={(fileObjs) => console.log('Added Files:', fileObjs)}
                                        onDelete={(fileObj) => console.log('Removed File:', fileObj)}
                                        onAlert={(message, variant) => console.log(`${variant}: ${message}`)}
                                    /> */}
                </Grid>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}></Grid>
              </Grid>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
}
