import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { Link as RouterLink } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { login } from "../../../core/store/auth/authThunks";
import AuthLogoContainer from "./Components/AuthLogoContainer/AuthLogoContainer";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {
  AuthFooter,
  AuthMainContainer,
  AuthSection,
  FormContainer,
  AuthTitle,
  StyledCheckboxStack,
} from "../Auth/Components/Styles";
import FormField from "../../Components/InputField/FormField";
import { CLEAR_API_ERRORS } from "../../../core/store/auth/authSlice";
import LoginLogo from "../../../assets/images/logos/Logo-placeholder.png";
import { Divider } from "@mui/material";
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const initialValues = {
  email: "",
  password: "",
};

export default function Login() {
  const [showAlert, setShowAlert] = useState(true);
  const [credentials, setCredentials] = useState("");
  const apiError = useSelector((state) => state?.auth?.apiError);
  // console.log('apierror' ,  apiError)
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(login(values));
    } catch (e) {
      console.log("login error", e);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const updatedErrors = {};
  useEffect(() => {
    if (Object.values(formik.errors).length > 0) setCredentials("");
  }, [formik.errors]);

  //  clear error when components unmount
  useEffect(() => {
    return () => {
      dispatch(CLEAR_API_ERRORS());
    };
  }, []);
  useEffect(() => {
    if (apiError)
      if (apiError.data && apiError.data.message) {
        const errorMessage = apiError.data.message;
        if (errorMessage.credentials && errorMessage.credentials.length > 0) {
          setCredentials(errorMessage.credentials[0]);
          setShowAlert(true);
        } else {
          const error = apiError?.data?.errors;

          const email = error?.email;
          const password = error?.password;
          if (email && email.length > 0) {
            updatedErrors.email = email[0];
          }
          if (password && password.length > 0) {
            updatedErrors.password = password[0];
          }
        }
        formik.setErrors(updatedErrors);
      }
  }, [apiError]);

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <AuthMainContainer>
      <Grid container>
        <Grid item container display="flex" justifyContent="center">
          <Grid item>
            <AuthSection>
              <AuthLogoContainer />
              <FormContainer>
                {apiError &&
                  credentials &&
                  !credentials.includes("Email") &&
                  showAlert && (
                    <Alert severity="error" onClose={handleAlertClose}>
                      {`${credentials}.. your email or password is incorrect`}
                    </Alert>
                  )}
                <AuthTitle variant="h6" component="body">
                  Login
                </AuthTitle>

                <Divider></Divider>
                <form onSubmit={formik.handleSubmit}>
                  <FormField
                    type="email"
                    name="email"
                    fullWidth
                    size="small"
                    label="Email address"
                    placeholder="jhon@example.com"
                    isTouched={formik.touched.email}
                    onBlur={formik.handleBlur}
                    style={{ margin: "20px 0" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    value={formik.values.email}
                    error={
                      (formik.touched.email &&
                        formik.errors.email &&
                        formik.errors.email) ||
                      (apiError?.email && apiError.email) ||
                      (credentials.includes("Email") && credentials)
                    }
                    handleChange={formik.handleChange}
                  />
                  <FormField
                    fullWidth
                    size="small"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    name="password"
                    placeholder="******"
                    password
                    isTouched={formik.touched.password}
                    onBlur={formik.handleBlur}
                    variant="outlined"
                    sx={{ marginY: ".8rem" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    value={formik.values.password}
                    error={
                      (formik.touched.password &&
                        formik.errors.password &&
                        formik.errors.password) ||
                      (apiError?.password && apiError.password)
                    }
                    handleChange={formik.handleChange}
                  />
                  <StyledCheckboxStack>
                    <Checkbox
                      size="small"
                      checked={formik.values.remember}
                      onChange={formik.handleChange}
                      name="remember"
                    />
                    <Typography variant="body1">Remember</Typography>
                  </StyledCheckboxStack>
                  <LoadingButton
                    type="submit"
                    disabled={formik.isSubmitting}
                    loading={formik.isSubmitting}
                    variant="contained"
                    fullWidth
                  >
                    Login
                  </LoadingButton>
                </form>
                <AuthFooter>
                  <Button
                    variant="text"
                    to="/register"
                    size="small"
                    component={RouterLink}
                    sx={{ textTransform: "capitalize" }}
                  >
                    Create Account
                  </Button>
                  <Button
                    variant="text"
                    component={RouterLink}
                    to="/reset-password"
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  >
                    Forgot Password
                  </Button>
                </AuthFooter>
              </FormContainer>
            </AuthSection>
          </Grid>
        </Grid>
      </Grid>
    </AuthMainContainer>
  );
}
