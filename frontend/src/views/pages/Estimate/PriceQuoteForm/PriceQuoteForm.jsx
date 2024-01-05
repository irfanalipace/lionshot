import React, { useEffect } from 'react';
import Select from 'react-select';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
	Box,
	Grid,
	Paper,
	TextField,
	Typography,
	Divider,
} from '@mui/material';

import FormField from '../../../Components/InputField/FormField';
import { useState } from 'react';
import MUIButton from '../../../Components/Button/MUIButton';

import { LoadingButton } from '@mui/lab';

// apis
// import { customersSingleApi, getTaxesApi } from '../../../../core/api/customer';
import { getPeymentTermsApi } from '../../../../core/api/termsTaxesReasonsAuthorities';

// import {
// 	getCustomersApi,
// 	getSalesPersonApi,
// } from '../../../../core/api/estimate/';
// import Address from '../../../Components/Address/Address/Address';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import CustomerContactsList from '../../../Components/CustomerContacts/CustomerContactsList';
import {
	createEstimateApi,
	deleteEstimateFielsApi,
	showEstimateApi,
	updateEstimateApi,
} from '../../../../core/api/estimate';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';
import {
	// addDaysToDate,
	decryptId,
	formatDateToYYYYMMDD,
} from '../../../../core/utils/helpers';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
// import TaxSection from '../../../Components/TaxSection/TaxSection';
// import CustomSelect from '../../../Components/Select/Select';
import TextArea from '../../../Components/TextArea/TextArea';
import { useGenerateNumber } from '../../../Components/GenerateNumber/GenerateNumber';
// import CustomFileupload from '../../../Components/CustomeFileUpload/CustomeFileupload';
import AddItem from '../NewEstimate/AddItem/AddItem';
import FilesModule from '../../../Components/FileUpload/FilesModule';
import CustomerSelection from '../../../Components/CustomerSelection';
import { Settings } from '@mui/icons-material';
import TermsModal from '../../../Components/TermsModal/TermsModal';
import SalesPersons from '../../../Components/SalesPerson/SalesPersons';
import { terms_and_conditions } from '../../../../core/utils/constants';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';

const PriceQuoteForm = ({ edit }) => {
	const params = useParams();
	const id = decryptId(params.id);
	const navigate = useNavigate();
	//   const [customerOptions, setCustomerOptions] = useState([]);
	//   const [salesPersonList, setSalesPersonList] = useState([]);
	const [selectedEmails, setSelectedEmails] = useState([]);
	const [customerList, setCustomerList] = useState('');
	// const [selectedCustomer, setSelectedCustomer] = useState(null);
	// const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);
	const [btnType, setBtnType] = useState('');
	// const [customerLoading, setCustomerLoading] = useState(false);
	// const [salesLoading, setSalesLoading] = useState(false);
	// const [termLoading, setTermsLoading] = useState(false);
	// const [selectedPaymentTerms, setSelectedPayTerms] = useState('');
	const [taxableCustomer, setTaxableCustomer] = useState('taxable');
	const [taxIdCustomer, setTaxIdCustomer] = useState(1);
	//   const [texValues, setTexValues] = useState([]);
	const [saveAsDraftLoading, setSaveAsDraftLoading] = useState(false);
	const [saveAndSendLoading, setSaveAndSendLoading] = useState(false);
	// const [loading, setLoading] = useState(false);
	const [isStatus, setIsStatus] = useState('draft');
	const [selectedTerm, setSelectedTerm] = useState();
	const [paymentTerms, setPaymentTerms] = useState([]);
	// const [terms, setTerms] = useState([]);
	const [clicked, setClicked] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
	const [estimateDate, setEstimateDate] = useState(
		formatDateToYYYYMMDD(new Date())
	);

	//  formik/ new estimate
	const initialValues_ = {
		customer_id: '',
		taxCheckBox: 'taxExempt',
		sales_person_id: '',
		estimate_number: '',
		reference_number: '',
		estimate_date: formatDateToYYYYMMDD(new Date()), // current Date
		expiry_date: formatDateToYYYYMMDD(new Date()),
		term_id: '',
		subject: '',
		adjustment_description: '',
		customer_note: '',
		discount_amount: 0,
		terms_and_condition: terms_and_conditions,
		estimate_files: [],
		email_to: [],
		// selectedCustomer: null,
		sub_total: 0,
		discount: 0,
		tax_amount: 0,
		discount_type: 'Percentage',
		shipping_charges: 0,
		adjustment: 0,
		items_rates_are:
			taxableCustomer === 'taxable' ? 'tax_exclusive' : 'tax_inclusive',
		total: 0,
		estimate_items: [
			{
				// item_id: '' ,
				item_name: 'Type or click to select an item',
				quantity: 1,
				rate: 0,
				tax_amount: 0,
				tax_id: { taxIdCustomer },
				total: 0,
			},
		],
	};
	const [initialValues, setInitialValues] = useState(initialValues_);

	const validationSchema = Yup.object().shape({
		customer_id: Yup.string().required('Customer  is required'),
		estimate_number: Yup.string().required('Price Quote number is required'),
		estimate_date: Yup.string().required('Price Quote date is required'),
		sales_person_id: Yup.string().required('Sales person is required'),
	});
	const [isSubmit, setIsSubmit] = useState(false);

	const handleButtonClick = type => {
		setIsSubmit(true);
		setBtnType(type);
		setClicked(true);
	};

	function returningType(type) {
		if (type === 'save_as_draft') {
			setSaveAsDraftLoading(true);
		} else if (type === 'save_and_send') {
			setSaveAndSendLoading(true);
		}
	}

	function runningFinally() {
		setSaveAsDraftLoading(false);
		setSaveAndSendLoading(false);
		// setSubmitting(false);
	}

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		// initialTouched: {}, // Initialize touched as an empty object
		onSubmit: async values => {
			if (edit && id) {
				try {
					returningType(btnType);
					const resp = await updateEstimateApi({
						...values,
						button_type: btnType,
						_method: 'PUT',
					});
					notyf.success(resp?.message);

					navigate('/price-quote');
				} catch (error) {
					if (
						error?.data?.errors &&
						Object.keys(error?.data?.errors)?.length > 0
					)
						formik.setErrors(error?.data?.errors);
					else notyf.error(error.data || 'Something Went Wrong');
				} finally {
					runningFinally();
				}
			} else {
				if (
					values.estimate_items.length === 1 &&
					values.estimate_items[0]?.total === 0
				) {
					console.log('onSubmit values at 0 index amount is 0');
				} else {
					try {
						returningType(btnType);
						const resp = await createEstimateApi({
							...values,
							button_type: btnType,
						});
						notyf.success(resp.message);
						navigate('/price-quote');
					} catch (error) {
						if (
							error?.data?.errors &&
							Object.keys(error?.data?.errors)?.length > 0
						)
							formik.setErrors(error?.data?.errors);
						else notyf.error(error.data);
					} finally {
						runningFinally();
					}
				}
			}
		},
	});

	// customer field select
	const gettingCustomersList = resp => {
		if (resp) {
			const termObject = {
				label: resp.term.term_name,
				value: resp.term.id,
				text: resp.term.term_name,
				number_of_days: resp.term.number_of_days,
				id: resp.term.id,
				due_date: resp.term.due_date,
			};
			if (!edit) formik.setFieldValue('term_id', resp.term.id);

			setSelectedEmails(resp?.customer_contacts);
			setCustomerList(resp);
			setTaxIdCustomer(resp?.tax_id);
			setTaxableCustomer(resp.tax_preference);
		}
	};

	useEffect(() => {
		if (initialValues?.term_id) {
			const preSelectedTerms = paymentTerms.find(
				item => item.id === initialValues.term_id
			);
			setSelectedTerm(preSelectedTerms);
		}
	}, [initialValues?.term_id]);

	useEffect(() => {
		formik.setFieldValue('expiry_date', selectedTerm?.due_date);
	}, [selectedTerm?.id]);

	useEffect(() => {
		if (formik.values?.term_id) {
			const selectedTerm = paymentTerms.find(
				term => term.id === formik.values.term_id
			);
			if (selectedTerm) {
				formik.setFieldValue('expiry_date', selectedTerm.due_date);
			}
		}
	}, [formik.values.term_id, paymentTerms]);

	const fetchTerms = async () => {
		try {
			const response = await getPeymentTermsApi();
			const termsData = response?.data;
			if (termsData) {
				const termsOptions = termsData.map(term => ({
					text: term?.term_name,
					value: term.id,
					number_of_days: term.number_of_days,
					id: term.id,
					due_date: term.due_date,
				}));

				setPaymentTerms([...termsOptions]);
			}
		} catch (error) {
			console.error('Error fetching payment terms:', error);
		}
	};

	useEffect(() => {
		fetchTerms();
	}, []);

	useEffect(() => {
		formik.setFieldValue('expiry_date', estimateDate);
	}, [estimateDate, formik.values?.customer_id]);

	useEffect(() => {
		const selectedEmailss = selectedEmails
			?.filter(item => item.is_selected === 1)
			.map(item => item.email);
		formik.setFieldValue(
			'email_to',
			(selectedEmailss.length > 0 && selectedEmailss) || 'null'
		);
	}, [formik.values?.customer_id, selectedEmails]);

	// delete/remove added files from list / api and added file
	const deleteFileFromApi = async fileId => {
		try {
			const resp = await deleteEstimateFielsApi(fileId);
			notyf.success('File Deleted');
			formik.setFieldValue(
				'estimate_files',
				formik.values?.estimate_files.filter(f => f.id !== fileId)
			);
		} catch (error) {}
	};
	const deletingFile = fileId => {
		if (fileId.id) {
			deleteFileFromApi(fileId?.id);
		} else {
			formik.setFieldValue(
				'estimate_files',
				formik.values?.estimate_files.filter(f => f !== fileId)
			);
			notyf.success('File Deleted');
		}
	};

	useEffect(() => {
		if (id) {
			fetchingSingleEstimate();
		}
	}, [id]);

	const fetchingSingleEstimate = async () => {
		try {
			const resp = await showEstimateApi(id);
			setIsStatus(resp?.data?.status);
			formik.setValues(resp.data);
			setInitialValues(resp.data);
			formik.setFieldValue('estimate_files', resp?.data?.estimate_files);
		} catch (error) {}
	};

	const updatingContacts = newContacts => {
		setSelectedEmails(prev => [...prev, ...newContacts]);
	};

	// generate number
	useGenerateNumber('estimate', 'estimate_number', formik, edit, id);

	const labelStyle = {
		display: 'flex',
		alignItems: 'start',
	};

	const MyDivider = () => (
		<Grid item xs={12} mt={3}>
			<Divider />
		</Grid>
	);

	useEffect(() => {
		if (formik.dirty === true) {
			const el = document.querySelector('.Mui-error, [data-error]');
			(el?.parentElement ?? el)?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [formik.isSubmitting]);

	return (
		<>
			<OverlayLoader open={isLoadingOverlay} />
			<form onSubmit={formik.handleSubmit}>
				<div style={{ position: 'relative' }}>
					<>
						<Paper sx={{ width: '100%', padding: '1.5rem 2rem 10rem 2rem' }}>
							<CustomerSelection
								id='customer_id'
								type='customer'
								formik={formik}
								onSelect={resp => gettingCustomersList(resp)}
								preSelected={formik.values.customer_id}
								setIsLoadingOverlay={setIsLoadingOverlay}
							/>

							<>
								<Grid item container mt={2}>
									<Grid item xs={2} sx={{ ...labelStyle }}>
										<InputLabel>
											Price Quote#<span style={{ color: 'red' }}>*</span>
										</InputLabel>
									</Grid>
									<Grid item sm={4}>
										<FormField
											name='estimate_number'
											size='small'
											fullWidth
											value={formik.values?.estimate_number}
											handleChange={formik.handleChange}
											isTouched={formik.touched?.estimate_number}
											disabled
											error={
												formik.touched?.estimate_number &&
												formik.errors?.estimate_number &&
												formik.errors?.estimate_number
											}
										/>
									</Grid>
								</Grid>

								<Grid item container mt={2}>
									<Grid item xs={2} display='flex' alignItems='center'>
										<InputLabel>
											Price Quote Date<span style={{ color: 'red' }}>*</span>
										</InputLabel>{' '}
									</Grid>
									<Grid item xs={4}>
										<TextField
											name='estimate_date'
											value={formik.values?.estimate_date}
											onChange={formik.handleChange}
											size='small'
											fullWidth
											type='date'
											inputProps={{
												min: formatDateToYYYYMMDD(new Date()),
											}}
										/>
									</Grid>
								</Grid>
								<Grid item container mt={2}>
									<Grid item xs={2}>
										<InputLabel>Validity</InputLabel>
									</Grid>
									<Grid item xs={4}>
										<FormField
											id='term_id'
											value={formik.values?.term_id}
											handleChange={formik.handleChange}
											error={
												formik.touched?.term_id &&
												formik?.errors?.term_id &&
												formik?.errors?.term_id
											}
											label={'Payment Terms'}
											isTouched={formik.touched?.term_id}
											type={'select'}
											fullWidth
											options={paymentTerms}
											selectbutton={
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'center',
														alignItems: 'center',
													}}
												>
													<MUIButton
														variant={'outlined'}
														fullWidth
														onClick={() => setIsOpen(true)}
													>
														<Settings /> Configure Terms
													</MUIButton>
												</Box>
											}
										/>
										<TermsModal
											terms={paymentTerms}
											isOpen={isOpen}
											onSave={fetchTerms}
											onClose={() => setIsOpen(false)}
										/>
									</Grid>
								</Grid>
								<Grid item container mt={2}>
									<Grid item xs={2}>
										<InputLabel>
											Validity Date<span style={{ color: 'red' }}>*</span>
										</InputLabel>{' '}
									</Grid>
									<Grid item xs={4}>
										<FormField
											name='expiry_date'
											value={formik.values?.expiry_date}
											onChange={formik.handleChange}
											isTouched={formik.touched?.expiry_date}
											size='small'
											fullWidth
											type='date'
											InputProps={{
												min: formatDateToYYYYMMDD(new Date()),
											}}
											error={
												formik.touched?.expiry_date &&
												formik?.errors?.expiry_date &&
												formik?.errors?.expiry_date
											}
										/>
									</Grid>
								</Grid>

								<MyDivider />

								{/* sales  */}

								<SalesPersons
									id='sales_person_id'
									formiks={{
										values: {
											sales_person_id: formik.values?.sales_person_id,
										},
										errors: {
											sales_person_id: formik?.errors?.sales_person_id,
										},
										touched: {
											sales_person_id: formik.touched?.sales_person_id,
										},
										handleChange: formik.handleChange,
										setFieldValue: formik.setFieldValue,
									}}
								/>
								<MyDivider />

								{/* Subject  */}
								<Grid item container sx={{ margin: '1rem 0' }}>
									<Grid item xs={2} sx={{ ...labelStyle }}>
										<InputLabel>
											Subject
											<HoverPopover text='You can add upto 250 characters '></HoverPopover>
										</InputLabel>
									</Grid>
									<Grid item xs={4}>
										<TextArea
											minRows={2}
											aria-label='textarea'
											className='textarea-autosize'
											placeholder='Let your customer know what this Price Quote for'
											name='subject'
											value={formik.values?.subject || ''}
											onChange={formik.handleChange}
										/>
									</Grid>
									<MyDivider />
								</Grid>
								{/* item rates  */}
							</>

							<>
								<Grid
									item
									container
									sx={{ marginTop: '2rem' }}
									display='flex'
									justifyContent='flex-end'
								>
									<Grid item xs={12} md={6}></Grid>

									<Grid item container spacing={1} mt={1}>
										<Grid item sm={12}>
											<AddItem
												initialValues={initialValues}
												formik={formik}
												isEdit={edit}
												clicked={clicked}
												setClicked={setClicked}
												taxIdCustomer={taxIdCustomer}
												taxableCustomer={taxableCustomer}
												loading={''}
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
													value={formik.values?.customer_note || ''}
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
                        value={formik.values?.terms_and_condition || ""}
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
													files={formik.values?.estimate_files}
													onDelete={deletingFile}
													setFiles={files =>
														formik.setFieldValue('estimate_files', files)
													}
												/>
											</Box>
										</Grid>
									</Grid>
								</Grid>
							</>

							{/* add new email/contact section  */}
							{formik.values?.customer_id && (
								<CustomerContactsList
									setSelectedEmails={setSelectedEmails}
									gettingCustomerList={gettingCustomersList}
									selectedEmails={selectedEmails}
									customerDetails={customerList}
									onSave={updatingContacts}
								/>
							)}
						</Paper>
						<Box
							style={{
								position: 'sticky',
								bottom: 0,
								left: 0,
								right: 0,
								width: '100%',
								zIndex: '1000',
							}}
						>
							<Paper elevation={10} sx={{ padding: '1rem 2.3rem' }}>
								{isStatus === 'draft' && (
									<LoadingButton
										type='submit'
										variant='contained'
										onClick={() => handleButtonClick('save_as_draft')}
										disabled={saveAsDraftLoading}
										loading={saveAsDraftLoading}
									>
										Save as Draft
									</LoadingButton>
								)}
								<LoadingButton
									sx={{ marginX: '.5rem' }}
									type='submit'
									variant='contained'
									onClick={() => handleButtonClick('save_and_send')}
									disabled={saveAndSendLoading}
									loading={saveAndSendLoading}
								>
									Save and send
								</LoadingButton>
								<MUIButton
									sx={{ marginX: '.5rem' }}
									variant='outlined'
									router
									to='/sales-orders'
								>
									Cancel
								</MUIButton>
							</Paper>
						</Box>
					</>
				</div>
			</form>
		</>
	);
};
export default PriceQuoteForm;
