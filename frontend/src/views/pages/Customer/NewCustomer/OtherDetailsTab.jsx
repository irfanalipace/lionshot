/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import GridRow from '../../../Components/GridRow/GridRow';
import {
	Button,
	Divider,
	FormControlLabel,
	Grid,
	Radio,
	Typography,
} from '@mui/material';
import FormField from '../../../Components/InputField/FormField';
import { Box } from '@mui/system';
import { TaxTypeEnum } from '../../../../core/utils/constants';
import { AccountCircle, Settings } from '@mui/icons-material';
import TermsModal from '../../../Components/TermsModal/TermsModal';
import {
	deleteCustomerFilesApi,
	getTaxesApi,
} from '../../../../core/api/customer';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import FilesModule from '../../../Components/FileUpload/FilesModule';
import NewTaxModal from '../../Estimate/NewEstimate/AddItem/NewTaxModal';
import { Add } from '@mui/icons-material';
function OtherDetailsTab({
	formik,
	PaymentRespone,
	texRate,
	customerID,
	otherDetailsOptions,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [isNewTaxModalOpen, setIsNewTaxModalOpen] = useState(false);
	const [isNewTaxAdded, setIsNewTaxAdded] = useState(false);
	const [taxRate, setTaxRate] = useState(texRate);
	const [paymentMode, setpaymentMode] = useState([]);

	useEffect(() => {
		const respTax = getTaxesApi();
		respTax
			.then(data => {
				const repsTax = data.data;
				const updatedOptions_ = repsTax.map(({ id, name }) => ({
					value: id,
					text: name,
				}));
				setTaxRate(updatedOptions_);
			})
			.catch(error => {
				console.error(error.message);
			});
	}, [isNewTaxAdded]);

	// on select payment term payment mode options should change
	useEffect(() => {
		const termname = otherDetailsOptions?.paymentTerms?.find(
			term => term?.value === formik.values?.term_id
		);
		let lowerCaseText = termname?.text?.toLowerCase();
		if (lowerCaseText?.includes('day')) {
			setpaymentMode([
				{ value: 'bank_transfer', text: 'Bank Transfer' },
				{ value: 'cc', text: 'Credit/Debit Card' },
				{ value: 'paypal', text: 'Paypal' },
				{ value: 'square', text: 'Square' },
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
				{ value: 'cc', text: 'Credit/Debit Card' },
				{ value: 'paypal', text: 'Paypal' },
				{ value: 'square', text: 'Square' },
				// { value: 'cc', text: 'Credit Card' },
				// { value: 'square', text: 'Square' },
				// { value: 'paypal', text: 'Paypal' },
			]);
		}
	}, [formik.values.term_id, otherDetailsOptions?.paymentTerms]);

	const deleteFileFromApi = async fileId => {
		try {
			const body = {
				customer_id: customerID,
				file_id: fileId,
			};
			const resp = await deleteCustomerFilesApi(body);
			const files = formik.values.customer_files.filter(f => f.id !== fileId);
			formik.setFieldValue('customer_files', files);
			notyf.success(resp.message);
		} catch (error) {
			console.log('error', error);
		}
	};

	const deletingFile = fileId => {
		if (fileId.id) {
			deleteFileFromApi(fileId?.id);
		} else {
			formik.setFieldValue(
				'customer_files',
				formik.values.customer_files?.filter(f => f !== fileId)
			);
		}
	};
	const downloadFile = file => {
		window.open(file?.file_path);
	};
	return (
		<Box>
			<GridRow style={{ alignItems: 'center' }}>
				<Grid item xs={2}>
					<Typography variant='body2'>Tax Type</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormControlLabel
						id='tax_preference'
						name='tax_preference'
						onChange={event => {
							formik.handleChange(event);
							if (event.target.checked) {
								formik.setFieldValue('tax_preference', TaxTypeEnum.taxable.key);
								// Clear Tax Exempt fields when Taxable is selected
								formik.setFieldValue('exemption_reason', '');
								formik.setFieldValue('tax_authority', '');
							}
						}}
						value={formik.values.tax_preference}
						checked={formik.values.tax_preference === TaxTypeEnum.taxable.key}
						control={<Radio />}
						label='Taxable'
					/>
					<FormControlLabel
						id='tax_preference'
						name='tax_preference'
						onChange={event => {
							formik.handleChange(event);
							if (event.target.checked) {
								formik.setFieldValue(
									'tax_preference',
									TaxTypeEnum.taxExempt.key
								);
								// Clear Taxable fields when Tax Exempt is selected
								formik.setFieldValue('tax_id', null);
							}
						}}
						value={formik.values.tax_preference}
						checked={formik.values.tax_preference === TaxTypeEnum.taxExempt.key}
						control={<Radio />}
						label='Tax Exempt'
					/>
				</Grid>
			</GridRow>
			{/* for Taxable fields */}
			{formik.values.tax_preference === TaxTypeEnum.taxable.key && (
				<GridRow>
					<Grid item xs={2}>
						<Typography variant='body2'>
							Tax Rate <span style={{ color: 'red' }}>*</span>
						</Typography>
					</Grid>
					<Grid item xs={4}>
						<FormField
							id='tax_id'
							handleChange={formik.handleChange}
							value={
								formik.values.tax_preference === TaxTypeEnum.taxable.key
									? formik.values.tax_id
									: null
							}
							error={formik.errors.tax_id}
							onBlur={formik.handleBlur}
							isTouched={formik.touched.tax_id}
							type={'select'}
							label={'Tax Rate'}
							fullWidth
							options={taxRate}
							selectbutton={
								<Button
									onClick={e => {
										e.stopPropagation();
										setIsNewTaxModalOpen(true);
									}}
									variant='outlined'
									fullWidth
								>
									<Add /> New Tax
								</Button>
							}
							required={
								formik.values.tax_preference === TaxTypeEnum.taxable.key
							}
						/>
						<Typography variant='caption'>
							To associate more than one tax, you need to create a tax group in
							Settings.
						</Typography>
					</Grid>
				</GridRow>
			)}
			{formik.values.tax_preference === TaxTypeEnum.taxExempt.key && (
				<>
					<GridRow>
						<Grid item xs={2}>
							<Typography variant='body2'>
								Exemption Reason <span style={{ color: 'red' }}>*</span>
							</Typography>
						</Grid>
						<Grid item xs={4}>
							<FormField
								id='exemption_reason'
								handleChange={formik.handleChange}
								value={formik.values.exemption_reason || ''}
								error={formik.errors.exemption_reason}
								onBlur={formik.handleBlur}
								isTouched={formik.touched.exemption_reason}
								label={'Exemption Reason'}
								fullWidth
								required={
									formik.values.tax_preference === TaxTypeEnum.taxExempt.key
								}
							/>
						</Grid>
					</GridRow>
					<GridRow>
						<Grid item xs={2}>
							<Typography variant='body2'>
								Tax Authority<span style={{ color: 'red' }}>*</span>
							</Typography>
						</Grid>
						<Grid item xs={4}>
							<FormField
								id='tax_authority'
								value={formik.values.tax_authority || ''}
								handleChange={formik.handleChange}
								error={formik.errors.tax_authority}
								onBlur={formik.handleBlur}
								isTouched={formik.touched.tax_authority}
								label={'Tax Authority'}
								fullWidth
								required={
									formik.values.tax_preference === TaxTypeEnum.taxExempt.key
								}
							/>
						</Grid>
					</GridRow>
				</>
			)}
			{/* Currency  */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Currency</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='currency'
						value={formik.values.currency || ''}
						handleChange={formik.handleChange}
						error={formik.errors.currency}
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
						value={Math.max(0, parseFloat(formik.values.opening_balance)) || ''}
						error={formik.errors.opening_balance}
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
						value={formik.values.term_id || ''}
						handleChange={formik.handleChange}
						error={formik.errors.term_id}
						label={'Payment Terms'}
						type={'select'}
						fullWidth
						options={otherDetailsOptions?.paymentTerms}
						selectbutton={
							<Button onClick={() => setIsOpen(true)}>
								<Settings /> Configure Terms
							</Button>
						}
					/>
					<TermsModal
						terms={otherDetailsOptions?.paymentTerms}
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
						value={formik.values.mode_of_payment || ''}
						handleChange={formik.handleChange}
						error={formik.errors.mode_of_payment}
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
						value={formik.values.website || ''}
						error={formik.errors.website}
						handleChange={formik.handleChange}
						label={'https://www.example.com'}
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
						value={formik.values?.department || ''}
						handleChange={formik.handleChange}
						error={formik.errors?.department}
						label={'Departments'}
						type={'select'}
						fullWidth
						options={otherDetailsOptions?.departments}
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
						value={formik.values.designation || ''}
						error={formik.errors.designation}
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
						value={formik.values.facebook_link || ''}
						error={formik.errors.facebook_link}
						handleChange={formik.handleChange}
						label={'facebook.com'}
						icon={<AccountCircle />}
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
						value={formik.values.skype_name || ''}
						error={formik.errors.skype_name}
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
						value={formik.values.twitter_link || ''}
						error={formik.errors.twitter_link}
						handleChange={formik.handleChange}
						label={'twitter.com'}
						icon={<AccountCircle />}
					/>
					<Typography variant='caption'>https://twitter.com/</Typography>
				</Grid>
			</GridRow>
			{/* Attachments */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Upload Attachments</Typography>
				</Grid>
				<Grid item xs={4}>
					<FilesModule
						files={formik.values.customer_files}
						setFiles={files => formik.setFieldValue('customer_files', files)}
						onDelete={deletingFile}
					/>
					{formik.errors.customer_files && (
						<Typography variant='caption' color={'red'}>
							{formik.errors.customer_files}
						</Typography>
					)}
				</Grid>
			</GridRow>
			<Typography variant='body2'>
				Customer Owner: Assign a user as the customer owner to provide access
				only to the data of this <br />
				customer.{' '}
				<span style={{ color: window.themeColors.primary }}>Learn More</span>
			</Typography>
			<NewTaxModal
				setIsNewTaxAdded={setIsNewTaxAdded}
				open={isNewTaxModalOpen}
				onClose={() => setIsNewTaxModalOpen(false)}
				newTax={isNewTaxAdded}
			/>
		</Box>
	);
}

export default OtherDetailsTab;
