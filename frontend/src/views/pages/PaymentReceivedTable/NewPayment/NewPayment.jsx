import { useState, useEffect } from 'react';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import {
	Button,
	Grid,
	IconButton,
	Paper,
	Typography,
	CircularProgress,
	InputAdornment,
	Autocomplete,
	TextField,
	List,
	ListItem,
	ListItemSecondaryAction,
	Divider,
	Select,
	Link,
} from '@mui/material';
import FormField from '../../../Components/InputField/FormField';
import {
	AccountCircle,
	Close,
	Delete,
	Download,
	East,
	EventNote,
	KeyboardArrowDown,
	UploadFile,
	Warning,
} from '@mui/icons-material';
import {
	customersSingleApi,
	getCustomerInvoices,
} from '../../../../core/api/customer';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { Box } from '@mui/system';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import ContainerPaper from '../../../Components/Containers/ContainerPaper';
import { useNavigate, useParams } from 'react-router-dom';
import GridRow from '../../../Components/GridRow/GridRow';
import { LoadingButton } from '@mui/lab';
import { getCurrentDate } from '../../../../core/utils/helpers';
import CustomerContactsList from '../../../Components/CustomerContacts/CustomerContactsList';
import {
	SinglePaymentReceivedApi,
	createPaymentReceivedApi,
	deletePaymentReceivedFielsApi,
	getAmountReceived,
	updatePaymentReceivedApi,
} from '../../../../core/api/paymentRecivied';
import FilesModule from '../../../Components/FileUpload/FilesModule';

function NewCustomerPage() {
	const { id } = useParams();
	// const [isOpen, setIsOpen] = useState(false);
	// const [loading, setLoading] = useState(false);
	const [buttonloading, setButtonLoading] = useState(false);
	const [fieldError, setFieldError] = useState('');
	const [paymentFiles, setPaymentFiles] = useState([]);
	// const [showFiles, setShowFiles] = useState();
	const [customerOptions, setCustomerOptions] = useState([]);
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [selectedCustomerOption, setselectedCustomerOption] = useState();
	const [customerEmailsList, setCustomerEmailsList] = useState([]);
	const [customerViewOpen, setCustomerViewOpen] = useState(false);
	const [singleCustomerDetail, setSingleCustomerDetail] = useState(false);
	const [invoiceOptions, setinvoiceOptions] = useState([]);
	const [selectedinvoiceOptions, setSelectedinvoiceOptions] = useState([]);
	const [UnpaidInvoicesData, setUnpaidInvoicesData] = useState();
	const [allInvoices, setallInvoices] = useState();
	const [receivedAmount, setReceivedAmount] = useState();
	const params = new URLSearchParams(window.location.search);
	const customerIdParam = decryptId(params.get('customerId'));
	const navigate = useNavigate();

	const closeCustomerView = () => {
		setCustomerViewOpen(!customerViewOpen);
	};
	let maxPaymentValue = 0;
	if (UnpaidInvoicesData?.due_amount) {
		maxPaymentValue = parseFloat(
			UnpaidInvoicesData?.due_amount.toString().replace(/,/g, '')
		);
	}

	const validationSchema = Yup.object().shape({
		payment_made: Yup.number()
			.typeError('Payment must be a number')
			.max(maxPaymentValue, 'Payment cannot be greater than due amount')
			.required('Payment is required'),
		// Other fields and validation rules...
	});
	const formik = useFormik({
		initialValues: {
			customer_id: '',
			invoice_id: '',
			amount_received: '',
			payment_date: getCurrentDate(),
			payment_number: '',
			payment_mode: 'cash',
			reference_number: '',
			payment_made: '',
			notes: '',
			payment_receive_files: paymentFiles || [],
			payment_receive_emails: '',
		},
		validationSchema: validationSchema,

		onSubmit: async values => {
			setButtonLoading(true);
			if (id) {
				try {
					await updatePaymentReceivedApi({ ...values, id, _method: 'PUT' });
					notyf.success('Payment Updated Successfully');
					navigate('/payment-received');
				} catch (e) {
					setButtonLoading(false);
					setFieldError(e.data.errors);
				}
			} else {
				try {
					await createPaymentReceivedApi(values);
					notyf.success('Payment Created Successfully');
					navigate('/payment-received');
					setButtonLoading(false);
				} catch (e) {
					setButtonLoading(false);
					setFieldError(e.data.errors);
				} finally {
					setButtonLoading(false);
				}
			}
		},
	});
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth', // You can adjust the scrolling behavior if needed
		});
	};
	// set error in formik fileds
	useEffect(() => {
		formik.setErrors(prettifyErrorfromObjectToArray(fieldError) || {});
		scrollToTop();
	}, [fieldError]);

	//  single PaymentData api
	const getsinglePaymentData = async () => {
		try {
			if (id) {
				const singlePayment = await SinglePaymentReceivedApi(id);
				formik.setValues(singlePayment);
				setPaymentFiles(singlePayment?.payment_receive_files);
			}
		} catch (e) {
			console.log('e', e);
		}
	};

	useEffect(() => {
		getsinglePaymentData();
	}, []);

	useEffect(() => {
		if (id) {
			let option = customerOptions?.find(
				option => formik.values?.customer_id == option.value
			);
			setSelectedCustomer(option?.value);
			setselectedCustomerOption(option);
			formik.setFieldValue('customer_id', option?.value);

			const findInvoiceId = invoiceOptions?.find(
				invoice => formik.values.invoice?.id == invoice.value
			);
			setSelectedinvoiceOptions(findInvoiceId);
			formik.setFieldValue('invoice_id', findInvoiceId?.value);
		}
		if (customerIdParam) {
			let option = customerOptions?.find(
				option => customerIdParam == option.value
			);
			setSelectedCustomer(option?.value);
			setselectedCustomerOption(option);
			formik.setFieldValue('customer_id', option?.value);
		}
	}, [id, customerOptions, customerIdParam, invoiceOptions]);

	//  customer options
	const fetchCustomerOptions = async () => {
		try {
			const resp = await getCustomersApi();
			setCustomerOptions(() =>
				resp?.data?.Customers?.map(item => ({
					label: item.display_name,
					value: item.id,
				}))
			);
		} catch (error) {
			console.log('error', error);
		}
	};
	// fetch data on load
	useEffect(() => {
		fetchCustomerOptions();
	}, []);
	const gettingCustomerDetail = async () => {
		try {
			if (selectedCustomer) {
				const resp = await customersSingleApi(selectedCustomer);
				setSingleCustomerDetail(resp);
				setCustomerEmailsList(resp?.customer_contacts);
			}
		} catch (error) {
			console.log('error', error);
		}
	};
	// fetch single customer data on selection of customer
	useEffect(() => {
		if (selectedCustomer !== null) {
			gettingCustomerDetail();
			handleInvoicesOfCustomer(selectedCustomer);
		}
	}, [selectedCustomer]);

	const handleInvoicesOfCustomer = async id => {
		const params = {
			customer_id: id,
		};
		if (params?.customer_id !== undefined) {
			const res = await getCustomerInvoices(params);

			setallInvoices(res?.data);

			setinvoiceOptions(
				res?.data?.map(item => ({
					label: item.invoice_number,
					value: item.id,
				}))
			);
		}
	};
	useEffect(() => {
		let findselecteInvoice = allInvoices?.find(
			invoice => selectedinvoiceOptions?.value === invoice?.id
		);
		setUnpaidInvoicesData(findselecteInvoice);
		async function fetchData() {
			if (findselecteInvoice?.id) {
				const amountRec = await getAmountReceived({
					invoice_id: findselecteInvoice?.id,
				});
				setReceivedAmount(amountRec?.data?.amount_received);
				formik.setFieldValue(
					'amount_received',
					amountRec?.data?.amount_received
				);
			}
		}
		fetchData();
	}, [allInvoices, selectedinvoiceOptions]);

	//   handle select change
	const handleSelectChange = (event, newValue) => {
		setSelectedCustomer(newValue?.value);
		setselectedCustomerOption(newValue);
		formik.setFieldValue('customer_id', newValue?.value);
	};
	//   handle invoice select change
	const handleInvoiceChange = (event, newValue) => {
		setSelectedinvoiceOptions(newValue);
		formik.setFieldValue('invoice_id', newValue?.value);
	};
	// handle  customer email list  lists , checked and unchecked sending to backend
	useEffect(() => {
		const selectedEmailss = customerEmailsList
			?.filter(item => item.is_selected === 1)
			.map(item => item.email);
		formik.setFieldValue('payment_receive_emails', selectedEmailss || []);
	}, [customerEmailsList]);

	const paymentModes = [
		{ value: 'cash', text: 'cash' },
		{ value: 'square', text: 'square' },
		{ value: 'cheque', text: 'cheque' },
	];

	const deletingFile = async file => {
		try {
			if (file.id) {
				const resp = await deletePaymentReceivedFielsApi(file?.id);
				setPaymentFiles(prevFiles => prevFiles.filter(f => f.id !== file.id));
				notyf.success(resp?.message);
			} else {
				setPaymentFiles(prevFiles => prevFiles.filter(f => f !== file));
			}
		} catch (error) {
			console.log('error', error);
		}
	};

	useEffect(() => {
		formik.setFieldValue('payment_receive_files', paymentFiles);
	}, [paymentFiles]);

	return (
		<>
			<HeaderPaper>
				<GridRow style={{ marginBottom: '0px', alignItems: 'center' }}>
					<Grid item xs={6}>
						<Typography variant='h6'>Record Payment</Typography>
					</Grid>
					<Grid item xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
						<IconButton onClick={() => navigate('/payment-received')}>
							<Close />
						</IconButton>
					</Grid>
				</GridRow>
			</HeaderPaper>
			<form onSubmit={formik.handleSubmit}>
				<ContainerPaper>
					<Box aria-label='payment-received-form' py={1}>
						{/* Company Name  */}
						{/* <GridRow>
							<Grid item xs={2}>
								<Typography variant='body2'>
									Customer Name <span style={{ color: 'red' }}>*</span>
								</Typography>
							</Grid> */}
						{/* <Grid item xs={4}> */}
						<CustomerSelection
							id='customer_id'
							options={customerOptions || []}
							value={selectedCustomerOption || []}
							getOptionLabel={option => option?.label || ''}
							onChange={handleSelectChange}
							sx={{
								marginTop: '-10px',
								'& .MuiInputBase-root': {
									fontSize: '16px',
									padding: '0px 5px',
								},
							}}
							renderInput={params => (
								<TextField
									sx={{
										'& .MuiInputBase-root': {
											'& .MuiInputBase-input': {
												padding: '4px 0px',
												fontSize: '14px',
												marginTop: '2px',
											},
											padding: '5px 10px',
											top: '5px',
										},
									}}
									required
									{...params}
									label='Customer Name'
								/>
							)}
						/>
						{/* </Grid>
						</GridRow> */}

						<Box
							aria-label='white-overlay'
							sx={
								selectedCustomer
									? { opacity: '1' }
									: {
											opacity: '0.5',
											zIndex: '3',
											cursor: 'not-allowed',
											pointerEvents: 'none',
									  }
							}
						>
							{/* Unpaid invoices  */}
							<GridRow style={{ marginTop: '15px' }}>
								<Grid item xs={2}>
									<Typography variant='body2'>
										Unpaid invoices <span style={{ color: 'red' }}>*</span>
									</Typography>
								</Grid>
								<Grid item xs={4}>
									<Autocomplete
										id='invoice_id'
										options={invoiceOptions || []}
										value={selectedinvoiceOptions}
										getOptionLabel={option => option?.label || ''}
										onChange={handleInvoiceChange}
										sx={{
											marginTop: '-10px',
											'& .MuiInputBase-root': {
												fontSize: '16px',
												padding: '0px 5px',
											},
										}}
										renderInput={params => (
											<TextField
												sx={{
													'& .MuiInputBase-root': {
														'& .MuiInputBase-input': {
															padding: '4px 0px',
															fontSize: '14px',
															marginTop: '-2px',
														},
														padding: '5px 10px',
														top: '8px',
													},
												}}
												required
												{...params}
												label='Unpaid invoices'
											/>
										)}
									/>
								</Grid>
							</GridRow>
							<GridRow style={{ marginTop: '15px' }}>
								<Grid item xs={2}>
									<Typography variant='body2'>
										Amount Received<span style={{ color: 'red' }}>*</span>
									</Typography>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='amount_received'
										aria-labelledby='amount_received'
										InputProps={{
											startAdornment: (
												<InputAdornment
													position='start'
													sx={{
														backgroundColor: '#EEEEEE',
														padding: '19px 10px',
														marginLeft: '-15px',
													}}
												>
													USD
												</InputAdornment>
											),
										}}
										sx={{
											'& .MuiInputBase-root': {
												'& .MuiInputBase-input': { paddingLeft: '10px' },
											},
										}}
										value={receivedAmount}
										handleChange={formik.handleChange}
										onBlur={formik.handleBlur}
										isTouched={formik.touched?.amount_received}
										error={formik.errors?.amount_received}
										fullWidth
										required
										type={'number'}
										disabled
									/>
								</Grid>
							</GridRow>
							{/* payment Date  */}
							<GridRow>
								<Grid item xs={2}>
									<Typography variant='body2'>
										Payment Date <span style={{ color: 'red' }}>*</span>
									</Typography>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='payment_date'
										type='date'
										value={formik.values.payment_date}
										error={formik.errors?.payment_date}
										onBlur={formik.handleBlur}
										isTouched={formik.touched?.payment_date}
										handleChange={formik.handleChange}
										required
									/>
								</Grid>
							</GridRow>
							{/* <GridRow>
                                <Grid item xs={2}>
                                    <Typography variant='body2'>Payment# <span style={{ color: 'red' }}>*</span></Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormField
                                        id='payment_number'
                                        value={formik.values.payment_number}
                                        error={formik.errors?.payment_number}
                                        onBlur={formik.handleBlur}
                                        isTouched={formik.touched?.payment_number}
                                        handleChange={formik.handleChange}
                                        label='Payment#'
                                        required
                                    />
                                </Grid>
                            </GridRow> */}
							<GridRow>
								<Grid item xs={2}>
									<Typography variant='body2'>
										Payment Mode <span style={{ color: 'red' }}>*</span>
									</Typography>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='payment_mode'
										type='select'
										value={formik.values.payment_mode}
										error={formik.errors?.payment_mode}
										onBlur={formik.handleBlur}
										isTouched={formik.touched?.payment_mode}
										handleChange={formik.handleChange}
										label='Payment Mode'
										fullWidth
										options={paymentModes}
										required
									/>
								</Grid>
							</GridRow>
							{/* Reference Number */}
							<GridRow>
								<Grid item xs={2}>
									<Typography variant='body2'>
										Reference# <span style={{ color: 'red' }}>*</span>
									</Typography>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='reference_number'
										value={formik.values.reference_number}
										error={formik.errors?.reference_number}
										onBlur={formik.handleBlur}
										isTouched={formik.touched?.reference_number}
										handleChange={formik.handleChange}
										label='Reference Number#'
										required
									/>
								</Grid>
							</GridRow>
							{/* Invoice Section */}
							<GridRow>
								<Grid item xs={8}>
									<GridRow
										style={{
											backgroundColor: '#F9F9FB',
											alignItems: 'center',
											marginLeft: '0px',
										}}
									>
										<Grid item xs={5}>
											<Typography variant='body1'>Unpaid Invoices </Typography>
										</Grid>
										<Grid item xs={4}></Grid>
										<Grid item xs={2.7} sx={{ textAlign: 'right' }}>
											<Button
												sx={{
													fontSize: '11px',
													textTransform: 'capitalize',
													color: window.themeColors.primary,
												}}
												onClick={() => formik.setFieldValue('payment_made', '')}
											>
												Clear Applied Amount
											</Button>
										</Grid>
									</GridRow>

									{UnpaidInvoicesData ? (
										<>
											<GridRow
												style={{
													margin: '0px 0',
													paddingBottom: '8px',
													borderBottom: '2px solid #E0E0E0',
												}}
											>
												<Grid item xs={2}>
													<Typography variant='body2Grey'>Date</Typography>
												</Grid>
												<Grid item xs={2}>
													<Typography variant='body2Grey'>
														Invoice Number
													</Typography>
												</Grid>
												<Grid item xs={2}></Grid>
												<Grid item xs={2} sx={{ textAlign: 'right' }}>
													<Typography variant='body2Grey'>
														Invoice Amount
													</Typography>
												</Grid>
												<Grid item xs={2} sx={{ textAlign: 'right' }}>
													<Typography variant='body2Grey'>
														Amount Due
													</Typography>
												</Grid>
												<Grid
													item
													xs={2}
													sx={{ textAlign: 'right', paddingRight: '15px' }}
												>
													<Typography variant='body2Grey'>Payment</Typography>
												</Grid>
											</GridRow>
											<GridRow
												style={{
													margin: '0 0',
													paddingBottom: '8px',
													borderBottom: '2px solid #E0E0E0',
												}}
											>
												<Grid item xs={2}>
													<Typography component='p' variant='body2Grey'>
														{UnpaidInvoicesData?.invoice_date}
													</Typography>
													<Typography
														variant='captionGrey'
														sx={{ fontSize: '11px' }}
													>
														Due Date: {UnpaidInvoicesData?.due_date}
													</Typography>
												</Grid>
												<Grid item xs={2}>
													<Typography variant='body2Grey'>
														{UnpaidInvoicesData?.invoice_number}
													</Typography>
												</Grid>
												<Grid item xs={2}></Grid>
												<Grid item xs={2} sx={{ textAlign: 'right' }}>
													<Typography variant='body2Grey'>
														${UnpaidInvoicesData?.total}
													</Typography>
												</Grid>
												<Grid item xs={2} sx={{ textAlign: 'right' }}>
													<Typography variant='body2Grey'>
														${UnpaidInvoicesData?.due_amount}
													</Typography>
												</Grid>
												<Grid item xs={2} sx={{ textAlign: 'right' }}>
													<FormField
														type='text'
														id='payment_made'
														value={formik.values.payment_made}
														aria-label='Payment MAdee'
														sx={{
															'& .MuiInputBase-input': {
																padding: '2px 15px',
																fontSize: '14px !important',
																textAlign: 'right',
															},
														}}
														onChange={formik.handleChange}
														error={formik.errors?.payment_made}
														onBlur={formik.handleBlur}
														isTouched={formik.touched?.payment_made}
														placeholder='Payment Value'
													/>
												</Grid>
												{/* <Grid item xs={2} sx={{ textAlign: 'right', paddingRight: '15px' }}><Typography variant="body2Grey">{UnpaidInvoicesData?.payment}</Typography></Grid> */}
											</GridRow>
										</>
									) : (
										<Typography sx={{ textAlign: 'center', margin: '20px' }}>
											There are no unpaid invoices associated with this customer
										</Typography>
									)}
									<GridRow style={{ margin: '0 0' }}>
										<Grid item xs={3}>
											<Typography
												variant='captionGrey'
												sx={{ fontSize: '11px' }}
											>
												**List contains only SENT invoices
											</Typography>
										</Grid>
										<Grid item xs={5}></Grid>
										<Grid item xs={2} sx={{ textAlign: 'right' }}>
											<Typography variant='body2Grey'>Total</Typography>
										</Grid>
										<Grid
											item
											xs={2}
											sx={{ textAlign: 'right', paddingRight: '15px' }}
										>
											<Typography variant='body2Bold'>
												$
												{Math.min(
													formik.values.payment_made,
													maxPaymentValue
												) || 0}
											</Typography>
										</Grid>
									</GridRow>
								</Grid>
							</GridRow>

							<GridRow>
								<Grid item xs={6}>
									<Typography variant='body2' mb={1}>
										Notes (Internal use. Not visible to customer)
									</Typography>
									<FormField
										id='notes'
										value={formik.values.notes}
										error={formik.errors?.notes}
										onBlur={formik.handleBlur}
										isTouched={formik.touched?.notes}
										handleChange={formik.handleChange}
										label='Notes'
										type='textarea'
									/>
								</Grid>
							</GridRow>
							<GridRow>
								<Grid item xs={6}>
									<Typography variant='body2'>Attachments</Typography>
									<Box sx={{ width: '400px' }}>
										<FilesModule
											files={formik.values.payment_receive_files}
											setFiles={files => setPaymentFiles(files)}
											onDelete={deletingFile}
										/>
									</Box>
								</Grid>
							</GridRow>
							{/* add new email/contact section  */}
							{formik.values.customer_id && (
								<CustomerContactsList
									pageName={'paymentRecived'}
									setSelectedEmails={setCustomerEmailsList}
									gettingCustomerList={gettingCustomerDetail}
									selectedEmails={customerEmailsList}
									customerList={singleCustomerDetail}
								/>
							)}
							<br />
							<br />
							{/* <Box sx={{ marginBottom: '70px' }}>
								<Divider sx={{ margin: '20px 0' }} />
								<Typography
									variant='body2'
									component={'span'}
									fontWeight={'500'}
								>
									{' '}
									Additional Fields:
								</Typography>
								<Typography variant='body2' component={'span'}>
									{' '}
									Start Adding custom fields for your payments received by going
									to Settings
								</Typography>
								<Typography
									variant='body2'
									component={'span'}
									ml={2}
									sx={{ fontStyle: 'italic' }}
								>
									<East sx={{ fontSize: '18px', marginBottom: '-3px' }} />{' '}
									Prefrences
								</Typography>
								<Typography
									variant='body2'
									component={'span'}
									ml={2}
									sx={{ fontStyle: 'italic' }}
								>
									<East sx={{ fontSize: '18px', marginBottom: '-3px' }} />{' '}
									Payment Recived
								</Typography>
							</Box> */}
						</Box>
					</Box>
				</ContainerPaper>
				<Paper
					style={{
						padding: '15px 20px',
						position: 'fixed',
						bottom: '0',
						width: '83.6%',
						zIndex: '2',
						borderTop: '15px solid #F3F3F3',
					}}
					sx={
						selectedCustomer
							? { opacity: '1' }
							: {
									opacity: '0.5',
									zIndex: '3',
									cursor: 'not-allowed',
									pointerEvents: 'none',
							  }
					}
				>
					<LoadingButton
						variant='contained'
						size='small'
						type='submit'
						loading={buttonloading}
					>
						Save
					</LoadingButton>
					<Button
						variant='outlined'
						sx={{ marginLeft: '5px' }}
						size='small'
						onClick={() => navigate('/payment-received')}
					>
						Cancel
					</Button>
				</Paper>
			</form>
		</>
	);
}

export default NewCustomerPage;
