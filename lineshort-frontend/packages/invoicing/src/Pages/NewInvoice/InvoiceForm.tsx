import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
// yup  / formik
import * as Yup from 'yup';
import { FormikProvider, useFormik } from 'formik';
// mui
import {
	Box,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	Paper,
	Stack,
	Typography,
	TextareaAutosize,
	Divider,
	Link,
} from '@mui/material';

import { NewEstimateFormLayout } from './NewInvoiceStyles';
import FormField from '@/Components/InputField/FormField';
import { useState } from 'react';
import MUIButton from '@/Components/Button/MUIButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
// apis
import {
	getPeymentTermsApi,
	customersSingleApi,
	generateNumberApi,
	createInvoiceApi,
	getCustomersApi,
	getSalesPersonApi,
	getInvoiceDetailsApi,
	updateInvoiceApi,
} from '@/apis/invoice';

import Address from './Adress/Address';
import InputLabel from '@/Components/InputLabel/InputLabel';
import CustomerContactsList from '@/Components/CustomerContacts/CustomerContactsList';
import HoverPopover from '@/Components/HoverPopover/ErrorOutlinePopover';
// helper
import { formatDateToYYYYMMDD, getCurrentDate } from '@/utils/helper';
import notyf from '@/Components/NotificationMessage/notyfInstance';
import AddItem from './AddItem/AddItem';
import HeaderPaper from '@/Components/Containers/HeaderPaper';
import { InitialValues } from '@/interfaces/InvoiceForm.interface';
import { FieldTitle } from '../../InvoiceStyleConst';
import CustomSelect from '@/Components/Select/Select';
import LoadingButton from '@mui/lab/LoadingButton';
import OverlayLoader from '@/Components/OverLayLoader';
import {
	PaymentTermValueEnum,
	dayPaymentTerms,
	netPaymentTerms,
} from '../constants';
interface PaymentSourceInterface {
	label: string;
	value: string;
}

interface SelectedCustomer {
	label: string;
	value: number;
}

const NewInvoice = ({ edit }: any) => {
	const { id } = useParams();
	const source_ref = useRef<any>();
	const navigate = useNavigate();
	const addItemRef = useRef<any>();
	const [customerOptions, setCustomerOptions] = useState<Customer[]>([]);
	const [salesPersonList, setSalesPersonList] = useState<SalesPerson[]>([]);
	const [customerEmailsList, setCustomerEmailsList] = useState([]);
	const [customerList, setCustomerList] = useState<any>('');
	const [selectedCustomer, setSelectedCustomer] =
		useState<SelectedCustomer | null>(null);
	const [selectedSalesPerson, setSelectedSalesPerson] = useState<{
		label: string | undefined;
		value: string | undefined;
	} | null>(null);
	const [invoiceFiles, setInvoiceFiles] = useState<File[]>([]);

	const [btnType, setBtnType] = useState('');
	const [customerLoading, setCsutomerLoading] = useState(false);
	const [salesLoading, setSalesLoading] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState('');

	const [loading, setLoading] = useState(false);
	// date terms
	const [selectedTerm, setSelectedTerm] = useState<any>([]);
	const [paymentTerms, setPaymentTerms] = useState<any>([]);
	const [paymentSource, setPaymentSource] =
		useState<PaymentSourceInterface[]>(dayPaymentTerms);
	const [taxIdCustomer, setTaxIdCustomer] = useState('');

	const [customError, setCustomError] = useState<any>({});

	const handlePaymentTerms = (label: string) => {
		const term = label.toLowerCase();
		if (term.includes('day')) setPaymentSource(dayPaymentTerms);
		if (term.includes('net')) setPaymentSource(netPaymentTerms);
		if (!edit) {
			setSelectedPayment({ value: '', label: '' });
		}
	};

	useEffect(() => {
		// formik.setErrors(customError);
	}, [customError]);

	const chequeImageRef = useRef<any>();

	//  formik/ new invoices
	const initialValues_: InitialValues = {
		customer_id: '',
		cheque_image: '',
		due_date: '',
		cheque_number: '',
		mode_of_payment: '',
		order_number: '',
		term_id: '',
		sales_person_id: '',
		invoice_number: '',
		reference_number: '',
		invoice_date: formatDateToYYYYMMDD(new Date()), // current Date
		expiry_date: formatDateToYYYYMMDD(new Date()) || '',
		subject: '',
		customer_note: '',
		terms_and_condition: '',
		invoice_files: invoiceFiles || [],
		email_to: customerEmailsList || [],
		// selectedCustomer: null,
		sub_total: 0,
		discount: 0,
		tax_amount: 0,
		discount_type: 'Percentage',
		shipping_charges: 0,
		adjustment: 0,
		items_rates_are: 'tax_exclusive',
		total: 0,
		invoice_items: !edit
			? [
					{
						item_name_object: '',
						item_id: '',
						item_name: '',
						quantity: 1,
						item_rate: 0,
						amount: 0,
						rate: 0,
						tax_amount: 0,
						tax_id: taxIdCustomer || 1,
						tax: '',
						total: 0,
					},
			  ]
			: [],
	};

	interface PaymentTerm {
		id: number;
	}

	const discountCalculate = (type, value, parentValue) => {
		return type === 'Percentage'
			? isNaN((parentValue * value) / 100)
				? '0.00'
				: `-${((parentValue * value) / 100).toFixed(2)}`
			: isNaN(value) || value === ''
			? '0.00'
			: `-${value.toFixed(2)}`;
	};

	const validationSchema = Yup.object().shape({
		customer_id: Yup.string().required('Customer  is required'),
		due_date: Yup.string().required('Due Date is required'),
		order_number: Yup.string().required('Order number  is required'),
		invoice_number: Yup.string().required('Invoice number is required'),
		invoice_date: Yup.string().required('Invoice date is required'),
		sales_person_id: Yup.string().required('Sales person is required'),
		term_id: Yup.string().required('Term is required'),
		// discount: Yup.number().min(0, 'Discount must be greater then 0 '),
		discount: Yup.number()
			.min(0, 'Discount must be greater then 0 ')
			.test(
				'lessThanOrEqual',
				'Discount must be less than or equal to Sub Total',
				function (value) {
					const subTotalValue = this.parent?.sub_total;
					const discountType = this.parent?.discount_type;
					return (
						Math.abs(
							parseInt(
								discountCalculate(discountType, value, subTotalValue),
								10
							)
						) <= parseInt(subTotalValue, 10)
					);
				}
			),
		adjustment: Yup.string().min(0, 'Adjustment must be greater then 0 '),
		shipping_charges: Yup.string().min(
			0,
			'Shipping charges must be greater then 0 '
		),
		invoice_items: Yup.array(
			Yup.object({
				item_name: Yup.string().required('Item name is required'),
				quantity: Yup.number()
					.required('Quantity is required')
					.min(1, 'Quantity must be greater than 0'),
				rate: Yup.number()
					.required('Rate is a required field')
					.min(1, 'Rate must be greater than 0'),
				tax: Yup.object().required('Tax is required'),
			})
		),

		mode_of_payment: Yup.string().required('Pyament mode is required'),

		cheque_number: Yup.string().when('mode_of_payment', {
			is: (mode_of_payment: any) =>
				mode_of_payment === PaymentTermValueEnum.Cheque,
			then: () => Yup.string().required('Cheque number is required'),
		}),

		cheque_image: Yup.string().when('mode_of_payment', {
			is: (mode_of_payment: any) =>
				mode_of_payment === PaymentTermValueEnum.Cheque,
			then: () =>
				Yup.string().when('mode_of_payment', {
					is: () => !edit && !singleInvoice?.cheque_image_path,
					then: () => Yup.string().required('Cheque image is required'),
				}),
		}),

		// invoice_items[0].taxt: Yup.string().required("Sales person is required")
	});

	const handleButtonClick = (type: React.SetStateAction<string>) => {
		setBtnType(type);
	};

	const [initialValues, setInitialValues] =
		useState<InitialValues>(initialValues_);

	const calculateDiscountAmount = (disoucnt, discountType, subTotal) => {
		if (discountType === 'dolloar') return disoucnt;
		return (disoucnt / 100) * subTotal;
	};
	// Define the onSubmit function
	const handleSubmit = async (
		values: any,
		{ setSubmitting, setFieldError }: any
	) => {
		if (values.total === '0.00' || values.total === 'NaN') {
			addItemRef.current?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		console.log(values);

		try {
			if (edit) {
				const newValues = { ...values };
				newValues.discount_amount = calculateDiscountAmount(
					newValues.discount,
					newValues.discount_type,
					newValues.sub_total
				);
				const resp: any = await updateInvoiceApi({
					...newValues,
					button_type: btnType,
					id,
					_method: 'PUT',
				});
				notyf.success(resp.message);
				navigate('/invoices');
			} else {
				const newValues = { ...values };

				newValues.mode_of_payment = paymentMethod;
				newValues.discount_amount = calculateDiscountAmount(
					newValues.discount,
					newValues.discount_type,
					newValues.sub_total
				);
				const resp: any = await createInvoiceApi({
					...newValues,
					button_type: btnType,
					origin: 'minnesota',
				});
				notyf.success(resp.message);
				setCustomError({});
				navigate('/invoices');
			}
		} catch (error: any) {
			const errorName = Object.keys(error?.data?.errors)[0];
			const errroMessage = Object.values(error?.data?.errors)[0][0];

			if (errorName) {
				setCustomError({
					[errorName]: errroMessage || 'something went wrong',
				});
				// formik.setErrors({
				// 	[errorName]: errroMessage || 'something went wrong',
				// });
				// setFieldError([errorName], errroMessage);
				return;
			}
			notyf.error(error.data.message);
			setFieldError(error?.data?.errors);
		} finally {
			setSubmitting(false);
		}
	};

	const formik: any = useFormik({
		// validateOnChange: false,
		initialValues,
		validationSchema,
		onSubmit: handleSubmit,
	});

	useEffect(() => {
		formik.setFieldValue('due_date', selectedTerm?.due_date);
		if (selectedTerm.label) handlePaymentTerms(selectedTerm.label);
	}, [selectedTerm?.id]);

	useEffect(() => {
		if (initialValues?.term_id) {
			//find specfic payment based on term_id
			const preSelectedTerms = paymentTerms.find(
				(item: PaymentTerm) => item.id === initialValues.term_id
			);
			setSelectedTerm(preSelectedTerms);
		}
	}, [initialValues?.term_id]);

	const fetchTerms = async () => {
		try {
			const response: any = await getPeymentTermsApi();
			const termsData: any = response?.data;
			if (termsData) {
				// Process the response and set state variables
				const termsOptions = termsData.map(
					(term: {
						term_name: any;
						id: any;
						number_of_days: any;
						due_date: string;
					}) => ({
						label: term?.term_name,
						value: term.id,
						number_of_days: term.number_of_days,
						id: term.id,
						due_date: term.due_date,
					})
				);

				// Set the state variables
				setPaymentTerms([...termsOptions]);
			}
		} catch (error) {
			// Handle errors here, e.g., display an error message or log the error
			console.error('Error fetching payment terms:', error);
		}
	};

	useEffect(() => {
		fetchTerms();
		// setSelectedPayment({ label: Source.Square, value: Source.Square });
		// setPaymentMethod(Source.Square);
		// formik.setFieldValue('mode_of_payment', Source.Square);
	}, []);

	console.log('invoice form render', formik);

	interface Customer {
		id: string;
		name: string;
	}

	const fetchCustomerOptions = async () => {
		const params = {};
		try {
			setCsutomerLoading(true);
			const resp: any = await getCustomersApi(params);
			const customersData: Customer[] | undefined = resp?.data?.Customers;
			if (customersData) {
				setCustomerOptions(customersData);
			}
		} catch (error) {
			console.error('Error fetching customers:', error);
		} finally {
			setCsutomerLoading(false);
		}
	};

	interface SalesPerson {
		// Define the structure of a sales person object based on your API response
		id: string;
		name: string;
	}

	const fetchSalesPersonList = async () => {
		const params = {};
		try {
			setSalesLoading(true);
			const resp: any = await getSalesPersonApi(params);
			const salesPersonsData: SalesPerson[] | undefined =
				resp?.data?.SalesPersons;

			if (salesPersonsData) {
				setSalesPersonList(salesPersonsData);
			}
		} catch (error) {
			console.error('Error fetching sales persons:', error);
		} finally {
			setSalesLoading(false);
		}
	};

	const generateNumber = async () => {
		try {
			const resp: any = await generateNumberApi({ type: 'invoice' });
			const generatedNumber: string | undefined = resp?.data[0];

			if (generatedNumber) {
				formik.setFieldValue('invoice_number', generatedNumber);
			}
		} catch (error) {
			console.error('Error generating number:', error);
		}
	};

	useEffect(() => {
		fetchCustomerOptions();
		fetchSalesPersonList();
		generateNumber();
	}, []);

	const params = new URLSearchParams(window.location.search);
	const customerId: string | null = params.get('customerId');

	useEffect(() => {
		formik.setFieldValue('customer_id', customerId);
	}, [customerId]);

	useEffect(() => {
		if (customerId && customerOptions.length > 0) {
			const defaultVal: any = customerOptions?.find(
				item => item?.id == customerId
			);
			setSelectedCustomer({
				label: defaultVal?.display_name,
				value: defaultVal.id,
			});
		}
	}, [customerId, customerOptions]);

	useEffect(() => {
		formik.setFieldValue('customer_id', customerId);
	}, [customerId]);

	// update customer  customerEmailsList when customer_id changes
	const gettingCUstomerList = async () => {
		try {
			// setLoading(true);
			if (formik.values.customer_id) {
				const resp: any = await customersSingleApi(formik.values.customer_id);

				if (!edit) {
					//setting term on cusotmer changed
					const termObject = {
						label: resp.term.term_name,
						value: resp.term.id,
						number_of_days: resp.term.number_of_days,
						id: resp.term.id,
						due_date: resp.term.due_date,
					};
					formik.setFieldValue('term_id', termObject.value);
					setSelectedTerm(termObject);
				}

				setCustomerEmailsList(resp?.customer_contacts);
				setCustomerList(resp);
				setTaxIdCustomer(resp.tax_id || 1);

				if (formik.values.invoice_items.length && !edit) {
					if (!formik.values.invoice_items?.[0]?.tax_id) {
						formik.setFieldValue(`invoice_items.${0}.tax_id`, resp.tax_id);
						formik.setFieldValue(
							`invoice_items.${0}.tax_amount`,
							resp?.tax?.rate
						);
					}
				}
				if (!edit) {
					formik.setFieldValue(
						'items_rates_are',
						resp.tax_preference === 'taxable'
							? 'tax_exclusive'
							: 'tax_inclusive'
					);
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			// setLoading(false);
		}
	};
	useEffect(() => {
		if (formik.values.customer_id !== null) {
			gettingCUstomerList();
		}
	}, [formik.values.customer_id]);

	// handle  customer email list  lists , checked and unchecked sending to backend
	useEffect(() => {
		formik.setFieldValue(
			'email_to',
			customerEmailsList
				?.filter((item: any) => item.is_selected === 1) // update emails_to with those emails which are checked(its is_selected key is 1)
				.map((item: any) => item.email)
		);
	}, [formik.values.customer_id, customerEmailsList]);

	// file work
	const handleFileInputChange = (event: { target: { files: any } }) => {
		const files = event.target.files;

		// if (files.length > 0) {
		// 	const newFiles = Array.from(files);
		// 	setInvoiceFiles((prevFiles) => [...prevFiles, ...newFiles]);
		// }

		if (files.length > 0) {
			const newFiles: File[] = Array.from(files);
			setInvoiceFiles((prevFiles: File[]) => [...prevFiles, ...newFiles]);
		}
	};

	// file work
	const handleChequeChange = (event: { target: { files: any } }) => {
		const files = event.target.files;
		formik.setFieldValue('cheque_image', files[0]);
	};

	// delete/remove added files from list
	const deleteFile = (id: File) => {
		setInvoiceFiles(prevFiles => prevFiles.filter(f => f !== id));
	};

	// handle files on changes .set values to formik
	useEffect(() => {
		formik.setFieldValue('invoice_files', invoiceFiles);
	}, [invoiceFiles]);

	const [singleInvoice, setSingleInvoice] = useState<any>('');

	useEffect(() => {
		if (id) {
			setLoading(true);
			fetchingSingleInvoice();
		}
	}, [id]);

	const fetchingSingleInvoice = async () => {
		try {
			const resp: any = await getInvoiceDetailsApi(id);
			const { mode_of_payment, mode_of_payment_value } = resp.data;
			const responseData = { ...resp.data };

			if (!responseData.cheque_image)
				responseData.cheque_image = resp.data.cheque_image_path || '';

			responseData.invoice_items.forEach(item => {
				item.item_name_object = {
					label: item.item_name,
					value: item.item_id,
					price: item?.rate || 0,
				};
			});

			resp.data.cheque_image_path === null ? '' : resp.data.cheque_image_path;
			responseData['cheque_number'] =
				resp.data.cheque_number === null ? '' : resp.data.cheque_number;

			if (responseData.discount === null) {
				responseData.discount = 0;
			}

			formik.setValues(responseData);

			setSingleInvoice(responseData);
			setInitialValues(responseData);

			setInvoiceFiles(responseData.invoice_files);

			const termObject = {
				label: responseData.term.term_name,
				value: responseData.term.id,
				number_of_days: responseData.term.number_of_days,
				id: responseData.term.id,
				due_date: responseData.term.due_date,
			};
			formik.setFieldValue('term_id', termObject.value);
			setSelectedTerm(termObject);

			setSelectedPayment({
				label: mode_of_payment_value,
				value: mode_of_payment,
			});
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	// setting invoices default options for customer

	useEffect(() => {
		if (id && customerOptions.length > 0 && singleInvoice) {
			const defaultVal: any = customerOptions.find(
				item => item.id === formik.values.customer_id
			);

			// Set the selectedCustomer state with the default value
			setSelectedCustomer({
				label: defaultVal?.display_name,
				value: defaultVal?.id,
			});

			const defaultValSales = salesPersonList.find(
				item => item.id === formik.values.sales_person_id
			);

			// Set the selectedCustomer state with the default value
			setSelectedSalesPerson({
				label: defaultValSales?.name,
				value: defaultValSales?.id,
			});
		}
	}, [id, customerOptions, singleInvoice]);

	// setting invoices default options for sales person

	const [selectedPayment, setSelectedPayment] =
		useState<PaymentSourceInterface>();

	const handleSelectChange = (newOption: any, type: string) => {
		if (type === 'customer_id') {
			setSelectedCustomer(newOption);
			formik.setFieldValue('customer_id', newOption); // Field Value / Label
			// formik.setFieldValue('tax', {
			// 	name: newOption.label,
			// 	id: newOption.value,
			// 	rate: newOption.price || 0,
			// }); // Field Value / Label
		}
		if (type === 'sales_person_id') {
			setSelectedSalesPerson(newOption);
		}

		if (type === 'term_id') setSelectedTerm(newOption);
		if (type === 'mode_of_payment') {
			setPaymentMethod(newOption.value);

			setSelectedPayment({
				value: newOption.value,
				label: newOption.label,
			});
		}

		formik.setFieldValue(type, newOption?.value); //  formik values
	};

	const labelStyle = {
		display: 'flex',
		alignItems: 'center',
	};

	const selectControlStyles = (baseStyles: any) => ({
		...baseStyles,
		fontSize: '13px',
		fontWeight: 400,
		fontFamily: 'Roboto',
		color: 'black',
		background: 'transparent',
		borderColor:
			formik.touched.customer_id && formik.errors.customer_id
				? 'red'
				: 'rgba(0, 0, 0, 0.2)',
	});

	useEffect(() => {
		console.log(formik);
		if (
			(formik.dirty === true && Object.keys(formik.errors).length !== 0) ||
			Object.keys(customError).length !== 0
		) {
			if (
				Object.keys(formik.errors).length === 1 &&
				Object.keys(formik.errors)[0] === 'mode_of_payment'
			) {
				source_ref.current?.scrollIntoView({ behavior: 'smooth' });
				return;
			}
			const el = document.querySelector('.Mui-error, [data-error]');
			(el?.parentElement ?? el)?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [formik.isSubmitting]);

	const selectMenuStyles = (baseStyles: any) => ({
		...baseStyles,
		zIndex: 9999,
		fontFamily: 'Roboto',
		fontSize: '13px',
		color: 'black',
	});

	const MyDivider = () => (
		<Grid item xs={12} mt={3}>
			<Divider />
		</Grid>
	);

	return (
		<>
			<OverlayLoader open={loading} />
			<FormikProvider value={formik}>
				<form onSubmit={formik.handleSubmit}>
					<div style={{ position: 'relative' }}>
						<Grid container>
							{/* top title / page header  */}
							<Grid item sm={12}>
								<HeaderPaper
									sx={{
										paddingLeft: '2rem',
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<Typography variant='h6'>
										{edit ? 'Edit Invoice' : 'New Invoice'}
									</Typography>
									<IconButton
										onClick={() => navigate('/invoices')}
										aria-label='delete'
									>
										<CloseIcon fontSize='medium' htmlColor='#0000008F' />
									</IconButton>
								</HeaderPaper>
							</Grid>
							{/* main layout   */}
							<NewEstimateFormLayout>
								<Grid item container>
									<Grid item xs={2} sx={{ ...labelStyle }}>
										<InputLabel required={true}>Customer Name</InputLabel>
									</Grid>
									<Grid item xs={4}>
										<CustomSelect
											id='customer_id'
											placeholder='Select or add a  Customer'
											value={selectedCustomer || ''} // Set the default value here
											options={customerOptions?.map((item: any) => ({
												label: item?.display_name || '',
												value: item.id,
											}))}
											isDisabled={loading || customerLoading}
											loading={loading || customerLoading}
											onChange={selected =>
												handleSelectChange(selected, 'customer_id')
											}
											isSearchable
											isClearable
											touched={!!formik.touched.customer_id}
											error={formik.errors.customer_id}
										/>
									</Grid>
								</Grid>
								{/* address container  */}
								<Grid item container>
									<Grid item xs={2}></Grid>
									{selectedCustomer ? (
										<Grid
											item
											sm={4}
											bgcolor='#f9f9fb'
											display='flex'
											justifyContent='space-between'
										>
											<Grid item xs={6}>
												<Address
													billing
													selectedCustomer={selectedCustomer}
													gettingCUstomerList={gettingCUstomerList}
													customer_id={formik.values.customer_id}
													customer_billing_address={
														customerList?.customer_billing_address
													}
													customerList={customerList}

													// loading={loading}
												/>
											</Grid>
											<Grid item xs={6}>
												<Address
													shipping
													selectedCustomer={selectedCustomer}
													gettingCUstomerList={gettingCUstomerList}
													customer_billing_address={
														customerList?.customer_shipping_address
													}
													customerList={customerList}
													customer_id={formik.values.customer_id}
												/>
											</Grid>
										</Grid>
									) : null}
								</Grid>
								{/* </Box> */}

								<>
									<Grid item container mt={2}>
										<Grid item xs={2} sx={{ ...labelStyle }}>
											<InputLabel required>Invoice #</InputLabel>
										</Grid>
										<Grid item sm={4}>
											<FormField
												name='invoice_number'
												placeholder='QU-3242'
												size='small'
												disabled={loading}
												loading={loading}
												type='text'
												fullWidth
												value={formik.values.invoice_number || ''}
												handleChange={formik.handleChange}
												onBlur={formik.handleBlur}
												isTouched={!!formik.touched.invoice_number}
												error={formik.errors.invoice_number}
											/>
										</Grid>
									</Grid>

									<Grid item container mt={2}>
										<Grid item xs={2} display='flex' alignItems='center'>
											<InputLabel required>Order #</InputLabel>
										</Grid>
										<Grid item xs={4}>
											<FormField
												placeholder='2930'
												name='order_number'
												size='small'
												loading={loading}
												fullWidth
												type='text'
												value={formik.values.order_number || ''}
												handleChange={formik.handleChange}
												isTouched={!!formik.touched.order_number}
												error={
													formik.errors.order_number ||
													customError?.order_number
												}
											/>
										</Grid>
									</Grid>

									<Grid item container mt={2}>
										<Grid item xs={2}>
											<InputLabel>Invoice Date</InputLabel>
										</Grid>
										<Grid item xs={4}>
											<FormField
												minDate={getCurrentDate()}
												loading={loading}
												name='invoice_date'
												value={formik.values.invoice_date || ''}
												onChange={formik.handleChange}
												size='small'
												fullWidth
												type='date'
												error={formik.errors.invoice_date}
												isTouched={!!formik.touched.invoice_date}
											/>
										</Grid>
										<Grid item xs={1}>
											<InputLabel required sx={{ textAlign: 'center' }}>
												Terms
											</InputLabel>
										</Grid>
										<Grid item xs={2}>
											<CustomSelect
												name='term_id'
												id='term_id'
												value={selectedTerm || ''}
												options={paymentTerms}
												className='basic-multi-select'
												classNamePrefix='select'
												placeholder='Select Validity Date'
												onChange={selected =>
													handleSelectChange(selected, 'term_id')
												}
												loading={undefined}
												touched={!!formik.touched.term_id}
												error={formik.errors.term_id}
											/>
										</Grid>
										<Grid item xs={1}>
											<InputLabel required sx={{ textAlign: 'center' }}>
												Due Date
											</InputLabel>{' '}
										</Grid>
										<Grid item xs={2}>
											<FormField
												loading={loading}
												minDate={getCurrentDate()}
												name='due_date'
												value={formik.values.due_date || ''}
												onChange={formik.handleChange}
												size='small'
												fullWidth
												type='date'
												error={formik.errors.due_date}
												isTouched={!!formik.touched.due_date}
											/>
										</Grid>
									</Grid>

									<MyDivider />

									{/* sales  */}
									<Grid item container sx={{ margin: '2rem 0' }}>
										<Grid item xs={2} display='flex' alignItems='center'>
											<InputLabel required={true}>Sales Person</InputLabel>
										</Grid>
										<Grid item xs={4}>
											<CustomSelect
												value={selectedSalesPerson || ''}
												name='sales_person_id'
												id='sales_person_id'
												className='basic-multi-select'
												classNamePrefix='select'
												placeholder='Select or add sales persons'
												options={salesPersonList?.map(item => ({
													label: item.name,
													value: item.id,
												}))}
												onChange={selected =>
													handleSelectChange(selected, 'sales_person_id')
												}
												touched={!!formik.touched.sales_person_id}
												error={
													formik.touched.sales_person_id &&
													formik.errors.sales_person_id &&
													formik.errors.sales_person_id
												}
												loading={salesLoading}
											/>
										</Grid>
										<MyDivider />
									</Grid>
									{/* Subject  */}
									<Grid item container sx={{ margin: '1rem 0' }}>
										<Grid item xs={2} sx={{ ...labelStyle }}>
											<InputLabel
												sx={{ display: 'flex', alignItems: 'center' }}
											>
												Subject
												<HoverPopover text='You can add subject for invoice '></HoverPopover>
											</InputLabel>
										</Grid>
										<Grid item xs={4}>
											<TextareaAutosize
												minRows={2}
												aria-label='textarea'
												style={{
													width: 'calc(100% - 0rem)',
													borderRadius: '4px',
													outlineColor: '#1565c0',
													borderColor: '#bdbdbd',
													padding: '8px',
													fontFamily: 'Roboto',
													fontSize: '16px',
													color: 'black',
												}} // only style working
												placeholder='let your customer know what this Invoice for'
												name='subject'
												value={formik.values.subject || ''}
												onChange={formik.handleChange}
											/>
										</Grid>
										<MyDivider />
									</Grid>
									{/* item rates  */}
								</>

								{/* add row comp  */}
								<>
									{/* total calcaultion section  */}
									{/* <NewEstimateFormTotal /> */}
									<Grid
										item
										container
										sx={{ marginTop: '2rem' }}
										display='flex'
										justifyContent='flex-end'
									>
										{/* left section .. empty */}
										<Grid item xs={12} md={6}>
											{/* <Typography>Right Side</Typography> */}
										</Grid>

										<Grid item container spacing={2} my={7}>
											<Grid item sm={12}>
												<Box ref={addItemRef}>
													<AddItem
														loading={loading}
														formiks={{
															values: {
																total: formik.values.total,
																sub_total: formik.values.sub_total,
																invoice_items: formik.values.invoice_items,
																adjustment: formik.values.adjustment,
																discount: formik.values.discount,
																shipping_charges:
																	formik.values.shipping_charges,
																discount_type: formik.values.discount_type,
																items_rates_are: formik.values.items_rates_are,
															},
															errors: formik.errors,
															touched: {
																invoice_items: formik.touched.invoice_items,
																adjustment: formik.touched.adjustment,
																discount: formik.touched.discount,
																shipping_charges:
																	formik.touched.shipping_charges,
																discount_type: formik.touched.discount_type,
															},
															handleChange: formik.handleChange,
															setFieldValue: formik.setFieldValue,
														}}
														customerTax={customerList.tax}
														isEdit={edit}
														taxIdCustomer={taxIdCustomer}
													/>
												</Box>
											</Grid>
											<Grid item xs={6}>
												<Grid item xs={12}>
													<FieldTitle>Customer Notes</FieldTitle>
													<FormField
														loading={loading}
														fullWidth
														// label='Notes'
														multiline
														rows={3}
														id={'customer_note'}
														name={'customer_note'}
														value={formik.values.customer_note}
														onChange={formik.handleChange}
														error={undefined} // variant="outlined"
													/>
												</Grid>
												<Grid item xs={12}>
													<FieldTitle>Terms and conditions</FieldTitle>
													<FormField
														loading={loading}
														fullWidth
														// label='Terms and conditions'
														multiline
														rows={3}
														id='terms_and_condition'
														onChange={formik.handleChange}
														value={formik.values.terms_and_condition}
														error={undefined} // variant="outlined"
													/>
												</Grid>
											</Grid>
											<Grid item xs={6} display='flex' justifyContent='center'>
												<Box
													sx={{
														width: '43%',
														display: 'flex',
														flexDirection: 'column',
														alignItems: 'center',
													}}
												>
													<FieldTitle>Attach file(s) to Invoice</FieldTitle>

													<label htmlFor='file-input'>
														<MUIButton
															disabled={invoiceFiles.length === 5}
															startIcon={<SendIcon />}
															sx={{
																border: '1px solid grey',
																color: 'black',
																textTransform: 'capitalize',
																padding: '32px, 16px, 32px, 16px',
																height: '35px',
																width: '150px',
															}}
															variant='outlined'
															component='span'
															onClick={() =>
																document.getElementById('file-input')?.click()
															}
														>
															Upload File
														</MUIButton>

														<input
															id='file-input'
															type='file'
															multiple
															style={{ display: 'none' }}
															onChange={handleFileInputChange}
														/>
													</label>

													<Typography variant='caption' mt={1}>
														You can upload a maximum of 5 files, 5MB each
													</Typography>

													<List>
														{invoiceFiles?.map((file: any, index) => (
															<ListItem key={index}>
																<Typography>
																	{(id && file.file_name) || file.name}
																</Typography>
																<ListItemSecondaryAction>
																	<IconButton
																		edge='end'
																		aria-label='delete'
																		onClick={() =>
																			deleteFile((id && file.id) || file)
																		}
																	>
																		<DeleteIcon />
																	</IconButton>
																</ListItemSecondaryAction>
															</ListItem>
														))}
													</List>
												</Box>
											</Grid>
											<Box mt={6} ml={2}>
												<Typography>Payment Information</Typography>
											</Box>
											<Grid item container mt={2}>
												<Grid item xs={2}>
													<InputLabel>Source</InputLabel>
													{formik?.value?.mode_of_payment}
												</Grid>
												<Grid item xs={4} ref={source_ref}>
													<CustomSelect
														name='mode_of_payment'
														value={selectedPayment}
														options={paymentSource}
														className='basic-multi-select'
														classNamePrefix='select'
														placeholder='Select Validity Date'
														onChange={selected =>
															handleSelectChange(selected, 'mode_of_payment')
														}
														styles={{
															control: selectControlStyles,
															menu: selectMenuStyles,
														}}
														id={''}
														touched={!!formik.touched.mode_of_payment}
														error={
															formik.touched.mode_of_payment &&
															formik.errors.mode_of_payment &&
															formik.errors.mode_of_payment
														}
														loading={false}
													/>
												</Grid>
											</Grid>
											{selectedPayment?.value ===
												PaymentTermValueEnum.Cheque && (
												<Grid item alignItems='center' container mt={2}>
													<Grid item xs={2}>
														<InputLabel
															required={
																selectedPayment?.value ===
																PaymentTermValueEnum.Cheque
															}
														>
															Reference / Check #
														</InputLabel>
													</Grid>
													<Grid item xs={4}>
														<FormField
															loading={loading}
															disabled={
																selectedPayment?.value !==
																PaymentTermValueEnum.Cheque
															}
															name='cheque_number'
															value={formik.values.cheque_number}
															onChange={formik.handleChange}
															size='small'
															fullWidth
															type='text'
														/>

														{formik.touched.cheque_number &&
															formik.errors.cheque_number && (
																<Typography variant='caption' color='error'>
																	{formik.errors.cheque_number.toString()}
																</Typography>
															)}
													</Grid>
													{selectedPayment?.value ===
														PaymentTermValueEnum.Cheque && (
														<Grid item xs={4} sx={{ ml: 4 }}>
															<Box sx={{ display: 'flex' }}>
																<InputLabel
																	required={
																		selectedPayment?.value ===
																		PaymentTermValueEnum.Cheque
																	}
																>
																	Cheque Image
																</InputLabel>

																<label htmlFor='file-input-cheque'>
																	<MUIButton
																		disabled={
																			selectedPayment?.value !==
																			PaymentTermValueEnum.Cheque
																		}
																		startIcon={<AttachFileIcon />}
																		sx={{
																			border: 'none',
																			color: 'black',
																			textTransform: 'capitalize',
																		}}
																		variant='text'
																		component='span'
																		onClick={() =>
																			document
																				.getElementById('file-input-cheque')
																				?.click()
																		}
																		fullWidth
																	></MUIButton>

																	<input
																		id='file-input-cheque'
																		type='file'
																		accept='image/*'
																		ref={chequeImageRef}
																		name='cheque_image'
																		disabled={
																			selectedPayment?.value !==
																			PaymentTermValueEnum.Cheque
																		}
																		style={{ display: 'none' }}
																		onChange={handleChequeChange}
																	/>
																</label>
															</Box>
															<Box
																sx={{
																	display: 'flex',
																	alignItems: 'center',
																	gap: 2,
																}}
															>
																{!edit && (
																	<Typography>
																		{formik.values.cheque_image?.name}
																	</Typography>
																)}
																{edit &&
																	(formik.values.cheque_image?.name ? (
																		<Typography>
																			{formik.values.cheque_image?.name}
																		</Typography>
																	) : (
																		<Link
																			target='_blank'
																			rel='noreferrer'
																			href={singleInvoice.cheque_image_path}
																		>
																			{singleInvoice.cheque_image_name}
																		</Link>
																	))}
																{formik.values.cheque_image && (
																	<MUIButton
																		startIcon={<DeleteIcon />}
																		sx={{
																			border: 'none',
																			color: 'black',
																			textTransform: 'capitalize',
																		}}
																		variant='text'
																		component='span'
																		onClick={() => {
																			formik.setFieldValue('cheque_image', '');
																			if (chequeImageRef.current) {
																				chequeImageRef.current.value = '';
																			}
																		}}
																	></MUIButton>
																)}
															</Box>
														</Grid>
													)}
												</Grid>
											)}
										</Grid>
									</Grid>
								</>

								{/* add new email/contact section  */}
								{customerEmailsList?.length > 0 && selectedCustomer && (
									<CustomerContactsList
										customer_id={formik.values.customer_id}
										setCustomerEmailsList={setCustomerEmailsList}
										gettingCUstomerList={gettingCUstomerList}
										customerEmailsList={customerEmailsList}
										customerList={customerList}
									/>
								)}
							</NewEstimateFormLayout>
							{/* footer/ (send/save/cancel btns) section  */}

							<Box
								style={{
									position: 'fixed',
									bottom: 0,
									width: '100%',
									zIndex: 9999,
								}}
							>
								<Paper
									elevation={10}
									style={{ padding: '.2rem 1rem 2rem 1rem', zIndex: 9999 }}
								>
									<Grid container>
										<Grid
											item
											xs={12}
											display='flex'
											alignItems='center'
											mt='2rem'
											pl='2rem'
										>
											<Stack direction='row' spacing={2}>
												<LoadingButton
													type='submit'
													variant='outlined'
													onClick={() => handleButtonClick('save_as_draft')}
													disabled={formik.isSubmitting}
													loading={
														formik.isSubmitting && btnType === 'save_as_draft'
													}
												>
													Save as Draft
												</LoadingButton>

												<LoadingButton
													// sx={{ fontWeight: 500, fontSize: '0.9rem' }}
													variant='contained'
													type='submit'
													onClick={() => handleButtonClick('save_and_send')}
													disabled={formik.isSubmitting}
													loading={
														formik.isSubmitting && btnType === 'save_and_send'
													}
												>
													Save and send
												</LoadingButton>
												<MUIButton
													variant='outlined'
													onClick={() => navigate(-1)}
												>
													Cancel
												</MUIButton>
											</Stack>
										</Grid>
									</Grid>
								</Paper>
							</Box>
						</Grid>
					</div>
				</form>
			</FormikProvider>
		</>
	);
};

export default NewInvoice;
