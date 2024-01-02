import {
	Box,
	Button,
	Grid,
	List,
	Paper,
	Stack,
	TextField,
	Divider,
	ListItem,
	Typography,
	ListItemSecondaryAction,
	IconButton,
} from '@mui/material';
import * as Yup from 'yup';
// import { NewEstimateFormLayout } from "../../Estimate/NewEstimate/NewEstimateStyles";
import InputLabel from '../../../Components/InputLabel/InputLabel';
import CustomSelect from '../../../Components/Select/Select';
import Address from '../../../Components/Address/Address/Address';
import TaxSection from '../../../Components/TaxSection/TaxSection';
import FormField from '../../../Components/InputField/FormField';
import DeleteIcon from '@mui/icons-material/Delete';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';
import MUIButton from '../../../Components/Button/MUIButton';
import { useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';

import React, { useState, useEffect } from 'react';

import NewCreditMemoHeader from './NewCreditMemoHeader';
import {
	getCustomersApi,
	getSalesPersonApi,
} from '../../../../core/api/estimate';
import AddIcon from '@mui/icons-material/Add';
import { customersSingleApi, getTaxesApi } from '../../../../core/api/customer';
import CustomerContactsList from '../../../Components/CustomerContacts/CustomerContactsList';
import CustomDrawer from '../../../Components/Drawer/Drawer';
import CustomerSearchModel from './CustomerSearchModel';
import { useNavigate, useParams } from 'react-router-dom';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import {
	ViewCreditMemo,
	createCreditMemo,
	updateCreditMemo,
} from '../../../../core/api/creditmemo';
import AddItem from '../AddItem/AddItem';
import { invoiceSingleApi } from '../../../../core/api/invoices';
import {
	decryptId,
	formatDateToYYYYMMDD,
	goBack,
} from '../../../../core/utils/helpers';
import { useGenerateNumber } from '../../../Components/GenerateNumber/GenerateNumber';
import CustomerViewDrawer from '../../../Components/CustomerViewDrawer/CustomerViewDrawer';
import FilesModule from '../../../Components/FileUpload/FilesModule';
import CustomerSelection from '../../../Components/CustomerSelection';
import { deleteCreditmemoFielsApi } from '../../CustomerPortal/APIs/CustomerPortalAPIs';
import { terms_and_conditions } from '../../../../core/utils/constants';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';

const NewCreditMemo = ({ edit }) => {
	const { id } = useParams();

	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [selectedInvoice, setSelectedInvoice] = useState();
	const [customerLoading, setCsutomerLoading] = useState(false);
	const [customerList, setCustomerList] = useState('');
	const [invoiceList, setInvoiceList] = useState([]);
	const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);
	const [loading, setLoading] = useState(false);
	const [texValues, setTexValues] = useState([]);
	const [salesPersonList, setSalesPersonList] = useState([]);
	const [creditMemoState, setCreditMemoState] = useState([]);
	const [invoicedItem, setInvoicedItem] = useState([]);

	const [salesLoading, setSalesLoading] = useState(false);
	const [taxIdCustomer, setTaxIdCustomer] = useState(1);
	const [selectedEmails, setSelectedEmails] = useState([]);
	const [creditMemoFiles, setCreditMemoFiles] = useState([]);
	const [openDrawer, setOpenDrawer] = useState(false);
	const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
	const [open, setOpen] = useState(false);
	const [btnType, setBtnType] = useState('');

	const navigate = useNavigate();
	const decryptedID = decryptId(id);

	const initialValues_ = {
		customer_id: '',
		credit_memo_number: '',
		credit_memo_date: formatDateToYYYYMMDD(new Date()),
		//		reference_number: null,
		sales_person_id: '',
		subject: '',
		discount: 0,
		shipping_charges: 0,
		adjustment: 0,
		invoice_id: '',
		customer_note: '',
		terms_and_condition: terms_and_conditions,
		total: 1,
		credit_memo_files: [],
		discount_type: 'Percentage',
		// items_rates_are: taxableCustomer === 'taxable' ? 'tax_exclusive' : 'tax_inclusive',
		// items_rates_are: 'tax_exclusive',
		credit_memo_items: [
			{
				//	isChecked: false,
				item_id: '',
				item_name: 'Type or click to select an item',
				quantity: 1,
				rate: 0,
				tax_amount: 0,
				tax_id: { taxIdCustomer },
				total: 1,
			},
		],
	};
	const [initialValues, setInitialValues] = useState(initialValues_);

	const validationSchema = Yup.object().shape({
		customer_id: Yup.number().required('Customer Name is required'),
		invoice_id: Yup.number().required('Invoice Number is required'),
		credit_memo_number: Yup.string().required('Credit Memo Number is required'),
		credit_memo_date: Yup.string().required('Credit Memo Date is required'),
		credit_memo_items: Yup.array()
			.min(1, 'Please select at least one item.')
			.test(
				'is-not-empty',
				'Please select at least one item.',
				value => value && value.length > 0
			),
	});

	const handleButtonClick = type => {
		console.log('formik.values ', formik.values);
		setBtnType(type);
	};

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: async values => {
			console.log('valuess.  submited', values);
			if (edit && decryptedID) {
				try {
					const vals = {
						...values,
						button_type: btnType,
						_method: 'PUT',
					};
					const resp = await updateCreditMemo(vals, decryptedID);
					notyf.success(resp?.message);
					navigate('/credit-memo');
				} catch (err) {
					console.log('valuess updateCreditMemoAPI err', err?.data);
					//notyf.error(err?.data?.message);
					if (
						typeof err?.data?.errors === 'object' &&
						err?.data?.errors !== null
					) {
						formik.setErrors(err.data.errors);
					} else {
						console.log('values updateCreditMemoAPI err', err?.message);
					}
				} finally {
					/* empty */
				}
			} else {
				try {
					const vals = {
						...values,
						button_type: btnType,
					};
					const resp = await createCreditMemo(vals);
					notyf.success(resp?.message);
					navigate('/credit-memo');
				} catch (err) {
					//		notyf.error(err?.data?.message);
					if (
						typeof err?.data?.errors === 'object' &&
						err?.data?.errors !== null
					) {
						formik.setErrors(err.data.errors);
					} else {
						console.log('values createCreditMemo err', err?.message);
					}
				} finally {
					/* empty */
				}
			}
		},
	});
	const labelStyle = {
		display: 'flex',
		alignItems: 'center',
	};

	const fetchCustomerOptions = async () => {
		try {
			//	setCsutomerLoading(true);
			const resp = await getCustomersApi();
			setCustomerOptions(resp?.data?.Customers);
		} catch (error) {
			/* empty */
		} finally {
			//	setCsutomerLoading(false);
		}
	};

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const customerId = decryptId(params.get('customerId'));
		if (customerId && customerOptions.length > 0) {
			const defaultVal = customerOptions?.find(item => item?.id == customerId);
			setInvoiceList(defaultVal?.paid_invoices);
			setSelectedCustomer({
				label: defaultVal?.display_name,
				value: defaultVal?.id,
			});
			formik.setFieldValue('customer_id', customerId);
		}

		if (edit) {
			const customer = customerOptions.find(
				row => row?.id === formik?.values?.customer_id
			);
			console.log('customer formik.customer customerOptions ', customerOptions);

			if (customer) {
				setInvoiceList(customer?.paid_invoices);
				setSelectedCustomer({
					label: customer.display_name,
					value: customer.id,
				});
			}
		}
	}, [customerOptions]);

	useGenerateNumber(
		'credit_memo',
		'credit_memo_number',
		formik,
		edit,
		decryptedID
	);

	const customButtonOption = {
		label: (
			<>
				<Divider style={{ marginBottom: '5px' }} />
				<Button
					onClick={() => goBack(() => navigate('/credit-memo'))}
					size='small'
					startIcon={<AddIcon />}
				>
					Add New Customer
				</Button>
			</>
		),
		isDisabled: true,
		value: 'Add Modal Button',
	};

	const gettingCustomerList = async () => {
		try {
			setLoading(true);
			if (formik.values.customer_id) {
				const resp = await customersSingleApi(formik.values.customer_id);

				setTaxIdCustomer(resp.tax_id);
				setSelectedEmails(resp?.customer_contacts);
				setCustomerList(resp);
			}
		} catch (error) {
			/* empty */
		} finally {
			setLoading(false);
			//	setUpdate(!update);
			// setUpdateCustomer(false)
		}
	};

	const fetchSalesPersonList = async () => {
		try {
			setSalesLoading(true);
			const resp = await getSalesPersonApi();
			setSalesPersonList(resp?.data?.SalesPersons);
			// console.log("customerOptions", resp);
		} catch (error) {
			/* empty */
		} finally {
			setSalesLoading(false);
		}
	};

	const handleInvoiceChange = async invId => {
		console.log('selected.value handle invoice change', invId);
		if (invId !== undefined) {
			const resp = await invoiceSingleApi(invId);
			if (edit === undefined) {
				setCreditMemoState(resp);
			} else if (edit) {
				console.log('invoiceSingleApi', resp);
				setInvoicedItem(resp?.invoice_items);
			}

			const saleperson = salesPersonList.find(
				row => row?.id === resp?.sales_person_id
			);
			formik.setFieldValue('sales_person_id', saleperson?.id);
			console.log('saleperson', saleperson);
			setSelectedSalesPerson({
				label: saleperson?.name,
				value: saleperson?.id,
			});

			console.log('selected.value resp', resp);
		}
	};
	const handleFileInputChange = event => {
		const files = event.target.files;

		if (files.length > 0) {
			const newFiles = Array.from(files);
			setCreditMemoFiles(prevFiles => [...prevFiles, ...newFiles]);
			const allFiles = [...formik.values.credit_memo_files, ...newFiles];
			formik.setFieldValue('credit_memo_files', allFiles);
		} else {
			/* empty */
		}
	};

	const deletingFile = fileId => {
		if (fileId.id) {
			deleteCreditmemoFielsApi(fileId?.id);
		} else {
			formik.setFieldValue(
				'credit_memo_files',
				formik.values?.credit_memo_files.filter(f => f !== fileId)
			);
			notyf.success('File Deleted');
		}
	};

	const fetchForm = async () => {
		if (decryptedID) {
			const resp = await ViewCreditMemo(decryptedID);
			if (resp && resp?.data) {
				setCreditMemoState(resp?.data);
				formik.setValues(resp?.data);
			}
		}
	};

	useEffect(() => {
		fetchCustomerOptions();
		fetchSalesPersonList();
		fetchForm();

		//get Tax API start
		const respTax = getTaxesApi();
		respTax
			?.then(data => {
				const repsTax = data?.data;
				const updatedOptions_ = repsTax?.map(({ id, name, rate }) => ({
					value: id,
					label: name,
					price: rate,
				}));
				setTexValues(updatedOptions_);
			})
			.catch(error => {
				console.error(error?.message);
			});
	}, []);

	useEffect(() => {
		if (formik.dirty === true) {
			const el = document.querySelector('.Mui-error, [data-error]');
			(el?.parentElement ?? el)?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [formik.isSubmitting]);

	useEffect(() => {
		gettingCustomerList();
		console.log('customer formik.values ', formik.values);
		const customer = customerOptions.find(
			row => row?.id === formik?.values?.customer_id
		);
		console.log('customer formik.customer customerOptions ', customerOptions);

		if (customer) {
			setInvoiceList(customer?.paid_invoices);
			setSelectedCustomer({
				label: customer.display_name,
				value: customer.id,
			});
		}
		const saleperson = salesPersonList.find(
			row => row?.id === formik?.values?.sales_person_id
		);
		if (saleperson) {
			setSelectedSalesPerson({
				label: saleperson?.name,
				value: saleperson?.id,
			});
		}
		if (edit === undefined) {
			setSelectedInvoice({
				value: null,
				label: '',
			});
			formik.setFieldValue(`invoice_id`, '');
		}
	}, [formik?.values?.customer_id]);

	useEffect(() => {
		let inv = invoiceList?.find(row => row?.id === formik?.values?.invoice_id);
		if (inv) {
			setSelectedInvoice({
				label: inv?.invoice_number,
				value: inv?.id,
			});
		}
		if (edit) {
			handleInvoiceChange(inv?.id);
		}
	}, [invoiceList]);

	return (
		<>
			<OverlayLoader open={isLoadingOverlay} />
			<form onSubmit={formik.handleSubmit}>
				<div style={{ position: 'relative' }}>
					<NewCreditMemoHeader
						title={edit ? 'Edit Credit Memo' : 'New Credit Memo'}
					>
						<Paper sx={{ width: '100%', padding: '1.5rem 2rem 10rem 2rem' }}>
							<CustomerSelection
								id='customer_id'
								type='customer'
								formik={formik}
								//      onSelect={(resp) => gettingCustomersList(resp)}
								preSelected={formik.values.customer_id}
								setIsLoadingOverlay={setIsLoadingOverlay}
							/>
							<>
								{formik.values?.customer_id && (
									<Grid item container mt={2}>
										<Grid item xs={2} sx={{ ...labelStyle }}>
											<InputLabel>
												Invoice#<span style={{ color: 'red' }}>*</span>
											</InputLabel>
										</Grid>
										<Grid item sm={4}>
											<CustomSelect
												id='invoice_id'
												isDisabled={edit}
												// placeholder='Select or add a  Customer'
												value={selectedInvoice}
												options={invoiceList?.map(item => ({
													label: item.invoice_number,
													value: item.id,
												}))}
												onChange={selected => {
													formik.setFieldValue('invoice_id', selected?.value);
													setSelectedInvoice({
														value: selected.value,
														label: selected.label,
													});
													handleInvoiceChange(selected.value);
												}}
												error={
													formik.touched?.invoice_id &&
													formik.errors?.invoice_id &&
													formik.errors?.invoice_id
												}
												isSearchable
												isClearable
											/>
										</Grid>
									</Grid>
								)}

								<Grid item container mt={2}>
									<Grid item xs={2} display='flex' alignItems='center'>
										<InputLabel>
											Credit Memo#<span style={{ color: 'red' }}>*</span>
										</InputLabel>{' '}
									</Grid>
									<Grid item xs={4}>
										<FormField
											name='credit_memo_number'
											value={formik.values?.credit_memo_number}
											onChange={formik.handleChange}
											size='small'
											disabled
											isTouched={formik.touched?.credit_memo_number}
											error={
												formik.touched?.credit_memo_number &&
												formik.errors?.credit_memo_number &&
												formik.errors?.credit_memo_number
											}
										/>
									</Grid>
								</Grid>
								<Grid item container mt={2}>
									<Grid item xs={2}>
										<InputLabel>
											Credit Memo Date<span style={{ color: 'red' }}>*</span>
										</InputLabel>{' '}
									</Grid>
									<Grid item xs={4}>
										<FormField
											name='credit_memo_date'
											value={formik.values?.credit_memo_date}
											onChange={formik.handleChange}
											type='date'
											size='small'
											inputProps={{
												min: formatDateToYYYYMMDD(new Date()),
											}}
											isTouched={formik.touched?.credit_memo_date}
											error={
												formik.touched?.credit_memo_date &&
												formik.errors?.credit_memo_date &&
												formik.errors?.credit_memo_date
											}
										/>
									</Grid>
								</Grid>

								<Grid item xs={12} mt={3}>
									<Divider />
								</Grid>

								{/* sales  */}
								<Grid item container sx={{ margin: '2rem 0' }}>
									<Grid item xs={2} display='flex' alignItems='center'>
										{' '}
										<InputLabel>Sales Person</InputLabel>
									</Grid>
									<Grid item xs={4}>
										<CustomSelect
											value={selectedSalesPerson}
											name='sales_person_id'
											id='sales_person_id'
											placeholder='Select or add sales persons'
											loading={salesLoading}
											options={salesPersonList?.map(item => ({
												label: item.name,
												value: item.id,
											}))}
											onChange={selected => {
												formik.setFieldValue('sales_person_id', selected.value);
												setSelectedSalesPerson({
													value: selected.value,
													label: selected.label,
												});
											}}
											touched={formik.touched?.sales_person_id}
											error={
												formik.touched?.sales_person_id &&
												formik.errors?.sales_person_id &&
												formik.errors?.sales_person_id
											}
											isSearchable
											isClearable
										/>
									</Grid>
									<Grid item xs={12} mt={3}>
										<Divider />
									</Grid>
								</Grid>
								{/* Subject  */}
								<Grid item container sx={{ margin: '1rem 0' }}>
									<Grid item xs={2} sx={{ ...labelStyle }}>
										<InputLabel>
											Subject
											<HoverPopover text='You can add uto 250 characters '></HoverPopover>
										</InputLabel>
									</Grid>
									<Grid item xs={4}>
										<FormField
											name='subject'
											value={formik.values?.subject}
											handleChange={formik.handleChange}
											placeholder='Let your customer know what this Credit Memo for'
											type='textarea'
											isTouched={formik.touched?.subject}
											error={
												formik.touched?.subject &&
												formik.errors?.subject &&
												formik.errors?.subject
											}
										/>
									</Grid>
								</Grid>
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

									<Grid item container spacing={1} mt={1}>
										<Grid item sm={12}>
											{/* formik.values.estimate_items.length > 0 */}
											<AddItem
												initialValues={initialValues}
												formik={formik}
												isEdit={edit}
												creditMemoState={creditMemoState}
												invoicedItem={invoicedItem && invoicedItem}
												loading={customerLoading}
											/>
										</Grid>
										<Grid item xs={6}>
											<Grid item xs={12}>
												<InputLabel>Customer Notes</InputLabel>
												<TextField
													fullWidth
													label='Notes'
													multiline
													rows={3}
													id='customer_note'
													value={formik.values?.customer_note}
													onChange={formik.handleChange}
													// variant="outlined"
												/>
											</Grid>
											{/* <Grid item xs={12}>
												<InputLabel>Terms and conditions</InputLabel>

												<TextField
													fullWidth
													label='Terms and conditions'
													multiline
													rows={3}
													id='terms_and_condition'
													onChange={formik.handleChange}
													value={formik.values?.terms_and_condition}
													// variant="outlined"
												/>
											</Grid> */}
										</Grid>
										<Grid
											item
											xs={6}
											display='flex'
											justifyContent='center'
											mt={1}
										>
											<Box
												sx={{
													width: '60%',
												}}
											>
												<FilesModule
													files={formik.values?.credit_memo_files}
													onDelete={deletingFile}
													setFiles={files =>
														formik.setFieldValue('credit_memo_files', files)
													}
												/>
											</Box>
										</Grid>
									</Grid>
								</Grid>
							</>

							{/* add new email/contact section  */}
							{/* {customerList?.id && ( */}
							<CustomerContactsList
								setSelectedEmails={setSelectedEmails}
								gettingCustomerList={gettingCustomerList}
								selectedEmails={selectedEmails}
								customerList={customerList}
							/>
						</Paper>
						<Box
							style={{
								position: 'fixed',
								bottom: 0,
								width: '83.2%',
								zIndex: 9,
							}}
						>
							<Paper elevation={5}>
								<Grid container style={{ padding: '0 1rem 1.2rem 1rem' }}>
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
												onClick={() => handleButtonClick('save_as_draft')}
												disabled={loading}
												loading={loading}
												variant='contained'
											>
												Save as Draft
											</LoadingButton>
											<LoadingButton
												variant='contained'
												type='submit'
												onClick={() => handleButtonClick('save_and_send')}
												disabled={loading}
												loading={loading}
											>
												Save and send
											</LoadingButton>
											<LoadingButton
												variant='contained'
												type='submit'
												onClick={() => goBack(() => navigate('/credit-memo'))}
											>
												Cancel
											</LoadingButton>
										</Stack>
									</Grid>
								</Grid>
							</Paper>
						</Box>
					</NewCreditMemoHeader>
				</div>
				<CustomDrawer
					open={openDrawer}
					onClose={() => setOpenDrawer(false)}
					dWidth
				>
					<CustomerViewDrawer
						onClose={() => setOpenDrawer(false)}
						customerList={customerList}
					/>
				</CustomDrawer>
				<CustomerSearchModel open={open} onClose={() => setOpen(false)} />
			</form>
		</>
	);
};

export default NewCreditMemo;
