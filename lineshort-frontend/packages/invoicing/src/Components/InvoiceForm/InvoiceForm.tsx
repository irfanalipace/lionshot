import { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Button from '@/Components/MUIButton';
import FormField from '@/Components/Common/Input';
import { styled } from '@mui/system';
import useResponsiveStyles from '@/hooks/useMedaiQuery';
import { useFormik } from 'formik';
import MUIButton from '@/Components/MUIButton';
import { MainLayout, MainTitleStyled, FormLayout } from './newInvoiceStyle';
import AddItem from '../AddItem/AddItem';
import React from 'react';
import Stack from '@mui/material/Stack';
const AddRowTitle = styled(Typography)(({ theme }) => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	margin: '1rem 0',
}));

interface FileData {
	name: string;
	size: number;
	type: string;
}

function InvoiceForm({ edit }) {
	const [fileData, setFileData] = useState<FileData[]>([]);

	// file work
	const handleFileInputChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const files = event.target.files;

		if (files && files.length > 0) {
			const newFiles = Array.from(files).map(file => ({
				name: file.name,
				size: file.size,
				type: file.type,
			}));
			setFileData(prevFiles => [...prevFiles, ...newFiles]);
		}
	};

	// delete/remove added files from list
	const deleteFile = (file: FileData) => {
		setFileData(prevFiles => prevFiles.filter(f => f !== file));
	};

	//  formik/ new estimate
	const initialValues = {
		customer_id: '',
		sales_person_id: '',
		estimate_number: '',
		reference_number: '',
		estimate_date: '',
		expiry_date: '',
		subject: '',
		sub_total: '',
		discount: '',
		discount_type: '',
		total: '',
		shipping_charges: '',
		adjustment_description: '',
		adjustment: '',
		items_rates_are: '',
		customer_note: '',
		terms_and_condition: '',
	};

	const formik = useFormik({
		initialValues,
		onSubmit: values => {
			console.log('values:', values);
		},
	});

	const [rows, setRows] = useState([
		{
			id: 1,
		},
	]);
	console.log('rowsss&&&', rows);

	return (
		<Box>
			<MainLayout>
				<Grid container>
					{/* top title  */}
					<Grid item xs={12}>
						<MainTitleStyled>
							<Typography
								variant='h6'
								sx={{
									fontSize: { xs: '.7rem', md: '1.2rem' },
									fontWeight: 500,
									mr: 'auto',
								}}
							>
								New Invoice
							</Typography>
							<MUIButton endIcon={<RemoveRedEyeIcon />} router path='/invoices'>
								View Invoice Details
							</MUIButton>
						</MainTitleStyled>
					</Grid>
					<FormLayout>
						{/* main layout   */}
						<Box>
							{/* New Estimate Top Create form section */}
							{/* <NewEstimateTopForm/> */}

							<Grid container my={7} spacing={2}>
								<Grid item xs={12} md={6}>
									<Stack direction='row' spacing={2}>
										<Typography variant='body2'>Customer Name</Typography>
										<FormField size='small' style={{ margin: '1rem 0' }} />
									</Stack>
								</Grid>
								<Grid item xs={12} md={6}></Grid>
								<Grid item xs={12} md={6}>
									<Typography variant='body2'>Invoice#</Typography>
									<FormField
										size='small'
										fullWidth
										style={{ margin: '1rem 0' }}
									/>
									<Typography variant='body2'>Invoice Date</Typography>
									<FormField
										size='small'
										fullWidth
										type='date'
										style={{ margin: '1rem 0' }}
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<Typography variant='body2'>Order Number</Typography>
									<FormField fullWidth style={{ margin: '1rem 0' }} />
								</Grid>
								<Grid item xs={12} md={6}>
									<Typography variant='body2' style={{ margin: '0 0 1rem 0' }}>
										Terms
									</Typography>
									<FormField
										type='select'
										fullWidth
										label='Terms'
										style={{ margin: '1rem 0' }}
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<Typography variant='body2'>Due Date</Typography>
									<FormField
										size='small'
										fullWidth
										type='date'
										style={{ margin: '1rem 0' }}
									/>
								</Grid>

								<Grid item xs={12} md={6}>
									<Typography variant='body2'>Salesperson</Typography>
									<FormField fullWidth style={{ margin: '1rem 0' }} />
									<Typography variant='body2'>Subject</Typography>
									<FormField fullWidth style={{ margin: '1rem 0' }} />
									<Typography variant='body2'>Item Rates</Typography>
									<FormField fullWidth style={{ margin: '1rem 0' }} />
								</Grid>
							</Grid>

							<AddItem />
							{/* total calcaultion section  */}
							{/* <NewEstimateFormTotal /> */}
							<Grid
								container
								sx={{ marginTop: '7rem' }}
								display='flex'
								justifyContent='flex-end'
							>
								{/* left section .. empty */}
								<Grid item xs={12} md={6}>
									{/* <Typography>Right Side</Typography> */}
								</Grid>
								{/* right section with field for total  */}
								<Grid item xs={12} md={6}>
									<Grid container>
										<Grid item xs={12}>
											<Typography variant='body2'>SubTotal</Typography>
											<FormField fullWidth />
										</Grid>
										<Grid item xs={12}>
											<Typography variant='body2'>Discount Type</Typography>
											<FormField fullWidth type='select' />
										</Grid>
										<Grid item xs={12}>
											<Typography variant='body2'>Discount Value</Typography>
											<FormField fullWidth />
										</Grid>
										<Grid item xs={12}>
											<Typography variant='body2'>Shipping Charges</Typography>
											<FormField fullWidth />
										</Grid>
										<Grid item xs={12}>
											<Typography variant='body2'>Adjustment</Typography>
											<FormField fullWidth />
										</Grid>
										<Grid
											item
											xs={12}
											display='flex'
											justifyContent='space-between'
										>
											<Typography variant='body2' fontWeight={700}>
												Discount
											</Typography>
											<Typography fontWeight={700}>0.00</Typography>
										</Grid>
										<Grid
											item
											xs={12}
											display='flex'
											justifyContent='space-between'
										>
											<Typography variant='body2'>Total</Typography>
											<Typography>70.00</Typography>
										</Grid>
									</Grid>
								</Grid>
								{/* notes section  */}
								<Grid item container spacing={2} my={7}>
									<Grid item xs={6}>
										<Grid item xs={12}>
											<Typography>Customer Notes</Typography>
											<FormField
												fullWidth
												label='Notes'
												multiline
												rows={3}
												// variant="outlined"
											/>
										</Grid>
										<Grid item xs={12}>
											<Typography>Terms and conditions</Typography>
											<FormField
												fullWidth
												label='Terms and conditions'
												multiline
												rows={3}
												// variant="outlined"
											/>
										</Grid>
									</Grid>
									<Grid item xs={6} display='flex' justifyContent='center'>
										<Box
											sx={{
												width: {
													xs: '100%',
													md: '70%',
													lg: '60%',
												},
											}}
										>
											<Typography textAlign='center'>
												Attach file(s) to Estimate
											</Typography>

											<label htmlFor='file-input'>
												{/* @ts-ignore */}
												<Button variant='contained' component='span' fullWidth>
													Upload File
												</Button>
												<input
													id='file-input'
													type='file'
													multiple
													style={{ display: 'none' }}
													onChange={handleFileInputChange}
												/>
											</label>
										</Box>
									</Grid>
								</Grid>
							</Grid>
						</Box>
					</FormLayout>
				</Grid>
			</MainLayout>
		</Box>
	);
}

export default InvoiceForm;
