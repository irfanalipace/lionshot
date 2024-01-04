import React from 'react';
import { Box, Dialog, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({
  open, // A boolean indicating whether the modal is open.
  onClose, // A function to handle the closing of the modal.
  children, // Content that will be rendered inside the modal.
  title, // Title of the modal
  className, // Additional CSS class to apply to the modal container.
  size, // Size configuration for the modal, e.g., 'small', 'medium', 'large'.
  hasCloseButton = true // A boolean indicating whether the modal should have a close button.
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      className={className}
      fullWidth={true}
      maxWidth={size}
    >
      {open ? (
        <Box>
          {title ? (
            <DialogTitle sx={{ m: 0, pb: 1 }}>
              {title}
              {hasCloseButton && (
                <IconButton
                  aria-label='close'
                  onClick={onClose}
                  sx={{
                    position: 'absolute',
                    right: 20,
                    top: 8
                  }}
                >
                  <CloseIcon color='primary' />
                </IconButton>
              )}
            </DialogTitle>
          ) : (
            <></>
          )}
          {children}
        </Box>
      ) : (
        <></>
      )}
    </Dialog>
  );
};

export default Modal;
