import { Grid, IconButton, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

// common comp
import HeaderPaper from "../../../../Components/Containers/HeaderPaper";

// icons
import CloseIcon from "@mui/icons-material/Close";
import PurchaseOrdersForm from "../PurchaseOrdersForm";

const EditPurchaseOrders = () => {
  return (
    <Grid container>
      <Grid item sm={12}>
        <HeaderPaper
          sx={{
            paddingLeft: "2rem",
            display: "flex",
            justifyContent: "space-between",
          }}>
          <Typography variant='h6'>Edit Purchase Orders</Typography>
          <Link to='/purchase-orders'>
            <IconButton>
              <CloseIcon />
            </IconButton>
          </Link>
        </HeaderPaper>
      </Grid>
      <Grid item sm={12}>
        <PurchaseOrdersForm edit />
      </Grid>
    </Grid>
  );
};
export default EditPurchaseOrders;
