import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function ExportSalesPriceListModal() {

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
        
      <MenuItem onClick={handleClickOpen}>
        <ListItemIcon>
          <UploadFileIcon />
        </ListItemIcon>
        Export Sales Price List
      </MenuItem>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Export Sales Price List</DialogTitle>
        <DialogContent>
          
          <Typography>This is the content of the modal.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ExportSalesPriceListModal;
