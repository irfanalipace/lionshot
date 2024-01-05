import React, { useState } from "react";
import Select from "react-select";

import {
  Box,
  IconButton,
  Stack,
  Typography,
  Checkbox,
  Menu,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
// icons
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";

import * as Yup from "yup";

import { useFormik } from "formik";
import notyf from "../NotificationMessage/notyfInstance";
import InputLabel from "../InputLabel/InputLabel";
import MUIButton from "../Button/MUIButton";
import {
  getExemtionsReasonsApi,
  getTaxAuthoritiesApi,
  updateCustomerTaxApi,
} from "../../../core/api/estimate";
import { useEffect } from "react";
import CustomSelect from "../Select/Select";
import { getTaxesApi } from "../../../core/api/customer";

const TaxSection = ({ customerDetails, onSave }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTax, setSelectedTax] = useState("");
  const [exemptionsOptions, setExpOptions] = useState("");
  const [selecteExempReasons, setSelectedExpReasons] = useState("");
  const [taxAuthoritiesOptions, setAuthoritiesOptions] = useState("");
  const [selecteTaxAuthorities, setSelectedTaxAuthorities] = useState("");
  const [taxValues, setTaxValues] = useState();


  const taxTypes = {
    TAXABLE: "taxable",
    TAXEXEMPT: "tax_exempt",
  };

  useEffect(() => {
      const respTax = getTaxesApi();
      respTax
        .then(data => {
          const repsTax = data.data;
          const updatedOptions_ = repsTax.map(({ id, name, rate }) => ({
            value: id,
            label: name,
            price: rate,
          }));
          setTaxValues(updatedOptions_);
        })
        .catch(error => {
          console.error(error.message);
        });

	}, []);

  const resetingValues = () => {
    setSelectedTax("");
    setSelectedExpReasons("");
    setSelectedTaxAuthorities("");
    taxFormik.resetForm();
    taxFormik.setFieldValue("tax_preference", "taxable");
  };

  const gettingExemptionsReason = async () => {
    try {
      const resp = await getExemtionsReasonsApi();
      const expReasons = resp?.data?.ExemptionReasons;
      setExpOptions(() => {
        return expReasons[0]?.map((item) => ({
          label: item,
          value: item,
        }));
      });
    } catch (error) {}
  };

  const gettingTaxAuthorities = async () => {
    try {
      const resp = await getTaxAuthoritiesApi();
      const taxAuthorities = resp?.data?.TaxAuthorities;
      setAuthoritiesOptions(() => {
        return taxAuthorities[0]?.map((item) => ({
          label: item,
          value: item,
        }));
      });
    } catch (error) {}
  };

  useEffect(() => {
    gettingExemptionsReason();
    gettingTaxAuthorities();
  }, []);
  // tax update
  const taxInitialValues = {
    tax_preference: "taxable",
    tax_id: "",
    exemption_reason: "",
    tax_authority: "",
    is_tax_permanent: 0, // 1 or 0
  };
  const taxValidationSchema = Yup.object().shape({
    tax_id: Yup.string().when("tax_preference", {
      is: "taxable",
      then: () => Yup.string().required("Tax  is required"),
      otherwise: () => Yup.string().notRequired(),
    }),
    exemption_reason: Yup.string().when("tax_preference", {
      is: "tax_exempt",
      then: () => Yup.string().required("Exemption reason  is required"),
      otherwise: () => Yup.string().notRequired(),
    }),
    tax_authority: Yup.string().when("tax_preference", {
      is: "tax_exempt",
      then: () => Yup.string().required("Tax authority  is required"),
      otherwise: () => Yup.string().notRequired(),
    }),
    tax_preference: Yup.string().required("Tax Preference is required"),
  });
  const taxFormik = useFormik({
    initialValues: taxInitialValues,
    validationSchema: taxValidationSchema,
    onSubmit: async (values) => {
      //  a function to remove empty keys from an object
      function removeEmptyKeys(obj) {
        const newObj = {};

        for (const key in obj) {
          if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
            newObj[key] = obj[key];
          }
        }

        return newObj;
      }

      // Remove empty keys from the values object just before submitting
      const filteredValues = removeEmptyKeys({
        ...values,
        customer_id: customerDetails?.id,
      });

      try {
        const resp = await updateCustomerTaxApi(filteredValues);
        notyf.success(resp?.message);
        onSave();
        taxMenuClose();
      } catch (error) {
        taxFormik.setErrors(error?.data?.errors);
      }
    },
  });

  const taxtSelectChange = (selected, type) => {
    if (type === "tax_id") {
      setSelectedTax(selected);
    }
    if (type === "exemption_reason") {
      setSelectedExpReasons(selected);
    }
    if (type === "tax_authority") {
      setSelectedTaxAuthorities(selected);
    }
    if (selected === null) {
      taxFormik.setFieldValue(type, "");
    } else {
      taxFormik.setFieldValue(type, selected.value);
    }
  };

  const taxMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    resetingValues();    // to make the form to initialVals on open , 

  };
  const taxMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <form onSubmit={taxFormik.handleSubmit}>
        <Stack direction='row' display='flex' alignItems='center' mt={1}>
          {customerDetails?.tax?.name ? (
            <>
              <Typography variant='body2Grey'>Tax:</Typography>
              <Typography variant='body2' ml={1}>
                {customerDetails?.tax?.name}
              </Typography>
              <IconButton
                onClick={(event) => taxMenuOpen(event)}
                sx={{ cursor: "pointer" }}>
                <EditOutlinedIcon fontSize='small' />
              </IconButton>
            </>
          ) : (
            <>
              <Typography variant='body2Grey'>Tax:</Typography>
              <Typography variant='body2'>Non Taxable</Typography>
              <IconButton
                onClick={(event) => taxMenuOpen(event)}
                sx={{ cursor: "pointer" }}>
                <EditOutlinedIcon fontSize='small' />
              </IconButton>
            </>
          )}
          <Menu
            onClose={taxMenuClose}
            anchorEl={anchorEl}
            id='account-menu'
            open={Boolean(anchorEl)}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                // "& .MuiAvatar-root": {
                //   width: 32,
                //   height: 32,
                //   ml: -0.5,
                //   mr: 1,
                // },
                // "&:before": {
                //   content: '""',
                //   display: "block",
                //   position: "absolute",
                //   top: 0,
                //   left: 15, // arrow positionm
                //   right: 14,
                //   width: 15,
                //   height: 15,
                //   bgcolor: "background.paper",
                //   transform: "translateY(-50%) rotate(45deg)",
                //   zIndex: 0,
                // },
              },
            }}
            transformOrigin={{
              horizontal: "left",
              vertical: "top",
            }}
            anchorOrigin={{
              horizontal: "left",
              vertical: "bottom",
            }}>
            <Box sx={{ width: 350 }}>
              <Stack
                direction='row'
                display='flex'
                bgcolor='#f9f9fb'
                width='100%'
                sx={{ padding: 1, margin: 0 }}
                alignItems='center'
                justifyContent='space-between'>
                <Typography variant='body2'>
                  Configure Tax Preferences
                </Typography>
                <IconButton bgcolor='red' onClick={taxMenuClose}>
                  <CloseIcon fontSize='small'  />
                </IconButton>
              </Stack>
              <Box padding={2}>
                <InputLabel>
                  Tax Preference
                  <span style={{ color: "red" }}>*</span>
                </InputLabel>

                <Stack
                  direction='row'
                  display='flex'
                  pl={0}
                  ml={0}
                  justifyContent='start'
                  alignItems='center'>
                  {/* <FormControl> */}
                  <FormControlLabel
                    id='tax_preference'
                    control={
                      <Radio
                        name='tax_preference'
                        value={taxTypes.TAXABLE}
                        checked={
                          taxFormik.values.tax_preference === taxTypes.TAXABLE
                        }
                        onChange={taxFormik.handleChange}
                      />
                    }
                    label={<InputLabel>Taxable</InputLabel>}
                  />
                  &ensp; &ensp; &ensp;
                  <FormControlLabel
                    id='tax_preference'
                    control={
                      <Radio
                        name='tax_preference'
                        value={taxTypes.TAXEXEMPT}
                        checked={
                          taxFormik.values.tax_preference === taxTypes.TAXEXEMPT
                        }
                        onChange={taxFormik.handleChange}
                      />
                    }
                    label={<InputLabel>Tax Exempt</InputLabel>}
                  />
                </Stack>
                {/* field s  */}
                {taxFormik.values.tax_preference === taxTypes.TAXABLE ? (
                  <Box>
                    <InputLabel>
                      Tax Rate
                      <span style={{ color: "red" }}>*</span>
                    </InputLabel>
                    <CustomSelect
                      id='tax_id'
                      options={taxValues}
                      value={selectedTax}
                      placeholder='Select tax'
                      onChange={(selected) =>
                        taxtSelectChange(selected, "tax_id")
                      }
                      error={
                       (taxFormik.touched.tax_id &&
                        taxFormik.errors.tax_id) &&
                        taxFormik.errors.tax_id
                      }
                      touched={taxFormik.touched.tax_id}

                    />
                  </Box>
                ) : taxFormik.values.tax_preference === taxTypes.TAXEXEMPT ? (
                  <Box spacing={2}>
                    <InputLabel>
                      Exemption Reason
                      <span style={{ color: "red" }}>*</span>
                    </InputLabel>
                    <CustomSelect
                    placeholder='Select exemptions reasons'
                      id='exemption_reason'
                      options={exemptionsOptions}
                      value={selecteExempReasons}
                      onChange={(selected) =>
                        taxtSelectChange(selected, "exemption_reason")
                      }
                      touched={taxFormik.touched.exemption_reason}
                      error={
                        (taxFormik.touched.exemption_reason &&
                      taxFormik.errors.exemption_reason)  &&     taxFormik.errors.exemption_reason
                      }
                    
                    />
            
                    <InputLabel>
                      Tax Authority
                      <span style={{ color: "red" }}>*</span>
                    </InputLabel>
                    <CustomSelect
                    placeholder='Select authorities'
                      id='tax_authority'
                      options={taxAuthoritiesOptions}
                      value={selecteTaxAuthorities}
                      onChange={(selected) =>
                        taxtSelectChange(selected, "tax_authority")
                      }
                      touched ={taxFormik.touched.tax_authority}
                      error={
                        (taxFormik.touched.tax_authority &&
                      taxFormik.errors.tax_authority)  &&     taxFormik.errors.tax_authority
                      }
                    />
          
                  </Box>
                ) : null}

                <Box my={3}>
                  <Typography variant='body2'>Make it permanent</Typography>
                  <Stack
                    mt={1}
                    direction='row'
                    display='flex'
                    alignItems='start'
                    justifyContent='start'>
                    <Checkbox
                      checked={taxFormik.values.is_tax_permanent===1}
                      id='is_tax_permanent'
                      onChange={(e) => {
                        const newValue = e.target.checked ? 1 : 0;
                        taxFormik.setFieldValue("is_tax_permanent", newValue);
                      }}
                      sx={{ padding: 0, margin: "2px 0" }}
                    />

                    <Typography variant='body2' ml={0.5}>
                      Use these settings for all future transactions of this
                      customer
                    </Typography>
                  </Stack>
                </Box>

                <Stack direction='row' spacing={1}>
                  <MUIButton type='submit' onClick={taxFormik.handleSubmit}>
                    Update
                  </MUIButton>
                  <MUIButton
                    onClick={taxMenuClose}
                    variant='text'
                    ml={2}
                    sx={{ background: "#f9f9fb" }}>
                    Cancel
                  </MUIButton>
                </Stack>
              </Box>
            </Box>
          </Menu>
        </Stack>
      </form>
    </>
  );
};

export default TaxSection;