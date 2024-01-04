import { Button, Typography } from '@mui/material';
import FormField from '../../../Components/InputField/FormField';
import { useFormik } from 'formik';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import * as Yup from 'yup';
import { printLabelAPI } from '../../../../core/api/productLabeling';
import Modal from '../../../Components/Modal/Dialog';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';

function ItemLabelModal({
	rowData,
	openItemModal,
	setOpenItemModal,
	setRefresh,
}) {
	const [buttonLoading, setButtonLoading] = useState();
	const validationSchema = Yup.object().shape({
		number_of_labels: Yup.number()
			.min(1, 'No of labels should be at least one')
			.required('No. of Labels is required'),
		// other fields in your schema
	});
	const formik = useFormik({
		initialValues: {
			item_id: rowData?.id,
			number_of_labels: rowData?.quantity,
		},
		validationSchema: validationSchema,
		onSubmit: async values => {
			try {
				setButtonLoading(true);
				const res = await printLabelAPI(values);
				if (res) {
					window.open(res?.data?.url, '_blank');
					notyf.success('Label Print Successfully');
					setOpenItemModal(false);
					setRefresh(prev => prev + 1);
				}
			} catch (error) {
				notyf.error('Something Went Wrong');
				console.log('error', error);
				formik.setErrors(error.data.errors);
			} finally {
				setButtonLoading(false);
			}
		},
	});

	return (
		<Modal
			title={'Item Label'}
			open={openItemModal}
			onClose={() => setOpenItemModal(false)}
			sx={{
				position: 'absolute',
				right: 20,
				top: 18,
			}}
		>
			<form onSubmit={formik.handleSubmit} style={{ padding: '20px' }}>
				<Typography variant='body2'>Item</Typography>
				<FormField
					id='item_name'
					fullWidth
					value={rowData?.title}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					isTouched={formik.touched?.item_name}
					error={formik.errors?.item_name}
					disabled
				/>
				<Typography variant='body2' mt={2}>
					No. of Labels
				</Typography>
				<FormField
					id='number_of_labels'
					fullWidth
					value={formik.values?.number_of_labels}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					isTouched={formik.touched?.number_of_labels}
					error={formik.errors?.number_of_labels}
					type={'number'}
				/>
				<Typography
					variant='caption'
					component={'p'}
					sx={{ paddingTop: '10px' }}
				>
					Note: {rowData?.quantity || 0} items available in stock but you can
					print more.
				</Typography>
				<LoadingButton
					variant='contained'
					loading={buttonLoading}
					sx={{ paddingX: '30px', marginTop: '20px' }}
					onClick={e => {
						e.stopPropagation();
						formik.handleSubmit();
					}}
				>
					Print Label
				</LoadingButton>
				<Button
					variant='outlined'
					sx={{ marginLeft: '10px', marginTop: '20px' }}
					onClick={() => setOpenItemModal(false)}
				>
					Cancel
				</Button>
			</form>
		</Modal>
	);
}

export default ItemLabelModal;
