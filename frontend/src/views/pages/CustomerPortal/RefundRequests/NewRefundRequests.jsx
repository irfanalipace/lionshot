import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import * as Yup from 'yup';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import CustomSelect from '../../../Components/Select/Select';
import FormField from '../../../Components/InputField/FormField';
import { useFormik } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import CustomerContactsList from '../../../Components/CustomerContacts/CustomerContactsList';
import CustomDrawer from '../../../Components/Drawer/Drawer';
import { useNavigate, useParams } from 'react-router-dom';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import AddItem from '../../CreditMemo/AddItem/AddItem';
import {
	decryptId,
	formatDateToYYYYMMDD,
	generateEncryptedID,
} from '../../../../core/utils/helpers';
import CustomerViewDrawer from '../../../Components/CustomerViewDrawer/CustomerViewDrawer';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import {
	ViewRefundRequest,
	createRefundRequest,
	deleteCreditmemoFielsApi,
	updateRefundRequest,
} from '../APIs/CustomerPortalAPIs';
import FilesModule from '../../../Components/FileUpload/FilesModule';
import {
	getAllInvoicesDashboardListApi,
	getInvoiceDashboardDetailsApi,
} from '../../../../core/api/CustomerPortal/customerportal';

const NewRefundRequests = ({ edit }) => {
	const { customerId, id } = useParams();
	const [selectedInvoice, setSelectedInvoice] = useState();
	const [customerLoading, setCsutomerLoading] = useState(false);
	const [customerList, setCustomerList] = useState('');
	const [invoiceList, setInvoiceList] = useState([]);
	//   const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);
	//   const [loading, setLoading] = useState(false);
	//   const [salesPersonList, setSalesPersonList] = useState([]);
	const [creditMemoState, setCreditMemoState] = useState([]);
	const [invoicedItem, setInvoicedItem] = useState([]);

	//   const [salesLoading, setSalesLoading] = useState(false);
	const [taxIdCustomer, setTaxIdCustomer] = useState(1);
	const [selectedEmails, setSelectedEmails] = useState([]);
	//   const [creditMemoFiles, setCreditMemoFiles] = useState([]);
	const [openDrawer, setOpenDrawer] = useState(false);
	const [btnType, setBtnType] = useState('');

	const navigate = useNavigate();
	const decryptedID = decryptId(id);
	const decryptedCustomerID = decryptId(customerId);

	const initialValues_ = {
		customer_id: '',
		credit_memo_date: formatDateToYYYYMMDD(new Date()),
		sales_person_id: '',
		// credit_memo_number: new Date().getTime(),
		subject: '',
		discount: 0,
		shipping_charges: 0,
		adjustment: 0,
		invoice_id: '',
		customer_note: '',
		total: 1,
		credit_memo_files: [],
		discount_type: 'Percentage',
		credit_memo_items: [
			{
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
		invoice_id: Yup.number().required('Invoice Number is required'),
		// credit_memo_number: Yup.string().required('Credit Memo Number is required'),
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
			//	 delete values.customer_id;
			values.customer_id = customerId;

			if (edit && decryptedID) {
				try {
					const vals = {
						...values,
						button_type: btnType,
						_method: 'PUT',
					};
					const resp = await updateRefundRequest(vals, decryptedID);
					notyf.success(resp?.message);
					navigate(`/customer-portal/${customerId}/refund-request`);
				} catch (err) {
					//notyf.error(err?.data?.message);
					if (
						typeof err?.data?.errors === 'object' &&
						err?.data?.errors !== null
					) {
						formik.setErrors(err.data.errors);
					} else {
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
					const resp = await createRefundRequest(vals);
					notyf.success(resp?.message);
					navigate(`/customer-portal/${customerId}/refund-request`);
				} catch (err) {
					if (
						typeof err?.data?.errors === 'object' &&
						err?.data?.errors !== null
					) {
						formik.setErrors(err.data.errors);
					} else {
						notyf.error('Something went wrong');
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

	useEffect(() => {
		if (formik.dirty === true) {
			const el = document.querySelector('.Mui-error, [data-error]');
			(el?.parentElement ?? el)?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [formik.isSubmitting]);

	//   const fetchCustomerOptions = async () => {
	//     try {
	//       setCsutomerLoading(true);
	//       const resp = await getCustomersApi();
	//       setCustomerOptions(resp?.data?.Customers);
	//     } catch (error) {
	//       /* empty */
	//     } finally {
	//       setCsutomerLoading(false);
	//     }
	//   };

	//   useEffect(() => {
	//     if (edit === undefined) {
	//       if (decryptedCustomerID && customerOptions.length > 0) {
	//         const defaultVal = customerOptions?.find(
	//           item => item?.id == decryptedCustomerID
	//         );
	//         setInvoiceList(defaultVal?.invoices);
	//         formik.setFieldValue('customer_id', decryptedCustomerID);
	//       }
	//     }
	//   }, [customerOptions]);

	//   useGenerateNumber(
	//     'credit_memo',
	//     'credit_memo_number',
	//     formik,
	//     edit,
	//     decryptedID
	//   );

	//   const gettingCustomerList = async () => {
	//     try {
	//       setLoading(true);
	//       if (formik.values.customer_id) {
	//         const resp = await customersSingleApi(formik.values.customer_id);

	//         setTaxIdCustomer(resp.tax_id);
	//         setSelectedEmails(resp?.customer_contacts);
	//         setCustomerList(resp);
	//       }
	//     } catch (error) {
	//       /* empty */
	//     } finally {
	//       setLoading(false);
	//     }
	//   };

	//   const fetchSalesPersonList = async () => {
	//     try {
	//       setSalesLoading(true);
	//       const resp = await getSalesPersonApi();
	//       setSalesPersonList(resp?.data?.SalesPersons);
	//     } catch (error) {
	//       /* empty */
	//     } finally {
	//       setSalesLoading(false);
	//     }
	//   };

	const handleInvoiceChange = async invId => {
		console.log('selected.value handle invoice change', invId);
		if (invId) {
			try {
				const resp = await getInvoiceDashboardDetailsApi({
					customer_id: customerId,
					invoice_id: generateEncryptedID(invId),
				});
				if (edit) {
					setInvoicedItem(resp?.data?.invoice_items);
				} else {
					setCreditMemoState(resp?.data);
				}
				formik.setFieldValue('sales_person_id', resp?.data?.sales_person_id);
			} catch (error) {
				console.log('Error: ', error);
				notyf.error('Something went wrong');
			}
		}
	};
	//   const handleFileInputChange = event => {
	//     const files = event.target.files;

	//     if (files.length > 0) {
	//       const newFiles = Array.from(files);
	//       setCreditMemoFiles(prevFiles => [...prevFiles, ...newFiles]);
	//       const allFiles = [...formik.values.credit_memo_files, ...newFiles];
	//       formik.setFieldValue('credit_memo_files', allFiles);
	//     } else {
	//       /* empty */
	//     }
	//   };

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
			const params = {
				customer_id: customerId,
				credit_memo_id: id,
			};
			const resp = await ViewRefundRequest(params);
			console.log('resp', resp);
			if (resp && resp?.data) {
				setCreditMemoState(resp?.data);
				formik.setValues(resp?.data);
			}
		}
	};

	useEffect(() => {
		// fetchCustomerOptions();
		// fetchSalesPersonList();
		fetchForm();
		fetchCustomerInvoices();
	}, []);

	const fetchCustomerInvoices = async () => {
		try {
			let resp = await getAllInvoicesDashboardListApi({
				customer_id: customerId,
			});
			setInvoiceList(resp?.data?.data);
		} catch (error) {}
	};

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
		<form onSubmit={formik.handleSubmit}>
			<div style={{ position: 'relative' }}>
				<Grid item sm={12}>
					<HeaderPaper>
						<Grid
							container
							rowSpacing={1}
							columnSpacing={{ xs: 1, sm: 2, md: 3 }}
						>
							<Grid item xs={6}>
								<Typography variant='h6' className='TextCapitalize'>
									{edit ? 'Edit Refund Requests' : 'New Refund Requests'}
								</Typography>
							</Grid>
							<Grid item xs={6} sx={{ textAlign: 'right' }}>
								<IconButton
									onClick={() =>
										navigate(`/customer-portal/${customerId}/refund-request`)
									}
									aria-label='delete'
								>
									<CloseIcon />
								</IconButton>
							</Grid>
						</Grid>
					</HeaderPaper>
				</Grid>
				<Paper sx={{ width: '100%', padding: '1.5rem 2rem 10rem 2rem' }}>
					<>
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

						{/* <Grid item container mt={2}>
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
            </Grid> */}
						<Grid item container mt={2}>
							<Grid item xs={2}>
								<InputLabel>
									Refund Request Date<span style={{ color: 'red' }}>*</span>
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

						{/* <Grid item xs={12} mt={3}>
              <Divider />
            </Grid> */}

						{/* sales  */}
						{/* <Grid item container sx={{ margin: '2rem 0' }}>
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
                    value: item.id
                  }))}
                  onChange={selected => {
                    formik.setFieldValue('sales_person_id', selected.value);
                    setSelectedSalesPerson({
                      value: selected.value,
                      label: selected.label
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
            </Grid> */}
						{/* Subject  */}
						{/* <Grid item container sx={{ margin: '1rem 0' }}>
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
									placeholder='Let your customer know what this Price Quote for'
									type='textarea'
									isTouched={formik.touched?.subject}
									error={
										formik.touched?.subject &&
										formik.errors?.subject &&
										formik.errors?.subject
									}
								/>
							</Grid>
						</Grid> */}
					</>

					{/* add row comp  */}
					<>
						<Grid item container display='flex' justifyContent='flex-end'>
							<Grid item xs={12} md={6}></Grid>

							<Grid item container spacing={1} mt={1}>
								<Grid item sm={12}>
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
										/>
									</Grid> */}
								</Grid>
								<Grid item xs={6} display='flex' justifyContent='center' mt={1}>
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
						selectedEmails={selectedEmails}
						customerList={customerList}
						// emails={formik?.values?.email_to}
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
									{/* <LoadingButton
										type='submit'
										onClick={() => handleButtonClick('save_as_draft')}
										//			  disabled={saveAsDraftLoading}
										//			  loading={saveAsDraftLoading}
										variant='contained'
									>
										Save as Draft
									</LoadingButton> */}
									<LoadingButton
										variant='contained'
										type='submit'
										onClick={() => handleButtonClick('save_and_send')}
										//		  disabled={saveAndSendLoading}
										//		  loading={saveAndSendLoading}
									>
										Save and send
									</LoadingButton>
									<LoadingButton
										variant='contained'
										type='submit'
										onClick={() =>
											navigate(`/customer-portal/${customerId}/refund-request`)
										}
									>
										Cancel
									</LoadingButton>
								</Stack>
							</Grid>
						</Grid>
					</Paper>
				</Box>
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
		</form>
	);
};

export default NewRefundRequests;
