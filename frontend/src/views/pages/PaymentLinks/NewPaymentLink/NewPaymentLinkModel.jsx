import { useEffect, useState } from 'react';
import { Autocomplete, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import Modal from '../../../Components/Modal/Dialog';
import { validationSchema } from './validationSchema';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { getCustomersApi } from '../../../../core/api/estimate';
import { Box } from '@mui/system';
import FormField from '../../../Components/InputField/FormField';
import { createPaymentLink } from '../../../../core/api/paymentLinks';
import { getCustomerInvoices } from '../../../../core/api/customer';
import { useNavigate } from 'react-router-dom';
function NewPaymentLinkModel({
	isOpen,
	onClose,
	setRefresh,
	newPaymentLinkID,
}) {
	const navigate = useNavigate();
	const [CustomerOptions, setCustomerOptions] = useState();
	const [btnType, setBtnType] = useState('');
	const [fieldError, setFieldError] = useState('');
	const [selectedInvoice, setSelectedInvoice] = useState(null);
	const [customerInvoices, setCustomerInvoices] = useState([]);
	const [selectedOption, setSelectedOption] = useState(null);
	const [allInvoicesData, setAllInvoicesData] = useState();
	const formik = useFormik({
		initialValues: {
			customer_id: '',
			invoice_id: '',
			payment_amount: '',
			link_expiration_date: '',
			description: '',
			button_type: btnType,
		},
		validationSchema: validationSchema,

		onSubmit: async values => {
			const updatedValues = {
				...values,
				button_type: btnType,
			};

			try {
				console.log('showformik', updatedValues);
				const response = await createPaymentLink(updatedValues);
				if (response) {
					notyf.success('Payment Link Created Successfully');
					setRefresh(prev => prev + 1);
					navigate('/payment-links');
					onClose();
				}
			} catch (e) {
				console.log('error creating', e.data.errors);
				setFieldError(e.data.errors);
			}
		},
	});
	// fetch customer
	const fetchCustomerOptions = async () => {
		try {
			const resp = await getCustomersApi();
			if (resp) {
				setCustomerOptions(
					resp?.data?.Customers?.map(item => ({
						label: item.display_name,
						value: item.id,
					}))
				);
			}
		} catch (error) {
			console.log('error', error);
		}
	};

	const getInvoices = async () => {
		let resp = await getCustomerInvoices({
			customer_id: formik.values?.customer_id,
		});
		setAllInvoicesData(resp?.data);

		// console.log('invoice res', resp?.data[0]?.total);
		setCustomerInvoices(
			resp?.data?.map(i => ({ label: i?.invoice_number, value: i?.id }))
		);
	};

	useEffect(() => {
		fetchCustomerOptions();
		if (formik.values?.customer_id) getInvoices();
	}, [formik.values?.customer_id]);

	// find invoice and set due_amount in payment amount
	useEffect(() => {
		const foundInvoice = allInvoicesData?.find(
			invoice => invoice.invoice_number === selectedInvoice?.label
		);
		formik.setFieldValue('payment_amount', foundInvoice?.due_amount);
		console.log('founddueamount', foundInvoice?.due_amount);
	}, [selectedInvoice]);

	useEffect(() => {
		if (newPaymentLinkID) {
			// const matchingCustomer = CustomerOptions?.find(customer => customer?.value == newPaymentLinkID);
			let option = CustomerOptions?.find(
				option => newPaymentLinkID == option.value
			);
			setSelectedOption(option);
			formik.setFieldValue('customer_id', option?.value);
		}
	}, [newPaymentLinkID, CustomerOptions]);

	const handleAutocompleteChange = (event, newValue) => {
		setSelectedOption(newValue);
		formik.setFieldValue('customer_id', newValue?.value);
	};
	const handleButtonClick = type => {
		setBtnType(type);
	};
	useEffect(() => {
		formik.setErrors(fieldError);
	}, [fieldError]);
	console.log('showformik', formik.values.customer_id);
	function handleCloseModel() {
		if (newPaymentLinkID) {
			history.back();
			onClose();
		} else {
			onClose();
		}
	}
	return (
		<>
			<Modal
				open={isOpen}
				onClose={handleCloseModel}
				title={'New Payment Link'}
				size={'sm'}
			>
				<Box p={2} sx={{ minHeight: '35vh' }}>
					<Typography variant='body1' sx={{ margin: '0 0 10px 0' }}>
						Customer Name*
					</Typography>
					<Autocomplete
						id='customer_id'
						options={CustomerOptions || []}
						value={selectedOption}
						// getOptionLabel={option => option?.label || []}
						onChange={handleAutocompleteChange}
						sx={{
							'& .MuiInputBase-root': { fontSize: '16px', padding: '0px 5px' },
							'& .MuiFormLabel-root': { top: '-8px' },
						}}
						renderInput={params => (
							<TextField {...params} label='Customer Name' />
						)}
					/>
					{formik.touched?.customer_id && formik.errors?.customer_id && (
						<Typography variant='caption' color='error'>
							{formik.errors.customer_id}
						</Typography>
					)}

					{formik.values?.customer_id && (
						<>
							<Typography variant='body1' sx={{ margin: '20px 0 10px 0' }}>
								Invoice*
							</Typography>
							<Autocomplete
								id='invoice_id'
								options={customerInvoices || []}
								value={selectedInvoice}
								selectedOption
								// getOptionLabel={option => option?.label || []}
								onChange={(e, value) => {
									setSelectedInvoice(value);
									formik.setFieldValue('invoice_id', value?.value);
								}}
								sx={{
									'& .MuiInputBase-root': {
										fontSize: '16px',
										padding: '0px 5px',
									},
									'& .MuiFormLabel-root': { top: '-8px' },
								}}
								renderInput={params => (
									<TextField {...params} label='Select Invoice' />
								)}
							/>
							{formik.touched?.invoice_id && formik.errors?.invoice_id && (
								<Typography variant='caption' color='error'>
									{formik.errors?.invoice_id}
								</Typography>
							)}
						</>
					)}
					{selectedInvoice && (
						<>
							<Typography variant='body1' sx={{ margin: '20px 0 10px 0' }}>
								Payment Amount*
							</Typography>
							<FormField
								id='payment_amount'
								fullWidth
								// label={'Payment Amount'}
								type={'number'}
								value={formik.values.payment_amount || ''}
								handleChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isTouched={formik.touched?.payment_amount}
								error={formik.errors?.payment_amount}
								disabled
							/>
						</>
					)}

					<Typography variant='body1' sx={{ margin: '20px 0 10px 0' }}>
						Link Expiration Date*
					</Typography>
					<FormField
						id='link_expiration_date'
						fullWidth
						type={'date'}
						handleChange={formik.handleChange}
						onBlur={formik.handleBlur}
						isTouched={formik.touched?.link_expiration_date}
						error={formik.errors?.link_expiration_date}
					/>
					<Typography variant='body1' sx={{ margin: '20px 0 10px 0' }}>
						Description*
					</Typography>
					<FormField
						id='description'
						fullWidth
						type={'textarea'}
						placeholder={
							'Tell your customer why you’re collecting this payment...'
						}
						handleChange={formik.handleChange}
						onBlur={formik.handleBlur}
						isTouched={formik.touched?.description}
						error={formik.errors?.description}
					/>
					<Box mt={2}>
						<Button
							variant='contained'
							size='small'
							type='button'
							onClick={() => {
								handleButtonClick('generate_link');
								formik.handleSubmit();
							}}
						>
							Generate Link
						</Button>
						{/* <Button
							variant='contained'
							size='small'
							sx={{ marginLeft: '5px', background: 'grey' }}
							type='button'
							onClick={() => {
								handleButtonClick('save_and_share');
								formik.handleSubmit();
							}}
							>
							Save and Share
						</Button> */}
						<Button
							variant='contained'
							size='small'
							sx={{ marginLeft: '5px', background: 'grey' }}
							onClick={() => {
								onClose();
							}}
						>
							Cancel
						</Button>
					</Box>
				</Box>
			</Modal>
		</>
	);
}

export default NewPaymentLinkModel;
