import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { Settings } from '@mui/icons-material';
// yup  / formik
import { FormikProvider, useFormik } from 'formik';
// mui
import {
	Box,
	Grid,
	IconButton,
	Paper,
	Stack,
	Typography,
	Divider,
} from '@mui/material';
import FormField from '../../../Components/InputField/FormField';
import { useState } from 'react';
import MUIButton from '../../../Components/Button/MUIButton';
import VendorContactsList from '../../../Components/CustomerContacts/CustomerContactsList';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import AddItem from '../../../Components/AddItemNew';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import LoadingButton from '@mui/lab/LoadingButton';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import { getPeymentTermsApi } from '../../../../core/api/customer';
import {
	generateNumberApi,
	getCustomersApi,
	getSalesPersonApi,
} from '../../../../core/api/estimate';
import {
	decryptId,
	formatDateToYYYYMMDD,
	goBack,
} from '../../../../core/utils/helpers';
import CustomerSelection from '../../../Components/CustomerSelection';
import { PAYMENT_METHODS } from '../../../../core/utils/constants';
import TermsModal from '../../../Components/TermsModal/TermsModal';
import {
	billSingleApi,
	createBillApi,
	deleteBillFielsApi,
	updateBillApi,
} from '../../../../core/api/bills';
import FilesModule from '../../../Components/FileUpload/FilesModule';
import { billValidationSchema } from '../ValidationSchema';

const NewInvoice = ({ edit }) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const addItemRef = useRef();
	const [customerOptions, setCustomerOptions] = useState([]);
	const [salesPersonList, setSalesPersonList] = useState([]);
	const [vendorEmailsList, setVendorEmailsList] = useState([]);
	const [vendorList, setVendorList] = useState('');
	const [selectedSalesPerson, setSelectedSalesPerson] = useState('');
	const [billFiles, setBillFiles] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [btnType, setBtnType] = useState('');
	const [paymentMethod, setPaymentMethod] = useState('');
	const [loading, setLoading] = useState(false);
	const [selectedTerm, setSelectedTerm] = useState();
	const [paymentTerms, setPaymentTerms] = useState([]);
	const [selectedVendor, setSlectedVendor] = useState('');

	//  formik/ new invoices
	const initialValues_ = {
		vendor_id: '',
		bill_number: '',
		bill_date: formatDateToYYYYMMDD(new Date()),
		due_date: formatDateToYYYYMMDD(new Date()),
		mode_of_payment: '',
		term_id: '',
		note: '',
		bill_files: [],
		sub_total: 0,
		discount: 0,
		discount_type: 'Percentage',
		shipping_charges: 0,
		adjustment: 0,
		total: 0,
		bill_item: !edit
			? [
					{
						item_name_object: '',
						item_id: '',
						item_name: '',
						quantity: 1,
						amount: 0,
						rate: 0,
						tax_amount: 0,
						tax_id: 1,
						tax: '',
						total: 0,
						customer_details: '',
					},
			  ]
			: [],
	};

	const [initialValues, setInitialValues] = useState(initialValues_);

	const handleButtonClick = type => {
		setBtnType(type);
	};

	// Define the onSubmit function
	const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
		if (values.total === '0.00' || values.total === 'NaN') {
			addItemRef.current?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		console.log(values);

		try {
			if (edit) {
				console.log(btnType);
				const resp = await updateBillApi({
					...values,
					button_type: btnType,
					billId,
					_method: 'PUT',
				});
				notyf.success(resp.message);
				navigate('/bills');
			} else {
				const newValues = { ...values };
				newValues.payment_method = paymentMethod;
				const resp = await createBillApi({
					...newValues,
					button_type: btnType,
				});
				notyf.success(resp.message);
				navigate('/bills');
			}
		} catch (error) {
			console.error(
				'🚀 ~ file: InvoiceForm.tsx:251 ~ NewInvoice ~ error:',
				error
			);

			let errorName;
			let errroMessage;

			if (error?.data?.errors) {
				errorName = Object.keys(error?.data?.errors)[0];
				errroMessage = Object.values(error?.data?.errors)[0];
			}

			if (errorName) {
				formik.setErrors({
					[errorName]: errroMessage || 'something went wrong',
				});
				return;
			}
			notyf.error(
				typeof error.data.message === 'string'
					? error.data.message
					: error.data.message?.error
			);
			setFieldError(error?.data?.errors);
		} finally {
			setSubmitting(false);
		}
	};

	const formik = useFormik({
		// validateOnChange: false,
		initialValues,
		validationSchema: billValidationSchema,
		onSubmit: handleSubmit,
	});

	useEffect(() => {
		formik.setFieldValue('due_date', selectedTerm?.due_date);
	}, [selectedTerm?.id]);

	useEffect(() => {
		if (initialValues?.term_id) {
			const preSelectedTerms = paymentTerms.find(
				item => item.id === initialValues.term_id
			);
			setSelectedTerm(preSelectedTerms);
		}
	}, [initialValues?.term_id]);

	const fetchTerms = async () => {
		try {
			const response = await getPeymentTermsApi();
			const termsData = response?.data;
			if (termsData) {
				// Process the response and set state variables
				const termsOptions = termsData.map(term => ({
					text: term?.term_name,
					value: term.id,
					number_of_days: term.number_of_days,
					id: term.id,
					due_date: term.due_date,
				}));

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
	}, []);

	console.log('invoice form render', formik);

	const fetchCustomerOptions = async () => {
		const params = {};
		try {
			const resp = await getCustomersApi(params);
			const customersData = resp?.data?.Customers;
			if (customersData) {
				setCustomerOptions(customersData);
			}
		} catch (error) {
			console.error('Error fetching customers:', error);
		}
	};

	const fetchSalesPersonList = async () => {
		const params = {};
		try {
			const resp = await getSalesPersonApi(params);
			const salesPersonsData = resp?.data?.SalesPersons;

			if (salesPersonsData) {
				setSalesPersonList(salesPersonsData);
			}
		} catch (error) {
			console.error('Error fetching sales persons:', error);
		}
	};

	console.log({ vendorEmailsList });
	console.log({ vendorList });

	const generateNumber = async () => {
		try {
			const resp = await generateNumberApi({ type: 'bill' });
			const generatedNumber = resp?.data[0];

			if (generatedNumber) {
				formik.setFieldValue('bill_number', generatedNumber);
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

	const { id: routeId } = useParams();
	const billId = decryptId(routeId);

	// update customer  customerEmailsList when vendor_id changes
	const gettingVendorList = resp => {
		if (resp) {
			const termObject = {
				label: resp.term.term_name,
				value: resp.term.id,
				number_of_days: resp.term.number_of_days,
				id: resp.term.id,
				due_date: resp.term.due_date,
			};
			// formik.setFieldValue('term_id', termObject.value);
			formik.setFieldValue(
				'mode_of_payment',
				resp.mode_of_payment.toLowerCase()
			);
			formik.setFieldValue('term_id', resp.term.id);
			setSelectedTerm(termObject);

			setVendorEmailsList(resp?.vendor_contacts);
			setVendorList(resp);
			if (edit) {
				setLoading(false);
			}
		}
	};
	// useEffect(() => {

	// }, [formik.values.vendor_id]);

	useEffect(() => {
		if (billId) {
			setLoading(true);

			fetchingSingleBill();
		}
	}, [billId]);

	// handle  customer email list  lists , checked and unchecked sending to backend
	useEffect(() => {
		formik.setFieldValue(
			'email_to',
			vendorEmailsList
				?.filter(item => item.is_selected === 1) // update emails_to with those emails which are checked(its is_selected key is 1)
				.map(item => item.email)
		);
	}, [formik.values.vendor_id, vendorEmailsList]);

	// file work
	const handleFileInputChange = event => {
		const files = event.target.files;

		if (files.length > 0) {
			const newFiles = Array.from(files);
			setBillFiles(prevFiles => [...prevFiles, ...newFiles]);
		}
	};

	// delete/remove added files from list
	const deleteFile = id => {
		setBillFiles(prevFiles => prevFiles.filter(f => f !== id));
	};

	// handle files on changes .set values to formik
	// useEffect(() => {
	// 	formik.setFieldValue('invoice_files', billFiles);
	// }, [billFiles]);

	const [singleBill, setSingleBill] = useState('');

	const fetchingSingleBill = async () => {
		try {
			const resp = await billSingleApi(billId);
			const responseData = { ...resp };

			responseData.bill_item.forEach(item => {
				item.item_name_object = {
					label: item.item_name,
					value: item.item_id,
					price: item?.rate || 0,
				};
			});

			formik.setValues(responseData);
			setSlectedVendor(responseData.vendor_id);

			formik.setFieldValue('bill_files', responseData?.bill_file);
			const dd = responseData?.bill_file;
			// debugger;
			setSingleBill(responseData);
			setInitialValues(responseData);

			// setBillFiles(responseData?.bill_file);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	// setting invoices default options for customer

	useEffect(() => {
		if (id && customerOptions.length > 0 && singleBill) {
			const defaultVal = customerOptions.find(
				item => item.id === formik.values.vendor_id
			);

			const defaultValSales = salesPersonList.find(
				item => item.id === formik.values.mode_of_payment
			);

			setSelectedSalesPerson({
				label: defaultValSales?.name,
				value: defaultValSales?.id,
			});
		}
	}, [id, customerOptions, singleBill]);

	// setting invoices default options for sales person

	const labelStyle = {};

	useEffect(() => {
		console.log(formik);
		if (formik.dirty === true && Object.keys(formik.errors).length !== 0) {
			const el = document.querySelector('.Mui-error, [data-error]');
			(el?.parentElement ?? el)?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [formik.isSubmitting]);

	console.log({ selectedSalesPerson });

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
							<Grid item sm={12}>
								<HeaderPaper
									sx={{
										paddingLeft: '2rem',
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<Typography variant='h6'>
										{edit ? 'Edit Bill' : 'New Bill'}
									</Typography>
									<IconButton onClick={goBack} aria-label='close'>
										<CloseIcon fontSize='medium' htmlColor='#0000008F' />
									</IconButton>
								</HeaderPaper>
							</Grid>
							{/* main layout   */}
							<Paper sx={{ padding: '1.5rem 2rem 10rem 2rem', width: '100%' }}>
								{/* <Grid item container>
									<Grid item xs={2} sx={{ ...labelStyle }}>
										<InputLabel required>Vendor Name</InputLabel>
									</Grid>
									<Grid item xs={4}> */}
								<CustomerSelection
									id='vendor_id'
									formik={formik}
									type='vendor'
									onSelect={resp => gettingVendorList(resp)}
									preSelected={selectedVendor}
								/>
								{/* </Grid>
								</Grid> */}

								<>
									<Grid item container mt={2}>
										<Grid item xs={2} sx={{ ...labelStyle }}>
											<InputLabel required>Bill #</InputLabel>
										</Grid>
										<Grid item sm={4}>
											<FormField
												name='bill_number'
												placeholder='QU-3242'
												size='small'
												disabled={loading}
												type='text'
												fullWidth
												value={formik.values.bill_number || ''}
												handleChange={formik.handleChange}
												onBlur={formik.handleBlur}
												isTouched={!!formik.touched.bill_number}
												error={formik.errors.bill_number}
											/>
										</Grid>
									</Grid>

									<Grid item container mt={2}>
										<Grid item xs={2}>
											<InputLabel required>Bill Date</InputLabel>
										</Grid>
										<Grid item xs={4}>
											<FormField
												InputProps={{ min: formatDateToYYYYMMDD(new Date()) }}
												name='bill_date'
												value={formik.values.bill_date || ''}
												onChange={formik.handleChange}
												size='small'
												fullWidth
												type='date'
												error={formik.errors.bill_date}
												isTouched={!!formik.touched.bill_date}
											/>
										</Grid>
									</Grid>

									<Grid item container mt={2}>
										<Grid item xs={2}>
											<InputLabel>Due Date</InputLabel>
										</Grid>
										<Grid item xs={4}>
											<FormField
												InputProps={{ min: formatDateToYYYYMMDD(new Date()) }}
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

									<Grid item container mt={2}>
										<Grid item xs={2} display='flex' alignItems='center'>
											<InputLabel required={true}>Mode of Payments</InputLabel>
										</Grid>
										<Grid item xs={4}>
											<FormField
												id='mode_of_payment'
												value={formik.values.mode_of_payment}
												handleChange={formik.handleChange}
												error={formik.errors.mode_of_payment}
												label={'Select mode of payments'}
												type={'select'}
												options={PAYMENT_METHODS}
												fullWidth
											/>
										</Grid>
									</Grid>

									<Grid item container mt={2}>
										<Grid item xs={2} display='flex' alignItems='center'>
											<InputLabel>Payment Terms</InputLabel>
										</Grid>
										<Grid item xs={4}>
											<FormField
												id='term_id'
												value={formik.values.term_id}
												handleChange={formik.handleChange}
												error={formik.errors.term_id}
												label={'Payment Terms'}
												type={'select'}
												fullWidth
												options={paymentTerms}
												selectbutton={
													<MUIButton
														variant={'outlined'}
														fullWidth
														onClick={() => setIsOpen(true)}
													>
														<Settings /> Configure Terms
													</MUIButton>
												}
											/>
											<TermsModal
												terms={paymentTerms}
												isOpen={isOpen}
												onSave={fetchTerms}
												onClose={() => setIsOpen(false)}
											/>
										</Grid>
										<MyDivider />
									</Grid>
								</>

								<Grid item container spacing={2} my={7}>
									<Grid item sm={12}>
										<Box ref={addItemRef}>
											<AddItem
												loading={loading}
												itemName='bill_item'
												formiks={{
													values: {
														total: formik.values.total,
														sub_total: formik.values.sub_total,
														items: formik.values.bill_item,
														adjustment: formik.values.adjustment,
														discount: formik.values.discount,
														shipping_charges: formik.values.shipping_charges,
														discount_type: formik.values.discount_type,
														items_rates_are: formik.values.items_rates_are,
													},
													errors: {
														total: formik.errors.total,
														sub_total: formik.errors.sub_total,
														items: formik.errors.bill_item,
														adjustment: formik.errors.adjustment,
														discount: formik.errors.discount,
														shipping_charges: formik.errors.shipping_charges,
														discount_type: formik.errors.discount_type,
														items_rates_are: formik.errors.items_rates_are,
													},
													touched: {
														items: formik.touched.bill_item,
														adjustment: formik.touched.adjustment,
														discount: formik.touched.discount,
														shipping_charges: formik.touched.shipping_charges,
														discount_type: formik.touched.discount_type,
													},
													handleChange: formik.handleChange,
													setFieldValue: formik.setFieldValue,
												}}
												customerTax={null}
												isEdit={edit}
												taxId={1}
											/>
										</Box>
									</Grid>
								</Grid>

								<Grid
									container
									gap={5}
									bgcolor={'#F5F5F5'}
									borderRadius={2}
									alignItems={'center'}
									px={3}
									py={5}
								>
									<Grid item xs={5.5}>
										<InputLabel>Notes</InputLabel>
										<FormField
											// loading={loading}
											id='note'
											fullWidth
											multiline
											sx={{ mb: 1 }}
											rows={2}
											value={formik.values.note}
											onChange={formik.handleChange}
											error={formik.errors.note}
										/>
										<Typography variant='caption'>
											It will not be shown in PDF
										</Typography>
									</Grid>
									<Grid
										item
										xs={'auto'}
										mt={1}
										display='flex'
										justifyContent='center'
									>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'start',
											}}
										>
											<FilesModule
												files={formik.values?.bill_files}
												// onDelete={deletingFile}
												deleteApi={deleteBillFielsApi}
												setFiles={files =>
													formik.setFieldValue('bill_files', files)
												}
											/>
											{/* <InputLabel>Attach file(s) to Payables</InputLabel> */}
											{/* 
											<label
												htmlFor='file-input'
												style={{ paddingTop: 2, paddingBottom: 2 }}
											>
												<MUIButton
													disabled={billFiles?.length === 5}
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
											</Typography> */}

											{/* <List>
												{billFiles?.map((file, index) => (
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
											</List> */}
										</Box>
									</Grid>
								</Grid>

								<Grid container mt={4}>
									<Grid item pl={2}>
										<Stack direction={'row'} gap={1}>
											<Typography>Additional Fields:</Typography>
											{/* <Typography sx={{ mt: 0.5 }} variant='caption'>
												Start adding custom fields for your bills by going to
												Settings > Preferences > Bills.
											</Typography> */}
										</Stack>
									</Grid>
								</Grid>

								{/* add new email/contact section  */}
								{vendorEmailsList?.length && formik.values.vendor_id ? (
									<VendorContactsList
										setSelectedEmails={setVendorEmailsList}
										gettingCustomerList={fetchingSingleBill}
										selectedEmails={vendorEmailsList}
										customerDetails={vendorList}
									/>
								) : (
									''
								)}
							</Paper>
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
												<MUIButton variant='outlined' onClick={goBack}>
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
