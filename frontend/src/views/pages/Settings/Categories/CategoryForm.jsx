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
// import { createPriceList, updatePriceList } from '../../../../core/api/items';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';

const NewCategoriesListFormLayout = styled(Paper)(() => ({
	width: '100%',
	padding: '1.5rem 2rem 10rem 2rem',
}));

const NewCategories = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const validationSchema = Yup.object({
		name: Yup.string().required('Name is required'),
		description: Yup.string(),
	});

	const formik = useFormik({
		initialValues: {
			name: '',
			description: '',
		},
		validationSchema: validationSchema,

		onSubmit: async (values, { setSubmitting }) => {
			try {
				setSubmitting(true);

				if (id) {
					const resp = await //updateMarketplacesList
					{
						...values,
						id,
						_method: 'PUT',
					};
					notyf.success(resp?.message);
				} else {
					const resp = await //createMarketplacesList(values);
					notyf.success(resp?.message);
				}

				navigate('/marketplaces'); // navigate after successfully sbummited form
			} catch (error) {
				console.error('API Error:', error.message);
				formik.setErrors(error?.data?.data);
			} finally {
				setSubmitting(false);
			}
		},
	});

	useEffect(() => {
		if (id) fetchData();
	}, [id]);

	const fetchData = async () => {
		try {
			// Fetch data for editing if needed
			// const response = await ShowPriceListApi(id);
			// formik.setValues(response?.data);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};
	return (
		<form onSubmit={formik.handleSubmit}>
			<div style={{ position: 'relative' }}>
				<NewCategoriesListFormLayout>
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
							<InputLabel>Description</InputLabel>
						</Grid>
						<Grid item xs={4} alignItems='center'>
							<FormField
								id='description'
								type='textarea'
								placeholder='Write Description'
								value={formik.values.description}
								onChange={formik.handleChange}
							/>
						</Grid>
					</Grid>
					<Box style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
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
								to='/categories'
								router
							>
								Cancel
							</MUIButton>
						</Paper>
					</Box>
				</NewCategoriesListFormLayout>
			</div>
		</form>
	);
};

export default NewCategories;
