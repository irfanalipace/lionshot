import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import {
	Button,
	FormControlLabel,
	Grid,
	IconButton,
	Paper,
	Radio,
	Typography,
	CircularProgress,
} from '@mui/material';
import FormField from '../../../Components/InputField/FormField';
import { Close } from '@mui/icons-material';
import { validationSchema } from './ValidationSchema';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
	createCustomer,
	getCurrenciesApi,
	getPeymentTermsApi,
	getTaxesApi,
	customersSingleApi,
	UpdateCustomerApi,
} from '../../../../core/api/customer';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { TaxTypeEnum, salutations } from '../../../../core/utils/constants';
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
import { CustomerTypeEnum } from '../CustomerStylesConst';
import AddressTab from './AddressTab';
import OtherDetailsTab from './OtherDetailsTab';
import ContactPersonTab from './ContactPersonTab';
import {
	getAllCountriesApi,
	getAllStatesApi,
} from '../../../../core/api/others';
import { getDepartmentsApi } from '../../../../core/api/department';

function NewCustomerPage({ edit }) {
	let { id } = useParams();
	id = decryptId(id);
	const [CountryStates, setCountryStates] = useState({
		billing: [],
		shipping: [],
	});
	const [allCountries, setAllCountries] = useState();
	const [texRate, setTexRate] = useState([]);
	const [loading, setLoading] = useState(false);
	const [buttonloading, setButtonLoading] = useState(false);
	const navigate = useNavigate();
	const [contactPersonError, setContactPersonError] = useState();
	const [otherDetailsOptions, setotherDetailsOptions] = useState({
		AllCurrencies: [],
		paymentTerms: [],
		departments: [],
	});
	const formik = useFormik({
		initialValues: {
			type: CustomerTypeEnum.individual.key,
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
			tax_preference: TaxTypeEnum.taxExempt.key,
			tax_id: '',
			exemption_reason: null,
			tax_authority: null,
			currency: 'US Dollar',
			opening_balance: '',
			mode_of_payment: '',
			term_id: '',
			is_portal_access: '',
			portal_language: '',
			facebook_link: '',
			twitter_link: '',
			remarks: '',
			customer_contacts: [
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
			customer_billing_address: {
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
			customer_shipping_address: {
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
			customer_files: [],
		},
		validationSchema: validationSchema,
		validate: values => {
			const errors = {};

			let contactErrors = values.customer_contacts?.map((contact, index) => {
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
					const otherContacts = values.customer_contacts.filter(
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
			if (tempArray) errors.customer_contacts = contactErrors;
			else delete errors.customer_contacts;

			return errors;
		},
		validateOnChange: false,
		onSubmit: async () => {
			setButtonLoading(true);
			const updatedValues = {
				...formik.values,
				customer_id: id,
				customer_contacts: formik.values.customer_contacts?.filter(
					obj => obj.first_name && obj.last_name && obj.email
				),
			};
			if (edit && id) {
				try {
					// await UpdateCustomerApi(id, updatedValues);
					await UpdateCustomerApi({ ...updatedValues, id, _method: 'PUT' });
					notyf.success('Customer Updated Successfully');
					navigate('/customer');
				} catch (e) {
					setButtonLoading(false);
					formik.setErrors(prettifyErrorfromObjectToArray(e.data.errors));
					console.log('error updating customer', e);
					document
						.querySelector('.toTop')
						?.scrollIntoView({ behavior: 'smooth' });
					// notyf.error(e.data.message);
				}
			} else {
				try {
					await createCustomer(updatedValues);
					notyf.success('Customer Created Successfully');
					navigate('/customer');
					setButtonLoading(false);
				} catch (e) {
					setButtonLoading(false);
					console.log('error creating', e.data.errors);
					formik.setErrors(prettifyErrorfromObjectToArray(e.data.errors));
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
			country_id: formik.values?.customer_billing_address?.country_id,
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
			// setCountryStates(
			// 	states?.data?.map(state => {
			// 		return {
			// 			value: state?.id,
			// 			text: state?.name,
			// 		};
			// 	})
			// );
		} catch (e) {
			console.log('e', e);
		}
	};
	useEffect(() => {
		getStatesForBilling();
	}, [formik.values?.customer_billing_address?.country_id]);

	// get state for shipping address
	const getStatesForShipping = async () => {
		const params = {
			country_id: formik.values?.customer_shipping_address?.country_id,
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
			// setCountryStates(
			// 	states?.data?.map(state => {
			// 		return {
			// 			value: state?.id,
			// 			text: state?.name,
			// 		};
			// 	})
			// );
		} catch (e) {
			console.log('e', e);
		}
	};
	useEffect(() => {
		getStatesForShipping();
	}, [formik.values?.customer_shipping_address?.country_id]);

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
	// get paymentresponse api
	const PaymentRespone = async () => {
		try {
			const paymentresponse = await getPeymentTermsApi();
			const terms = paymentresponse?.data?.map(term => {
				return {
					value: term?.id,
					text: term?.term_name,
					is_default: term?.is_default,
				};
			});
			setotherDetailsOptions(prev => {
				return {
					...prev,
					paymentTerms: terms,
				};
			});
			if (!id) {
				const term_id = terms?.find(t => !!t?.is_default)?.value;
				formik.setFieldValue('term_id', term_id);
			}
		} catch (e) {
			console.log('error: ', e);
		}
	};
	// get tax rate api
	const getAllTaxes = async () => {
		try {
			const taxrate = await getTaxesApi();
			setTexRate(
				taxrate?.data?.map(tex => {
					return {
						id: tex?.id,
						value: tex?.id,
						text: tex?.name,
					};
				})
			);
		} catch (e) {
			console.log('e', e);
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

	//  single customer api
	const getsinglecustomer = async () => {
		try {
			if (edit && id) {
				setLoading(true);
				const singleCustomer = await customersSingleApi(id);

				let customerBillingAddress = singleCustomer.customer_billing_address[0];
				let customerShippingAddress =
					singleCustomer.customer_shipping_address[0];
				formik.setValues(singleCustomer);
				formik.setFieldValue(
					'customer_billing_address',
					customerBillingAddress
				);
				formik.setFieldValue(
					'customer_shipping_address',
					customerShippingAddress
				);
			}
		} catch (e) {
			console.log('e', e);
		}
		setLoading(false);
	};

	useEffect(() => {
		getsinglecustomer();
		getCountriesFromApi();
		getAllCurrencies();
		PaymentRespone();
		getAllTaxes();
		getAllDepartments();
	}, []);

	// for display name
	const { salutation, first_name, last_name } = formik.values;
	const displayName = [];

	if (salutation !== '' && salutation !== null) {
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
			formik.errors?.customer_billing_address?.[field] &&
			formik.touched?.customer_billing_address?.[field]
	);
	const ErrorsInShippingAddress = formikInAddress.some(
		field =>
			formik.errors.customer_shipping_address?.[field] &&
			formik.touched?.customer_shipping_address?.[field]
	);
	const showErrorsInAddress = ErrorsInBillingAddress || ErrorsInShippingAddress;

	const formikInOtherDetails = ['tax_authority', 'exemption_reason'];
	const ErrorsInOtherDetails = formikInOtherDetails.some(
		field => formik.errors[field]
	);
	const scrollOnError = () => {
		const hasErrors = Object.keys(formik.errors).length > 0; // Check if there are errors
		if (hasErrors || contactPersonError || formik.errors) {
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
		const filterdArray = formik.errors?.customer_contacts?.filter(
			contact =>
				contact?.last_name ||
				contact?.email ||
				contact?.work_phone ||
				contact?.mobile
		);
		if (filterdArray?.length > 0) {
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
	// const departments = [
	// 	{ value: 'Frontend', text: 'Frontend' },
	// 	{ value: 'Backend', text: 'Backend' },
	// ];
	// console.log('showformik values', formik.values);
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
								{edit ? 'Edit Customer' : 'New Customer'}{' '}
							</Typography>
						</Grid>
						<Grid
							item
							xs={6}
							style={{ display: 'flex', justifyContent: 'end' }}
						>
							<IconButton onClick={() => goBack(() => navigate('/customer'))}>
								<Close />
							</IconButton>
						</Grid>
					</GridRow>
				</HeaderPaper>
				<form onSubmit={formik.handleSubmit}>
					<ContainerPaper>
						<Box mb={5} sx={{ minHeight: '80vh' }}>
							<Box aria-label='customer-details' className='toTop'>
								{/* customer Type  */}
								<GridRow style={{ alignItems: 'center' }}>
									<Grid item xs={2}>
										<Typography variant='body2'>
											Customer Type
											<HoverPopover text='The contact which are associated to any account in CRM is of type Business and the other contacts will be of type individuals' />
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<div>
											<FormControlLabel
												id='customerTypeBusiness'
												control={<Radio />}
												label={'Business'}
												checked={
													formik.values.type === CustomerTypeEnum.business.key
												}
												onChange={e => {
													formik.setFieldValue(
														'type',
														e.target.checked
															? CustomerTypeEnum.business.key
															: ''
													);
												}}
											/>
											<FormControlLabel
												id='customerTypeIndividual'
												control={<Radio />}
												label={'Individual'}
												checked={
													formik.values.type === CustomerTypeEnum.individual.key
												}
												onChange={e => {
													formik.setFieldValue(
														'type',
														e.target.checked
															? CustomerTypeEnum.individual.key
															: ''
													);
												}}
											/>
										</div>
									</Grid>
								</GridRow>
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
										{/* {formik.values.type === 'business' && (
											<Typography
												variant='caption'
												component={'p'}
												sx={{ margin: '-10px 0 10px 0' }}
											>
												<Info sx={{ fontSize: '15px', mb: '-3px' }} /> Last name
												is mandatory to sync this contact with IMS CRM.{' '}
											</Typography>
										)} */}
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
											onBlur={formik.handleBlur}
											isTouched={formik.touched.company_name}
											error={formik.errors.company_name}
											label={'Company Name'}
											required
										/>
									</Grid>
								</GridRow>
								<GridRow>
									<Grid item xs={2}>
										<Typography variant='body2'>
											Customer Display Name{' '}
											<span style={{ color: 'red' }}>
												*
												<HoverPopover text='This name will be displayed on the transactions you created for this customer.' />
											</span>
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
								{/* Customer Email  */}
								<GridRow>
									<Grid item xs={2}>
										<Typography variant='body2'>
											Customer Email{' '}
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
								{/* Customer Phone  */}
								<GridRow>
									<Grid item xs={2}>
										<Typography variant='body2'>
											Customer Phone{' '}
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
											onBlur={e => {
												formik.handleBlur(e);
												formik.setFieldValue(
													'customer_billing_address.phone',
													e.target.value
												);
												formik.setFieldValue(
													'customer_shipping_address.phone',
													e.target.value
												);
											}}
											isTouched={formik.touched.phone}
											error={formik.errors.phone}
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
										PaymentRespone={PaymentRespone}
										texRate={texRate}
										customerID={id}
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
												Settings &gt; Preferences &gt; Customers and
												<br />
												Vendors. You can also refine the address format of your
												customers from there.
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
							onClick={() => navigate('/customer')}
						>
							Cancel
						</Button>
					</Paper>
				</form>
			</>
		);
}

export default NewCustomerPage;
