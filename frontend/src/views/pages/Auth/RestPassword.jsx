import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import {
  AuthMainContainer,
  AuthSection,
  FormContainer,
  AuthTitle,
  AuthImg,
  AuthFooter,
} from "../Auth/Components/Styles";
import FormField from "../../Components/InputField/FormField";
import EmailIcon from "@mui/icons-material/Email";
import { forgetPassword } from "../../../core/store/auth/authThunks";
import LoadingButton from "@mui/lab/LoadingButton";
import AuthLogoContainer from "./Components/AuthLogoContainer/AuthLogoContainer";
import { CLEAR_API_ERRORS } from "../../../core/store/auth/authSlice";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const apiError = useSelector((state) => state?.auth?.apiError);

  function cb() {
    formik.resetForm();
    navigate("/login");
  }

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        await dispatch(forgetPassword(values, cb));
      } catch (error) {
        console.log("err", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // api error set for field
  const updateError = {};
  useEffect(() => {
    if (apiError) {
      console.log("errror", apiError);
      if (apiError.email && apiError.email.length > 0)
        updateError.email = apiError.email[0];
    }
    formik.setErrors(updateError);
  }, [apiError]);

  //  clear error when components unmount
  useEffect(() => {
    return () => {
      dispatch(CLEAR_API_ERRORS());
    };
  }, []);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputs = Array.from({ length: 6 }, (_, index) => index);
  const inputRefs = otpInputs.map(() => useRef(null));

  const handleInputChange = (value, index) => {
    if (value.length > 1) {
      // If user pastes multiple characters, take only the first character
      value = value[0];
    }

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = value;
      return newOtp;
    });

    // Move focus to the next input
    if (index < otpInputs.length - 1 && value) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    // Move focus to the previous input on backspace
    if (event.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs[index - 1].current.focus();
    }
  };
  return (
    <AuthMainContainer>
      <Grid container>
        <Grid item container display="flex" justifyContent="center">
          <Grid item>
            <AuthSection>
              <AuthLogoContainer />

              {/* <RouterLink
                to="/login"
                style={{ textDecoration: "none", cursor: "pointer" }}
              >
                <KeyboardBackspaceIcon />
              </RouterLink> */}
              <FormContainer>
                <AuthTitle variant="h6" component="body1">
                  Continue with Your Email
                </AuthTitle>

                <Divider sx={{ marginBottom: "14px" }}></Divider>
                <form onSubmit={formik.handleSubmit}>
                  <FormField
                    type="email"
                    name="email"
                    fullWidth
                    size="small"
                    label="Email address"
                    placeholder="jhon@gmail.com"
                    variant="outlined"
                    sx={{ marginY: ".8rem" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    value={formik.values.email}
                    isTouched={formik.touched.email}
                    error={
                      (formik.touched.email &&
                        formik.errors.email &&
                        formik.errors.email) ||
                      (apiError?.email && apiError.email)
                    }
                    onBlur={formik.handleBlur}
                    handleChange={formik.handleChange}
                  />
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}
                    >
                      <Box>
                        {otpInputs.map((index) => (
                          <TextField
                            key={index}
                            inputRef={inputRefs[index]}
                            variant="outlined"
                            size="small"
                            margin="dense"
                            placeholder="#"
                            value={otp[index]}
                            onChange={(e) =>
                              handleInputChange(e.target.value, index)
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            inputProps={{
                              maxLength: 1,
                              style: {
                                textAlign: "center",
                                height: "52px", // Set the height
                                width: "32px", // Adjust the width as needed
                              },
                            }}
                            InputProps={{
                              startAdornment: index === 0 && (
                                <InputAdornment position="start"></InputAdornment>
                              ),
                            }}
                            sx={{ margin: "2px", borderRadius: "23px" }}
                          />
                        ))}
                      </Box>
                      <Box>
                        <Button
                          sx={{
                            textDecoration: "underline",
                            paddingTop: "20px",
                          }}
                        >
                          Send Code
                        </Button>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <AuthTitle component="body1">
                      Check your email and enter the code here
                    </AuthTitle>
                    <LoadingButton
                    sx={{background:'#2196F3'}}
                      type="submit"
                      variant="contained"
                      disabled={formik.isSubmitting}
                      loading={formik.isSubmitting}
                      fullWidth
                    >
                      Continue
                    </LoadingButton>
                  </Grid>
                </form>
              </FormContainer>
            </AuthSection>
          </Grid>
        </Grid>
      </Grid>
    </AuthMainContainer>
  );
}
