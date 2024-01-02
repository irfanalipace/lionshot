import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
	Button,
	Grid,
	Paper,
	Typography,
	InputAdornment,
	Checkbox,
	FormControlLabel,
} from '@mui/material';
import FormField from '../../../Components/InputField/FormField';

import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { Box } from '@mui/system';
import ContainerPaper from '../../../Components/Containers/ContainerPaper';
import { useNavigate } from 'react-router-dom';
import GridRow from '../../../Components/GridRow/GridRow';
import { LoadingButton } from '@mui/lab';
import {
	formatDate,
	formatDateToYYYYMMDD,
	getCurrentDate,
} from '../../../../core/utils/helpers';

import VendorContactsList from '../../../Components/CustomerContacts/CustomerContactsList';
import {
	SinglePayableApi,
	createPayableApi,
	deletePayableFilesApi,
	updatePayableApi,
} from '../../../../core/api/payables';
import FilesModule from '../../../Components/FileUpload/FilesModule';
import CustomerSelection from '../../../Components/CustomerSelection';
import { getVendorBills } from '../../../../core/api/vendor';
import { useGenerateNumber } from '../../../Components/GenerateNumber/GenerateNumber';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';

function AccountPayableForm({ id }) {
	const [buttonloading, setButtonLoading] = useState(false);
	const [vendorDetails, setVendorEmailsDetails] = useState([]);
	const [selectedEmails, setSelectedEmails] = useState([]);
	const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
	const navigate = useNavigate();

	const validationSchema = Yup.object().shape({
		account_payable_paid_bills: Yup.array()
			.of(
				Yup.object().shape({
					amount: Yup.number().when('is_checked', {
						is: true,
						then: () =>
							Yup.number()
								.typeError('Payment must be a number')
								.required('Payment is required')
								.min(1, 'Payment must be greater than 0')
								.test(
									'is-less-than-due',
									'Amount must be equal to due amount',
									function (value) {
										const due_amount = this.parent.due_amount;
										return value === due_amount;
									}
								),
					}),
				})
			)
			.test(
				'at-least-one-checked',
				'At least one bill is required',
				function (value) {
					const isCheckedArray = value.map(item => item.is_checked);
					return isCheckedArray.includes(true);
				}
			),
		total_bill_amount: Yup.number().test(
			'equal-to-paid-amount',
			'Total Bill Amount must be equal to Amount Payable',
			function (value) {
				const payment_paid = this.parent.payment_paid;
				return payment_paid === value;
			}
		),
	});
	const formik = useFormik({
		initialValues: {
			vendor_id: '',
			amount_payable: '',
			payment_date: getCurrentDate(),
			payment_number: '',
			payment_mode: 'cash',
			reference_number: '',
			payment_paid: '',
			is_pay_full_amount: 0,
			bank_charges: null,
			notes: '',
			account_payable_paid_bills: [],
			account_payable_attachments: [],
			account_payable_emails: [],
			total_bill_amount: 0,
		},
		validationSchema: validationSchema,
		onSubmit: async values => {
			setButtonLoading(true);
			const bills = values?.account_payable_paid_bills?.filter(
				bill => bill.is_checked
			);
			if (id) {
				try {
					await updatePayableApi({
						...values,
						id,
						account_payable_paid_bills: bills,
						_method: 'PUT',
					});
					notyf.success('Payment Updated Successfully');
					navigate('/account-payable');
				} catch (e) {
					setButtonLoading(false);
					formik.setErrors(e.data.errors);
				}
			} else {
				try {
					await createPayableApi({
						...values,
						account_payable_paid_bills: bills,
					});
					notyf.success('Payment Created Successfully');
					navigate('/account-payable');
					setButtonLoading(false);
				} catch (e) {
					setButtonLoading(false);
					formik.setErrors(e.data.errors);
				} finally {
					setButtonLoading(false);
				}
			}
		},
	});

	useGenerateNumber('account_payable', 'payment_number', formik, id);

	useEffect(() => {
		if (formik.dirty === true) {
			const el = document.querySelector('.Mui-error, [data-error]');
			(el?.parentElement ?? el)?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [formik.isSubmitting]);

	//  single PaymentData api
	const fetchVendorBills = async _id => {
		setIsLoadingOverlay(true);
		try {
			const singlePayment = await getVendorBills(_id);
			if (!id) {
				formik.setFieldValue('payment_paid', singlePayment.payment_paid);
			}
			formik.setFieldValue('total_amount', singlePayment.total_pending_amount);
			const vendorBills = singlePayment?.vendor_data?.bills?.map(bill => {
				return {
					...bill,
					bill_id: bill.id,
					amount: 0,
					is_checked: false,
				};
			});
			if (!id) formik.setFieldValue('account_payable_paid_bills', vendorBills);
			else {
				const editedBills = vendorBills.map(bill => {
					const paidBill = formik.values?.account_payable_paid_bills?.find(
						_bill => _bill.bill_id === bill.id
					);
					if (paidBill)
						return { ...bill, is_checked: true, amount: paidBill.amount };
					else return bill;
				});
				formik.setFieldValue('account_payable_paid_bills', editedBills);
			}
		} catch (e) {
			console.log('e', e);
		}
		setIsLoadingOverlay(false);
	};

	useEffect(() => {
		const total_bill_amount = formik.values.account_payable_paid_bills?.reduce(
			(total, obj) => total + (obj.is_checked ? parseFloat(obj.amount) : 0),
			0
		);
		formik.setFieldValue('total_bill_amount', total_bill_amount);
	}, [formik.values.account_payable_paid_bills]);

	const onSelect = resp => {
		formik.setValues(values => {
			return {
				...values,
				vendor_id: resp.id,
			};
		});
		setSelectedEmails(resp.vendor_contacts);
		setVendorEmailsDetails(resp);
		if (resp.id) {
			fetchVendorBills(resp.id);
		}
	};

	useEffect(() => {
		const selectedEmailss = selectedEmails
			?.filter(item => item.is_selected === 1)
			.map(item => item.email);
		formik.setFieldValue('account_payable_emails', selectedEmailss || []);
	}, [selectedEmails]);

	const getsinglePaymentData = async () => {
		setIsLoadingOverlay(true);
		try {
			if (id) {
				const singlePayment = await SinglePayableApi(id);
				formik.setValues(singlePayment);
				// formik.setFieldValue('vendor_id', singlePayment.id)
			}
		} catch (e) {
			console.log('e', e);
		}
		setIsLoadingOverlay(false);
	};

	useEffect(() => {
		getsinglePaymentData();
	}, [id]);

	const updatingContacts = newContacts => {
		setSelectedEmails(prev => [...prev, ...newContacts]);
	};

	const paymentModes = [
		{ value: 'bank_transfer', text: 'Bank Transfer' },
		{ value: 'cash', text: 'cash' },
		{ value: 'square', text: 'square' },
		{ value: 'cheque', text: 'cheque' },
	];

	return (
		<>
			<OverlayLoader open={isLoadingOverlay} />
			<form onSubmit={formik.handleSubmit}>
				<ContainerPaper>
					<Box aria-label='account-payable-form' py={1}>
						{/* Vendor Name  */}
						{/* <GridRow>
							<Grid item xs={2}>
								<Typography variant='body2'>
									Vendor Name <span style={{ color: 'red' }}>*</span>
								</Typography>
							</Grid>
							<Grid item xs={4}> */}

						<CustomerSelection
							id='vendor_id'
							formik={formik}
							type='vendor'
							onSelect={onSelect}
							showAddress={false}
							preSelected={formik.values?.vendor_id}
							setIsLoadingOverlay={setIsLoadingOverlay}
						/>
						{/* </Grid>
						</GridRow> */}

						<Box
							aria-label='white-overlay'
							sx={
								formik.values.vendor_id
									? { opacity: '1' }
									: {
											opacity: '0.5',
											zIndex: '3',
											cursor: 'not-allowed',
											pointerEvents: 'none',
									  }
							}
						>
							{/* Payment Number*/}
							<GridRow>
								<Grid item xs={2}>
									<Typography variant='body2'>
										Payment Number <span style={{ color: 'red' }}></span>
									</Typography>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='payment_number'
										// disabled
										value={formik.values.payment_number}
										isTouched={formik.touched.payment_number}
										error={formik.errors?.payment_number}
										handleChange={formik.handleChange}
									/>
								</Grid>
							</GridRow>
							{/* Amount Payable  */}
							<GridRow style={{ marginTop: '15px' }}>
								<Grid item xs={2}>
									<Typography variant='body2'>
										Amount Payable<span style={{ color: 'red' }}>*</span>
									</Typography>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='payment_paid'
										placeholder='$'
										aria-labelledby='payment_paid'
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
										value={formik.values.payment_paid}
										handleChange={formik.handleChange}
										onBlur={formik.handleBlur}
										disabled={formik.values.is_pay_full_amount}
										isTouched={formik.touched?.payment_paid}
										error={formik.errors?.payment_paid}
										fullWidth
										required
										type={'number'}
									/>
									<FormControlLabel
										control={<Checkbox />}
										name={'is_pay_full_amount'}
										label={`Pay Full Amount (${
											formik.values.total_amount || 0
										})`}
										type={'checkbox'}
										onChange={(e, value) => {
											formik.setFieldValue('is_pay_full_amount', value ? 1 : 0);
											formik.setFieldValue(
												'payment_paid',
												formik.values.total_amount
											);
											if (value) {
												const _all_bills =
													formik.values?.account_payable_paid_bills?.map(
														bill => {
															return {
																...bill,
																is_checked: true,
																amount: bill.due_amount,
															};
														}
													);
												formik.setFieldValue(
													'account_payable_paid_bills',
													_all_bills
												);
											}
										}}
										checked={formik.values.is_pay_full_amount}
									/>
								</Grid>
							</GridRow>

							{/* Bank Charges */}
							<GridRow>
								<Grid item xs={2}>
									<Typography variant='body2'>
										Bank Charges (Optional){' '}
										<span style={{ color: 'red' }}></span>
									</Typography>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='bank_charges'
										type={'number'}
										placeholder='$'
										value={formik.values.bank_charges}
										error={formik.errors?.bank_charges}
										handleChange={formik.handleChange}
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
										InputProps={{ min: formatDateToYYYYMMDD(new Date()) }}
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
									<Typography variant='body2'>Reference#</Typography>
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
									/>
								</Grid>
							</GridRow>
							{/* Bill Section */}
							<GridRow>
								<Grid item xs={8}>
									<GridRow
										style={{
											backgroundColor: '#F9F9FB',
											alignItems: 'center',
											marginLeft: '0px',
										}}
									>
										<Grid item xs={5} pb={1}>
											<Typography variant='body2'>Unpaid Bills </Typography>
										</Grid>
										<Grid item xs={4}></Grid>
										<Grid item xs={2.7} sx={{ textAlign: 'right' }}>
											{/* <Button
												sx={{
													fontSize: '11px',
													textTransform: 'capitalize',
													color: window.themeColors.primary,
												}}
												onClick={() => formik.setFieldValue('payment_made', '')}
											>
												Clear Applied Amount
											</Button> */}
										</Grid>
									</GridRow>

									{formik.values.vendor_id &&
									formik.values.account_payable_paid_bills?.length > 0 ? (
										<>
											<GridRow
												style={{
													margin: '0px 0',
													paddingBottom: '8px',
													borderBottom: '2px solid #E0E0E0',
												}}
											>
												<Grid item xs={0.8}></Grid>
												<Grid item xs={2}>
													<Typography variant='body2Grey'>Date</Typography>
												</Grid>
												<Grid item xs={2}>
													<Typography variant='body2Grey'>Bill#</Typography>
												</Grid>
												<Grid item xs={2}>
													<Typography variant='body2Grey'>
														Purchase Order#
													</Typography>
												</Grid>
												<Grid item xs={2}>
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
											{formik.values.account_payable_paid_bills.map(
												(bill, index) => (
													<>
														<GridRow
															style={{
																margin: '0 0',
																borderBottom: '2px solid #E0E0E0',
															}}
															sx={{
																'& .MuiGrid-item': {
																	display: 'flex',
																	paddingTop: 0,
																	alignItems: 'center',
																},
															}}
															key={index}
														>
															<Grid item xs={0.8}>
																{' '}
																<FormControlLabel
																	control={<Checkbox />}
																	name={
																		'account_payable_paid_bills[' +
																		index +
																		'].is_checked'
																	}
																	type={'checkbox'}
																	onChange={(e, value) => {
																		formik.setFieldValue(
																			'account_payable_paid_bills[' +
																				index +
																				'].is_checked',
																			value
																		);
																		formik.setFieldValue(
																			'account_payable_paid_bills[' +
																				index +
																				'].amount',
																			formik.values.account_payable_paid_bills[
																				index
																			].due_amount
																		);
																	}}
																	checked={
																		formik.values.account_payable_paid_bills[
																			index
																		].is_checked
																	}
																/>{' '}
															</Grid>
															<Grid item xs={2}>
																<Typography variant='body2Grey'>
																	{formatDate(
																		formik.values?.account_payable_paid_bills[
																			index
																		]?.bill_date
																	)}
																</Typography>
															</Grid>
															<Grid item xs={2}>
																<Typography variant='body2Grey'>
																	{
																		formik.values?.account_payable_paid_bills[
																			index
																		]?.bill_number
																	}
																</Typography>
															</Grid>
															<Grid item xs={2}>
																<Typography variant='body2Grey'>
																	{formik.values?.account_payable_paid_bills[
																		index
																	]?.purchase_order?.purchase_order_number ||
																		'--'}
																</Typography>
															</Grid>
															<Grid item xs={2}>
																<Typography variant='body2Grey'>
																	$
																	{
																		formik.values?.account_payable_paid_bills[
																			index
																		]?.due_amount
																	}
																</Typography>
															</Grid>
															<Grid item xs={2}>
																{/* <FormField
																	type='number'
																	id={
																		'account_payable_paid_bills[' +
																		index +
																		'].amount'
																	}
																	value={
																		formik.values?.account_payable_paid_bills[
																			index
																		]?.amount
																	}
																	aria-label='Payment Made'
																	sx={{
																		'& .MuiInputBase-input': {
																			padding: '2px 0px',
																			textAlign: 'right',
																		},
																	}}
																	disabled={
																		!formik.values?.account_payable_paid_bills[
																			index
																		]?.is_checked
																	}
																	onChange={formik.handleChange}
																	error={
																		formik.errors?.account_payable_paid_bills
																			?.length >= index
																			? formik.errors
																					?.account_payable_paid_bills[index]
																					?.amount
																			: false
																	}
																	onBlur={formik.handleBlur}
																	isTouched={
																		formik.touched?.account_payable_paid_bills
																			?.length >= index
																			? formik.touched
																					?.account_payable_paid_bills[index]
																					?.amount
																			: false
																	}
																	placeholder='Payment Value'
																/> */}
																<Typography
																	variant='body2Grey'
																	marginLeft={'60px'}
																>
																	$
																	{
																		formik.values?.account_payable_paid_bills[
																			index
																		]?.due_amount
																	}
																</Typography>
															</Grid>
															{/* <Grid item xs={2} sx={{ textAlign: 'right', paddingRight: '15px' }}><Typography variant="body2Grey">{UnpaidBillsData?.payment}</Typography></Grid> */}
														</GridRow>
													</>
												)
											)}
											<GridRow style={{ margin: '0 0' }}>
												<Grid item xs={3}>
													<Typography
														variant='captionGrey'
														sx={{ fontSize: '11px' }}
													>
														**List contains only SENT bills
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
														${formik.values.total_bill_amount || 0}
													</Typography>
												</Grid>
											</GridRow>
										</>
									) : (
										<Typography sx={{ textAlign: 'center', margin: '20px' }}>
											There are no unpaid bills associated with this vendor
										</Typography>
									)}
								</Grid>
							</GridRow>
							{
								<Box my={1}>
									{typeof formik.errors.account_payable_paid_bills ===
										'string' && (
										<Typography
											className='Mui-error'
											variant='body2'
											color={'error'}
										>
											{formik.errors.account_payable_paid_bills}
										</Typography>
									)}

									{typeof formik.errors.total_bill_amount === 'string' && (
										<Typography
											className='Mui-error'
											variant='body2'
											color={'error'}
										>
											{formik.errors.total_bill_amount}
										</Typography>
									)}
								</Box>
							}
							<GridRow>
								<Grid item xs={6}>
									<Typography variant='body2' mb={1}>
										Notes (Internal use. Not visible to vendor)
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
											files={formik.values.account_payable_attachments}
											setFiles={files =>
												formik.setFieldValue(
													'account_payable_attachments',
													files
												)
											}
											deleteApi={deletePayableFilesApi}
											VendorContactsList // onDelete={deletingFile}
										/>
									</Box>
								</Grid>
							</GridRow>
							{/* add new email/contact section  */}
							{vendorDetails?.length > 0 && (
								<VendorContactsList
									pageName={'paymentPayed'}
									setSelectedEmails={setSelectedEmails}
									selectedEmails={selectedEmails}
									customerDetails={vendorDetails}
									onSave={updatingContacts}
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
									Start Adding custom fields for your payments payable by going
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
									Payment Payed
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
						formik.values.vendor_id
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
						onClick={() => navigate('/account-payable')}
					>
						Cancel
					</Button>
				</Paper>
			</form>
		</>
	);
}

export default AccountPayableForm;
