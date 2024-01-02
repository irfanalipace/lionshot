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
	createConditions,
	GetConditionsDetail,
	UpdateCondition,
} from '../../../../core/api/condition';
import { decryptId } from '../../../../core/utils/helpers';

const NewMarketplacesListFormLayout = styled(Paper)(() => ({
	width: '100%',
	padding: '1.5rem 2rem 10rem 2rem',
}));

const NewCondition = ({ edit }) => {
	console.log(edit, 'edit');
	const { id } = useParams();
	const decryptedId = decryptId(id);
	const navigate = useNavigate();

	const validationSchema = Yup.object({
		name: Yup.string().required('Name is required'),
	});

	const formik = useFormik({
		initialValues: {
			name: '',
		},
		validationSchema: validationSchema,
		onSubmit: async (values, { setSubmitting, setErrors }) => {
			if (edit) {
				try {
					setSubmitting(true);

					const resp = await UpdateCondition({
						...values,
						id: decryptedId,
						_method: 'PUT',
					});
					console.log('values Updateconditions ', values);
					notyf.success(resp?.message);
					navigate('/conditions');
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
					console.log('values New conditions ', values);
					const resp = await createConditions(values);
					notyf.success(resp?.message);
					navigate('/conditions');
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
			const response = await GetConditionsDetail(decryptedId);
			//   console.log('response...', response.logo);

			formik.setValues(response);
			formik.setFieldValue('name', response.name);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
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
							{edit ? 'Edit Condition' : 'New Condition'}
						</Typography>
					</Grid>
					<Grid item xs={6} sx={{ textAlign: 'right' }}>
						<IconButton
							onClick={() => navigate('/conditions')}
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
										to='/conditions'
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

export default NewCondition;
