import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import LockIcon from '@mui/icons-material/Lock';
import Alert from '@mui/material/Alert';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

// styles
import {
	AuthMainContainer,
	AuthSection,
	FormContainer,
	AuthTitle,
} from '../Auth/Components/Styles';

import FormField from '../../Components/InputField/FormField';
import { resetPassword } from '../../../core/store/auth/authThunks';
import AuthLogoContainer from './Components/AuthLogoContainer/AuthLogoContainer';
import { LoadingButton } from '@mui/lab';
import { CLEAR_API_ERRORS } from '../../../core/store/auth/authSlice';

// formik
const validationSchema = Yup.object().shape({
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

export default function ForgotPassword() {
	const apiError = useSelector(state => state?.auth?.apiError);
	const [errors, setErrors] = useState('');
	console.log('errorsvvv', errors);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	function cb() {
		formik.resetForm();
		navigate('/login');
	}
	const formik = useFormik({
		initialValues: {
			password: '',
			password_confirmation: '',
		},
		validationSchema: validationSchema,
		onSubmit: async (values, { setSubmitting }) => {
			try {
				await dispatch(resetPassword(values, cb));
			} catch (error) {
			} finally {
				setSubmitting(false);
			}
		},
	});

	// backend errors handling
	const backendFormError = {};
	console.log('backendFormError', backendFormError);
	useEffect(() => {
		if (apiError) {
			// email , token invalid in url
			const { email, token, password } = apiError;
			const newErrors = [];

			if (email && email.length > 0) {
				// const emailError = email[0];
				newErrors.push('Email Invalid... ');
			}

			if (token && token.length > 0) {
				// const tokenError = token[0];
				newErrors.push('Token Invalid');
			}
			setErrors(newErrors);
			// validation for password and confirm password
			if (
				password &&
				password.length > 0 &&
				!password[0].includes('confirmation')
			) {
				backendFormError.password = password[0];
			}
			if (
				password &&
				password.length > 0 &&
				password[0].includes('confirmation')
			) {
				backendFormError.password_confirmation = 'Password not matched';
			}
			formik.setErrors(backendFormError);
		}
	}, [apiError]);

	// if there is frontend validation error ,  hide email && token erros
	useEffect(() => {
		if (Object.values(formik.errors)) setErrors('');
	}, [formik.errors]);

	//  clear error when components unmount
	useEffect(() => {
		return () => {
			dispatch(CLEAR_API_ERRORS());
		};
	}, []);

	return (
		<AuthMainContainer>
			<Grid container>
				
				<Grid item container display='flex' justifyContent='center'>
					<Grid item>
						<AuthSection>
						<Grid item sx={{display:'flex', justifyContent:'center'}}>
						<AuthLogoContainer />
							</Grid>
							{/* <RouterLink
								to='/login'
								style={{ textDecoration: 'none', cursor: 'pointer' }}
							>
								<KeyboardBackspaceIcon />
							</RouterLink> */}
							<FormContainer>
								{errors.length > 0 && (
									<Alert severity='error'>
										{errors.map((error, index) => (
											<span key={index} style={{ padding: '0 4px' }}>
												{error}
											</span>
										))}
									</Alert>
								)}
								<AuthTitle variant='h6' component='body1'>
									Enter New Password
								</AuthTitle>
								<form onSubmit={formik.handleSubmit}>
									<FormField
										type='password'
										password
										fullWidth
										size='small'
										label='Re-type New Password'
										placeholder='******'
										variant='outlined'
										style={{ marginY: '.5rem' }}
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<LockIcon fontSize='small' />
												</InputAdornment>
											),
										}}
										onBlur={formik.handleBlur}
										id='password'
										name='password'
										isTouched={formik.touched.password}
										value={formik.values.password}
										onChange={formik.handleChange}
										error={
											(formik.touched.password &&
												formik.errors.password &&
												formik.errors.password) ||
											(backendFormError?.password && backendFormError.password)
										}
									/>
									<FormField
										type='password'
										password
										fullWidth
										size='small'
										label='Confirm Password'
										placeholder='******'
										variant='outlined'
										style={{ marginTop: '1.5rem' }}
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<LockIcon fontSize='small' />
												</InputAdornment>
											),
										}}
										isTouched={formik.touched.password_confirmation}
										name='password_confirmation'
										value={formik.values.password_confirmation}
										onBlur={formik.handleBlur}
										onChange={formik.handleChange}
										error={
											(formik.touched.password_confirmation &&
												formik.errors.password_confirmation &&
												formik.errors.password_confirmation) ||
											(backendFormError?.password_confirmation &&
												backendFormError.password_confirmation)
										}
									/>

									<LoadingButton
										type='submit'
										variant='contained'
										fullWidth
										disabled={formik.isSubmitting}
										loading={formik.isSubmitting}
										sx={{ marginTop: '1.5rem' }}
									>
										Submit
									</LoadingButton>
								</form>
							</FormContainer>
						</AuthSection>
					</Grid>
				</Grid>
			</Grid>
		</AuthMainContainer>
	);
}
