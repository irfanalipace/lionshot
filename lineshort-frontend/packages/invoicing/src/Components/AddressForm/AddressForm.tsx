import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// mui components
import {
	Typography,
	Grid,
	Stack,
	TextareaAutosize,
	Divider,
	Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// Components
import FormField from '../InputField/FormField';
import InputLabel from '../InputLabel/InputLabel';
// import CloseBtn from "../closeBtn/CloseBtn";
import MUIButton from '../Button/MUIButton';

// apis:
import { getAllStatesApi } from '@/apis/customer';
import {
	createCustomerAddress,
	updateCustomerAddressApi,
} from '@/apis/invoice';
import notyf from '../NotificationMessage/notyfInstance';

const AddressForm = ({
	handleClose,
	type,
	address,
	customerList,
	customer_id,
	gettingCUstomerList,
	addressFormOpen,
}) => {
	const ADDRESS_KEY_ENUM = {
		shipping: 'customer_shipping_address',
		billing: 'customer_billing_address',
	};

	// console.log('address', address);
	// console.log('customerList', customerList);

	const [statesList, setStatesList] = useState<any>();
	const [stateOptions, setStateOptions] = useState([]);
	const [selectedState, setSelectedState] = useState<any>();
	const [selectedCountry, setSelectedCountry] = useState<any>();
	const [fieldError, setFieldError] = useState('');
	// console.log("selectedState", selectedCountry);

	// populdate data in the field when edit is true

	const initialValues = {
		attention: address?.attention || '',
		country_id: address?.country_id || '',
		city: address?.city || '',
		address: address?.address || '',
		address2: address?.address2 || '',
		zipcode: address?.zipcode || '',
		phone: address?.phone || '',
		fax: address?.fax || '',
		state_id: address?.state_id || '',
	};
	const validationSchema = Yup.object().shape({
		attention: Yup.string().required('Attention is required'),
		country_id: Yup.number().required('Country is required'),
		state_id: Yup.number().required('State is required'),
		address: Yup.string().required('Address is required'),
		address2: Yup.string().required('Address is required'),
	});

	//  useEffect(()=> {
	//  if(!addressFormOpen) {

	//  }
	//  } , [addressFormOpen])
	const handleSubmit = async (values, { setSubmitting }) => {
		// console.log("valuesss", values);
		try {
			if (address?.id) {
				const updatedData = {
					...values,
					customer_id,
					type,
				};
				const resp: any = await updateCustomerAddressApi(
					// calling update address api
					updatedData,
					address?.id
				);
				gettingCUstomerList();
				notyf.success(resp?.message);
				formik.resetForm();
				handleClose();
			} else {
				const resp: any = await createCustomerAddress({
					// calling add  address api
					...values,
					type,
					customer_id,
				});
				// setAddress([...customerList , {...values}])
				gettingCUstomerList();
				notyf.success(resp?.message);
				handleClose();
			}
		} catch (error) {
			console.log('error', error);
			setFieldError(error?.data?.errors);
			// notyf.error("Something went wrong");
		} finally {
			setSubmitting(false);
		}
	};

	//  formik
	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: handleSubmit,
	});

	// console.log('statesList' , statesList?.map(item => item?.country_id))

	// fetch state list
	const fetchingStates = async () => {
		try {
			const resp: any = await getAllStatesApi();
			setStatesList(resp?.data);
		} catch (error) {
			// Handle the error
		}
	};

	// states list / city list api
	useEffect(() => {
		fetchingStates();
	}, []);

	// state options / changing country_id will set its states
	const countries = [
		{
			value: 231,
			label: 'United States',
		},
	];
	useEffect(() => {
		if (address?.id) {
			setSelectedCountry(() => {
				const customerCountry = countries.filter(
					(country) => country.value === formik.values.country_id
				);
				// console.log("customerCountry", customerCountry);
				return customerCountry || null;
			});
		}
	}, [formik.values.country_id]);

	useEffect(() => {
		if (statesList?.length) {
			// console.log('statte@' ,statesList?.map(state => state.country_id) )
			setStateOptions(() => {
				return statesList
					?.filter((state) => state?.country_id === formik.values.country_id)
					?.map((state) => {
						return {
							label: state?.name,
							value: state?.id,
						};
					});
			});

			if (address?.id) {
				setSelectedState(() => {
					const customerState = statesList?.find(
						(state) => state?.id === formik.values?.state_id
					);
					return {
						label: customerState?.name,
						value: customerState?.id,
					};
				});
			}
		}
	}, [formik.values?.country_id, statesList]);

	// handle select  field on change
	const handleSelectChange = (selected, type) => {
		if (type === 'state_id') {
			setSelectedState(selected);
			formik.setFieldValue(type, selected.value);
		}
		if (type === 'country_id') {
			formik.setFieldValue(type, selected.value);
		}
	};
	//  styles
	const textAreaStyle = {
		width: '100%',
		borderRadius: '4px',
		borderColor: 'gray',
		padding: '5px',
		fontFamily: 'Roboto',
		margin: '.4rem 0',
	};

	const otherStyle = {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	};

	// clear error when modal close /unmount
	useEffect(() => {
		return () => {
			setFieldError('');
		};
	}, []);

	// handling backend error for fields
	useEffect(() => {
		if (fieldError) {
			for (const field in fieldError as any) {
				if (fieldError.hasOwnProperty(field)) {
					formik.setFieldError(field, fieldError[field][0]);
				}
			}
		}
	}, [fieldError]);
	// console.log('formik' , formik.values.state_id)
	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={2} paddingBottom='1rem'>
				<Grid
					item
					container
					spacing={2}
					display='flex'
					justifyContent='center'
					alignItems='center'>
					<Grid item xs={11}>
						<InputLabel>Attention</InputLabel>
						<FormField
							error={
								formik.touched.attention &&
								formik.errors.attention &&
								formik.errors.attention
							}
							isTouched={!!formik.touched.attention}
							name='attention'
							value={formik.values?.attention}
							onChange={formik.handleChange}
						/>
					</Grid>

					<Grid item xs={11}>
						<InputLabel>Country/ Region</InputLabel>
						{/* <SelectCountryJSX /> */}
						<Select
							id='country_id'
							name='country_id'
							placeholder='Select Country'
							isClearable={true}
							value={selectedCountry}
							// options={countries}
							options={countries?.map((option) => ({
								label: option.label,
								value: option.value,
							}))}
							onBlur={formik.handleBlur}
							onChange={(selectedOption) =>
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
								menu: (baseStyles) => ({
									...baseStyles,
									zIndex: 9999,
									fontFamily: 'Roboto',
								}),
							}}
						/>
						{formik.touched.country_id && formik.errors.country_id ? (
							<Typography color='error' variant='caption'>
								{formik.errors.country_id.toString()}
							</Typography>
						) : null}
					</Grid>

					<Grid item xs={11}>
						<InputLabel>Address</InputLabel>
						<TextareaAutosize
							minRows={2}
							aria-label='textarea'
							name='address'
							value={formik.values?.address}
							style={textAreaStyle}
							placeholder='Street 1'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{formik.touched.address && formik.errors.address ? (
							<Typography color='error' variant='caption'>
								{formik.errors.address.toString()}
							</Typography>
						) : null}
						<TextareaAutosize
							minRows={2}
							aria-label='textarea'
							name='address2'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values?.address2}
							style={textAreaStyle}
							placeholder='Street 2'
						/>
						{formik.touched.address2 && formik.errors.address2 ? (
							<Typography color='error' variant='caption'>
								{formik.errors.address2.toString()}
							</Typography>
						) : null}
					</Grid>
					<Grid item xs={11}>
						<InputLabel>City</InputLabel>
						<FormField
							id='city'
							name='city'
							placeholder='Select City'
							value={formik.values?.city}
							onChange={formik.handleChange}
							isTouched={!!formik.touched.cities}
							error={
								formik.touched.cities &&
								formik.errors.cities &&
								formik.errors.cities
							}
						/>
					</Grid>
					<Grid item container columnGap={6} style={otherStyle}>
						<Grid item xs={5}>
							<InputLabel>State</InputLabel>
							{/* <SelectStateJSX /> */}
							<Select
								id='state_id'
								name='state_id'
								placeholder='Select State'
								isClearable={true}
								value={selectedState}
								options={stateOptions}
								onChange={(selectedOption) =>
									handleSelectChange(selectedOption, 'state_id')
								}
								styles={{
									control: (baseStyles, state) => ({
										...baseStyles,
										fontFamily: 'Roboto',
									}),
									menu: (baseStyles) => ({
										...baseStyles,
										zIndex: 9999,
										fontFamily: 'Roboto',
									}),
								}}
							/>
							{formik.touched.state_id && formik.errors.state_id ? (
								<Typography color='error' variant='caption'>
									{formik.errors.state_id.toString()}
								</Typography>
							) : null}
						</Grid>
						<Grid item xs={5}>
							<InputLabel>Zip code</InputLabel>

							<FormField
								name='zipcode'
								value={formik.values?.zipcode}
								onChange={formik.handleChange}
							/>
						</Grid>
					</Grid>
					<Grid item container columnGap={6} style={otherStyle}>
						<Grid item xs={5}>
							<Typography variant='body2' my='.4rem'>
								Phone
							</Typography>
							<FormField
								name='phone'
								value={formik.values?.phone}
								onChange={formik.handleChange}
							/>
						</Grid>
						<Grid item xs={5}>
							<Typography variant='body2' my='.4rem'>
								Fax
							</Typography>
							<FormField
								name='fax'
								value={formik.values?.fax}
								onChange={formik.handleChange}
							/>
						</Grid>
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
							loading={formik.isSubmitting}>
							Save
						</LoadingButton>
						<MUIButton
							onClick={handleClose}
							variant='outlined'
							size='small'
							sx={{ margin: ' 0 1rem' }}>
							Cancel
						</MUIButton>
					</Stack>
				</Grid>
			</Grid>
		</form>
	);
};

export default AddressForm;
