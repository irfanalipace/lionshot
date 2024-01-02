import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import ApartmentIcon from '@mui/icons-material/Apartment';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import { Link as RouterLink } from 'react-router-dom';

// Styles
import {
	AuthFooter,
	AuthMainContainer,
	AuthSection,
	FormContainer,
	AuthTitle,
	AuthSectionTwo,
	AuthImg,
} from '../Auth/Components/Styles';

// Components
import FormField from '../../Components/InputField/FormField';
import computer from '../../../assets/computer.png';

// time_zone: Yup.string().when("send_immediately", {
//   is: false,
//   then: () => Yup.string().required("Time Zone is required"),
// }),

const validationSchema = Yup.object().shape({
	companyName: Yup.string().when('checkBoxState', {
		is: 'create',
		then: Yup.string().required('Company name is required'),
	}),
	phoneNumber: Yup.string().when('checkBoxState', {
		is: 'create',
		then: Yup.string().required('Phone number is required'),
	}),
	companyCode: Yup.string().when('checkBoxState', {
		is: 'join',
		then: Yup.string().required('Company Code is required'),
	}),
});

const initialValues = {
	companyName: '',
	phoneNumber: '',
	companyCode: '',
	checkBoxState: 'create',
};

const CreateCompany = () => {
	const handleSubmit = values => {
		console.log('Form values:', values);
	};

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: handleSubmit,
	});

	const handleRadioChange = event => {
		formik.setFieldValue('checkBoxState', event.target.value);
	};

	return (
		<AuthMainContainer>
			<Grid container>
				<Grid item xs={12}>
					<AuthImg>
						<img src={computer} alt='Computer' />
					</AuthImg>
				</Grid>

				<Grid item container display='flex' justifyContent='center'>
					<Grid item xs={12} display='flex' justifyContent='center'>
						<AuthSectionTwo>
							<FormContainer>
								<Grid item xs={12}>
									<AuthTitle variant='h6' component='body1'>
										Create Your Company
									</AuthTitle>
								</Grid>
								<AuthSection>
									<form onSubmit={formik.handleSubmit}>
										<Grid item sx={12}>
											<FormControl style={{ width: '100%' }}>
												<RadioGroup
													aria-labelledby='demo-radio-buttons-group-label'
													defaultValue='create'
													onChange={handleRadioChange}
													style={{
														display: 'flex',
														flexDirection: 'row',
														alignItems: 'start',
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

											{/* When create is checked */}
											{formik.values.checkBoxState === 'create' && (
												<>
													<FormField
														value={formik.values.companyName}
														onChange={formik.handleChange}
														error={
															formik.touched.companyName &&
															formik.errors.companyName
														}
														type='text'
														fullWidth
														name='companyName'
														size='small'
														label='Company Name'
														variant='outlined'
														sx={{ marginY: '.8rem' }}
														InputProps={{
															startAdornment: (
																<InputAdornment position='start'>
																	<ApartmentIcon fontSize='small' />
																</InputAdornment>
															),
														}}
													/>
													<FormField
														type='text'
														name='phoneNumber'
														fullWidth
														size='small'
														label='Phone Number'
														value={formik.values.phoneNumber}
														onChange={formik.handleChange}
														error={
															formik.touched.phoneNumber &&
															formik.errors.phoneNumber
														}
														variant='outlined'
														sx={{ marginY: '.8rem' }}
														InputProps={{
															startAdornment: (
																<InputAdornment position='start'>
																	<TabletMacIcon fontSize='small' />
																</InputAdornment>
															),
														}}
													/>
												</>
											)}

											{formik.values.checkBoxState === 'join' && (
												<FormField
													type='text'
													fullWidth
													size='small'
													label='Company Code'
													variant='outlined'
													name='companyCode'
													value={formik.values.companyCode}
													onChange={formik.handleChange}
													error={
														formik.touched.companyCode &&
														formik.errors.companyCode
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
										</Grid>
										<AuthFooter>
											<Button
												variant='text'
												component={RouterLink}
												sx={{ textTransform: 'capitalize' }}
											>
												Skip Now
											</Button>
											<Button
												type='submit'
												variant='contained'
												sx={{ textTransform: 'capitalize' }}
											>
												Continue
											</Button>
										</AuthFooter>
									</form>
								</AuthSection>
							</FormContainer>
						</AuthSectionTwo>
					</Grid>
					<Grid item></Grid>
				</Grid>
			</Grid>
		</AuthMainContainer>
	);
};

export default CreateCompany;
