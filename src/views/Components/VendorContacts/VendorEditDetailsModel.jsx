import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormField from '../InputField/FormField';
import MUIButton from '../Button/MUIButton';
// apis
import notyf from '../NotificationMessage/notyfInstance';
import {
	vendorsSingleApi,
	UpdateVendorSpecificApi,
} from '../../../core/api/vendor';
import { phoneRegExp } from '../../../core/utils/helpers';
import { getDepartmentsApi } from '../../../core/api/department';

const salutations = [
	{
		value: 'Mr.',
		text: 'Mr.',
	},
	{
		value: 'Mrs.',
		text: 'Mrs.',
	},
	{
		value: 'Ms.',
		text: 'Ms.',
	},
	{
		value: 'Miss.',
		text: 'Miss.',
	},
	{
		value: 'Dr.',
		text: 'Dr.',
	},
];
export default function CutomerEditDetails({ onClose, vendor_id, onSave }) {
	const [alldepartments, setAllDepartments] = useState();
	// const [vendorData, setvendorData] = useState();
	//  single vendor api
	// console.log('vendor_id', vendor_id);
	const getsinglevendor = async () => {
		try {
			if (vendor_id) {
				const singleVendor = await vendorsSingleApi(vendor_id);
				formik.setValues(singleVendor);
			}
		} catch (e) {
			console.log('e', e);
		}
	};

	useEffect(() => {
		getsinglevendor();
	}, []);
	const [error, setError] = useState('');

	// schama
	const validationSchema = Yup.object().shape({
		// salutation: Yup.string().required("Salutation is required"),
		first_name: Yup.string().required('First Name is required'),
		last_name: Yup.string().required('Last Name is required'),
		email: Yup.string()
			.email('Invalid email address')
			.required('Email is required'),
		phone: Yup.string().matches(phoneRegExp, 'Invalid phone number').required(),
		work_phone: Yup.string()
			.matches(phoneRegExp, 'Invalid phone number')
			.nullable(),
		// phone: Yup.string()
		//     .min(11, "Mobile Number be at least 11 characters")
		//     .required("Mobile is required"),
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
				const resp = await await UpdateVendorSpecificApi({
					id: vendor_id,
					...values,
				});
				notyf.success(resp?.message);
				onClose();
				onSave();
			} catch (error) {
				setError(error?.data?.errors);
			} finally {
				setSubmitting(false);
			}
		},
	});

	useEffect(() => {
		return () => {
			setError('');
		};
	}, []);

	//   api error
	useEffect(() => {
		if (error) {
			for (const field in error) {
				// eslint-disable-next-line no-prototype-builtins
				if (error.hasOwnProperty(field)) {
					formik.setFieldError(field, error[field][0]);
				}
			}
		}
	}, [error]);
	// get all departments api
	const getAllDepartments = async () => {
		try {
			const dep = await getDepartmentsApi();
			setAllDepartments(
				dep?.data?.data?.map(option => {
					return {
						value: option?.name,
						text: option?.name,
					};
				})
			);
		} catch (e) {
			console.log('e', e);
		}
	};
	useEffect(() => {
		getAllDepartments();
	}, []);
	console.log('formik in edit vendor', formik.errors);
	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid container p={3}>
					<Grid item container spacing={3}>
						<Grid item xs={3}>
							<Typography variant='body1'> Names</Typography>
						</Grid>
						<Grid item xs={3}>
							<FormField
								id='salutation'
								name='salutation'
								// sx={{ width: "42%"}}
								fullWidth
								label={'Salutation'}
								type={'select'}
								value={formik.values.salutation}
								handleChange={formik.handleChange}
								options={salutations}
								isTouched={formik.touched.salutation}
								error={
									formik.touched.salutation &&
									formik.errors.salutation &&
									formik.errors.salutation
								}
							/>
						</Grid>

						<Grid item xs={3}>
							<FormField
								fullWidth
								label=' First Name'
								name='first_name'
								value={formik.values.first_name}
								onChange={formik.handleChange}
								isTouched={formik.touched.first_name}
								error={
									formik.touched.first_name &&
									formik.errors.first_name &&
									formik.errors.first_name
								}
							/>
						</Grid>
						<Grid item xs={3}>
							<FormField
								fullWidth
								label=' Last Name'
								name='last_name'
								value={formik.values.last_name}
								onChange={formik.handleChange}
								isTouched={formik.touched.last_name}
								error={
									formik.touched.last_name &&
									formik.errors.last_name &&
									formik.errors.last_name
								}
							/>
						</Grid>
						<Grid item xs={3}>
							<Typography variant='body1'> Email</Typography>
						</Grid>
						<Grid item xs={9}>
							<FormField
								type='email'
								fullWidth
								name='email'
								value={formik.values.email}
								onChange={formik.handleChange}
								isTouched={formik.touched.email}
								error={
									formik.touched.email &&
									formik.errors.email &&
									formik.errors.email
								}
							/>
						</Grid>
						<Grid item xs={3}>
							<Typography variant='body1'> Contact info</Typography>
						</Grid>
						<Grid item xs={4.5}>
							<FormField
								fullWidth
								placeholder='Primary Contact'
								name='phone'
								value={formik.values.phone}
								onChange={formik.handleChange}
								isTouched={formik.touched.phone}
								error={
									formik.touched.phone &&
									formik.errors.phone &&
									formik.errors.phone
								}
							/>
						</Grid>
						<Grid item xs={4.5}>
							<FormField
								fullWidth
								placeholder='Secondary Contact'
								name='work_phone'
								value={formik.values.work_phone}
								onChange={formik.handleChange}
								isTouched={formik.touched.work_phone}
								error={
									formik.touched.work_phone &&
									formik.errors.work_phone &&
									formik.errors.work_phone
								}
							/>
						</Grid>

						<Grid item xs={3}>
							<Typography variant='body1'> Skype Name/number</Typography>
						</Grid>
						<Grid item xs={9}>
							<FormField
								fullWidth
								name='skype_name'
								placeholder='skype Name/Number'
								value={formik.values.skype_name}
								onChange={formik.handleChange}
							/>
						</Grid>
						<Grid item xs={3}>
							<Typography variant='body1'> Other Details</Typography>
						</Grid>
						<Grid item xs={4.5}>
							<FormField
								fullWidth
								label='Designation'
								name='designation'
								value={formik.values.designation}
								onChange={formik.handleChange}
							/>
						</Grid>
						<Grid item xs={4.5}>
							<FormField
								id='department'
								value={formik.values?.department}
								handleChange={formik.handleChange}
								error={formik.errors?.department}
								label={'Departments'}
								type={'select'}
								fullWidth
								options={alldepartments}
								// fullWidth
								// label='Department'
								// name='department'
								// value={formik.values.department}
								// onChange={formik.handleChange}
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
