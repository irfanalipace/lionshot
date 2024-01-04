/* eslint-disable no-unsafe-optional-chaining */
import GridRow from '../../../Components/GridRow/GridRow';
import { Button, Divider, Grid, IconButton, Typography } from '@mui/material';
import FormField from '../../../Components/InputField/FormField';
import { Add, Delete } from '@mui/icons-material';
import { Box } from '@mui/system';
import { salutations } from '../../../../core/utils/constants';
function ContactPersonTab({ formik }) {
	const handleAddRow = () => {
		const newRow = {
			id: Date.now(),
		};
		formik?.setValues(prevValues => {
			return {
				...prevValues,
				customer_contacts: [...prevValues?.customer_contacts, newRow],
			};
		});
		// setRows((prevRows) => {
		//  return  prevRows?.length ?  [...prevRows, newRow] : [newRow]
		// });
	};
	const handleDeleteRow = rowId => {
		// formik?.setFieldValue('customer_contacts',(prevRows) => prevRows.filter((row) => row.id !== rowId));
		formik?.setValues(prevValues => {
			return {
				...prevValues,
				customer_contacts: [
					...prevValues?.customer_contacts.filter(row => row.id !== rowId),
				],
			};
		});
	};
	return (
		<Box>
			<GridRow style={{ marginTop: '20px' }}>
				<Grid item xs={1.4}>
					<Typography variant='subtitle2'>Salutation</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography variant='subtitle2'>First Name</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography variant='subtitle2'>Last Name</Typography>
				</Grid>
				<Grid item xs={1.5}>
					<Typography variant='subtitle2'>Email Address</Typography>
				</Grid>
				<Grid item xs={1.1}>
					<Typography variant='subtitle2'>Primary Contact</Typography>
				</Grid>
				<Grid item xs={1.1}>
					<Typography variant='subtitle2'>Secondary Contact</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography variant='subtitle2'>Skype</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography variant='subtitle2'>Designation</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography variant='subtitle2'>Department</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography variant='subtitle2'>Action</Typography>
				</Grid>
			</GridRow>
			<Divider style={{ width: '80%', marginBottom: '20px' }} />
			{formik.values?.customer_contacts?.map((row, index) => (
				<GridRow key={index}>
					<Grid item xs={1.4}>
						<FormField
							id={`customer_contacts[${index}].salutation`}
							value={formik.values?.customer_contacts[index]?.salutation}
							handleChange={formik.handleChange}
							size={'small'}
							type={'select'}
							label={'salutation'}
							options={salutations}
							fullWidth
						/>
					</Grid>
					<Grid item xs={1}>
						<FormField
							id={`customer_contacts[${index}].first_name`}
							value={formik.values.customer_contacts[index]?.first_name}
							handleChange={formik.handleChange}
							size={'small'}
						/>
					</Grid>
					<Grid item xs={1}>
						<FormField
							id={`customer_contacts[${index}].last_name`}
							value={formik.values.customer_contacts[index]?.last_name}
							handleChange={formik.handleChange}
							error={
								formik?.errors?.customer_contacts?.length &&
								formik.errors?.customer_contacts[index]?.last_name
							}
							onBlur={formik.handleBlur}
							isTouched={true}
							size={'small'}
						/>
					</Grid>
					<Grid item xs={1.5}>
						<FormField
							id={`customer_contacts[${index}].email`}
							value={formik.values.customer_contacts[index]?.email}
							handleChange={formik.handleChange}
							size={'small'}
							error={
								formik?.errors?.customer_contacts?.length &&
								formik.errors?.customer_contacts[index]?.email
							}
							onBlur={formik.handleBlur}
							isTouched={
								formik?.touched?.customer_contacts?.length &&
								formik.touched.customer_contacts[index]?.email
							}
						/>
					</Grid>
					<Grid item xs={1.1}>
						<FormField
							id={`customer_contacts[${index}].work_phone`}
							value={formik.values.customer_contacts[index]?.work_phone}
							handleChange={formik.handleChange}
							size={'small'}
							error={
								formik?.errors?.customer_contacts?.length &&
								formik.errors?.customer_contacts[index]?.work_phone
							}
							onBlur={formik.handleBlur}
							isTouched={
								formik?.touched?.customer_contacts?.length &&
								formik.touched.customer_contacts[index]?.work_phone
							}
						/>
					</Grid>
					<Grid item xs={1.1}>
						<FormField
							id={`customer_contacts[${index}].mobile`}
							value={formik.values.customer_contacts[index]?.mobile}
							handleChange={formik.handleChange}
							size={'small'}
							error={
								formik?.errors?.customer_contacts?.length &&
								formik.errors?.customer_contacts[index]?.mobile
							}
							onBlur={formik.handleBlur}
							isTouched={
								formik?.touched?.customer_contacts?.length &&
								formik.touched.customer_contacts[index]?.mobile
							}
						/>
					</Grid>
					<Grid item xs={1}>
						<FormField
							id={`customer_contacts[${index}].skype_name`}
							value={formik.values.customer_contacts[index]?.skype_name}
							handleChange={formik.handleChange}
							size={'small'}
						/>
					</Grid>
					<Grid item xs={1}>
						<FormField
							id={`customer_contacts[${index}].designation`}
							value={formik.values.customer_contacts[index]?.designation}
							handleChange={formik.handleChange}
							size={'small'}
						/>
					</Grid>
					<Grid item xs={1}>
						<FormField
							id={`customer_contacts[${index}].department`}
							value={formik.values.customer_contacts[index]?.department}
							handleChange={formik.handleChange}
							size={'small'}
						/>
					</Grid>
					<Grid item xs={1}>
						<IconButton
							color='primary'
							onClick={() => handleDeleteRow(row.id)}
							// sx={{ mt: 2 }}
						>
							<Delete />
						</IconButton>
					</Grid>
				</GridRow>
			))}
			<Button sx={{ mt: 1, mb: 10 }} startIcon={<Add />} onClick={handleAddRow}>
				Add More Rows
			</Button>
		</Box>
	);
}

export default ContactPersonTab;
