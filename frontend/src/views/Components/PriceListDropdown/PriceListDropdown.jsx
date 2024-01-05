import { ArrowDropDown } from "@mui/icons-material";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";

const PriceListDropdown = ({ title, variant, fontSize }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Typography onClick={handleClick} variant= "h6" component="span" fontSize={fontSize ? fontSize : null}>
        {title}
        <ArrowDropDown sx={{ margin: "-10px 0 -8px 0" }} />
      </Typography>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
       
      >
       

        <MenuItem>All</MenuItem>
        <MenuItem>Sales</MenuItem>
        <MenuItem>Purchase</MenuItem>
     
      </Menu>
    </>
  );
};

export default PriceListDropdown;
