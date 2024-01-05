import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import MUIButton from '../Button/MUIButton';
import CloseBtn from '../closeBtn/CloseBtn';

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

const DeletePopUp = ({ deleteClick, handleClose, deleteType, type }) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <DialogTitle
          id="delete-dialog-title"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ padding: '25px 4px 16px 16px' }}
        >
          {deleteType === 'bulk'
            ? 'Confirm Bulk Delete'
            : 'Confirm  Delete'}
          <CloseBtn onClose={handleClose} />
        </DialogTitle>
      </Grid>
      <Grid item xs={12}>
        <DialogContent>
          <DialogContentText>
            {deleteType === 'bulk'
              ? `This action will delete selected ${type} in bulk.`
              : `This action will delete the selected ${type}.`}
          </DialogContentText>
          <DialogActions>
            <MUIButton onClick={handleClose} variant="outlined">
              Cancel
            </MUIButton>
            <MUIButton onClick={deleteClick} variant="contained" autoFocus>
              Confirm
            </MUIButton>
          </DialogActions>
        </DialogContent>
      </Grid>
    </Grid>
  );
};

export default DeletePopUp;
