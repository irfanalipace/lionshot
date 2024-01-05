import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// mui components
import {
	Typography,
	Grid,
	Stack,
	TextareaAutosize,
	Divider,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
// Components
import FormField from '../../InputField/FormField';
import InputLabel from '../../InputLabel/InputLabel';
// import CloseBtn from "../closeBtn/CloseBtn";
import MUIButton from '../../Button/MUIButton';
import {
	createCustomerAddress,
	updateCustomerAddressApi,
} from '../../../../core/api/estimate';
import notyf from '../../NotificationMessage/notyfInstance';
import { phoneRegExp } from '../../../../core/utils/helpers';
import {
	getAllCountriesApi,
	getAllStatesApi,
} from '../../../../core/api/others';
import {
	createVendorAddress,
	updateVendorAddressApi,
} from '../../../../core/api/vendor';

const AddressForm = ({ type, address, onSave, onClose, userId, userType }) => {
	const API_ENUMS = {
		customer: {
			create: createCustomerAddress,
			update: updateCustomerAddressApi,
		},
		vendor: {
			create: createVendorAddress,
			update: updateVendorAddressApi,
		},
	};
	const API_KEY_ENUM = {
		customer: 'customer_id',
		vendor: 'vendor_id',
	};
	const [CountryStates, setCountryStates] = useState();
	const [allCountries, setAllCountries] = useState();
	const initialValues = {
		attention: address?.attention || '',
		country_id: address?.country_id || '',
		city: address?.city || '',
		address: address?.address || '',
		address2: address?.address2 || null,
		zipcode: address?.zipcode || '',
		phone: address?.phone || '',
		...(userType === 'vendor' ? {} : { fax: address?.fax || '' }),
		state_id: address?.state_id || '',
	};
	const validationSchema = Yup.object().shape({
		attention: Yup.string().required('Name is required'),
		country_id: Yup.number().required('Country is required'),
		state_id: Yup.number().required('State is required'),
		address: Yup.string().required('Address is required'),
		city: Yup.string().required('City is required'),
		zipcode: Yup.string().required('Zip Code is required'),
		phone: Yup.string()
			.matches(phoneRegExp, 'Invalid phone number')
			.nullable('Phone is required'),
		fax: Yup.string().matches(phoneRegExp, 'Invalid Fax number'),
	});
	let resp;
	const handleSubmit = async (values, { setSubmitting }) => {
		if (address?.id) {
			try {
				const updatedData = {
					...values,
					[API_KEY_ENUM[userType]]: userId,
					type,
				};
				if (userType === 'customer') {
					resp = await API_ENUMS[userType].update(updatedData, address?.id);
				} else if (userType === 'vendor') {
					resp = await API_ENUMS[userType].update(updatedData, address?.id);
				}
				notyf.success(resp?.message);
				onClose();
				onSave();
			} catch (error) {
				// formik.setErrors(error.errors.data);
				formik.setErrors(error.data.errors);
			}
		} else {
			try {
				const updatedData = {
					...values,
					[API_KEY_ENUM[userType]]: userId,
					type,
				};
				if (userType === 'customer') {
					resp = await API_ENUMS[userType].create(updatedData);
				} else if (userType === 'vendor') {
					resp = await API_ENUMS[userType].create(updatedData);
				}
				notyf.success(resp?.message);
				onClose();
				onSave();
			} catch (error) {
				formik.setErrors(error.data.errors);
			} finally {
				setSubmitting(false);
			}
		}
	};

	//  formik
	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: handleSubmit,
	});
	// get countries
	const getCountriesFromApi = async () => {
		try {
			const countries = await getAllCountriesApi();
			setAllCountries(
				countries?.data?.map(state => {
					return {
						value: state?.id,
						text: state?.name,
					};
				})
			);
		} catch (e) {
			console.log('e', e);
		}
	};

	// fetch state list
	const fetchingStates = async () => {
		const params = { country_id: formik.values.country_id };
		try {
			const resp = await getAllStatesApi(params);
			setCountryStates(
				resp?.data?.map(state => {
					return {
						value: state?.id,
						text: state?.name,
					};
				})
			);
			// setStatesList(resp?.data);
		} catch (error) {
			// Handle the error
		}
	};
	// states list / city list api
	useEffect(() => {
		fetchingStates();
	}, [formik.values.country_id]);
	useEffect(() => {
		getCountriesFromApi();
	}, []);

	// state options / changing country_id will set its states
	// const countries = [
	// 	{
	// 		value: 231,
	// 		label: 'United States',
	// 	},
	// ];
	// useEffect(() => {
	// 	if (address?.id) {
	// 		setSelectedCountry(() => {
	// 			const customerCountry = countries.filter(
	// 				country => country.value === formik.values.country_id
	// 			);
	// 			return customerCountry || null;
	// 		});
	// 	}
	// }, [formik.values.country_id]);

	// useEffect(() => {
	// 	if (statesList?.length) {
	// 		setStateOptions(() => {
	// 			return statesList
	// 				?.filter(state => state?.country_id === formik.values.country_id)
	// 				?.map(state => {
	// 					return {
	// 						label: state?.name,

	// 						value: state?.id,
	// 					};
	// 				});
	// 		});

	// 		if (address?.id && address?.state_id) {
	// 			setSelectedState(() => {
	// 				const customerState = statesList?.find(
	// 					state => state?.id === formik.values?.state_id
	// 				);
	// 				return {
	// 					label: customerState?.name,
	// 					value: customerState?.id,
	// 				};
	// 			});
	// 		}
	// 	}
	// }, [statesList, formik.values.state_id, formik.values.country_id]);

	// handle select  field on change
	// const handleSelectChange = (selected, type) => {
	// 	if (type === 'state_id') {
	// 		setSelectedState(selected);
	// 	}
	// 	if (type === 'country_id') {
	// 		setSelectedCountry(selected);
	// 	}

	// 	// set value to formik key for null or for selected value
	// 	if (selected !== null && selected !== undefined) {
	// 		formik.setFieldValue(type, selected.value);
	// 	} else if (selected === null || selected === undefined) {
	// 		formik.setFieldValue(type, '');
	// 	}
	// };

	//  styles
	const textAreaStyle = {
		width: '100%',
		borderRadius: '4px',
		borderColor: 'grey',
		padding: '5px',
		fontFamily: 'Roboto',
		margin: '.4rem 0',
		fontSize: '13.5px',
	};

	const otherStyle = {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	};
	console.log('formik.values', formik.errors);
	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={2} paddingBottom='1rem'>
				<Grid
					item
					container
					spacing={2}
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					<Grid item xs={11}>
						{/* <InputLabel>Name</InputLabel> */}
						<FormField
							placeholder='Name'
							error={
								formik.touched.attention &&
								formik.errors.attention &&
								formik.errors.attention
							}
							isTouched={formik.touched.attention}
							name='attention'
							value={formik.values?.attention}
							onChange={formik.handleChange}
							label={'Name'}
						/>
					</Grid>

					<Grid item xs={11}>
						<InputLabel>Country/ Region</InputLabel>
						{/* <SelectCountryJSX /> */}
						{/* <Select
							id='country_id'
							name='country_id'
							placeholder='Select Country'
							isClearable={true}
							value={selectedCountry}
							// options={countries}
							options={allCountries?.map(country => ({
								value: country?.id,
								text: country?.name,
							}))}
							onBlur={formik.handleBlur}
							onChange={selectedOption =>
								handleSelectChange(selectedOption, 'country_id')
							}
							styles={{
								control: (baseStyles, state) => ({
									...baseStyles,
									fontFamily: 'Roboto',
									background: 'transparent',
									borderColor:
										formik.touched.country_id && formik.errors.country_id
											? 'red'
											: 'rgba(0, 0, 0, 0.2)', // Customize border color based on error state
								}),
								menu: baseStyles => ({
									...baseStyles,
									zIndex: 9999,
									fontFamily: 'Roboto',
								}),
							}}
						/> */}
						<FormField
							id='country_id'
							value={formik.values?.country_id}
							error={formik.errors?.country_id}
							handleChange={formik.handleChange}
							onBlur={formik.handleBlur}
							isTouched={formik.touched?.country_id}
							label={'Country'}
							type={'select'}
							options={allCountries}
							fullWidth
							required
						/>
						{formik.touched.country_id && formik.errors.country_id ? (
							<Typography color='error' variant='caption'>
								{formik.errors.country_id}
							</Typography>
						) : null}
					</Grid>

					<Grid item xs={11}>
						<InputLabel>Address</InputLabel>
						<TextareaAutosize
							minRows={2}
							aria-label='textarea'
							name='address'
							value={formik.values?.address || ''}
							style={textAreaStyle}
							placeholder='Street 1'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{formik.touched.address && formik.errors.address ? (
							<Typography color='error' variant='caption'>
								{formik.errors.address}
							</Typography>
						) : null}
						<TextareaAutosize
							minRows={2}
							aria-label='textarea'
							name='address2'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values?.address2 || ''}
							style={textAreaStyle}
							placeholder='Street 2'
						/>
						{formik.touched.address2 && formik.errors.address2 ? (
							<Typography color='error' variant='caption'>
								{formik.errors.address2}
							</Typography>
						) : null}
					</Grid>
					<Grid item xs={11}>
						{/* <InputLabel>City</InputLabel> */}
						<FormField
							label={'City'}
							id='city'
							name='city'
							placeholder='Select City'
							value={formik.values?.city}
							onChange={formik.handleChange}
							isTouched={formik.touched.cities}
						/>
						{formik.touched.city && formik.errors.city ? (
							<Typography color='error' variant='caption'>
								{formik.errors.city}
							</Typography>
						) : null}
					</Grid>
					<Grid item container columnGap={6} style={otherStyle}>
						<Grid item xs={5}>
							{/* <SelectStateJSX /> */}
							{/* <Select
								id='state_id'
								name='state_id'
								placeholder='Select State'
								isClearable={true}
								value={selectedState}
								options={stateOptions}
								onChange={selectedOption =>
									handleSelectChange(selectedOption, 'state_id')
								}
								styles={{
									control: (baseStyles, state) => ({
										...baseStyles,
										fontFamily: 'Roboto',
										background: 'transparent',
										borderColor:
											formik.touched.state_id && formik.errors.state_id
												? 'red'
												: 'rgba(0, 0, 0, 0.2)',
									}),
									menu: baseStyles => ({
										...baseStyles,
										zIndex: 9999,
										fontFamily: 'Roboto',
									}),
								}}
							/> */}
							<FormField
								id='state_id'
								value={formik.values?.state_id}
								handleChange={formik.handleChange}
								error={formik.errors?.state_id}
								onBlur={formik.handleBlur}
								isTouched={formik.touched?.state_id}
								label={'State'}
								fullWidth
								required
								type={'select'}
								options={CountryStates}
							/>
						</Grid>
						<Grid item xs={5}>
							<FormField
								label={'Zip Code'}
								placeholder='Zip code'
								name='zipcode'
								value={formik.values?.zipcode}
								onChange={formik.handleChange}
								error={formik.errors?.zipcode}
								onBlur={formik.handleBlur}
								isTouched={formik.touched?.zipcode}
							/>
						</Grid>
					</Grid>
					<Grid item container columnGap={6} style={otherStyle}>
						<Grid item xs={11}>
							<Typography variant='body2' my='.4rem'>
								Phone
							</Typography>
							<FormField
								label={'Phone'}
								name='phone'
								value={formik.values?.phone}
								onChange={formik.handleChange}
								isTouched={formik.touched.phone}
								error={
									formik.touched.phone &&
									formik.errors.phone &&
									formik.errors.phone
								}
							/>
						</Grid>
						{userType === 'customer' && (
							<Grid item xs={11}>
								<Typography variant='body2' my='.4rem'>
									Fax
								</Typography>
								<FormField
									label={'Fax'}
									name='fax'
									value={formik.values?.fax}
									onChange={formik.handleChange}
									isTouched={formik.touched.fax}
									error={
										formik.touched.fax && formik.errors.fax && formik.errors.fax
									}
								/>
							</Grid>
						)}
					</Grid>
					<Grid item xs={11}>
						<Typography variant='body2'>
							Note:
							<Typography component='span' variant='body2Grey'>
								Changes made will be update in this contact
							</Typography>
						</Typography>
					</Grid>
				</Grid>

				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12} pl='1rem'>
					<Stack direction='row' pl='1rem'>
						<LoadingButton
							type='submit'
							variant='contained'
							disabled={formik.isSubmitting}
							loading={formik.isSubmitting}
						>
							Save
						</LoadingButton>
						<MUIButton
							onClick={onClose}
							variant='outlined'
							size='small'
							sx={{ margin: ' 0 1rem' }}
						>
							Cancel
						</MUIButton>
					</Stack>
				</Grid>
			</Grid>
		</form>
	);
};

export default AddressForm;
