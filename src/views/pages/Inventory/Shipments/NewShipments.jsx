import React, { useState, useEffect, useRef } from 'react';
import {
	Button,
	Divider,
	FormControlLabel,
	Grid,
	IconButton,
	InputAdornment,
	Paper,
	Radio,
	RadioGroup,
	Tab,
	Tabs,
	Typography,
} from '@mui/material';
import * as Yup from 'yup';

import SwapVertIcon from '@mui/icons-material/SwapVert';
import Loop from '@mui/icons-material/Loop';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Add from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { useParams, useNavigate } from 'react-router-dom';
import {
	decryptId,
	formatDate,
	formatDateToYYYYMMDD,
	goBack,
} from '../../../../core/utils/helpers';
import { useFormik } from 'formik';

import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import FormField from '../../../Components/InputField/FormField';
import MUIButton from '../../../Components/Button/MUIButton';
import PackageModal from './PackageModal';
import {
	CreateShipmentPackageApi,
	createShipment,
	getFedExApiCall,
	getRatesFedexApi,
} from '../../../../core/api/shipments';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import PrintModal from './PrintModal';
import ShippingOptionsModal from './ShippingOptionsModal';

function GridRow({ children, style, sx, columnSpacingMd, ...rest }) {
	return (
		<>
			<Grid
				container
				rowSpacing={1}
				{...rest}
				columnSpacing={{
					xs: 1,
					sm: 2,
					md: columnSpacingMd !== undefined ? columnSpacingMd : 1.5,
				}}
				sx={{ mb: '15px', display: 'flex', ...sx }}
				style={style}
			>
				{children}
			</Grid>
		</>
	);
}

const dimensionsSchema = Yup.object().shape({
	length: Yup.number().min(1, 'Invalid length').required('Length is required'),
	width: Yup.number().min(1, 'Invalid width').required('Width is required'),
	height: Yup.number().min(1, 'Invalid height').required('Height is required'),
	//   units: Yup.string().required('Dimension units are required'),
});

const weightSchema = Yup.object().shape({
	value: Yup.number().min(1, 'Invalid weight').required('Weight is required'),
	// units: Yup.string().required('Weight units are required'),
});

const packageSchema = Yup.object().shape({
	dimensions: dimensionsSchema,
	weight: weightSchema,
});
const formValidationSchema = Yup.object().shape({
	// Other fields validations...
	//	serviceType: Yup.string().required('Service Type is required'),

	requestedPackageLineItems: Yup.array()
		.of(packageSchema)
		.test(
			'max-requestedPackageLineItems',
			'Packages must not exceed 30',
			function (requestedPackageLineItems) {
				const noOfRepitition =
					this.options.context.modalData?.NoOfRepitition || 0;
				return requestedPackageLineItems.length + noOfRepitition <= 30;
			}
		),
});

const NewShipment = () => {
	const navigate = useNavigate();
	const params = useParams();
	const params_id = decryptId(params?.id);
	const renderCount = useRef(0);

	const [rowsOrder, setRowsOrder] = useState([0, 1]);
	const [isRepetitionModalOpen, setIsRepetitionModalOpen] = useState(false);
	const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
	const [isShippingOptionsModalOpen, setIsShippingOptionsModalOpen] =
		useState(false);
	const [selectedRows, setSelectedRows] = useState([]);
	const [clickedBtn, setClickedBtn] = useState('');
	const [modalData, setModalData] = useState();
	const [serviceTypesOptions, setServiceTypesOptions] = useState([]);
	const [fedExApiResState, setFedExApiResState] = useState([]);
	const [createShipmentApiResState, setCreateShipmentApiResState] = useState(
		[]
	);
	const [barCode, setBarCode] = useState('');

	const [clickedLabelToPdf, setClickedLabelToPdf] = useState('');

	const [packagingItem, setPackagingItem] = useState([
		{ value: 'YOUR_PACKAGING', text: 'YOUR_PACKAGING' },
		// { value: 'box', text: 'Box' },
		// { value: 'envelope', text: 'Envelope' },
		// { value: 'parcel', text: 'Parcel' },
	]);

	const [shipmentToItem, setShipmentToItem] = useState([
		{ value: '51E85R', text: '51E85R' },
		{ value: '856820536', text: '856820536' },
	]);
	const [shipmentFromItem, setShipmentFromItem] = useState([
		{ value: 'item1', text: 'Item 1' },
		{ value: 'item2', text: 'Item 2' },
	]);
	const [stateItem, setStateItem] = useState([
		{ value: 'state', text: 'State' },
		// { value: 'state2', text: 'State2' },
	]);
	const [weightUnit, setWeightUnit] = useState([
		{ value: 'LB', text: 'lbs' },
		{ value: 'KG', text: 'kg' },
	]);
	const [dimensionsUnit, setDimensionsUnit] = useState([
		{ value: 'IN', text: 'in' },
		{ value: 'CM', text: 'cm' },
	]);
	const [countryItem, setCountryItem] = useState([{ value: 'US', text: 'US' }]);
	const [shippingServicesItem, setShippingServicesItem] = useState([
		{ value: 'Empty', text: '' },
		{ value: 'FEDEX_2_DAY', text: 'FedEx' },
	]);

	const packageTypeDefaults = {
		package: {
			dimensions: { length: '21', width: '16', height: '5' },
			weight: { value: '5' },
		},
		box: {
			dimensions: { length: '23', width: '34', height: '56' },
			weight: { value: '23' },
		},
		envelope: {
			dimensions: { length: '10', width: '8', height: '1.2' },
			weight: { value: '1.5' },
		},
		parcel: {
			dimensions: { length: '30', width: '20', height: '10' },
			weight: { value: '10' },
		},
	};
	const modaldataTrue =
		modalData?.NoOfRepitition === undefined
			? null
			: typeof modalData?.NoOfRepitition === 'number'
			? modalData
			: null;
	const formik = useFormik({
		initialValues: {
			ship_to: '51E85R',
			ship_from: 'item1',
			company: '',
			name: '',
			phone: '',
			address: '',
			email: '',
			city: '',
			state: 'state',
			packaging_type: 'YOUR_PACKAGING',
			service_type: 'Empty',
			pickupType: 'DROPOFF_AT_FEDEX_LOCATION',
			requestedPackageLineItems: [
				{
					weight: {
						units: 'LB',
						value: '10',
					},
					dimensions: {
						length: '21',
						width: '16',
						height: '5',
						units: 'IN',
					},
				},
			],
			customer_address: {
				postalCode: '75063',
				countryCode: 'US',
			},
			shipment_date: formatDateToYYYYMMDD(new Date()),
			serviceType: '',
			shipment_price: 0,
		},

		validationSchema: formValidationSchema,
		context: { modaldataTrue },
		validateOnChange: true,
		onSubmit: async values => {
			console.log('submited values', values);
			try {
				const resp = await CreateShipmentPackageApi({
					...values,
					shipping_id: params_id,
				});
				notyf.success(resp.message);
				navigate('/shipments');
			} catch (error) {
				if (error?.data?.errors && Object.keys(error?.data?.errors)?.length > 0)
					formik.setErrors(error?.data?.errors);
				else notyf.error(error.data);
			} finally {
				('empty');
			}
		},
	});
	const [tabValue, setTabValue] = useState(0);

	const handleSwapGridRow = () => {
		setRowsOrder([rowsOrder[1], rowsOrder[0]]);
	};

	const handleTabChange = (event, tabIndex) => {
		setTabValue(tabIndex);
	};

	function a11yProps(index) {
		return {
			id: `simple-tab-${index}`,
			'aria-controls': `simple-tabpanel-${index}`,
		};
	}

	const handleDeleteActivePackage = () => {
		if (formik.values.requestedPackageLineItems.length > 1) {
			// Update formik values to remove the active package
			formik.setValues({
				...formik.values,
				requestedPackageLineItems:
					formik.values.requestedPackageLineItems.filter(
						(_, index) => index !== tabValue
					),
			});

			// Update tabValue to point to the first tab if the last tab was deleted
			const newTabValue =
				tabValue >= formik.values.requestedPackageLineItems.length - 1
					? tabValue - 1
					: tabValue;

			setTabValue(newTabValue);
		}
	};

	const handleAddPackages = () => {
		const newPackages = Array.from(
			{ length: modalData.NoOfRepitition },
			(_, index) => {
				const existingPackage =
					formik.values.requestedPackageLineItems[tabValue];
				const existingPackageingType = formik.values.packaging_type;

				return {
					packaging_type: existingPackageingType.packaging_type,
					dimensions: {
						length: existingPackage.dimensions.length,
						width: existingPackage.dimensions.width,
						height: existingPackage.dimensions.height,
						units: 'IN',
					},
					weight: {
						units: 'LB',
						value: existingPackage.weight.value,
					},
				};
			}
		);

		const insertionIndex = tabValue + 1;
		formik.setValues({
			...formik.values,
			requestedPackageLineItems: [
				...formik.values.requestedPackageLineItems.slice(0, insertionIndex),
				...newPackages,
				...formik.values.requestedPackageLineItems.slice(insertionIndex),
			],
		});
	};

	const handleNewPackages = () => {
		const newPackages = Array.from({ length: 1 }, (_, index) => {
			return {
				//	packaging_type: modalData.NoOfRepitition,
				dimensions: {
					length: 1,
					width: 1,
					height: 1,
					units: 'IN',
				},
				weight: {
					units: 'LB',
					value: 1,
				},
			};
		});
		formik.setValues({
			...formik.values,
			requestedPackageLineItems: [
				...formik.values.requestedPackageLineItems,
				...newPackages,
			],
		});
	};

	useEffect(() => {
		//	renderCount.current++;

		if (modalData !== undefined) {
			renderCount.current++;
			//	console.log('renderCount', renderCount);
			if (renderCount.current <= 2) {
				return;
			}
			if (isNaN(modalData.NoOfRepitition)) {
				handleNewPackages();
			} else if (typeof modalData.NoOfRepitition === 'number') {
				handleAddPackages();
			}
		}
	}, [modalData]);

	// useEffect(() => {
	// 	const fetchServiceTypes = async () => {
	// 		try {
	// 			const response = await getFedExApiCall();
	// 			setServiceTypesOptions(response.data.data);
	// 			console.log('fetchServiceTypes', response.data.data);
	// 			setFedExApiResState(response.data.data);
	// 		} catch (error) {
	// 			console.error('Failed to fetch service types', error);
	// 		}
	// 	};

	// 	fetchServiceTypes();
	// }, []);

	let firstErrorIndex = null;

	const renderTabs = () => {
		// Check if formik.errors.requestedPackageLineItems is an array
		const isPackagesArray = Array.isArray(
			formik.errors.requestedPackageLineItems
		);
		// console.log('isPackagesArray', isPackagesArray);
		if (isPackagesArray) {
			firstErrorIndex = formik.errors.requestedPackageLineItems.findIndex(
				error => Boolean(error)
			);
		}
		// console.log('firstErrorIndex', firstErrorIndex);

		return formik.values.requestedPackageLineItems.map((_, index) => {
			// Check for errors in the current package only if formik.errors.requestedPackageLineItems is an array
			const hasError =
				isPackagesArray && formik.errors.requestedPackageLineItems[index];

			return (
				<Tab
					key={index}
					sx={{ minWidth: '2rem', padding: '.5rem 1rem' }}
					label={
						<>
							{hasError && (
								<ErrorOutlineIcon
									sx={{
										fontSize: '.52rem',
										marginLeft: '0.5rem',
										color: 'red',
									}}
								/>
							)}
							{index + 1}
						</>
					}
					{...a11yProps(index)}
				>
					{`${index + 1}`}
				</Tab>
			);
		});
	};

	const validationCheck = async () => {
		const errors = await formik.validateForm(formik.values, {
			context: { modalData },
		});
		formik.setTouched(makeAllFieldsTouched(formik.values));
		if (firstErrorIndex != null) {
			setTabValue(firstErrorIndex);
		}

		if (Object.keys(errors).length === 0) {
			return false;
		} else {
			return true;
		}
	};

	// Function to extract specific fields for the API payload
	const createPayloadForGetRatesFedexApi = values => {
		const {
			packaging_type,
			pickupType,
			requestedPackageLineItems,
			customer_address,
		} = values;
		return {
			packaging_type,
			pickupType,
			requestedPackageLineItems,
			customer_address,
		};
	};

	const handleShippingServicesChange = async serviceType => {
		const isValid = await validationCheck();

		if (isValid) {
			formik.setFieldValue('service_type', 'Empty');
		} else {
			const payload = createPayloadForGetRatesFedexApi(formik.values);
			payload.service_type = serviceType; // Add service_type to the payload

			try {
				const response = await getRatesFedexApi(payload);
				formik.setFieldValue('service_type', serviceType);
				const transformedResponse = transformFedexResponse(response);
				setFedExApiResState(transformedResponse);
				setServiceTypesOptions(transformedResponse);
				//		console.log('handleShippingServicesChange', transformedResponse);
			} catch (error) {
				formik.setFieldValue('service_type', 'Empty');
				//		console.error('Failed to fetch service types', error);
			}
		}
	};

	function transformFedexResponse(originalResponse) {
		console.log(
			'handleShippingServicesChange originalResponse',
			originalResponse
		);

		if (!originalResponse.success) {
			console.error('Response unsuccessful');
			return [];
		}

		return originalResponse.data.map((item, index) => {
			return {
				id: index + 1,
				carrier: 'FedEx',
				serviceType: item.serviceType,
				serviceName: item.serviceName,
				estimated_delivery_date: formatDateToYYYYMMDD(new Date()),
				totalNetFedExCharge: item.ratedShipmentDetails[0].totalNetFedExCharge,
			};
		});
	}

	const handlePackageTypeChange = e => {
		const selectedPackageType = e.target.value;
		const defaultValues = packageTypeDefaults[selectedPackageType];
		formik.setValues({
			...formik.values,
			packaging_type: selectedPackageType,
			requestedPackageLineItems: formik.values.requestedPackageLineItems.map(
				(packageData, index) => {
					if (index === tabValue) {
						return {
							...packageData,
							...defaultValues,
						};
					}
					return packageData;
				}
			),
		});
	};

	const renderPackageDetails = () => {
		const activePackage = formik.values.requestedPackageLineItems[tabValue];
		return (
			<>
				<GridRow>
					<Grid container alignItems='center' item xs={2}>
						<Typography variant='body2'>Packaging</Typography>
					</Grid>
					<Grid item xs={10}>
						<FormField
							id='packaging_type'
							value={formik.values.packaging_type}
							handleChange={e => {
								handlePackageTypeChange(e);
							}}
							isTouched={formik.touched?.packaging_type}
							fullWidth
							options={packagingItem}
							type={'select'}
							required
						/>
					</Grid>
				</GridRow>
				<GridRow columnSpacingMd={0.5}>
					<Grid container alignItems='center' item xs={2}>
						<Typography variant='body2'>Size</Typography>
					</Grid>
					<Grid item xs={2.9}>
						<FormField
							id='length'
							label={'Length'}
							value={activePackage.dimensions.length}
							type={'number'}
							handleChange={e => {
								formik.setFieldValue(
									`requestedPackageLineItems[${tabValue}].dimensions.length`,
									e.target.value
								);
							}}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<Typography sx={{ color: 'gray', fontSize: 'small' }}>
											in
										</Typography>
									</InputAdornment>
								),
							}}
							error={
								formik.touched.requestedPackageLineItems &&
								formik.errors.requestedPackageLineItems
									? formik.errors.requestedPackageLineItems[tabValue]
											?.dimensions?.length
									: undefined
							}
							helperText={
								formik.touched.requestedPackageLineItems &&
								formik.errors.requestedPackageLineItems &&
								formik.errors.requestedPackageLineItems[tabValue] ? (
									<Typography
										style={{ color: 'red', fontSize: '10px' }}
										className='Mui-error'
									>
										{
											formik.errors.requestedPackageLineItems[tabValue]
												?.dimensions?.length
										}
									</Typography>
								) : null
							}
						/>
					</Grid>
					<Grid
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						item
						xs={0.65}
					>
						<CloseIcon style={{ color: 'gray', fontSize: '18px' }} />
					</Grid>
					<Grid item xs={2.9}>
						<FormField
							id='width'
							value={activePackage.dimensions.width}
							type={'number'}
							handleChange={e => {
								formik.setFieldValue(
									`requestedPackageLineItems[${tabValue}].dimensions.width`,
									e.target.value
								);
							}}
							label={'Width'}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<Typography sx={{ color: 'gray', fontSize: 'small' }}>
											in
										</Typography>
									</InputAdornment>
								),
							}}
							error={
								formik.touched.requestedPackageLineItems &&
								formik.errors.requestedPackageLineItems
									? formik.errors.requestedPackageLineItems[tabValue]
											?.dimensions?.width
									: undefined
							}
							helperText={
								formik.touched.requestedPackageLineItems &&
								formik.errors.requestedPackageLineItems &&
								formik.errors.requestedPackageLineItems[tabValue] ? (
									<Typography
										style={{ color: 'red', fontSize: '10px' }}
										className='Mui-error'
									>
										{
											formik.errors.requestedPackageLineItems[tabValue]
												?.dimensions?.width
										}
									</Typography>
								) : null
							}
						/>
					</Grid>
					<Grid
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						item
						xs={0.65}
					>
						<CloseIcon style={{ color: 'gray', fontSize: '18px' }} />
					</Grid>
					<Grid item xs={2.9}>
						<FormField
							id='height'
							value={activePackage.dimensions.height}
							type={'number'}
							handleChange={e => {
								formik.setFieldValue(
									`requestedPackageLineItems[${tabValue}].dimensions.height`,
									e.target.value
								);
							}}
							label={'height'}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<Typography sx={{ color: 'gray', fontSize: 'small' }}>
											in
										</Typography>
									</InputAdornment>
								),
							}}
							error={
								formik.touched.requestedPackageLineItems &&
								formik.errors.requestedPackageLineItems
									? formik.errors.requestedPackageLineItems[tabValue]
											?.dimensions?.height
									: undefined
							}
							helperText={
								formik.touched.requestedPackageLineItems &&
								formik.errors.requestedPackageLineItems &&
								formik.errors.requestedPackageLineItems[tabValue] ? (
									<Typography
										style={{ color: 'red', fontSize: '10px' }}
										className='Mui-error'
									>
										{
											formik.errors.requestedPackageLineItems[tabValue]
												?.dimensions?.height
										}
									</Typography>
								) : null
							}
						/>
					</Grid>
				</GridRow>
				<GridRow>
					<Grid container alignItems='center' item xs={2}>
						<Typography variant='body2'>
							Weight<span style={{ color: 'red' }}>*</span>
						</Typography>
					</Grid>
					<Grid item xs={2.9}>
						<FormField
							//	label='With normal TextField'
							id='weight'
							value={activePackage.weight.value}
							type={'number'}
							defaultValue={
								formik.values.requestedPackageLineItems[tabValue].weight.value
							}
							handleChange={e => {
								formik.setFieldValue(
									`requestedPackageLineItems[${tabValue}].weight.value`,
									e.target.value
								);
							}}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<Typography sx={{ color: 'gray', fontSize: 'small' }}>
											lbs
										</Typography>
									</InputAdornment>
								),
							}}
							error={
								formik.touched.requestedPackageLineItems &&
								formik.errors.requestedPackageLineItems
									? formik.errors.requestedPackageLineItems[tabValue]?.weight
											?.value
									: undefined
							}
							helperText={
								formik.touched.requestedPackageLineItems &&
								formik.errors.requestedPackageLineItems &&
								formik.errors.requestedPackageLineItems[tabValue] ? (
									<Typography style={{ color: 'red', fontSize: '10px' }}>
										{
											formik.errors.requestedPackageLineItems[tabValue]?.weight
												?.value
										}
									</Typography>
								) : null
							}
						/>
					</Grid>
				</GridRow>
			</>
		);
	};

	const handleChangeShippingOption = event => {
		const value = event.target.value;
		console.log('handleChangeShippingOption', value);
		formik.setFieldValue('serviceType', value);

		console.log(
			'handleChangeShippingOption serviceTypesOptions',
			serviceTypesOptions
		);
	};

	const handleFormSubmission = async () => {
		try {
			formik.handleSubmit();
			// Additional logic after successful form submission
		} catch (error) {
			// Handle form submission error
			console.error('Form submission error:', error);
		}
	};

	useEffect(() => {
		const fetchServiceTypes = async () => {
			try {
				// const response = await getFedExApiCall();
				// const fetchedOptions = response.data.data;

				// Check if the current serviceType is not in the first three options
				console.log('formik.values.serviceType', formik.values.serviceType);
				if (
					formik.values.serviceType &&
					!fedExApiResState
						.slice(0, 3)
						.some(option => option.serviceType === formik.values.serviceType)
				) {
					const matchingOption = fedExApiResState.find(
						option => option.serviceType === formik.values.serviceType
					);

					if (matchingOption) {
						const updatedOptions = [
							...fedExApiResState.slice(0, 2),
							matchingOption,
							...fedExApiResState.slice(2),
						];

						// Update the state or formik values with the updated options
						//	setFedExApiResState(updatedOptions);
						setServiceTypesOptions(updatedOptions);
						console.log('useEffect updatedOptions', updatedOptions);
						formik.setFieldValue(
							'shipment_price',
							matchingOption.totalNetFedExCharge
						);
					}
				} else {
					// If the current serviceType is in the first three options, use the fetched options directly
					console.log('useEffect fedExApiResState ', fedExApiResState);
					setServiceTypesOptions(fedExApiResState);
					//	setFedExApiResState(fedExApiResState);
				}
			} catch (error) {
				console.error('Failed to fetch service types', error);
			}
		};

		fetchServiceTypes();
	}, [formik.values.serviceType]);

	useEffect(() => {
		if (formik.dirty === true) {
			const el = document.querySelector('.Mui-error, [data-error]');
			(el?.parentElement ?? el)?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [formik.isSubmitting]);

	const handlePrintLabelToPdf = async () => {
		const isValid = await validationCheck();
		if (isValid && formik.values.serviceType === '') {
			setClickedLabelToPdf('Service name is required');
			setTimeout(() => {
				setClickedLabelToPdf('');
			}, 5000);
		} else if (!isValid) {
			try {
				const resp = await createShipment();
				console.log('createShipment', resp.data);
				console.log(
					'createShipment encodedLabel',
					resp.data.pieceResponses[0].packageDocuments[0].encodedLabel
				);
				setBarCode(
					resp.data.pieceResponses[0].packageDocuments[0].encodedLabel
				);
				setCreateShipmentApiResState(resp.data);
				setIsPrintModalOpen(true);
				notyf.success(resp.message);
			} catch (error) {
				if (error?.data?.errors && Object.keys(error?.data?.errors)?.length > 0)
					formik.setErrors(error?.data?.errors);
				else notyf.error(error.data);
			} finally {
				('empty');
			}
		}
	};

	// Utility function to mark all fields as touched
	function makeAllFieldsTouched(values) {
		const touchedFields = {};
		Object.keys(values).forEach(key => {
			if (Array.isArray(values[key])) {
				touchedFields[key] = values[key].map(() => true);
			} else {
				touchedFields[key] = true;
			}
		});
		return touchedFields;
	}

	return (
		<>
			<Grid container>
				<Grid item sm={12}>
					<HeaderPaper sx={{ marginBottom: '0rem' }}>
						<GridRow style={{ marginBottom: '0px', alignItems: 'center' }}>
							<Grid item xs={6}>
								<Typography variant='h6'>New Shipment</Typography>
							</Grid>
							<Grid
								item
								xs={6}
								style={{ display: 'flex', justifyContent: 'end' }}
							>
								<IconButton
									onClick={() => goBack(() => navigate('/shipments'))}
								>
									<CloseIcon />
								</IconButton>
							</Grid>
						</GridRow>
					</HeaderPaper>
				</Grid>
				{/* sm={8.5} */}
				<Grid item sm={12}>
					<Paper sx={{ marginTop: '.6rem', marginRight: '.6rem' }}>
						<form onSubmit={formik.handleSubmit}>
							<Grid
								container
								sx={{
									minHeight: '100vh',
									padding: '1.2rem 1rem 0 1rem',
								}}
							>
								<Grid
									item
									xs={6}
									sx={{
										padding: '0 .8rem 0px .6rem',
										marginBottom: '0',
									}}
								>
									{/* Left side */}
									{rowsOrder.map(index => (
										<GridRow
											key={index}
											style={{
												borderRadius: '.6rem',
												backgroundColor: '#F5F5F5',
											}}
										>
											{index === 0 && (
												<>
													<Grid container alignItems='center' item xs={2}>
														<Typography
															variant='body2'
															pt={0}
															style={{ fontWeight: 500 }}
														>
															To
														</Typography>
													</Grid>
													<Grid container alignItems='center' item xs={9}>
														<FormField
															sx={{
																backgroundColor: 'white',
																borderRadius: '3px',
																marginBottom: '.5rem',
																//		marginRight: '1rem',
															}}
															id='ship_to'
															defaultValue={'test default value'}
															value={formik.values.ship_to}
															isTouched={formik.touched.ship_to}
															//			handleChange={formik.handleChange}
															label={'Shipment To'}
															options={shipmentToItem}
															fullWidth
															type={'select'}
															required
														/>
													</Grid>
													<Grid item xs={1}>
														<IconButton
															onClick={handleSwapGridRow}
															style={{
																color: '#2196F3',
																padding: '1rem 0rem 1rem 0.25rem',
															}}
														>
															<SwapVertIcon />
														</IconButton>
													</Grid>
												</>
											)}
											{index === 1 && (
												<>
													<Grid container alignItems='center' item xs={2}>
														<Typography
															variant='body2'
															pt={0}
															style={{ fontWeight: 500 }}
														>
															From
														</Typography>
													</Grid>
													<Grid container alignItems='center' item xs={10}>
														<FormField
															sx={{
																backgroundColor: 'white',
																borderRadius: '3px',
																marginBottom: '.5rem',
																marginRight: '1rem',
															}}
															id='ship_from'
															value={formik.values.ship_from}
															isTouched={formik.touched.ship_from}
															//			handleChange={formik.handleChange}
															label={'Shipment From'}
															options={shipmentFromItem}
															fullWidth
															type={'select'}
															required
														/>
													</Grid>
												</>
											)}
										</GridRow>
									))}
									<GridRow>
										<Grid container alignItems='center' item xs={2}>
											<Typography variant='body2'>
												Company<span style={{ color: 'red' }}>*</span>
											</Typography>
										</Grid>
										<Grid item xs={10}>
											<FormField
												id='company'
												value={formik.values.company}
												//			handleChange={formik.handleChange}
												fullWidth
												required
											/>
										</Grid>
									</GridRow>
									<GridRow>
										<Grid container alignItems='center' item xs={2}>
											<Typography variant='body2'>
												Name<span style={{ color: 'red' }}>*</span>
											</Typography>
										</Grid>
										<Grid item xs={10}>
											<FormField
												id='name'
												value={formik.values.name}
												//			handleChange={formik.handleChange}
												fullWidth
												required
											/>
										</Grid>
									</GridRow>
									<GridRow>
										<Grid container alignItems='center' item xs={2}>
											<Typography variant='body2'>
												Phone<span style={{ color: 'red' }}>*</span>
											</Typography>
										</Grid>
										<Grid item xs={10}>
											<FormField
												id='phone'
												value={formik.values.phone}
												//			handleChange={formik.handleChange}
												fullWidth
												required
											/>
										</Grid>
									</GridRow>
									<GridRow>
										<Grid container alignItems='center' item xs={2}>
											<Typography variant='body2'>
												Address<span style={{ color: 'red' }}>*</span>
											</Typography>
										</Grid>
										<Grid item xs={10}>
											<FormField
												id='address'
												value={formik.values.address}
												//			handleChange={formik.handleChange}
												fullWidth
												required
											/>
										</Grid>
									</GridRow>
									<GridRow>
										<Grid container alignItems='center' item xs={2}>
											<Typography variant='body2'>Email</Typography>
										</Grid>
										<Grid item xs={10}>
											<FormField
												id='email'
												value={formik.values.email}
												//			handleChange={formik.handleChange}
												fullWidth
												required
												error={
													formik.touched.email && Boolean(formik.errors.email)
												}
												helperText={formik.touched.email && formik.errors.email}
											/>
										</Grid>
									</GridRow>
									<GridRow>
										<Grid container alignItems='center' item xs={2}>
											<Typography variant='body2'>
												City<span style={{ color: 'red' }}>*</span>
											</Typography>
										</Grid>
										<Grid item xs={4}>
											<FormField
												id='city'
												value={formik.values.city}
												//		handleChange={formik.handleChange}
												fullWidth
												required
											/>
										</Grid>
										<Grid container alignItems='center' item xs={2}>
											<Typography variant='body2'>State</Typography>
										</Grid>
										<Grid item xs={4}>
											<FormField
												id='state'
												value={formik.values.state}
												//		handleChange={formik.handleChange}
												fullWidth
												type={'select'}
												options={stateItem}
												required
											/>
										</Grid>
									</GridRow>
									<GridRow>
										<Grid container alignItems='center' item xs={2}>
											<Typography variant='body2'>Zip</Typography>
										</Grid>
										<Grid item xs={4}>
											<FormField
												id='postalCode'
												type={'number'}
												value={formik.values.customer_address.postalCode}
												//		handleChange={formik.handleChange}
												fullWidth
												required
											/>
										</Grid>
										<Grid container alignItems='center' item xs={2}>
											<Typography variant='body2'>Country</Typography>
										</Grid>
										<Grid item xs={4}>
											<FormField
												id='countryCode'
												value={formik.values.customer_address.countryCode}
												//		handleChange={formik.handleChange}
												//				defaultValue={'test default value'}
												//				value={'from'}
												fullWidth
												type={'select'}
												options={countryItem}
												required
											/>
										</Grid>
									</GridRow>
								</Grid>
								<Grid
									item
									xs={6}
									sx={{ padding: '0 0 0 .8rem', marginBottom: '0' }}
								>
									<GridRow
										style={{
											borderRadius: '.6rem',
											backgroundColor: '#F5F5F5',
										}}
									>
										<Grid container alignItems='center' item xs={2}>
											<Typography
												variant='body2'
												pt={0}
												style={{ fontWeight: 500, textAlign: 'center' }}
											>
												Package
											</Typography>
										</Grid>
										<Grid container item xs={10} justifyContent='flex-end'>
											{formik.values.requestedPackageLineItems.length !== 1 && (
												<MUIButton
													startIcon={<DeleteIcon fontSize='small' />}
													variant='outlined'
													sx={{ margin: '0 .5rem .5rem', color: 'red' }}
													onClick={handleDeleteActivePackage}
												>
													DELETE
												</MUIButton>
											)}
											<MUIButton
												startIcon={<Loop fontSize='small' />}
												variant='outlined'
												sx={{ margin: '0 .5rem .5rem' }}
												onClick={() => {
													setIsRepetitionModalOpen(true);
													setClickedBtn('repeat');
												}}
											>
												REPEAT
											</MUIButton>
											<MUIButton
												startIcon={<Add fontSize='small' />}
												variant='outlined'
												sx={{ margin: '0 .5rem .5rem', marginRight: '1rem' }}
												onClick={() => {
													setIsRepetitionModalOpen(true);
													setClickedBtn('new');
												}}
											>
												NEW
											</MUIButton>
										</Grid>
									</GridRow>
									{formik.values.requestedPackageLineItems.length !== 1 && (
										<GridRow columnSpacingMd={0.15}>
											<div style={{ width: '100%', overflowX: 'auto' }}>
												<Tabs
													value={tabValue}
													onChange={handleTabChange}
													scrollButtons
													variant='scrollable'
													aria-label='basic tabs example'
													sx={{
														'& .MuiTabs-scrollButtons.Mui-disabled': {
															opacity: 0.3,
														},
													}}
												>
													{renderTabs()}
												</Tabs>
												{formik.touched.requestedPackageLineItems &&
													typeof formik.errors.requestedPackageLineItems ===
														'string' && (
														<Typography
															style={{ color: 'red', fontSize: '10px' }}
														>
															{formik.errors.requestedPackageLineItems}
														</Typography>
													)}
											</div>
										</GridRow>
									)}
									{renderPackageDetails()}

									<GridRow
										style={{
											borderRadius: '.6rem',
											backgroundColor: '#F5F5F5',
										}}
									>
										<Grid container alignItems='center' item xs={3.5}>
											<Typography
												variant='body2'
												pt={0}
												style={{ fontWeight: 500, whiteSpace: 'nowrap' }}
											>
												Shipping Services
											</Typography>
										</Grid>
										<Grid container alignItems='center' item xs={8.5}>
											<FormField
												sx={{
													backgroundColor: 'white',
													borderRadius: '3px',
													marginBottom: '.5rem',
													marginRight: '.5rem',
												}}
												id='service_type'
												value={formik.values.service_type}
												handleChange={e =>
													handleShippingServicesChange(e.target.value)
												}
												defaultValue={'test default value'}
												options={shippingServicesItem}
												fullWidth
												type={'select'}
											/>
										</Grid>
									</GridRow>
									<GridRow>
										<Grid container alignItems='center' item xs={2}>
											<Typography variant='body2'>Ship Date</Typography>
										</Grid>
										<Grid item xs={10}>
											<FormField
												id='shipment_date'
												//	defaultValue={'test default value'}
												value={formik.values.shipment_date}
												handleChange={formik.handleChange}
												fullWidth
												type={'Date'}
											/>
										</Grid>
									</GridRow>
									{formik.values.service_type !== 'Empty' && (
										<>
											<RadioGroup
												aria-label='my-radio-group'
												name='my-radio-group'
												value={formik.values.serviceType}
												onChange={handleChangeShippingOption}
											>
												{serviceTypesOptions.slice(0, 3).map(option => (
													<GridRow columnSpacingMd={0.5} key={option.id}>
														<FormControlLabel
															control={<Radio />}
															value={option.serviceType}
															label={
																<>
																	<Typography
																		variant='body2'
																		pt={0}
																		style={{
																			fontWeight: 500,
																			textAlign: 'left',
																		}}
																	>
																		{option.serviceName}
																	</Typography>
																	<Typography
																		sx={{ color: 'gray', fontSize: 'small' }}
																	>
																		${option.totalNetFedExCharge} -{' '}
																		{formatDate(option.estimated_delivery_date)}
																	</Typography>
																</>
															}
														/>
													</GridRow>
												))}
												{clickedLabelToPdf !== '' ? (
													<Typography
														style={{ color: 'red', fontSize: '10px' }}
														className='Mui-error'
													>
														{clickedLabelToPdf}
													</Typography>
												) : null}
											</RadioGroup>
											<Button
												onClick={() => {
													setIsShippingOptionsModalOpen(true);
												}}
												sx={{ textTransform: 'none' }}
											>
												See all options
												<ExpandMoreIcon
													sx={{
														fontSize: '1.2rem',
														marginRight: '5px',
														lineHeight: '1.5px',
													}}
												/>
											</Button>
										</>
									)}
								</Grid>
								<Grid xs={12} item mt={0}>
									<Divider />
								</Grid>
								<Grid
									item
									xs={12}
									mt={0}
									sx={{
										textAlign: 'right',
										alignSelf: 'flex-start',
									}}
								>
									<Button
										onClick={handlePrintLabelToPdf}
										mt={0}
										sx={{ textTransform: 'none' }}
										disabled={formik.values.service_type === 'Empty'}
									>
										<LocalPrintshopOutlinedIcon
											sx={{
												marginTop: '0px',
												fontSize: '1.2rem',
												marginRight: '.5rem',
											}}
										/>
										PRINT (LABEL TO PDF)
									</Button>
								</Grid>
							</Grid>
							<PrintModal
								barCode={barCode}
								open={isPrintModalOpen}
								onClose={() => setIsPrintModalOpen(false)}
								onSubmit={handleFormSubmission}
								//     newTax={isNewTaxAdded}
							/>
						</form>
					</Paper>
				</Grid>
				{/* <Grid item sm={3.5}>
					<Paper
						sx={{ minHeight: '20vh', marginBottom: '.6rem', marginTop: '.6em' }}
					>
						<GridRow columnSpacingMd={0}>
							<Button mt={0} sx={{ textTransform: 'none' }}>
								<AddPhotoAlternateOutlinedIcon
									sx={{
										marginTop: '0px',
										fontSize: '1.2rem',
										marginRight: '.5rem',
									}}
								/>
								New Shipment
							</Button>
						</GridRow>
						<GridRow columnSpacingMd={0}>
							<Button mt={0} sx={{ textTransform: 'none' }}>
								<FileCopyOutlinedIcon
									sx={{
										marginTop: '0px',
										fontSize: '1.2rem',
										marginRight: '.5rem',
									}}
								/>
								Clone Shipment
							</Button>
						</GridRow>
					</Paper>
					<Paper sx={{ minHeight: '80vh' }}></Paper>
				</Grid> */}
			</Grid>
			<br />
			<PackageModal
				setModalData={setModalData}
				clickedBtn={clickedBtn}
				open={isRepetitionModalOpen}
				onClose={() => setIsRepetitionModalOpen(false)}
				packagingItem={packagingItem}
				//     newTax={isNewTaxAdded}
			/>

			<ShippingOptionsModal
				fedExApiResState={fedExApiResState}
				open={isShippingOptionsModalOpen}
				onClose={() => setIsShippingOptionsModalOpen(false)}
				setSelectedRows={setSelectedRows}
				setModalData={setModalData}
				setFieldValue={formik.setFieldValue}
				size={'md'}
				title='Shipping Options'
			/>
		</>
	);
};

export default NewShipment;
