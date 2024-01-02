import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
	Box,
	Grid,
	Typography,
	Checkbox,
	Stack,
	TextField,
	styled,
	Paper,
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmailList, sendInvoiceEmailApi } from '@/apis/invoice';
import FormField from '@/Components/InputField/FormField';
import notyf from '@/Components/NotificationMessage/notyfInstance';
import MUIButton from '@/Components/MUIButton';
import HeaderPaper from '@/Components/Containers/HeaderPaper';
import useResponsiveStyles from '@/hooks/useMedaiQuery';
import { decryptId } from '@/utils/helper';

// styles
export const FormTitle = styled(Typography)(() => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	margin: '1rem 0 .4rem 0',
}));

const checkBoxStyle = {
	margin: 0,
	padding: 0,
};

const fromOptions = [
	{ label: 'support@sjcomputer.us', value: 'support@sjcomputer.us' },
];

const validationSchema = Yup.object().shape({
	from: Yup.string().email('Invalid email').required('From email is required'),
	to: Yup.array()
		.of(Yup.string().email('Invalid email'))
		.min(1, 'At least one recipient is required'),
	subject: Yup.string().required('Subject is required'),
});

const SendMail = () => {
	// const [apiError, setApiError] = useState(null);
	const [fromState, setFromState] = useState(null);
	const [EmailList, setEmailList] = useState([]);
	const [selectedTo, setSelectedTo] = useState('');
	const [selectedCC, setSelectedCC] = useState('');

	const { type, id } = useParams();
	const decryptedId = decryptId(id);

	const navigate = useNavigate();

	// console.log('emails', EmailList)
	const initialValues = {
		from: 'support@sjcomputer.us',
		to: [],
		cc: [],
		bcc: [],
		attachments: [],
		attach_pdf: 0,
		message: '',
		subject: '',
	};
	// console.log('typess', type, id)
	const finalType = type == 'price-quote' ? 'estimate' : type;
	// console.log('finaltype', finalType)
	const fetchingEmailList = async () => {
		try {
			const resp: any = await getEmailList({ key: finalType, id: decryptedId });
			if (resp) {
				setEmailList(
					resp?.data?.map(email => ({ label: email, value: email }))
				);
			}
			// setEmailList(resp.data)
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		fetchingEmailList();
	}, [id]);

	const handleSubmit = async (values, { setSubmitting }) => {
		// console.log('values', values);
		const finalValues = {
			...values,
			id: decryptedId,
			type: finalType,
			// to:
		};
		try {
			console.log('finalValues', finalValues);
			const resp: any = await sendInvoiceEmailApi(finalValues);
			if (resp) {
				notyf.success(resp?.message);
				navigate('/invoices');
			}
		} catch (error) {
			// setApiError(error?.data?.errors);
			if (error.data && error.data.errors) {
				const validationErrors = error.data?.errors;
				console.log('error', validationErrors);
				for (const field in validationErrors) {
					const errorMessages = validationErrors[field];

					if (Array.isArray(errorMessages)) {
						errorMessages.forEach(errorMsg => {
							notyf.error(`${field}: ${errorMsg}`);
						});
					} else {
						notyf.error(`${field}: ${errorMessages}`);
					}
				}
			}
		} finally {
			setSubmitting(false);
		}
	};

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: handleSubmit,
	});

	const handleFileChange = event => {
		const files = event.target.files;
		if (files && files.length > 0) {
			formik.setFieldValue('attachments', Array.from(files));
		} else {
			formik.setFieldValue('attachments', []);
		}
	};

	const handleSelectChange = (selected, type) => {
		if (type === 'to') {
			setSelectedTo(selected);
		}
		if (type === 'cc') {
			setSelectedCC(selected);
		}
		formik.setFieldValue(
			type,
			selected.map(item => item.value)
		);
	};

	// from email
	useEffect(() => {
		setFromState(() => {
			const filtered = fromOptions?.filter(
				from => from.value === formik.values.from
			);
			return filtered || null;
		});
	}, [formik.values.from]);

	return (
		<form onSubmit={formik.handleSubmit}>
			<HeaderPaper>
				<Grid container>
					<Grid item sm={12}>
						<Typography>Email to</Typography>
					</Grid>
				</Grid>
			</HeaderPaper>
			<Paper
				sx={{
					padding: '1.5rem 1rem',
					borderRadius: '10px',
					border: 0,
					// width: '500px',
					marginX: 'auto',
				}}
			>
				<Grid item container marginY='.9rem'>
					<Grid item xs={12}>
						<Stack direction='row' spacing={1}>
							<LockOpenIcon fontSize='small' color='primary' />
							<Typography
								variant='subtitle2'
								sx={{ fontSize: { xs: '.7rem', md: '.9rem' }, fontWeight: 550 }}
							>
								Send Email
							</Typography>
						</Stack>
					</Grid>
					<Grid item xs={12}>
						<FormTitle variant='body2'>From</FormTitle>
						<Select
							// value={formik.values.from}
							styles={{
								control: baseStyles => ({
									...baseStyles,
									fontFamily: 'Roboto',
									background: 'transparent',
									borderColor:
										formik.touched.customer_id && formik.errors.customer_id
											? 'red'
											: 'rgba(0, 0, 0, 0.2)',
								}),
								menu: baseStyles => ({
									...baseStyles,
									zIndex: 9999,
									fontFamily: 'Roboto',
								}),
							}}
							isClearable
							isSearchable
							options={fromOptions?.map(option => ({
								label: option.label,
								value: option.value,
							}))}
							value={fromState}
							placeholder='Select Email'
							id='from'
							name='from'
							onBlur={formik.handleBlur}
							onChange={selectedOption =>
								handleSelectChange(selectedOption, 'from')
							}
						/>
						{formik.touched.from && formik.errors.from && (
							<Typography variant='caption' color='error'>
								{formik.errors.from}
							</Typography>
						)}
					</Grid>
					<Grid item xs={12}>
						<Box>
							<FormTitle variant='body2'>Send To</FormTitle>

							<Select
								// value={formik.values.from}
								styles={{
									control: baseStyles => ({
										...baseStyles,
										fontFamily: 'Roboto',
										background: 'transparent',
										borderColor:
											formik.touched.to && formik.errors.to
												? 'red'
												: 'rgba(0, 0, 0, 0.2)',
									}),
									menu: baseStyles => ({
										...baseStyles,
										zIndex: 9999,
										fontFamily: 'Roboto',
									}),
								}}
								isClearable
								isSearchable
								isMulti
								options={EmailList}
								value={selectedTo}
								placeholder='Select Email'
								id='to'
								name='to'
								onBlur={formik.handleBlur}
								onChange={selectedOption =>
									handleSelectChange(selectedOption, 'to')
								}
							/>

							{formik.touched.to && formik.errors.to && (
								<Typography variant='caption' color='error'>
									{formik.errors.to}
								</Typography>
							)}
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Box>
							<FormTitle variant='body2'>Cc</FormTitle>

							<Select
								// value={formik.values.from}
								styles={{
									control: baseStyles => ({
										...baseStyles,
										fontFamily: 'Roboto',
										background: 'transparent',
										borderColor:
											formik.touched.cc && formik.errors.cc
												? 'red'
												: 'rgba(0, 0, 0, 0.2)',
									}),
									menu: baseStyles => ({
										...baseStyles,
										zIndex: 9999,
										fontFamily: 'Roboto',
									}),
								}}
								isClearable
								isSearchable
								isMulti
								options={EmailList}
								value={selectedCC}
								placeholder='Select Email'
								id='cc'
								name='cc'
								onBlur={formik.handleBlur}
								onChange={selectedOption =>
									handleSelectChange(selectedOption, 'cc')
								}
							/>
							{formik.touched.cc && formik.errors.cc && (
								<Typography variant='caption' color='error'>
									{formik.errors.cc}
								</Typography>
							)}
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Box>
							<FormTitle variant='body2'>Subject</FormTitle>
							<FormField
								size='small'
								name='subject'
								id='subject'
								value={formik.values.subject}
								handleChange={formik.handleChange}
								isTouched={!!formik.touched.subject}
								onBlur={formik.handleBlur}
								error={
									formik.touched.subject &&
									formik.errors.subject &&
									formik.errors.subject
								}
							/>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<FormTitle variant='body2'>Message</FormTitle>
						<FormField
							name='message'
							id='message'
							value={formik.values.message}
							handleChange={formik.handleChange}
							multiline
							rows={4}
							fullWidth
						/>
					</Grid>
					{finalType !== 'customer' ? (
						<>
							<Grid item xs={12} my={2}>
								<Typography variant='body2'>Attach Pdf</Typography>
								<Stack
									direction='row'
									spacing={1}
									display='flex'
									alignItems='center'
								>
									<Checkbox
										style={checkBoxStyle}
										size='small'
										name='attach_pdf'
										label='Attach Pdf'
										onChange={() => {
											formik.setFieldValue(
												'attach_pdf',
												formik.values.attach_pdf ? 0 : 1
											);
										}}
										checked={Boolean(formik.values.attach_pdf)}
									/>
									<FormTitle variant='h6' fontWeight='400'>
										Attach pdf
									</FormTitle>
								</Stack>
							</Grid>
						</>
					) : (
						<></>
					)}
					<Grid item xs={12} mt={3}>
						<TextField
							type='file'
							size='small'
							multiple
							fullWidth
							onChange={handleFileChange}
						/>
						{formik.touched.attachments && formik.errors.attachments && (
							<Typography variant='caption' color='error'>
								{formik.errors.attachments}
							</Typography>
						)}
					</Grid>

					<Grid
						item
						xs={12}
						sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}
					>
						<LoadingButton
							disabled={formik.isSubmitting}
							loading={formik.isSubmitting}
							type='submit'
							variant='contained'
							size='small'
							endIcon={<SendIcon />}
							sx={{
								fontSize: '14px',
								marginRight: '.5rem',
							}}
						>
							Send
						</LoadingButton>
						<MUIButton variant='outlined' onClick={() => navigate(-1)}>
							Cancel
						</MUIButton>
					</Grid>
				</Grid>
			</Paper>
		</form>
	);
};

export default SendMail;
