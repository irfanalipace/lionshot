import { useEffect, useState } from 'react';
import GridRow from '../../../Components/GridRow/GridRow';
import { Button, Grid, Typography } from '@mui/material';
import FormField from '../../../Components/InputField/FormField';
import { Box } from '@mui/system';
import { AccountCircle, Settings } from '@mui/icons-material';
import TermsModal from '../../../Components/TermsModal/TermsModal';
function OtherDetailsTab({
	formik,
	paymentTerms,
	PaymentRespone,
	otherDetailsOptions,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [paymentMode, setpaymentMode] = useState([]);
	useEffect(() => {
		const termname = paymentTerms?.find(
			term => term?.value === formik.values?.term_id
		);

		let lowerCaseText = termname?.text?.toLowerCase();
		if (lowerCaseText?.includes('day')) {
			setpaymentMode([
				{ value: 'bank_transfer', text: 'Bank Transfer' },
				{ value: 'cc', text: 'Credit Card' },
				{ value: 'square', text: 'Square' },
				{ value: 'paypal', text: 'Paypal' },
			]);
		} else if (lowerCaseText?.includes('net')) {
			setpaymentMode([
				{ value: 'cheque', text: 'Cheque' },
				{ value: 'wire', text: 'Wire' },
				{ value: 'ach', text: 'ACH' },
			]);
		} else {
			setpaymentMode([
				{ value: 'bank_transfer', text: 'Bank Transfer' },
				{ value: 'cc', text: 'Credit Card' },
				{ value: 'square', text: 'Square' },
				{ value: 'paypal', text: 'Paypal' },
			]);
		}
	}, [formik.values.term_id, paymentTerms]);

	return (
		<Box pt={2}>
			{/* Currency  */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Currency</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='currency'
						value={formik.values?.currency || ''}
						handleChange={formik.handleChange}
						error={formik.errors?.currency}
						label={'Select Currency'}
						type={'select'}
						options={otherDetailsOptions?.AllCurrencies}
						fullWidth
					/>
				</Grid>
			</GridRow>
			{/* opening_balance */}
			{/* <GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Opening Balance</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='opening_balance'
						// value={formik.values?.opening_balance}
						value={Math.max(0, parseFloat(formik.values.opening_balance)) || ''}
						error={formik.errors?.opening_balance}
						handleChange={formik.handleChange}
						label={'$0.00'}
						type={'number'}
					/>
				</Grid>
			</GridRow> */}
			{/* payment Term  */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Payment Terms</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='term_id'
						value={formik.values?.term_id}
						handleChange={formik.handleChange}
						error={formik.errors?.term_id}
						label={'Payment Terms'}
						type={'select'}
						fullWidth
						options={paymentTerms}
						selectbutton={
							<Button onClick={() => setIsOpen(true)}>
								<Settings /> Configure Terms
							</Button>
						}
					/>
					<TermsModal
						terms={paymentTerms}
						isOpen={isOpen}
						onSave={PaymentRespone}
						onClose={() => setIsOpen(false)}
					/>
				</Grid>
			</GridRow>
			{/* Mode of Payments */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Mode of Payments</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='mode_of_payment'
						value={formik.values?.mode_of_payment}
						handleChange={formik.handleChange}
						error={formik.errors?.mode_of_payment}
						label={'Select mode of payments'}
						type={'select'}
						options={paymentMode}
						fullWidth
					/>
				</Grid>
			</GridRow>
			{/* Website  */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Website</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='website'
						value={formik.values?.website}
						error={formik.errors?.website}
						handleChange={formik.handleChange}
						label={'https://www.example.com'}
						type={'url'}
					/>
				</Grid>
			</GridRow>
			{/* Department  */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Department</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='department'
						value={formik.values?.department}
						handleChange={formik.handleChange}
						error={formik.errors?.department}
						label={'Departments'}
						type={'select'}
						fullWidth
						options={otherDetailsOptions?.departments}

						// id='department'
						// value={formik.values?.department}
						// handleChange={formik.handleChange}
						// error={formik.errors?.department}
						// label={'Department'}
					/>
				</Grid>
			</GridRow>
			{/* Designation  */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Designation</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='designation'
						value={formik.values?.designation}
						error={formik.errors?.designation}
						handleChange={formik.handleChange}
						label={'Designation'}
					/>
				</Grid>
			</GridRow>

			{/* Facebook  */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Facebook</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='facebook_link'
						value={formik.values?.facebook_link}
						error={formik.errors?.facebook_link}
						handleChange={formik.handleChange}
						label={'facebook.com'}
						icon={<AccountCircle />}
						type={'url'}
					/>
					<Typography variant='caption'>https://facebook.com/</Typography>
				</Grid>
			</GridRow>
			{/* Skype  */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Skype</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='skype_name'
						value={formik.values?.skype_name}
						error={formik.errors?.skype_name}
						handleChange={formik.handleChange}
						label={'skype.com'}
						icon={<AccountCircle />}
					/>
				</Grid>
			</GridRow>
			{/* Twitter  */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Twitter</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='twitter_link'
						value={formik.values?.twitter_link}
						error={formik.errors?.twitter_link}
						handleChange={formik.handleChange}
						label={'twitter.com'}
						icon={<AccountCircle />}
						type={'url'}
					/>
					<Typography variant='caption'>https://twitter.com/</Typography>
				</Grid>
			</GridRow>
		</Box>
	);
}

export default OtherDetailsTab;
