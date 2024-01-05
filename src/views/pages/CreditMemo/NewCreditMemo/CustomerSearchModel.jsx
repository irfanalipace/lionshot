import React, { useState } from "react";
import Modal from "../../../Components/Modal/Dialog";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import GridRow from "../../../Components/GridRow/GridRow";
import CloseIcon from "@mui/icons-material/Close";
import CustomSelect from "../../../Components/Select/Select";
import FormField from "../../../Components/InputField/FormField";

const CustomerSearchModel = ({ open, onClose }) => {
  const [searchTab, setSearchTab] = useState(0);
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ minHeight: "300px" }}>
        <GridRow
          style={{
            backgroundColor: "#f3f3f3",
            padding: "20px",
          }}
        >
          <Grid item sm={9}>
            <Typography variant='h5' fontWeight={500}>
              Advance Customer Search
            </Typography>
          </Grid>
          <Grid item ml={10}>
            <IconButton onClick={() => onClose()}>
              <CloseIcon />
            </IconButton>{" "}
          </Grid>
        </GridRow>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
          mb={2}
        >
          <Grid>
            <ButtonGroup>
              <Button
                variant={searchTab === 0 ? "contained" : "outlined"}
                onClick={() => setSearchTab(0)}
              >
                IN IMS BOOKS
              </Button>
              <Button
                variant={searchTab === 1 ? "contained" : "outlined"}
                onClick={() => setSearchTab(1)}
              >
                IN IMS CRM
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
        {searchTab === 0 ? (
          <GridRow style={{ padding: "0px 20px" }}>
            <Grid item sm={4}>
              <CustomSelect placeholder='Display Name' />
            </Grid>
            <Grid item sm={6}>
              <FormField placeholder='Search Name' />
            </Grid>
            <Grid item sm={2}>
              <Button variant='contained'>Go</Button>
            </Grid>
          </GridRow>
        ) : (
          <GridRow style={{ padding: "0px 20px" }}>
            <Grid item sm={3}>
              <CustomSelect placeholder='Accounts' />
            </Grid>
            <Grid item sm={7}>
              <FormField placeholder='Search Name' />
            </Grid>
            <Grid item sm={2}>
              <Button variant='contained'>Go</Button>
            </Grid>
          </GridRow>
        )}
      </Box>
    </Modal>
  );
};

export default CustomerSearchModel;
