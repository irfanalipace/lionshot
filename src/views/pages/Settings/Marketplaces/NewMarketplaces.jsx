import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import MUIButton from '../../../Components/Button/MUIButton';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import FormField from '../../../Components/InputField/FormField';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';
import {
	CreateMarketplace,
	GetMarketplacesDetail,
	UpdateMarketplace,
} from '../../../../core/api/marketplaces';
import UploadFile from '../../../Components/UploadFile/UploadFile';
import { decryptId } from '../../../../core/utils/helpers';

const NewMarketplacesListFormLayout = styled(Paper)(() => ({
	width: '100%',
	padding: '1.5rem 2rem 10rem 2rem',
}));

const NewMarketplaces = ({ edit }) => {
	const { id } = useParams();
	const decryptedId = decryptId(id);
	const navigate = useNavigate();

	// Get the current date and format it as "MM/DD/YYYY"
	const currentDate = new Date();
	const formattedCurrentDate = `${
		currentDate.getMonth() + 1
	}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

	const validationSchema = Yup.object({
		name: Yup.string().required('Name is required'),
		last_sync: Yup.string(),
		//  total_items: Yup.string(),
		url: Yup.string().required('Url is required'),
		status: Yup.string().required('Status is required'),
		access_token: Yup.string().required('Access Token is required'),
		refresh_token: Yup.string().required('Refresh Token is required'),
		secret_key: Yup.string().required('Secret Key is required'),
		//		role: Yup.string(),
		access_key: Yup.string().required('Access Key is required'),
		logo_attachment: Yup.mixed()
			.required('Logo is required')
			.test('fileType', 'Invalid file type', value => {
				if (value && value.type) {
					// Check if value and value.type are defined
					return value.type.startsWith('image/');
				}
				return true; // Allow the field to be empty if no file is selected
			}),

		//		deleted_at: Yup.string(),
	});

	const formik = useFormik({
		initialValues: {
			name: '',
			logo_attachment: null,
			//	description: '',
			last_sync: formattedCurrentDate,
			//    total_items: '',
			url: '',
			status: 1,
			access_token: '',
			refresh_token: '',
			//		role: '',
			secret_key: '',
			access_key: '',
			//		deleted_at: '',
		},
		validationSchema: validationSchema,
		onSubmit: async (values, { setSubmitting, setErrors }) => {
			if (edit) {
				console.log('values UpdateMarketplace ............', values);

				try {
					setSubmitting(true);
					console.log('values UpdateMarketplace ', values);
					const resp = await UpdateMarketplace({ ...values, _method: 'PUT' });
					notyf.success(resp?.message);
					navigate('/marketplaces');
				} catch (error) {
					console.error('API Error:', error);

					console.error('API Error:', error?.data?.errors);
					setErrors(error?.data?.errors);
				} finally {
					setSubmitting(false);
				}
			} else {
				try {
					setSubmitting(true);
					console.log('values New CreateMarketplace ', values);
					const resp = await CreateMarketplace(values);
					notyf.success(resp?.message);
					navigate('/marketplaces');
				} catch (error) {
					console.error('API Error:', error?.data?.errors);
					setErrors(error?.data?.errors);
				} finally {
					setSubmitting(false);
				}
			}
		},
	});

	useEffect(() => {
		if (id) fetchData();
	}, [id]);

	const fetchData = async () => {
		try {
			// Fetch data for editing if needed
			const response = await GetMarketplacesDetail(decryptedId);
			//   console.log('response...', response.logo);
			formik.setValues(response);
			formik.setFieldValue('logo_attachment', response.logo);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};
	const handleImageUrlChange = newImageUrl => {
		formik.setFieldValue('logo_attachment', newImageUrl);
	};

	return (
		<>
			<HeaderPaper>
				<Grid
					container
					item
					rowSpacing={1}
					columnSpacing={{ xs: 1, sm: 2, md: 3 }}
				>
					<Grid item xs={6}>
						<Typography variant='h6' className='TextCapitalize'>
							{edit ? 'Edit Market Place' : 'New Market Place'}
						</Typography>
					</Grid>
					<Grid item xs={6} sx={{ textAlign: 'right' }}>
						<IconButton
							onClick={() => navigate('/marketplaces')}
							aria-label='delete'
						>
							<CloseIcon />
						</IconButton>
					</Grid>
				</Grid>
			</HeaderPaper>
			<form onSubmit={formik.handleSubmit}>
				<div style={{ position: 'relative' }}>
					<Grid item container paddingBottom={1}>
						<NewMarketplacesListFormLayout>
							<Grid item container>
								<Grid item xs={1.5}>
									<InputLabel>
										Name<span style={{ color: 'red' }}>*</span>
									</InputLabel>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='name'
										name='name'
										placeholder='Enter Name'
										type='text'
										size='small'
										variant='outlined'
										value={formik.values.name}
										fullWidth
										handleChange={formik.handleChange}
										error={formik.touched.name && formik.errors.name}
										isTouched={formik.touched.name}
									/>
								</Grid>
							</Grid>
							<Grid item container mt={2}>
								<Grid item xs={1.5}>
									<InputLabel>Logo</InputLabel>
								</Grid>
								<Grid item xs={4} alignItems='center'>
									<UploadFile
										id='logo_attachment'
										name='logo_attachment'
										accept='image/*'
										label='Upload Logo'
										value={formik.values.logo_attachment}
										onChange={file =>
											formik.setFieldValue('logo_attachment', file)
										}
										isUrl={edit}
										// setUrl={imageUrl =>
										// 	formik.setFieldValue('logo_attachment', imageUrl)
										// }
										setUrl={handleImageUrlChange}
									/>
									{console.log('file uploaded ', formik.values)}
									{formik.errors.logo_attachment &&
										formik.touched.logo_attachment && (
											<Typography
												variant='h6'
												fontSize={11}
												fontFamily='Roboto'
												color='error'
												ml={2}
											>
												{formik.errors.logo_attachment}
											</Typography>
										)}
								</Grid>
							</Grid>

							{/* New input fields for the additional keys */}
							<Grid item container mt={2}>
								<Grid item xs={1.5}>
									<InputLabel>Last Sync</InputLabel>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='last_sync'
										name='last_sync'
										placeholder='Enter Last Sync'
										type='text'
										size='small'
										variant='outlined'
										value={formik.values.last_sync}
										fullWidth
										handleChange={formik.handleChange}
										error={formik.touched.last_sync && formik.errors.last_sync}
										isTouched={formik.touched.last_sync}
										disabled={true}
									/>
								</Grid>
							</Grid>
							<Grid item container mt={2}>
								<Grid item xs={1.5}>
									<InputLabel>
										URL<span style={{ color: 'red' }}>*</span>
									</InputLabel>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='url'
										name='url'
										placeholder='Enter URL'
										type='text'
										size='small'
										variant='outlined'
										value={formik.values.url}
										fullWidth
										handleChange={formik.handleChange}
										error={formik.touched.url && formik.errors.url}
										isTouched={formik.touched.url}
									/>
								</Grid>
							</Grid>

							<Grid item container mt={2}>
								<Grid item xs={1.5}>
									<InputLabel>Status</InputLabel>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='status'
										name='status'
										placeholder='Enter Status'
										type='select'
										size='small'
										fontSize='16px'
										variant='outlined'
										value={formik.values.status}
										options={[
											{ value: 1, text: 'Active' },
											{ value: 0, text: 'Inactive' },
										]}
										fullWidth
										handleChange={formik.handleChange}
										error={formik.touched.status && formik.errors.status}
										isTouched={formik.touched.status}
									/>
								</Grid>
							</Grid>

							<Grid item container mt={2}>
								<Grid item xs={1.5}>
									<InputLabel>Access Token</InputLabel>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='access_token'
										name='access_token'
										placeholder='Enter Access Token'
										type='text'
										size='small'
										variant='outlined'
										value={formik.values.access_token}
										fullWidth
										handleChange={formik.handleChange}
										error={
											formik.touched.access_token && formik.errors.access_token
										}
										isTouched={formik.touched.access_token}
									/>
								</Grid>
							</Grid>

							<Grid item container mt={2}>
								<Grid item xs={1.5}>
									<InputLabel>Refresh Token</InputLabel>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='refresh_token'
										name='refresh_token'
										placeholder='Enter Refresh Token'
										type='text'
										size='small'
										variant='outlined'
										value={formik.values.refresh_token}
										fullWidth
										handleChange={formik.handleChange}
										error={
											formik.touched.refresh_token &&
											formik.errors.refresh_token
										}
										isTouched={formik.touched.refresh_token}
									/>
								</Grid>
							</Grid>

							<Grid item container mt={2}>
								<Grid item xs={1.5}>
									<InputLabel>Secret Key</InputLabel>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='secret_key'
										name='secret_key'
										placeholder='Enter Secret Key'
										type='text'
										size='small'
										variant='outlined'
										value={formik.values.secret_key}
										fullWidth
										handleChange={formik.handleChange}
										error={
											formik.touched.secret_key && formik.errors.secret_key
										}
										isTouched={formik.touched.secret_key}
									/>
								</Grid>
							</Grid>

							<Grid item container mt={2}>
								<Grid item xs={1.5}>
									<InputLabel>Access Key</InputLabel>
								</Grid>
								<Grid item xs={4}>
									<FormField
										id='access_key'
										name='access_key'
										placeholder='Enter Access Key'
										type='text'
										size='small'
										variant='outlined'
										value={formik.values.access_key}
										fullWidth
										handleChange={formik.handleChange}
										error={
											formik.touched.access_key && formik.errors.access_key
										}
										isTouched={formik.touched.access_key}
									/>
								</Grid>
							</Grid>

							<Box
								style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
							>
								<Paper elevation={3} sx={{ padding: '1rem 2.3rem' }}>
									<LoadingButton
										type='submit'
										variant='contained'
										disabled={formik.isSubmitting}
										loading={formik.isSubmitting}
									>
										Save
									</LoadingButton>
									<MUIButton
										sx={{ padding: '6px 6px', marginLeft: 3 }}
										variant='outlined'
										to='/marketplaces'
										router
									>
										Cancel
									</MUIButton>
								</Paper>
							</Box>
						</NewMarketplacesListFormLayout>
					</Grid>
				</div>
			</form>
		</>
	);
};

export default NewMarketplaces;
