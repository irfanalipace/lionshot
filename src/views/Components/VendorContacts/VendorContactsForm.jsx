import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Grid, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormField from '../../Components/InputField/FormField';
import MUIButton from '../../Components/Button/MUIButton';
import notyf from '../../Components/NotificationMessage/notyfInstance';
// apis
import { addVendorContactApi } from '../../../core/api/vendor';
import { salutations } from '../../../core/utils/constants';
import { phoneRegExp } from '../../../core/utils/helpers';

export default function VendorContactsForm({ onClose, vendor_id, onSave }) {
	// schema
	const validationSchema = Yup.object().shape({
		// salutation: Yup.string().required('Salutation is required'),
		first_name: Yup.string().required('First Name is required'),
		last_name: Yup.string().required('Last Name is required'),
		email: Yup.string()
			.email('Invalid email address')
			.required('Email is required'),
		mobile: Yup.string()
			.matches(phoneRegExp, 'Invalid phone number')
			.nullable(),
		work_phone: Yup.string()
			.matches(phoneRegExp, 'Invalid phone number')
			.nullable(),
	});

	const formik = useFormik({
		initialValues: {
			salutation: '',
			first_name: '',
			last_name: '',
			email: '',
			work_phone: '',
			mobile: '',
			skypeNumber: '',
			designation: '',
			department: '',
		},
		validationSchema: validationSchema,
		onSubmit: async (values, { setSubmitting }) => {
			try {
				const resp = await addVendorContactApi({ ...values, vendor_id });
				notyf.success(resp?.message);
				onClose();
				onSave?.(resp?.data);
			} catch (error) {
				console.log('error', error);
				formik.setErrors(error?.data?.errors);
			} finally {
				setSubmitting(false);
			}
		},
	});

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid container p={3}>
					<Grid item container spacing={3}>
						<Grid item xs={12} sm={12}>
							<FormField
								value={formik.values?.salutation}
								type={'select'}
								fullWidth
								name='salutation'
								placeholder='Salutation'
								label='Salutation'
								options={salutations}
								isTouched={formik.touched?.salutation}
								onBlur={formik.handleBlur}
								onChange={formik.handleChange}
								error={formik.errors?.salutation}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<FormField
								fullWidth
								label=' First Name'
								name='first_name'
								value={formik.values?.first_name}
								onChange={formik.handleChange}
								isTouched={formik.touched?.first_name}
								error={
									formik.touched?.first_name &&
									formik.errors?.first_name &&
									formik.errors?.first_name
								}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormField
								fullWidth
								label=' Last Name'
								name='last_name'
								value={formik.values?.last_name}
								onChange={formik.handleChange}
								isTouched={formik.touched?.last_name}
								error={
									formik.touched?.last_name &&
									formik.errors?.last_name &&
									formik.errors?.last_name
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormField
								type='email'
								fullWidth
								name='email'
								label='Email'
								value={formik.values?.email}
								onChange={formik.handleChange}
								isTouched={formik.touched?.email}
								error={
									formik.touched?.email &&
									formik.errors?.email &&
									formik.errors?.email
								}
							/>
						</Grid>
						<Grid item xs={6}>
							<FormField
								id='work_phone'
								fullWidth
								label=' Work Phone'
								name='work_phone'
								value={formik.values?.work_phone}
								isTouched={formik.touched?.work_phone}
								onChange={formik.handleChange}
								error={
									formik.touched?.work_phone &&
									formik.errors?.work_phone &&
									formik.errors?.work_phone
								}
							/>
						</Grid>
						<Grid item xs={6}>
							<FormField
								fullWidth
								name='mobile'
								label='Phone'
								value={formik.values?.mobile}
								isTouched={formik.touched?.mobile}
								onChange={formik.handleChange}
								error={
									formik.touched?.mobile &&
									formik.errors?.mobile &&
									formik.errors?.mobile
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormField
								fullWidth
								label='Skype Number'
								name='skypeNumber'
								value={formik.values?.skypeNumber}
								onChange={formik.handleChange}
							/>
						</Grid>
						<Grid item xs={6}>
							<FormField
								fullWidth
								label='Designation'
								name='designation'
								value={formik.values?.designation}
								onChange={formik.handleChange}
							/>
						</Grid>
						<Grid item xs={6}>
							<FormField
								fullWidth
								label='Department'
								name='department'
								value={formik.values?.department}
								onChange={formik.handleChange}
							/>
						</Grid>
						<Grid item xs={12} display='flex' justifyContent='flex-end'>
							<Stack direction='row' padding='0 1.5rem' spacing={2}>
								<LoadingButton
									variant='contained'
									type='submit'
									disabled={formik.isSubmitting}
									loading={formik.isSubmitting}
								>
									Add
								</LoadingButton>
								<MUIButton variant='outlined' onClick={onClose}>
									Cancel
								</MUIButton>
							</Stack>
						</Grid>
					</Grid>
				</Grid>
			</form>
		</>
	);
}
