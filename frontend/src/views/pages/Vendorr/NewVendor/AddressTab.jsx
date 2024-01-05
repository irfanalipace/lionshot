import React from 'react';
import GridRow from '../../../Components/GridRow/GridRow';
import { Button, Divider, Grid, Typography } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import FormField from '../../../Components/InputField/FormField';

function AddressTab({ formik, CountryStates, allCountries }) {
	console.log('rendering address');
	function copyBillingFieldsToShipping() {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id, type, ...billingFields } = formik.values.vendor_billing_address;

		formik.setFieldValue('vendor_shipping_address', {
			...formik.values.vendor_shipping_address,
			...billingFields,
			// type: 'shipping',
		});
	}

	return (
		<>
			<GridRow>
				<Grid item xs={4}>
					<Typography variant='body1' mb={3}>
						Billing Address
					</Typography>

					{/* attention  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Name</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								placeholder='Name'
								id='vendor_billing_address.attention'
								label={'Name'}
								error={formik.errors?.vendor_billing_address?.attention}
								value={formik.values?.vendor_billing_address?.attention}
								handleChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isTouched={formik.touched?.vendor_billing_address?.attention}
								fullWidth
								required
							/>
						</Grid>
					</GridRow>
					{/* Country  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Country</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_billing_address.country_id'
								value={
									formik.values?.vendor_billing_address?.country_id || '231'
								}
								error={formik.errors?.vendor_billing_address?.country_id}
								handleChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isTouched={formik.touched?.vendor_billing_address?.country_id}
								label={'Country'}
								type={'select'}
								options={allCountries}
								fullWidth
								required
							/>
						</Grid>
					</GridRow>
					{/* Address1  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Address</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_billing_address.address'
								value={formik.values?.vendor_billing_address?.address}
								error={formik.errors?.vendor_billing_address?.address}
								handleChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isTouched={formik.touched?.vendor_billing_address?.address}
								label={'Street 1'}
								type={'textarea'}
								fullWidth
								required
							/>
						</Grid>
					</GridRow>
					{/* Address2  */}
					<GridRow>
						<Grid item xs={4}></Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_billing_address.address2'
								value={formik.values?.vendor_billing_address?.address2}
								error={formik.errors?.vendor_billing_address?.address2}
								handleChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isTouched={formik.touched?.vendor_billing_address?.address2}
								label={'Street 2 (Optional)'}
								fullWidth
								type={'textarea'}
							/>
						</Grid>
					</GridRow>
					{/* City  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>City</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_billing_address.city'
								value={formik.values?.vendor_billing_address?.city}
								error={formik.errors?.vendor_billing_address?.city}
								handleChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isTouched={formik.touched?.vendor_billing_address?.city}
								label={'City'}
								required
							/>
						</Grid>
					</GridRow>
					{/* State  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>State</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_billing_address.state_id'
								value={formik.values?.vendor_billing_address?.state_id}
								error={formik.errors?.vendor_billing_address?.state_id}
								handleChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isTouched={formik.touched?.vendor_billing_address?.state_id}
								label={'State'}
								fullWidth
								required
								type={'select'}
								options={CountryStates?.billing}
							/>
						</Grid>
					</GridRow>
					{/* Zipcode  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Zip Code</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_billing_address.zipcode'
								value={formik.values?.vendor_billing_address?.zipcode}
								error={formik.errors?.vendor_billing_address?.zipcode}
								onBlur={formik.handleBlur}
								isTouched={formik.touched?.vendor_billing_address?.zipcode}
								handleChange={formik.handleChange}
								label={'Zip Code'}
								required
							/>
						</Grid>
					</GridRow>
					{/* Phone  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Phone</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_billing_address.phone'
								value={formik.values?.vendor_billing_address?.phone}
								error={formik.errors?.vendor_billing_address?.phone}
								onBlur={formik.handleBlur}
								isTouched={formik.touched?.vendor_billing_address?.phone}
								handleChange={formik.handleChange}
								label={'Phone'}
							/>
						</Grid>
					</GridRow>
				</Grid>
				<Grid item xs={4} ml={10}>
					<GridRow>
						<Grid item xs={12}>
							<Typography variant='body1'>
								Shipping Address (
								<Button
									sx={{ textTransform: 'none' }}
									onClick={() => {
										copyBillingFieldsToShipping();
									}}
								>
									<ContentCopy
										sx={{
											fontSize: '14px',
											marginRight: '5px',
											lineHeight: '1.5px',
										}}
									/>
									Copy Billing Fields
								</Button>
								)
							</Typography>
						</Grid>
					</GridRow>

					{/* attention  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Name</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_shipping_address.attention'
								label={'Name'}
								error={formik.errors.vendor_shipping_address?.attention}
								value={formik.values.vendor_shipping_address?.attention}
								handleChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isTouched={formik.touched.vendor_shipping_address?.attention}
								fullWidth
								required
							/>
						</Grid>
					</GridRow>
					{/* Country  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Country</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_shipping_address.country_id'
								value={
									formik.values.vendor_shipping_address?.country_id || '231'
								}
								error={formik.errors.vendor_shipping_address?.country_id}
								handleChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isTouched={formik.touched.vendor_shipping_address?.country_id}
								label={'Country'}
								fullWidth
								required
								type={'select'}
								options={allCountries}
							/>
						</Grid>
					</GridRow>
					{/* Address1  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Address</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_shipping_address.address'
								value={formik.values.vendor_shipping_address?.address}
								error={formik.errors.vendor_shipping_address?.address}
								handleChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isTouched={formik.touched.vendor_shipping_address?.address}
								label={'Street 1'}
								fullWidth
								required
								type={'textarea'}
							/>
						</Grid>
					</GridRow>
					{/* Address2  */}
					<GridRow>
						<Grid item xs={4}></Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_shipping_address.address2'
								value={formik.values.vendor_shipping_address?.address2}
								error={formik.errors.vendor_shipping_address?.address2}
								handleChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isTouched={formik.touched.vendor_shipping_address?.address2}
								label={'Street 2 (Optional)'}
								fullWidth
								type={'textarea'}
							/>
						</Grid>
					</GridRow>
					{/* City  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>City</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_shipping_address.city'
								value={formik.values.vendor_shipping_address?.city}
								error={formik.errors.vendor_shipping_address?.city}
								handleChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isTouched={formik.touched.vendor_shipping_address?.city}
								label={'City'}
								required
							/>
						</Grid>
					</GridRow>
					{/* State  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>State</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_shipping_address.state_id'
								value={formik.values.vendor_shipping_address?.state_id}
								error={formik.errors.vendor_shipping_address?.state_id}
								handleChange={formik.handleChange}
								onBlur={formik.handleBlur}
								isTouched={formik.touched.vendor_shipping_address?.state_id}
								label={'State'}
								fullWidth
								required
								type={'select'}
								options={CountryStates?.shipping}
							/>
						</Grid>
					</GridRow>
					{/* Zipcode  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Zip Code</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_shipping_address.zipcode'
								value={formik.values.vendor_shipping_address?.zipcode}
								error={formik.errors.vendor_shipping_address?.zipcode}
								onBlur={formik.handleBlur}
								isTouched={formik.touched.vendor_shipping_address?.zipcode}
								handleChange={formik.handleChange}
								label={'Zip Code'}
								required
							/>
						</Grid>
					</GridRow>
					{/* Phone  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Phone</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='vendor_shipping_address.phone'
								value={formik.values.vendor_shipping_address?.phone}
								error={formik.errors.vendor_shipping_address?.phone}
								onBlur={formik.handleBlur}
								isTouched={formik.touched.vendor_shipping_address?.phone}
								handleChange={formik.handleChange}
								label={'Phone'}
							/>
						</Grid>
					</GridRow>
				</Grid>
			</GridRow>

			<GridRow>
				<Grid item xs={8.6}>
					<Divider />
				</Grid>
				<Grid item xs={2}></Grid>
			</GridRow>
			<Typography variant='body2'>Note:</Typography>
			<Typography variant='body2'>
				<Typography component={'span'} style={{ fontSize: '40px' }}>
					.
				</Typography>
				You can add and manage additional addresses from contact details
				section.
			</Typography>
			<Typography variant='body2'>
				<Typography component={'span'} style={{ fontSize: '40px' }}>
					.
				</Typography>
				View and edit the address format of your transactions under Settings
				&gt; Preferences &gt; Vendors and Vendors.
			</Typography>
		</>
	);
}

// export default AddressTab
export default React.memo(AddressTab);
