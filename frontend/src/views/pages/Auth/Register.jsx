import React, { useEffect, useRef, useState } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import LoginLogo from "../../../assets/images/logos/Logo-placeholder.png";
import {
  AuthFooter,
  AuthMainContainer,
  AuthSection,
  FormContainer,
  AuthTitle,
  StyledCheckboxStack,
  AuthImg,
  AuthSectionTwo,
} from "../Auth/Components/Styles";
import Checkbox from "@mui/material/Checkbox";
// import computer from "../../../assets/computer.png";
import FormField from "../../Components/InputField/FormField";
import { register } from "../../../core/store/auth/authThunks";
import AuthLogoContainer from "./Components/AuthLogoContainer/AuthLogoContainer";
import { CLEAR_API_ERRORS } from "../../../core/store/auth/authSlice";
import { CheckBox } from "@mui/icons-material";
import { Divider } from "@mui/material";

const accountValidationSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function Register() {
  const navigate = useNavigate();
  const apiError = useSelector((state) => state?.auth?.apiError);
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [continueState, setContinueState] = useState(false);
  // const [company_logo, setcompany_logo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const handleShowPassChange = () => {
    setShowPass(!showPass);
  };
  const handleAccountSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
    //  setLoading(true);
	  alert(loading,'try')
      const accountData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      };

      function cb(params) {
        if (params === "catch") {
        } else {
          accountFormik.resetForm();
          console.log("Registration successful:", params);
         
          navigate("/login");
        }
      }

      dispatch(register(accountData, cb));
    } catch (error) {
      //	alert("error")
    //  setLoading(false);
      console.log("reg error", error);
    } finally {
      setSubmitting(false);
	//  alert(loading,'finally')
    //  setLoading(false);
    }
  };

  const accountFormik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: accountValidationSchema,
    onSubmit: handleAccountSubmit,
  });

  const updatedAccountError = {};
  useEffect(() => {
    if (apiError) {
      const { email, first_name, last_name, password, password_confirmation } =
        apiError;

      if (first_name && first_name.length > 0) {
        updatedAccountError.first_name = first_name[0];
      }
      if (last_name && last_name.length > 0) {
        updatedAccountError.last_name = last_name[0];
      }
      if (
        password &&
        password.length > 0 &&
        !password[0].includes("confirmation")
      ) {
        updatedAccountError.password = password[0];
      }
      if (
        password &&
        password.length > 0 &&
        password[0].includes("confirmation")
      ) {
        updatedAccountError.password_confirmation = "Password not matched";
      }
      if (email && email.length > 0) {
        updatedAccountError.email = email[0];
      }

      accountFormik.setErrors(updatedAccountError);
    }
  }, [apiError]);

  useEffect(() => {
    if (Object.values(updatedAccountError).length > 0) {
      setContinueState(false);
    }
  }, [updatedAccountError]);

  useEffect(() => {
    return () => {
      dispatch(CLEAR_API_ERRORS());
    };
  }, []);
  return (
    <>
      <AuthMainContainer>
        <Grid container>
          {/* <AuthImg item xs={12}> */}
          {/* <img src={computer} alt="Computer" /> */}
          {/* </AuthImg> */}
          {/* <AuthLogoContainer /> */}
          <Grid container display="flex" justifyContent="center">
            <AuthSection>
              <Grid item sx={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={LoginLogo}
                  alt=""
                  style={{ height: "36px", marginBottom: "28px" }}
                />
              </Grid>

              <FormContainer>
                <form onSubmit={accountFormik.handleSubmit}>
                  <Grid container spacing={2}>
                    <>
                      <>
                        <Grid item xs={6}>
                          <FormField
                            type="text"
                            label="First Name"
                            name="first_name"
                            placeholder="ABC"
                            variant="outlined"
                            size="small"
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon />
                                </InputAdornment>
                              ),
                            }}
                            value={accountFormik.values.first_name}
                            isTouched={accountFormik.touched.first_name}
                            error={
                              (accountFormik.touched.first_name &&
                                accountFormik.errors.first_name &&
                                accountFormik.errors.first_name) ||
                              (apiError?.first_name && apiError.first_name)
                            }
                            onBlur={accountFormik.handleBlur}
                            handleChange={accountFormik.handleChange}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormField
                            type="text"
                            label="Last Name"
                            placeholder="XYZ"
                            name="last_name"
                            variant="outlined"
                            size="small"
                            fullWidth
                            isTouched={accountFormik.touched.last_name}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                            value={accountFormik.values.last_name}
                            error={
                              (accountFormik.touched.last_name &&
                                accountFormik.errors.last_name &&
                                accountFormik.errors.last_name) ||
                              (apiError?.last_name && apiError.last_name)
                            }
                            onBlur={accountFormik.handleBlur}
                            handleChange={accountFormik.handleChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormField
                            type="email"
                            label="Email Address"
                            variant="outlined"
                            placeholder="username"
                            size="small"
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                            name="email"
                            value={accountFormik.values.email}
                            isTouched={accountFormik.touched.email}
                            error={
                              (accountFormik.touched.email &&
                                accountFormik.errors.email &&
                                accountFormik.errors.email) ||
                              (apiError?.email && apiError.email)
                            }
                            onBlur={accountFormik.handleBlur}
                            handleChange={accountFormik.handleChange}
                          />
                          <Typography
                            sx={{ paddingTop: "6px" }}
                            paddingLeft="4px"
                            variant="body2"
                          >
                            You can use letters, numbers & symbols
                          </Typography>
                        </Grid>

                        <Grid item xs={6} md={6}>
                          <FormField
                            type={showPass ? "text" : "password"}
                            label="Password"
                            password
                            placeholder="******"
                            variant="outlined"
                            size="small"
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                            name="password"
                            value={accountFormik.values.password}
                            isTouched={accountFormik.touched.password}
                            error={
                              (accountFormik.touched.password &&
                                accountFormik.errors.password &&
                                accountFormik.errors.password) ||
                              (apiError?.password && apiError.password)
                            }
                            onBlur={accountFormik.handleBlur}
                            handleChange={accountFormik.handleChange}
                          />
                        </Grid>

                        <Grid item xs={6} md={6}>
                          <FormField
                            type={showPass ? "text" : "password"}
                            label="Confirm Password"
                            variant="outlined"
                            placeholder="******"
                            size="small"
                            password
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                            name="password_confirmation"
                            value={accountFormik.values.password_confirmation}
                            isTouched={
                              accountFormik.touched.password_confirmation
                            }
                            error={
                              (accountFormik.touched.password_confirmation &&
                                accountFormik.errors.password_confirmation &&
                                accountFormik.errors.password_confirmation) ||
                              (apiError?.password_confirmation &&
                                apiError.password_confirmation)
                            }
                            onBlur={accountFormik.handleBlur}
                            handleChange={accountFormik.handleChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography paddingLeft="4px" variant="body2">
                            Use 8 or more characters with a mix of letters,
                            numbers & symbols
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <Checkbox
                            checked={showPass}
                            onChange={handleShowPassChange}
                          />{" "}
                          Show Password
                        </Grid>
                      </>
                    </>
                  </Grid>

                  {/* <AuthFooter justifyContent> */}
                  <Grid
                    item
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Grid item>
                      <Button
                        variant="text"
                        to="/login"
                        component={RouterLink}
                        sx={{
                          textTransform: "capitalize",
                          textDecoration: "underline",
                        }}
                      >
                        Sign in instead
                      </Button>
                    </Grid>
                    <Grid item>
                      <LoadingButton
                        variant="contained"
                        type="submit"
                        sx={{
                          textTransform: "capitalize",
                          background: "#2196F3",
                        }}
                        disabled={loading}
                        loading={loading}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Continue"
                        )}
                      </LoadingButton>

                      {/* <Button
												variant='contained'
												type='submit'
												sx={{ textTransform: 'capitalize' }}
												disabled={loading}
												// loading={companyFormik.isSubmitting}
											>
												{loading ? (
													<CircularProgress size={24} color='inherit' />
												) : (
													'Sign Up'
												)}
											</Button> */}
                    </Grid>
                  </Grid>
                  {/* </AuthFooter> */}
                </form>
              </FormContainer>
            </AuthSection>
            {/* </Grid> */}
          </Grid>
        </Grid>
      </AuthMainContainer>
    </>
  );
}
