import { CircularProgress, Divider, Grid } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import Modal from "../../../../Components/Modal/Dialog";
import GridRow from "../../../../Components/GridRow/GridRow";
import InputLabel from "../../../../Components/InputLabel/InputLabel";
import FormField from "../../../../Components/InputField/FormField";
import MUIButton from "../../../../Components/Button/MUIButton";
import notyf from "../../../../Components/NotificationMessage/notyfInstance";
import { createTax } from "../../../../../core/api/Others/tax";

const NewTaxModal = ({ open, onClose, setIsNewTaxAdded }) => {
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    rate: Yup.number()
      .typeError("Rate must be a number")
      .required("Rate is required")
      .positive("Rate must be greater than 0")
      .moreThan(0, "Rate must be greater than 0"),
    authority: Yup.string().required("Authority is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      rate: 0,
      authority: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("NewTaxModal Submited ", values);
      setLoading(true);
      try {
        const resp = await createTax(values);
        if (resp?.success === true) {
          setIsNewTaxAdded(true);
        }
        notyf.success(resp?.message);
      } catch (err) {
        console.log("NewTaxModal error", err);
        notyf.error(err?.data?.message);
        setIsNewTaxAdded(false);
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
    <Modal size={"sm"} title={"New Tax"} open={open} onClose={handleCancel}>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ padding: "1rem", paddingLeft: "2.5rem" }}>
          <GridRow>
            <Grid item xs={3}>
              <InputLabel required>Tax Name*</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <FormField
                id="name"
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
            <Grid item xs={3}>
              <InputLabel required>Rate (%)*</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <FormField
                id="rate"
                value={formik.values.rate}
                handleChange={formik.handleChange}
                isTouched={formik.touched.rate}
                error={
                  formik.touched.rate &&
                  formik.errors.rate &&
                  formik.errors.rate
                }
              />
            </Grid>
          </GridRow>
          <GridRow>
            <Grid item xs={3}>
              <InputLabel required>Tax Authority*</InputLabel>
            </Grid>
            <Grid item xs={8}>
              <FormField
                id="authority"
                value={formik.values.authority}
                handleChange={formik.handleChange}
                isTouched={formik.touched.authority}
                error={
                  formik.touched.authority &&
                  formik.errors.authority &&
                  formik.errors.authority
                }
              />
            </Grid>
          </GridRow>
        </Box>
        <Divider />
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ p: 2 }}
        >
          <Stack direction="row" spacing={2}>
            <MUIButton disabled={loading} type="submit">
              {loading ? <CircularProgress size={20} /> : "Save"}
            </MUIButton>
            <MUIButton variant="outlined" onClick={handleCancel}>
              Cancel
            </MUIButton>
          </Stack>
        </Grid>
      </form>
    </Modal>
  );
};

export default NewTaxModal;
