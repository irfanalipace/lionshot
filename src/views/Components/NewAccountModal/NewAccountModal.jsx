import {
  Card,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Tooltip,
} from "@mui/material";
import Modal from "../Modal/Dialog";
import GridRow from "../GridRow/GridRow";
import InputLabel from "../InputLabel/InputLabel";
import { Box, Stack } from "@mui/system";
import FormField from "../InputField/FormField";
import Select from "react-select";
import MUIButton from "../Button/MUIButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createAccount } from "../../../core/api/accounts";
import notyf from "../NotificationMessage/notyfInstance";
import { useState } from "react";

export const NewAccountModal = ({ open, onClose, createdAccount }) => {
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    type: Yup.string().required("Type is required"),
    name: Yup.string().required("Name is required"),
    code: Yup.string().required("Account Code is required"),
    // is_sub_account: Yup.boolean(),
    // parent_account_id: Yup.number().when("is_sub_account", {
    //   is: true,
    //   then: () =>
    //     Yup.number().required(
    //       "Parent Account ID is required when Is Sub Account is true"
    //     ),
    //   otherwise: () => Yup.number().notRequired(),
    // }),
  });
  const formik = useFormik({
    initialValues: {
      type: "cost_of_goods_sold",
      name: "",
      is_sub_account: false,
      // parent_account_id: null,
      code: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const resp = await createAccount(values);
        createdAccount(resp);
        notyf.success(resp?.message);
      } catch (err) {
        notyf.error(err?.data?.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
          onClose();
          formik.resetForm();
        }, 1000);
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    onClose();
  };
  return (
    <Modal
      size={"md"}
      title={"Create Account"}
      open={open}
      onClose={handleCancel}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ padding: "40px" }}>
          <GridRow>
            <Grid item xs={2}>
              <InputLabel required>Account Name*</InputLabel>
            </Grid>
            <Grid item xs={6}>
              <FormField
                id='name'
                value={formik.values.name}
                handleChange={formik.handleChange}
                isTouched={formik.touched.name}
                error={
                  formik.touched.name &&
                  formik.errors.name &&
                  formik.errors.name
                }
              />
            </Grid>
          </GridRow>
          <GridRow>
            <Grid item xs={2}>
              <InputLabel required>Account Type*</InputLabel>
            </Grid>
            <Tooltip open={true} arrow title={toolTip} placement='right'>
              <Grid item xs={6}>
                <Select
                  isSearchable={true}
                  isDisabled={true}
                  placeholder='Cost of Goods Sold'
                  // options={accountSales}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      fontFamily: "Roboto",
                      background: state.isDisabled ? "#e0e0e0" : "transparent",
                    }),
                    menu: (baseStyles) => ({
                      ...baseStyles,
                      zIndex: 9999,
                      fontFamily: "Roboto",
                    }),
                  }}
                />
              </Grid>
            </Tooltip>
          </GridRow>
          {/* <GridRow>
          <Grid item xs={2}></Grid>
          <Grid item xs={4}>
            <FormControlLabel
              id="is_sub_account"
              control={
                <Checkbox
                  name="is_sub_account"
                  checked={formik.values.is_sub_account}
                  onChange={(event) => {
                    formik.handleChange(event);
                  }}
                  value={formik.values.is_sub_account}
                />
              }
              label="Make this a sub - account"
            />
          </Grid>
        </GridRow>
        {formik.values.is_sub_account && (
          <GridRow>
            <Grid item xs={2}>
              <InputLabel required>Parent Account*</InputLabel>
            </Grid>
            <Grid item xs={6}>
              <Select
                id="parent_account_id"
                isSearchable={true}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    fontFamily: "Roboto",
                    background: state.isDisabled ? "#e0e0e0" : "transparent",
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    zIndex: 9999,
                    fontFamily: "Roboto",
                  }),
                }}
              />
            </Grid>
          </GridRow>
        )} */}

          <GridRow>
            <Grid item xs={2}>
              <InputLabel>Account Code</InputLabel>
            </Grid>
            <Grid item xs={6}>
              <FormField
                id='code'
                value={formik.values.code}
                handleChange={formik.handleChange}
                isTouched={formik.touched.code}
                error={
                  formik.touched.code &&
                  formik.errors.code &&
                  formik.errors.code
                }
              />
            </Grid>
          </GridRow>
          <GridRow>
            <Grid item xs={2}>
              <InputLabel>Description</InputLabel>
            </Grid>
            <Grid item xs={6}>
              <FormField
                type='textarea'
                placeholder={"Max 500 Characters"}
                id='description'
                value={formik.values.description}
                handleChange={formik.handleChange}
              />
            </Grid>
          </GridRow>
        </Box>
        <Divider />
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
          sx={{ p: 2 }}
        >
          <Stack direction='row' spacing={2}>
            <MUIButton disabled={loading} type='submit'>
              {loading ? <CircularProgress size={20} /> : "Save and Select"}
            </MUIButton>
            <MUIButton variant='outlined' onClick={handleCancel}>
              Cancel
            </MUIButton>
          </Stack>
        </Grid>
      </form>
    </Modal>
  );
};

const toolTip = (
  <Card>
    <div
      style={{
        backgroundColor: "#ffffff",
        color: "#000",
        padding: "20px 35px",
      }}
    >
      <h2>Expenses</h2>
      <br />
      This indicates the direct costs attributable to <br />
      the production of the goods sold by a <br />
      company such as:
      <ul>
        <li>Material and Laborcosts</li>
        <li>Cost of obtaining raw materials</li>
      </ul>
    </div>
  </Card>
);
