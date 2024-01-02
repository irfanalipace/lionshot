import React, { useState } from "react";
import { Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import HeaderPaper from "../../../Components/Containers/HeaderPaper";
import { useNavigate } from "react-router-dom";
import { goBack } from "../../../../core/utils/helpers";

const NewCreditMemoHeader = ({ children, title }) => {
  const navigate = useNavigate();
  const [anchorEN, setAnchorEN] = useState(null);
  const handleClick = (event) => {
    setAnchorEN(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEN(null);
  };

  return (
    <Grid container>
      <Grid item sm={12}>
        <HeaderPaper>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <Typography variant='h6' className='TextCapitalize'>
                {title}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              {/* <IconButton onClick={handleClick} aria-label='delete'>
                <SettingsIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEN}
                open={Boolean(anchorEN)}
                onClose={handleClose}
              >
                <MenuItem>Preferences</MenuItem>
                <MenuItem>Manage Custom Fields</MenuItem>
              </Menu> */}
              <IconButton
               onClick={() => goBack(()=> navigate('/credit-memo'))}
                aria-label='delete'
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </HeaderPaper>
      </Grid>
      {children}
    </Grid>
  );
};

export default NewCreditMemoHeader;
