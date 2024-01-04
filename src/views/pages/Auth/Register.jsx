import React, { useEffect, useRef, useState } from 'react';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import LoginLogo from '../../../assets/images/logos/Logo-placeholder.png'
import {
	AuthFooter,
	AuthMainContainer,
	AuthSection,
	FormContainer,
	AuthTitle,
	StyledCheckboxStack,
	AuthImg,
	AuthSectionTwo,
} from '../Auth/Components/Styles';
import Checkbox from '@mui/material/Checkbox';
// import computer from "../../../assets/computer.png";
import FormField from '../../Components/InputField/FormField';
import { register } from '../../../core/store/auth/authThunks';
import AuthLogoContainer from './Components/AuthLogoContainer/AuthLogoContainer';
import { CLEAR_API_ERRORS } from '../../../core/store/auth/authSlice';
import { CheckBox } from '@mui/icons-material';
import { Divider } from '@mui/material';

const accountValidationSchema = Yup.object().shape({
	first_name: Yup.string().required('First Name is required'),
	last_name: Yup.string().required('Last Name is required'),
	email: Yup.string()
		.email('Invalid email format')
		.required('Email is required'),
	password: Yup.string()
		.required('Password is required')
		.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
		.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.matches(
			/[^a-zA-Z0-9]/,
			'Password must contain at least one special character'
		),
	password_confirmation: Yup.string()
		.oneOf([Yup.ref('password'), null], 'Passwords must match')
		.required('Confirm Password is required'),
});

const companyValidationSchema = Yup.object().shape({
	checkBoxState: Yup.string().notRequired(),
	company_name: Yup.string().when('checkBoxState', {
		is: 'create',
		then: () => Yup.string().required('Company name is required'),
		otherwise: () => Yup.string().notRequired(),
	}),
	company_phone_number: Yup.string().when('checkBoxState', {
		is: 'create',
		then: () =>
			Yup.string()
				.matches(/^\+[\d\s()-]+$/, 'Invalid phone number format')
				.required('Phone Number is required'),

		otherwise: () => Yup.string().notRequired(),
	}),
	company_logo: Yup.mixed().when('checkBoxState', {
		is: 'create',
		then: () =>
			Yup.mixed()
				.required('You need to provide a file')
				.test('fileSize', 'The file is too large', value => {
					if (!value) return true; // No file provided, consider it valid
					return value.size <= 2000000; // 2MB
				})
				.test(
					'fileType',
					'Only the following formats are accepted: .jpeg, .jpg, .png',
					value => {
						if (!value) return true; // No file provided, consider it valid

						const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png'];

						return supportedFormats.includes(value.type);
					}
				),
		otherwise: () => Yup.mixed().notRequired(),
	}),

	company_code: Yup.string().when('checkBoxState', {
		is: 'join',
		then: () => Yup.string().required('Company Code is required'),

		otherwise: () => Yup.string().notRequired(),
	}),
});

export default function Register() {
	const navigate = useNavigate();
	const apiError = useSelector(state => state?.auth?.apiError);
	const dispatch = useDispatch();
	const [showPass, setShowPass] = useState(false);
	const [continueState, setContinueState] = useState(false);
	// const [company_logo, setcompany_logo] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);

	const [loading, setLoading] = useState(false);
	
	// ... (other state and formik setup)
  
	const handleShowPassChange = () => {
	  setShowPass(!showPass);
	};
	const handleAccountSubmit = async (values, { setSubmitting }) => {
		try {
			setSubmitting(true);
			setContinueState(true);
		} catch (error) {
			console.log('reg error', error);
		} finally {
			setSubmitting(false);
		}
	};

	const accountFormik = useFormik({
		initialValues: {
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			password_confirmation: '',
		},
		validationSchema: accountValidationSchema,
		onSubmit: handleAccountSubmit,
	});

	const handleCompanySubmit = async (values, { setSubmitting }) => {
		const combinedValues = {
			...accountFormik.values,
			...values,
		};

		// api request ... form submiting
		function cb(params) {
			if (params === 'catch') {
				setLoading(false);
			} else {
				companyFormik.resetForm();
				accountFormik.resetForm();
				setLoading(false);
				navigate('/login');
			}
		}

		try {
			// setSubmitting(true);
			setLoading(true);

			dispatch(register(combinedValues, cb));
			setSubmitting(false);
		} catch (error) {
			// companyFormik.setErrors(error?.data?.errors);
			setLoading(false);
		} finally {
		}
	};

	const companyFormik = useFormik({
		initialValues: {
			company_name: '',
			company_phone_number: '',
			company_code: '8907',
			checkBoxState: 'create',
			company_create: '',
			company_logo: null,
		},
		validationSchema: companyValidationSchema,
		onSubmit: handleCompanySubmit,
	});
	useEffect(() => {
		if (companyFormik.values.checkBoxState === 'create') {
			companyFormik?.setFieldValue('company_create', 1);
		} else {
			companyFormik?.setFieldValue('company_create', 0);
		}
	}, [companyFormik?.values?.checkBoxState]);

	const handleRadioChange = event => {
		companyFormik.setFieldValue('checkBoxState', event.target.value);
	};

	// backend api error handling with field
	const updatedAccountError = {};
	const updatedCompanyError = {};
	useEffect(() => {
		if (apiError) {
			const {
				email,
				company_name,
				company_phone_number,
				first_name,
				last_name,
				password,
				password_confirmation,
				company_logo,
			} = apiError;
			// Update specific error messages for account form
			if (first_name && first_name.length > 0) {
				updatedAccountError.first_name = first_name[0];
			}
			if (last_name && last_name.length > 0) {
				updatedAccountError.last_name = last_name[0];
			}
			if (
				password &&
				password.length > 0 &&
				!password[0].includes('confirmation')
			) {
				updatedAccountError.password = password[0];
			}
			if (
				password &&
				password.length > 0 &&
				password[0].includes('confirmation')
			) {
				updatedAccountError.password_confirmation = 'Password not matched';
			}
			if (email && email.length > 0) {
				updatedAccountError.email = email[0];
			}
			// Update specific error messages for company form
			if (company_name && company_name.length > 0) {
				updatedCompanyError.company_name = company_name[0];
			}
			if (company_phone_number && company_phone_number.length > 0) {
				updatedCompanyError.company_phone_number = company_phone_number[0];
			}
			if (company_logo && company_logo.length > 0) {
				updatedCompanyError.company_logo = company_logo[0];
			}
			accountFormik.setErrors(updatedAccountError);
			companyFormik.setErrors(updatedCompanyError);
		}
	}, [apiError]);

	// if there is error in account form , show the account form again
	useEffect(() => {
		if (Object.values(updatedAccountError).length > 0) {
			setContinueState(false);
		}
	}, [updatedAccountError]);

	//  clear error when components unmount
	useEffect(() => {
		return () => {
			dispatch(CLEAR_API_ERRORS());
		};
	}, []);

	const handleCompanyLogoChange = event => {
		const file = event.currentTarget.files[0];
		companyFormik.setFieldValue('company_logo', file);
		if (file) {
			setSelectedFile(file);
		}
	};
	const fileInputRef = useRef(null);
	const openFileInput = () => {
		fileInputRef.current.click();
	};

	console.log('loading', companyFormik.values.company_logo);
	return (
		<>
			<AuthMainContainer>
				<Grid container>
					{/* <AuthImg item xs={12}> */}
					{/* <img src={computer} alt="Computer" /> */}
					{/* </AuthImg> */}
					{/* <AuthLogoContainer /> */}
					<Grid container display='flex' justifyContent='center'>
						<AuthSection>
						<Grid item sx={{display:'flex', justifyContent:'center'}}>
							<img src={LoginLogo} alt=''  style={{height:'36px'}}/>
							</Grid>
							{continueState && (
								<KeyboardBackspaceIcon
									style={{ cursor: 'pointer' }}
									onClick={() => setContinueState(false)}
								/>
							)}

							<FormContainer>
								<form
									onSubmit={
										!continueState
											? accountFormik.handleSubmit
											: companyFormik.handleSubmit
									}
								>
									<Grid container spacing={2}>
										<Grid item xs={12}>
											{/* {!continueState ? (
												<AuthTitle variant='h6' component='body1'>
													Create Your Account
													<Divider></Divider>
												</AuthTitle>
												
											) : (
												<AuthTitle
													sx={{ marginTop: '10px' }}
													variant='h6'
													component='body1'
												>
													Create Your Company
												</AuthTitle>
											)} */}

												<AuthTitle variant='h6' component='body1'>
													Create Your Account
													
												</AuthTitle>
												<Divider sx={{padding:'0px'}}></Divider>
										</Grid>
										{continueState && (
											<Grid
												item
												xs={12}
												sx={{
													display: 'flex',
													justifyContent: 'start',
													alignItems: 'start',
												}}
											>
												<FormControl>
													<RadioGroup
														aria-labelledby='demo-radio-buttons-group-label'
														defaultValue={'create'}
														onChange={handleRadioChange}
														style={{
															display: 'flex',
															flexDirection: 'row',
															alignItems: 'start',
															marginLeft: '.7rem',
														}}
													>
														<FormControlLabel
															value='create'
															control={<Radio />}
															label='Create'
														/>
														<FormControlLabel
															value='join'
															control={<Radio />}
															label='Join'
														/>
													</RadioGroup>
												</FormControl>
											</Grid>
										)}

										<>
											{continueState && (
												<>
													{companyFormik.values.checkBoxState === 'create' && (
														<>
															<Grid item xs={12}>
																<Button
																	disableRipple
																	disableFocusRipple
																	variant='outlined'
																	onClick={openFileInput}
																	fullWidth
																	sx={{
																		display: 'flex',
																		justifyContent: 'start',
																		textTransform: 'capitalize',
																		padding: '8.5px 14px',
																		fontWeight: 400,
																		fontFamily: 'Roboto',
																		borderColor:
																			companyFormik.touched.company_logo &&
																			companyFormik.errors.company_logo
																				? 'red'
																				: 'rgba(0, 0, 0, 0.2)',
																		color: selectedFile
																			? 'rgba(0, 0, 0, 0.8)'
																			: 'grey',
																		fontSize: '13px',
																		'&:focus': {
																			outline: 'none',
																			boxShadow: 'none',
																			background: 'white',
																			borderWidth: '1px',
																			// borderColor:'#FC8F31',
																		},
																		'&:hover': {
																			borderColor: 'black',
																			background: 'white',
																			outline: 'none',
																			boxShadow: 'none',
																			borderWidth: '1px',
																		},
																	}}
																	startIcon={<PhotoCameraIcon color='grey' />}
																>
																	{selectedFile
																		? selectedFile.name
																		: 'Upload Image'}
																</Button>
																<input
																	type='file'
																	ref={fileInputRef}
																	style={{ display: 'none' }}
																	onChange={handleCompanyLogoChange}
																	accept='.jpeg, .jpg, .png'
																/>

																<Typography
																	variant='caption'
																	color='error'
																	ml={2}
																	sx={{
																		display: companyFormik.errors.company_logo
																			? 'block'
																			: 'none',
																	}}
																>
																	{(companyFormik.touched.company_logo &&
																		companyFormik.errors.company_logo &&
																		companyFormik.errors.company_logo) ||
																		(apiError?.company_logo &&
																			apiError?.company_logo)}
																</Typography>
															</Grid>

															<Grid item xs={12}>
																<FormField
																	value={companyFormik.values.company_name}
																	onChange={companyFormik.handleChange}
																	isTouched={companyFormik.touched.company_name}
																	placeholder={' ABC'}
																	onBlur={companyFormik.handleBlur}
																	error={
																		(companyFormik.touched.company_name &&
																			companyFormik.errors.company_name &&
																			companyFormik.errors.company_name) ||
																		(apiError?.company_name &&
																			apiError.company_name)
																	}
																	type='text'
																	fullWidth
																	name='company_name'
																	size='small'
																	label='Company Name'
																	variant='outlined'
																	InputProps={{
																		startAdornment: (
																			<InputAdornment position='start'>
																				<ApartmentIcon fontSize='small' />
																			</InputAdornment>
																		),
																	}}
																/>
															</Grid>
															<Grid item xs={12}>
																<FormField
																	type='text'
																	name='company_phone_number'
																	fullWidth
																	size='small'
																	placeholder=' +1 (123) 456-7890'
																	label='Phone Number'
																	value={
																		companyFormik.values.company_phone_number
																	}
																	isTouched={
																		companyFormik.touched.company_phone_number
																	}
																	onBlur={companyFormik.handleBlur}
																	onChange={companyFormik.handleChange}
																	error={
																		(companyFormik.touched
																			.company_phone_number &&
																			companyFormik.errors
																				.company_phone_number &&
																			companyFormik.errors
																				.company_phone_number) ||
																		(apiError?.company_phone_number &&
																			apiError.company_phone_number)
																	}
																	variant='outlined'
																	InputProps={{
																		startAdornment: (
																			<InputAdornment position='start'>
																				<TabletMacIcon fontSize='small' />
																			</InputAdornment>
																		),
																	}}
																/>
															</Grid>
														</>
													)}

													{companyFormik.values.checkBoxState === 'join' && (
														<FormField
															type='text'
															fullWidth
															size='small'
															label='Company Code'
															variant='outlined'
															name='company_code'
															isTouched={companyFormik.touched.company_code}
															onBlur={companyFormik.handleBlur}
															value={companyFormik.values.company_code}
															onChange={companyFormik.handleChange}
															error={
																(companyFormik.touched.company_code &&
																	companyFormik.errors.company_code &&
																	companyFormik.errors.company_code) ||
																(apiError?.company_code &&
																	apiError.company_code)
															}
															sx={{ marginY: '.8rem' }}
															InputProps={{
																startAdornment: (
																	<InputAdornment position='start'>
																		<ApartmentIcon fontSize='small' />
																	</InputAdornment>
																),
															}}
														/>
													)}
												</>
											)}
											<>
												{!continueState && (
													<>
														<Grid item xs={6}>
															<FormField
																type='text'
																label='First Name'
																name='first_name'
																placeholder='ABC'
																variant='outlined'
																size='small'
																fullWidth
																InputProps={{
																	startAdornment: (
																		<InputAdornment position='start'>
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
																type='text'
																label='Last Name'
																placeholder='XYZ'
																name='last_name'
																variant='outlined'
																size='small'
																fullWidth
																isTouched={accountFormik.touched.last_name}
																InputProps={{
																	startAdornment: (
																		<InputAdornment position='start'>
																			<PersonIcon fontSize='small' />
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
																type='email'
																label='Email Address'
																variant='outlined'
																placeholder='username'
																size='small'
																fullWidth
																InputProps={{
																	startAdornment: (
																		<InputAdornment position='start'>
																			<EmailIcon fontSize='small' />
																		</InputAdornment>
																	),
																}}
																name='email'
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
															<Typography sx={{paddingTop:'6px'}} paddingLeft='4px' variant='body2'>You can use letters, numbers & symbols</Typography>
														</Grid>
															
														<Grid item xs={6} md={6}>
															<FormField
																type={showPass ? 'text' : 'password'}
																label='Password'
																password
																placeholder='******'
																variant='outlined'
																size='small'
																fullWidth
																InputProps={{
																	startAdornment: (
																		<InputAdornment position='start'>
																			<LockIcon fontSize='small' />
																		</InputAdornment>
																	),
																}}
																name='password'
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
																type={showPass ? 'text' : 'password'}
																label='Confirm Password'
																variant='outlined'
																placeholder='******'
																size='small'
																password
																fullWidth
																InputProps={{
																	startAdornment: (
																		<InputAdornment position='start'>
																			<LockIcon fontSize='small' />
																		</InputAdornment>
																	),
																}}
																name='password_confirmation'
																value={
																	accountFormik.values.password_confirmation
																}
																isTouched={
																	accountFormik.touched.password_confirmation
																}
																error={
																	(accountFormik.touched
																		.password_confirmation &&
																		accountFormik.errors
																			.password_confirmation &&
																		accountFormik.errors
																			.password_confirmation) ||
																	(apiError?.password_confirmation &&
																		apiError.password_confirmation)
																}
																onBlur={accountFormik.handleBlur}
																handleChange={accountFormik.handleChange}
															/>
														</Grid>
														<Grid item xs={12}>
															<Typography paddingLeft='4px' variant='body2'>
																Use 8 or more characters with a mix of letters,
																numbers & symbols
															</Typography>
														</Grid>

														<Grid item xs={12}>
				<Checkbox checked={showPass} onChange={handleShowPassChange} /> Show Password
			</Grid>
													</>
												)}
											</>
										</>

										{/* {!continueState && (
                      <>
                        <Grid item xs={12}>
                          <StyledCheckboxStack>
                            <Checkbox
                              size="small"
                              onClick={() => setShowPass(!showPass)}
                            />
                            <Typography variant="body2">
                              Show Password
                            </Typography>
                          </StyledCheckboxStack>
                        </Grid>
                      </>
                    )} */}
									</Grid>
									{/* <AuthFooter  >
                    {!continueState ? (
                      <Button
                        variant="text"
                        to="/login"
                        component={RouterLink}
                        sx={{ textTransform: "capitalize" }}
                      >
                        Sign In
                      </Button>
                    ) : (
                      <Button
                        variant="text"
                        // to="/login"
                        // component={RouterLink}
                        sx={{ textTransform: "capitalize" }}
                      >
                      
                      </Button>
                    )} */}
									{/* <AuthFooter justifyContent> */}
									<Grid item sx={{display:'flex', justifyContent:'space-between'}}>
									<Grid item>
										{!continueState && (
											<Button
												variant='text'
												to='/login'
												component={RouterLink}
												sx={{ textTransform: 'capitalize', textDecoration:'underline', }}
											>
												Sign in instead
											</Button>
										)}

										</Grid>
									    <Grid item>
										{!continueState ? (
											<LoadingButton
											
												variant='contained'

												type='submit'
												sx={{ textTransform: 'capitalize',background:'#2196F3' }}
												disabled={accountFormik.isSubmitting}
												loading={accountFormik.isSubmitting}
											>
												Continue
											</LoadingButton>
										) : (
											<Button
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
											</Button>
										)}
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
