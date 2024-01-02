import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Edit from '@mui/icons-material/Edit';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import fileService from '../../../../../core/services/fileService';
import { FILE_TYPES } from '../../../../../core/utils/constants';
import FileError from '../../../../Components/FileError/FileError';
import FormField from '../../../../Components/InputField/FormField';
import { useDispatch, useSelector } from 'react-redux';
import {
	updateCustomerDetails,
	updateCustomerProfile,
} from '../../../../../core/store/auth/customerPortalThunks';
import LoadingButton from '@mui/lab/LoadingButton';
import { phoneRegExp } from '../../../../../core/utils/helpers';

const Profile = ({ customerDetails, customerId }) => {
	const [errors, setErrors] = useState('');
	const [files, setFiles] = useState('');
	const [dp, setDp] = useState(null);
	console.log('files', dp);
	const [loading, setLoading] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	console.log('isEdit', isEdit);
	const dispatch = useDispatch();
	const updatingProfile = useSelector(
		state => state.customer.isUpdatingProfile
	);
	const upadteLoader = useSelector(state => state?.customer?.isLoading);
	console.log('loading', loading);
	const profilePIC = useSelector(state => state?.customer?.profilePic);
	const allowedFiles = [
		FILE_TYPES.png.contentType,
		FILE_TYPES.jpeg.contentType,
		FILE_TYPES.jpg.contentType,
		FILE_TYPES.gif.contentType,
		FILE_TYPES.svg.contentType,
	];

	function cb(params, validDp) {
		if (params == 'catch') {
			setLoading(false);
		}
		if (params === 'success') {
			setDp(validDp);
			const valid = URL.createObjectURL(validDp);
			setFiles(valid);
			setLoading(false);
		}
	}
	const settingDp = async validDp => {
		setLoading(true);
		dispatch(
			updateCustomerProfile(
				{
					upload_avatar: validDp,
					customer_id: customerId,
				},
				cb,
				validDp
			)
		);
	};
	const onChange = validFiles => {
		if (validFiles.length > 0) {
			const validDp = validFiles[0];
			settingDp(validDp);
		}
	};

	const handleChange = e => {
		// setTimeout(() => {
		fileService.handleFileInputChange(e, allowedFiles, (validFiles, errors) => {
			onChange(validFiles);
			setErrors(errors);
		});
		// }, 2000);
	};

	const validationSchema = Yup.object().shape({
		phone: Yup.string()
			.matches(phoneRegExp, 'Invalid phone number')
			.required('Phone is required'),
	});

	// console.log("customerDetails", customerDetails);
	const formik = useFormik({
		initialValues: customerDetails?.id
			? {
					...customerDetails,
					billing_address: { ...customerDetails.default_billing_address },
					shipping_address: { ...customerDetails.default_shipping_address },
					// upload_avator: customerDetails?.avator,
			  }
			: {
					email: '',
					phone: '',
					billing_address: {
						id: '',
						type: 'billing',
						attention: '',
						state_id: '',
						address: '',
						address2: '',
						country_id: '',
						city: '',
						zipcode: '',
						phone: '',
						fax: '',
					},
					shipping_address: {
						id: '',
						type: 'shipping',
						attention: '',
						address: '',
						state_id: '',
						address2: '',
						country_id: '',
						city: '',
						zipcode: '',
						phone: '',
						fax: '',
					},
			  },

		validateOnChange: false,
		validationSchema: validationSchema,
		onSubmit: async values => {
			dispatch(
				updateCustomerDetails(
					{ ...values, customer_id: customerId, upload_avatar: dp },
					() => setIsEdit(false)
				)
			);
		},
	});
	console.log('formik', formik.errors);
	return (
		<Grid item xs={12}>
			<Paper>
				<Stack
					display='flex'
					justifyContent='center'
					alignItems='center'
					paddingY={6}
					paddingX={1}
					sx={{ position: 'relative' }}
				>
					{
						<label>
							<Box sx={profileImageWrapperStyles}>
								{
									<>
										<Avatar
											alt='Remy Sharp'
											src={files || customerDetails?.avator}
											sx={avatarStyles}
										/>

										{loading ? (
											<Box sx={profileLoaderStyles}>
												<CircularProgress />
											</Box>
										) : (
											<Box className='hover-overlay'>
												<CameraAltIcon />
											</Box>
										)}
									</>
								}

								<AddCircleOutlineOutlinedIcon sx={editProfileStyles} />
							</Box>

							<input
								id='file-input'
								type='file'
								style={{ display: 'none' }}
								onChange={handleChange}
								accept='.jpeg, .jpg, .png , .svg , .gif'
							/>
						</label>
					}
					<FileError errors={errors} />

					<Typography
						variant='h6'
						display='flex'
						flexWrap='wrap'
						style={{
							wordBreak: 'break-word',
							maxWidth: '100%',
						}}
					>
						{`${customerDetails?.first_name || ''} ${
							customerDetails?.last_name || ''
						}`}
					</Typography>
					<Typography
						variant='body1'
						style={{
							wordBreak: 'break-word',
							maxWidth: '100%',
						}}
					>
						99 Technologies
					</Typography>
				</Stack>
				<Divider />

				{!isEdit && (
					<Grid container justifyContent={'end'}>
						<Button
							variant='outlined'
							onClick={() => setIsEdit(true)}
							sx={{ marginRight: '5px', marginTop: '5px' }}
						>
							<Edit fontSize='small' />
						</Button>
					</Grid>
				)}

				<Stack>
					<Grid item container padding={1}>
						<Grid item xs={12}>
							<Typography variant='templateBody'>Email</Typography>
							<Typography
								variant='body2'
								style={{
									wordBreak: 'break-word',
									maxWidth: '100%',
								}}
							>
								{formik.values?.email || customerDetails?.email}
							</Typography>
						</Grid>
					</Grid>
					<Grid item container padding={1.2}>
						<Grid item xs={12}>
							<Typography
								variant='templateBody'
								style={{
									wordBreak: 'break-word',
									maxWidth: '100%',
								}}
							>
								Phone
							</Typography>
						</Grid>

						<Grid item xs={12}>
							{isEdit ? (
								<FormField
									name='phone'
									onBlur={formik.handleBlur}
									error={formik.errors.phone}
									isTouched={formik.touched?.phone}
									value={formik.values?.phone}
									onChange={formik.handleChange}
									sx={formFieldStyles}
								/>
							) : (
								<Typography
									variant='body2'
									style={{
										wordBreak: 'break-word',
										maxWidth: '100%',
									}}
								>
									{formik.values?.phone || customerDetails?.phone}
								</Typography>
							)}
						</Grid>
					</Grid>
					<Grid item container padding={1.2}>
						<Grid item xs={12}>
							<Typography
								variant='templateBody'
								style={{
									wordBreak: 'break-word',
									maxWidth: '100%',
								}}
							>
								Billing Address
							</Typography>
						</Grid>

						<Grid item xs={12}>
							{isEdit ? (
								<FormField
									sx={formFieldStyles}
									value={formik?.values?.billing_address?.address}
									name='billing_address.address'
									onChange={formik.handleChange}
								/>
							) : (
								<Typography
									variant='body2'
									style={{
										wordBreak: 'break-word',
										maxWidth: '100%',
									}}
								>
									{formik.values?.billing_address?.address ||
										customerDetails?.billing_address?.address}
								</Typography>
							)}
						</Grid>
					</Grid>
					<Grid item container padding={1.2}>
						<Grid item xs={12}>
							<Typography variant='templateBody'>Shipping Address</Typography>
						</Grid>

						<Grid item xs={12}>
							{isEdit ? (
								<FormField
									sx={formFieldStyles}
									value={formik?.values?.shipping_address?.address}
									name='shipping_address.address'
									onChange={formik.handleChange}
								/>
							) : (
								<Typography variant='body2'>
									{formik.values?.shipping_address?.address ||
										customerDetails?.shipping_address?.address}
								</Typography>
							)}
						</Grid>
					</Grid>
					<Grid item container justifyContent={'center'} padding={1.2}>
						{/* <Grid item xs={12}>
              <Typography variant='templateBody'>Credit Card</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2'>*****12345678899999</Typography>{" "}
            </Grid> */}
						{isEdit && (
							<>
								<LoadingButton
									variant='contained'
									loading={upadteLoader}
									onClick={formik.handleSubmit}
								>
									Update
								</LoadingButton>
								<Button
									variant='outlined'
									sx={{ margin: '0 8px' }}
									onClick={() => setIsEdit(false)}
								>
									Cancel
								</Button>
							</>
						)}
					</Grid>
				</Stack>
			</Paper>
		</Grid>
	);
};

export default Profile;

const avatarStyles = {
	width: '150px',
	height: '150px',
	position: 'relative',
	border: '1px solid grey',
	cursor: 'pointer',
};
const editProfileStyles = {
	position: 'absolute',
	padding: '1px',
	width: '30px',
	height: '29px',
	bottom: 6,
	right: 15,
	background: 'white',
	border: '2px solid black',
	borderRadius: '50%',
	cursor: 'pointer',
	// border: ".5px solid #1976d2",
};

const formFieldStyles = {
	'& .MuiInputBase-input': {
		padding: '5px',
		fontSize: '14px',
	},
};

const profileImageWrapperStyles = {
	position: 'relative',
	'& .hover-overlay': {
		display: 'none',
	},
	'&:hover .hover-overlay': {
		cursor: 'pointer',
		position: 'absolute',
		width: ' 100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		top: '0',
		background: '#d3d3d394',
		borderRadius: '50%',
	},
};

const profileLoaderStyles = {
	position: 'absolute',
	width: ' 150px',
	height: '150px',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	top: '0',
	background: '#d3d3d394',
	borderRadius: '50%',
};
