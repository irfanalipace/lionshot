import React, { useEffect, useState } from 'react';
import { Box, Grid, Divider, CircularProgress, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Modal from '../../../Components/Modal/Dialog';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import FormField from '../../../Components/InputField/FormField';
import MUIButton from '../../../Components/Button/MUIButton';

const PackageModal = ({
	open,
	onClose,
	setModalData,
	clickedBtn,
	packagingItem,
}) => {
	const [loading, setLoading] = useState(false);

	const validationSchema = Yup.object().shape({
		NoOfRepitition: Yup.mixed().required('Required'),
	});
	const formik = useFormik({
		initialValues: {
			NoOfRepitition: clickedBtn === 'new' ? 'YOUR_PACKAGING' : 1,
		},
		validationSchema,
		onSubmit: async values => {
			try {
				if (values) {
					console.log('valuesss', values, clickedBtn);
					setModalData(values);
				}
				// const resp = await createTax(values);
				// setModalData(!newTax);
				// notyf.success(resp?.message);
			} catch (err) {
				console.log('PackageModal error', err);
				// notyf.error(err?.data?.message);
				// setModalData(false);
			} finally {
				setLoading(false);
				onClose();
				formik.resetForm();
			}
		},
	});

	useEffect(() => {
		formik.setValues({
			NoOfRepitition: clickedBtn === 'new' ? 'YOUR_PACKAGING' : 1,
		});
	}, [clickedBtn]);

	const handleCancel = () => {
		formik.resetForm();
		onClose();
	};

	return (
		<Modal
			size={'sm'}
			title={clickedBtn === 'new' ? 'New Package' : 'Repetition'}
			open={open}
			onClose={handleCancel}
		>
			<form onSubmit={formik.handleSubmit}>
				<Box sx={{ padding: '0rem 1.2rem 1rem 1.2rem' }}>
					<Grid container item xs={12} alignItems='center'>
						<Grid item xs={3}>
							<InputLabel>
								{clickedBtn === 'new' ? 'Packaging' : 'No. of Repitition'}
							</InputLabel>
						</Grid>
						<Grid item xs={9}>
							<FormField
								id='NoOfRepitition'
								type={clickedBtn === 'new' ? 'select' : 'number'}
								value={formik?.values?.NoOfRepitition}
								handleChange={formik.handleChange}
								isTouched={formik.touched.NoOfRepitition}
								options={packagingItem}
								fullWidth
								error={
									formik.touched.NoOfRepitition &&
									formik.errors.NoOfRepitition &&
									formik.errors.NoOfRepitition
								}
							/>
						</Grid>
					</Grid>
				</Box>
				<Divider />
				<Grid
					container
					justifyContent='flex-end'
					sx={{ padding: '1.2rem 1.2rem 1rem 1.2rem' }}
				>
					<Stack direction='row' spacing={2}>
						<MUIButton disabled={loading} type='submit'>
							{loading ? <CircularProgress size={20} /> : 'Add'}
						</MUIButton>
						<MUIButton variant='outlined' onClick={handleCancel}>
							Cancel
						</MUIButton>
					</Stack>
				</Grid>
			</form>
		</Modal>
	);
};

export default PackageModal;
