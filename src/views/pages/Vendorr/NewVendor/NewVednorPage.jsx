import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import {
	Button,
	Grid,
	IconButton,
	Paper,
	Typography,
	CircularProgress,
} from '@mui/material';
import FormField from '../../../Components/InputField/FormField';
import { Close } from '@mui/icons-material';
import { validationSchema } from './ValidationSchema';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
	createVendor,
	getCurrenciesApi,
	getPeymentTermsApi,
	vendorsSingleApi,
	UpdateVendorApi,
} from '../../../../core/api/vendor';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { salutations } from '../../../../core/utils/constants';
import { Box } from '@mui/system';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import ContainerPaper from '../../../Components/Containers/ContainerPaper';
import { useNavigate, useParams } from 'react-router-dom';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';
import GridRow from '../../../Components/GridRow/GridRow';
import TabGlobalComponent from '../../../Components/GlobalTabs/GlobalTabs';
import { LoadingButton } from '@mui/lab';
import {
	decryptId,
	goBack,
	prettifyErrorfromObjectToArray,
} from '../../../../core/utils/helpers';
import AddressTab from './AddressTab';
import OtherDetailsTab from './OtherDetailsTab';
import ContactPersonTab from './ContactPersonTab';
import {
	getAllCountriesApi,
	getAllStatesApi,
} from '../../../../core/api/others';
import { getDepartmentsApi } from '../../../../core/api/department';

function NewVendorPage({ edit }) {
	let { id } = useParams();
	id = decryptId(id);
	const [CountryStates, setCountryStates] = useState({
		billing: [],
		shipping: [],
	});
	const [otherDetailsOptions, setotherDetailsOptions] = useState({
		AllCurrencies: [],
		departments: [],
	});
	const [allCountries, setAllCountries] = useState();
	const [paymentTerms, setpaymentTerms] = useState([]);
	const [loading, setLoading] = useState(false);
	const [buttonloading, setButtonLoading] = useState(false);
	const [fieldError, setFieldError] = useState('');
	const navigate = useNavigate();
	const [contactPersonError, setContactPersonError] = useState();

	const formik = useFormik({
		initialValues: {
			salutation: '',
			first_name: '',
			last_name: '',
			company_name: '',
			display_name: '',
			email: '',
			phone: '',
			work_phone: '',
			skype_name: '',
			designation: '',
			department: '',
			website: '',
			tax_id: '',
			currency: 'US Dollar',
			opening_balance: '',
			mode_of_payment: '',
			term_id: '',
			facebook_link: '',
			twitter_link: '',
			remarks: '',
			vendor_contacts: [
				{
					salutation: '',
					first_name: '',
					last_name: '',
					email: '',
					work_phone: '',
					mobile: '',
					skype_name: '',
					designation: '',
					department: '',
				},
			],
			vendor_billing_address: {
				id: '',
				type: 'billing',
				attention: '',
				state_id: '',
				address: '',
				address2: '',
				country_id: '231',
				city: '',
				zipcode: '',
				phone: '',
				fax: '',
			},
			vendor_shipping_address: {
				id: '',
				type: 'shipping',
				attention: '',
				address: '',
				state_id: '',
				address2: '',
				country_id: '231',
				city: '',
				zipcode: '',
				phone: '',
				fax: '',
			},
		},
		validationSchema: validationSchema,
		validate: values => {
			const errors = {};

			let contactErrors = values.vendor_contacts?.map((contact, index) => {
				const contactErrors = {};
				// Check if last_name is required
				if (
					(contact.salutation || contact.first_name || contact.email) &&
					!contact.last_name
				) {
					contactErrors.last_name = 'Last Name is required';
				}

				// Check for duplicate email in other contacts
				if (contact.email) {
					const otherContacts = values.vendor_contacts.filter(
						(otherContact, otherIndex) => otherIndex !== index
					);
					const isEmailDuplicate = otherContacts.some(
						otherContact => otherContact.email === contact.email
					);
					if (isEmailDuplicate) {
						contactErrors.email = 'Email is already in use by another contact';
					}
				}
				setContactPersonError(contactErrors);
				return contactErrors;
			});

			contactErrors = contactErrors.map(contact =>
				contact?.last_name || contact?.email ? contact : null
			);
			let tempArray = contactErrors.some(contact => contact !== null);
			if (tempArray) errors.vendor_contacts = contactErrors;
			else delete errors.vendor_contacts;

			return errors;
		},
		validateOnChange: false,
		onSubmit: async () => {
			setButtonLoading(true);
			const updatedValues = {
				...formik.values,
				vendor_id: id,
				vendor_contacts: formik.values.vendor_contacts?.filter(
					obj => obj.first_name && obj.last_name && obj.email
				),
			};
			if (edit && id) {
				try {
					// await UpdateVendorApi(id, updatedValues);
					await UpdateVendorApi({ ...updatedValues, id, _method: 'PUT' });
					notyf.success('Vendor Updated Successfully');
					navigate('/vendor');
				} catch (e) {
					setButtonLoading(false);
					setFieldError(e.data.errors);
					console.log('error updating vendor', e);
					document
						.querySelector('.toTop')
						?.scrollIntoView({ behavior: 'smooth' });
					// notyf.error(e.data.message);
				}
			} else {
				try {
					await createVendor(updatedValues);
					notyf.success('Vendor Created Successfully');
					navigate('/vendor');
					setButtonLoading(false);
				} catch (e) {
					setButtonLoading(false);
					console.log('error creating', e.data.errors);
					setFieldError(e.data.errors);
					document
						.querySelector('.toTop')
						?.scrollIntoView({ behavior: 'smooth' });
					// notyf.error(e.data.message);
				} finally {
					setButtonLoading(false);
				}
			}
		},
	});

	useEffect(() => {
		formik.setErrors(prettifyErrorfromObjectToArray(fieldError) || {});
	}, [fieldError]);

	// get countries
	const getCountriesFromApi = async () => {
		try {
			const countries = await getAllCountriesApi();
			setAllCountries(
				countries?.data?.map(country => {
					return {
						value: country?.id,
						text: country?.name,
					};
				})
			);
		} catch (e) {
			console.log('e', e);
		}
	};
	// get state for billing address
	const getStatesForBilling = async () => {
		const params = {
			country_id: formik.values?.vendor_billing_address?.country_id,
		};

		try {
			const states = await getAllStatesApi(params);
			setCountryStates(prev => {
				return {
					...prev,
					billing: states?.data?.map(Bstate => {
						return {
							value: Bstate?.id,
							text: Bstate.name,
						};
					}),
				};
			});
		} catch (e) {
			console.log('e', e);
		}
	};
	useEffect(() => {
		if (formik.values?.vendor_billing_address?.country_id)
			getStatesForBilling();
	}, [formik.values?.vendor_billing_address?.country_id]);

	// get state for shipping address
	const getStatesForShipping = async () => {
		const params = {
			country_id: formik.values?.vendor_shipping_address?.country_id,
		};

		try {
			const states = await getAllStatesApi(params);
			setCountryStates(prev => {
				return {
					...prev,
					shipping: states?.data?.map(Bstate => {
						return {
							value: Bstate?.id,
							text: Bstate.name,
						};
					}),
				};
			});
		} catch (e) {
			console.log('e', e);
		}
	};
	// console.log('CountryStates', CountryStates);
	useEffect(() => {
		if (formik.values?.vendor_shipping_address?.country_id)
			getStatesForShipping();
	}, [formik.values?.vendor_shipping_address?.country_id]);

	// ger currencies api
	const getAllCurrencies = async () => {
		try {
			const currencies = await getCurrenciesApi();
			setotherDetailsOptions(prev => {
				return {
					...prev,
					AllCurrencies: currencies?.data?.map(currency => {
						return {
							value: currency?.name,
							text: currency?.name,
						};
					}),
				};
			});
		} catch (e) {
			console.log('e', e);
		}
	};

	// ger payment response api
	const PaymentRespone = async () => {
		try {
			const paymentresponse = await getPeymentTermsApi();
			// console.log("__resp", paymentresponse)

			const terms = paymentresponse?.data?.map(term => {
				return {
					value: term?.id,
					text: term?.term_name,
					is_default: term?.is_default,
				};
			});
			setpaymentTerms(terms);
			if (!id) {
				const term_id = terms.find(t => !!t?.is_default)?.value;
				formik.setFieldValue('term_id', term_id);
			}
		} catch (e) {
			console.log('error: ', e);
		}
	};
	// get all departments api
	const getAllDepartments = async () => {
		try {
			const dep = await getDepartmentsApi();
			setotherDetailsOptions(prev => {
				return {
					...prev,
					departments: dep?.data?.data?.map(option => {
						return {
							value: option?.name,
							text: option?.name,
						};
					}),
				};
			});
		} catch (e) {
			console.log('e', e);
		}
	};
	//  single vendor api
	const getsinglevendor = async () => {
		try {
			if (edit && id) {
				setLoading(true);
				const singleVendor = await vendorsSingleApi(id);

				let vendorBillingAddress = singleVendor.vendor_billing_address[0];
				let vendorShippingAddress = singleVendor.vendor_shipping_address[0];
				formik.setValues(singleVendor);
				formik.setFieldValue('vendor_billing_address', vendorBillingAddress);
				formik.setFieldValue('vendor_shipping_address', vendorShippingAddress);
			}
		} catch (e) {
			console.log('e', e);
		}
		setLoading(false);
	};

	useEffect(() => {
		getsinglevendor();
		getCountriesFromApi();
		getAllCurrencies();
		PaymentRespone();
		getAllDepartments();
	}, []);

	// for display name
	const { salutation, first_name, last_name } = formik.values;
	// const displayName = [
	// 	{
	// 		value: `${salutation || ''} ${first_name} ${last_name}`,
	// 		text: `${salutation || ''} ${first_name} ${last_name}`,
	// 	},
	// 	{
	// 		value: `${first_name} ${last_name}`,
	// 		text: `${first_name} ${last_name}`,
	// 	},
	// 	{
	// 		value: `${last_name}, ${first_name} `,
	// 		text: `${last_name}, ${first_name}`,
	// 	},
	// ];
	const displayName = [];

	if (salutation && salutation.trim() !== '') {
		displayName.push({
			value: `${salutation} ${first_name} ${last_name}`,
			text: `${salutation} ${first_name} ${last_name}`,
		});
	}

	displayName.push(
		{
			value: `${first_name} ${last_name}`,
			text: `${first_name} ${last_name}`,
		},
		{
			value: `${last_name}, ${first_name}`,
			text: `${last_name}, ${first_name}`,
		}
	);

	// for Formik Errors
	// const formikInAccount = ["first_name", "last_name", "email"];
	// const ErrorsInAccount = formikInAccount.some((field) => formik.errors[field]);

	const formikInAddress = [
		'attention',
		'address',
		'address2',
		'country_id',
		'state_id',
		'city',
		'zipcode',
		'phone',
		'fax',
	];
	const ErrorsInBillingAddress = formikInAddress.some(
		field =>
			formik.errors?.vendor_billing_address?.[field] &&
			formik.touched?.vendor_billing_address?.[field]
	);
	const ErrorsInShippingAddress = formikInAddress.some(
		field =>
			formik.errors.vendor_shipping_address?.[field] &&
			formik.touched?.vendor_shipping_address?.[field]
	);
	const showErrorsInAddress = ErrorsInBillingAddress || ErrorsInShippingAddress;

	const formikInOtherDetails = ['tax_authority', 'exemption_reason'];
	const ErrorsInOtherDetails = formikInOtherDetails.some(
		field => formik.errors[field]
	);
	const scrollOnError = () => {
		const hasErrors = Object.keys(formik.errors).length > 0; // Check if there are errors
		if (hasErrors || contactPersonError || fieldError) {
			document.querySelector('.toTop')?.scrollIntoView({ behavior: 'smooth' });
		}
	};

	// For Tabs
	const TabIconStyle = {
		fontSize: '14px',
		// marginBottom:'-3px',
		color: 'red',
		backgroundColor: 'white',
		borderRadius: '8px',
		padding: '0',
	};

	const isContactPersonValid = () => {
		const filteredArray = formik.errors?.vendor_contacts?.filter(
			contact =>
				contact?.last_name ||
				contact?.email ||
				contact?.mobile ||
				contact?.work_phone
		);
		if (filteredArray?.length > 0) {
			return <ErrorOutlineIcon sx={TabIconStyle} />;
		} else {
			return <></>;
		}
	};
	const tabLabels = [
		{
			label: 'OtherDetails',
			icon: ErrorsInOtherDetails ? <ErrorOutlineIcon sx={TabIconStyle} /> : '',
		},
		{
			label: 'Address',
			icon: showErrorsInAddress ? <ErrorOutlineIcon sx={TabIconStyle} /> : '',
		},
		{ label: 'Contact Persons', icon: isContactPersonValid() },
		// { label: 'Custom Fields', icon: '' },
		// { label: 'Reporting Tags', icon: '' },
		{ label: 'Notes', icon: '' },
	];

	// console.log('showformik values', formik.errors);
	if (loading) {
		return (
			<Box
				style={{
					width: '100%',
					height: '90vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<CircularProgress />
			</Box>
		);
	} else
		return (
			<>
				<HeaderPaper>
					<GridRow style={{ marginBottom: '0px', alignItems: 'center' }}>
						<Grid item xs={6}>
							<Typography variant='h6'>
								{edit ? 'Edit Vendor' : 'New Vendor'}{' '}
							</Typography>
						</Grid>
						<Grid
							item
							xs={6}
							style={{ display: 'flex', justifyContent: 'end' }}
						>
							<IconButton onClick={() => goBack(() => navigate('/vendor'))}>
								<Close />
							</IconButton>
						</Grid>
					</GridRow>
				</HeaderPaper>
				<form onSubmit={formik.handleSubmit}>
					<ContainerPaper>
						<Box mb={5} sx={{ minHeight: '80vh' }}>
							<Box aria-label='vendor-details' className='toTop'>
								{/* Names  */}
								<GridRow style={{ marginBottom: '0' }}>
									<Grid item xs={2}>
										<Typography variant='body2'>
											Primary Contact
											<HoverPopover text='The name you enter here will be for your primary contact. You can continue to add multiple contact persons from the details page' />
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<GridRow>
											<Grid item xs={4}>
												<FormField
													id='salutation'
													// sx={{ width: "42%"}}
													fullWidth
													label={'Salutation'}
													type={'select'}
													value={formik.values.salutation || ''}
													handleChange={formik.handleChange}
													options={salutations}
												/>
											</Grid>
											<Grid item xs={4}>
												<FormField
													id='first_name'
													label={'First Name'}
													value={formik.values.first_name}
													handleChange={formik.handleChange}
													onBlur={formik.handleBlur}
													isTouched={formik.touched.first_name}
													error={formik.errors.first_name}
													required
													// sx={{ width: "32%" }}
												/>
											</Grid>
											<Grid item xs={4}>
												<FormField
													id='last_name'
													label={'Last Name'}
													value={formik.values.last_name}
													handleChange={formik.handleChange}
													onBlur={formik.handleBlur}
													isTouched={formik.touched.last_name}
													error={formik.errors.last_name}
													required
													// sx={{ width: "32%" }}
												/>
											</Grid>
										</GridRow>
									</Grid>
								</GridRow>
								{/* Company Name  */}
								<GridRow>
									<Grid item xs={2}>
										<Typography variant='body2'>Company Name</Typography>
									</Grid>
									<Grid item xs={4}>
										<FormField
											id='company_name'
											value={formik.values.company_name}
											handleChange={formik.handleChange}
											error={formik.errors.company_name}
											label={'Company Name'}
										/>
									</Grid>
								</GridRow>
								<GridRow>
									<Grid item xs={2}>
										<Typography variant='body2'>
											Vendor Display Name{' '}
											{/* <span style={{ color: 'red' }}>*</span> */}
											<HoverPopover text='This name will be displayed on the transactions you created for this vendor.' />
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<FormField
											id='display_name'
											defaultValue={
												displayName?.length > 0 ? displayName[0]?.text : ''
											}
											value={formik.values.display_name}
											handleChange={formik.handleChange}
											onBlur={formik.handleBlur}
											isTouched={formik.touched.display_name}
											error={formik.errors.display_name}
											label={'Display Name'}
											fullWidth
											type={'select'}
											options={displayName}
											required
										/>
									</Grid>
								</GridRow>
								{/* Vendor Email  */}
								<GridRow>
									<Grid item xs={2}>
										<Typography variant='body2'>
											Vendor Email{' '}
											<HoverPopover text='Privacy Info: This data will be stored without encryption and will be visible only to your organization who have the required permission.' />
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<FormField
											id='email'
											value={formik.values.email}
											error={formik.errors.email}
											onBlur={formik.handleBlur}
											isTouched={formik.touched.email}
											handleChange={formik.handleChange}
											label={'Email Address'}
											required
										/>
									</Grid>
								</GridRow>
								{/* Vendor Phone  */}
								<GridRow>
									<Grid item xs={2}>
										<Typography variant='body2'>
											Vendor Phone{' '}
											<HoverPopover text='Privacy Info: This data will be stored without encryption and will be visible only to your organization who have the required permission.' />
										</Typography>
									</Grid>
									<Grid
										item
										xs={4}
										sx={{ display: 'flex', justifyContent: 'space-between' }}
									>
										<FormField
											id='phone'
											value={formik.values.phone}
											handleChange={formik.handleChange}
											label={'Primary Contact'}
											style={{ width: '48%' }}
											error={formik.errors.phone}
											// onBlur={formik.handleBlur}
											onBlur={e => {
												formik.handleBlur(e);
												formik.setFieldValue(
													'vendor_billing_address.phone',
													e.target.value
												);
												formik.setFieldValue(
													'vendor_shipping_address.phone',
													e.target.value
												);
											}}
											isTouched={formik.touched?.phone}
											required
										/>
										<FormField
											id='work_phone'
											value={formik.values.work_phone}
											handleChange={formik.handleChange}
											label={'Secondary Contact'}
											style={{ width: '48%' }}
											error={formik.errors.work_phone}
											onBlur={formik.handleBlur}
											isTouched={formik.touched?.work_phone}
										/>
									</Grid>
								</GridRow>
							</Box>
							<TabGlobalComponent tabLabels={tabLabels}>
								<Box label='OtherDetails' pb={5}>
									<OtherDetailsTab
										formik={formik}
										paymentTerms={paymentTerms}
										PaymentRespone={PaymentRespone}
										otherDetailsOptions={otherDetailsOptions}
									/>
								</Box>
								<Box label='Address' pb={5}>
									<AddressTab
										formik={formik}
										CountryStates={CountryStates}
										allCountries={allCountries}
									/>
								</Box>
								<Box label='Contact Persons'>
									<ContactPersonTab formik={formik} />
								</Box>
								{/* <Box label='Custom Fields' py={4}>
									<GridRow>
										<Grid item xs={6}>
											<Typography variant='body2' sx={{ textAlign: 'center' }}>
												Start adding custom fields for your contacts by going to
												Settings &gt; Preferences &gt; Vendors and
												<br />
												Vendors. You can also refine the address format of your
												vendors from there.
											</Typography>
										</Grid>
									</GridRow>
								</Box>
								<Box label='Reporting Tags' py={4}>
									<GridRow>
										<Grid item xs={6}>
											<Typography variant='body2' sx={{ textAlign: 'center' }}>
												You've not created any Reporting Tags. <br />
												Start creating reporting tags by going to More Settings
												&gt; Reporting Tags
											</Typography>
										</Grid>
									</GridRow>
								</Box> */}
								<Box label='Notes' py={4}>
									<GridRow>
										<Grid item xs={2}>
											<Typography variant='body2'>
												Notes (for internal Use)
											</Typography>
										</Grid>
										<Grid item xs={4}>
											<FormField
												id='remarks'
												value={formik.values?.remarks}
												error={formik.errors?.remarks}
												handleChange={formik.handleChange}
												onBlur={formik.handleBlur}
												isTouched={formik.touched.remarks}
												label={'Notes'}
												fullWidth
												type={'textarea'}
												characterCount={'500'}
											/>
										</Grid>
									</GridRow>
								</Box>
							</TabGlobalComponent>
						</Box>
					</ContainerPaper>
					<Paper
						sx={{
							padding: '15px 20px',
							position: 'fixed',
							bottom: '0',
							width: '83.6%',
							zIndex: '2',
							borderTop: '15px solid #F3F3F3',
						}}
					>
						<LoadingButton
							variant='contained'
							type='submit'
							loading={buttonloading}
							sx={{ paddingX: '30px' }}
							onClick={() => scrollOnError()}
						>
							Save
						</LoadingButton>
						<Button
							variant='outlined'
							sx={{ marginLeft: '5px' }}
							onClick={() => navigate('/vendor')}
						>
							Cancel
						</Button>
					</Paper>
				</form>
			</>
		);
}

export default NewVendorPage;
