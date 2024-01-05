import React from 'react';
// mui
import {
	Grid,
	MenuItem,
	Paper,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';

// common
import InputLabel from '../../../../Components/InputLabel/InputLabel';
import FormField from '../../../../Components/InputField/FormField';
import GridRow from '../../../../Components/GridRow/GridRow';

const ItemDetails = ({ formik, lists }) => {
	// const addBulletPointRow = () => {
	// 	const rows = [...formik.values?.bullet_points, ''];
	// 	formik.setFieldValue('item_details.bullet_points', rows);
	// };
	// const deleteBulletPointRow = index => {
	// 	const rows = deleteItemByIndex(formik.values?.bullet_points, index);
	// 	formik.setFieldValue('item_details.bullet_points', rows);
	// };
	return (
		<Grid container p={3}>
			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Title<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						label={'Title'}
						name='item_details.title'
						onBlur={formik.handleBlur}
						value={formik.values?.title}
						onChange={formik.handleChange}
						isTouched={formik.touched?.title}
						error={formik.touched?.title && formik.errors?.title}
					/>
				</Grid>
			</GridRow>

			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Item ID<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						label={'ID'}
						id='item_details.item_id'
						onBlur={formik.handleBlur}
						type={'number'}
						value={formik.values?.item_id}
						onChange={formik.handleChange}
						isTouched={formik.touched?.item_id}
						error={formik.touched?.item_id && formik.errors?.item_id}
					/>
				</Grid>
			</GridRow>
			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Asin<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						label={'ASIN'}
						id='item_details.asin'
						onBlur={formik.handleBlur}
						type={'number'}
						value={formik.values?.asin}
						onChange={formik.handleChange}
						isTouched={formik.touched?.asin}
						error={formik.touched?.asin && formik.errors?.asin}
					/>
				</Grid>
			</GridRow>
			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Part Number<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						label={'Part Number'}
						id='item_details.mpn'
						onBlur={formik.handleBlur}
						value={formik.values?.mpn}
						onChange={formik.handleChange}
						isTouched={formik.touched?.mpn}
						error={
							formik.touched?.mpn && formik.errors?.mpn && formik.errors?.mpn
						}
					/>
				</Grid>
			</GridRow>

			<GridRow>
				<Grid item xs={2}>
					<InputLabel>
						Description<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='item_details.description'
						label={'Description'}
						type='textarea'
						style={{ fontSize: '16px' }}
						onBlur={formik.handleBlur}
						value={formik.values?.description}
						onChange={formik.handleChange}
						isTouched={formik.touched?.description}
						error={
							formik.touched?.description &&
							formik.errors?.description &&
							formik.errors?.description
						}
					/>
				</Grid>
			</GridRow>

			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Quantity<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						name={'item_details.quantity'}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						isTouched={formik.touched?.quantity}
						value={formik.values?.quantity}
						error={formik.errors?.quantity}
						type={'number'}
						label={'Quantity'}
					/>
				</Grid>
			</GridRow>
			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Cost<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						value={formik.values?.cost}
						name='item_details.cost'
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						isTouched={formik.touched?.cost}
						error={formik.errors?.cost}
						label={'$0.00'}
						type={'number'}
					/>
				</Grid>
			</GridRow>
			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Brands<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						type={'select'}
						name={'item_details.brand_id'}
						value={formik.values?.brand_id}
						onBlur={formik.handleBlur}
						isTouched={formik.touched?.brand_id}
						label={'Brands'}
						options={lists.brands}
						fullWidth
						onChange={formik.handleChange}
						error={formik.errors?.brand_id}
					/>
				</Grid>
			</GridRow>
			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Category<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						type={'select'}
						name={'item_details.category_id'}
						value={formik.values?.category_id}
						onBlur={formik.handleBlur}
						isTouched={formik.touched?.category_id}
						label={'Category'}
						options={lists.categories}
						fullWidth
						onChange={formik.handleChange}
						error={formik.errors?.category_id}
					/>
				</Grid>
			</GridRow>
			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Seller SKU<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						name='item_details.sku'
						value={formik.values?.sku}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						isTouched={formik.touched?.sku}
						label={'SKU'}
						error={formik.errors?.sku}
					/>
				</Grid>
			</GridRow>
			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Condition<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						type={'select'}
						name='item_details.condition_id'
						fullWidth
						placeholder='Select Condition'
						label='Condition'
						value={formik.values?.condition_id}
						onBlur={formik.handleBlur}
						isTouched={formik.touched?.condition_id}
						options={lists.conditions}
						onChange={formik.handleChange}
						error={formik.errors?.condition_id}
					/>
				</Grid>
			</GridRow>

			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Selling Price<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						value={formik.values?.selling_price}
						name='item_details.selling_price'
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						isTouched={formik.touched?.selling_price}
						label={'Selling Price'}
						error={formik.errors?.selling_price}
					/>
				</Grid>
			</GridRow>
		</Grid>
	);
};

export default ItemDetails;

function DimensionsInputField({ value, label, ...props }) {
	const inputOptions = { ...props, label: label + ' ' + value };
	const theme = useTheme();
	return (
		<FormField
			{...inputOptions}
			sx={{
				'& .MuiInputBase-input': { color: theme.palette.info.dark },
				marginBottom: '10px',
			}}
		/>
	);
}

function DimensionsSelectField({
	id,
	name,
	value,
	size,
	error,
	isTouched,
	handleChange,
	options,
	SelectProps,
	disabled, // Add disabled prop
	...otherProps
}) {
	const theme = useTheme();
	const configSelect = {
		id,
		name: name || id,
		label: value ? measurementUnitEnums[value] : 'Measurement Unit',
		select: true,
		value: value,
		fullWidth: true,
		onChange: handleChange,
		size: size || 'small',
		disabled: disabled || false, // Set the disabled prop
		...otherProps,
	};

	if (isTouched && error) {
		configSelect.error = true;
		configSelect.helperText = error;
	}
	return (
		<TextField
			{...configSelect}
			SelectProps={{
				MenuProps: { PaperProps: { style: { maxHeight: '250px' } } },
				...SelectProps,
			}}
			InputLabelProps={{
				style: {
					fontSize: '16px',
				},
			}}
			sx={{
				'& .MuiInputBase-root': {
					'& .MuiSelect-select': {
						padding: '8.5px 14px',
						fontSize: '14px',
						color: theme.palette.info.dark,
					},
				},
			}}
		>
			{options?.map(option => (
				<MenuItem key={option?.value} value={option?.value}>
					<Typography sx={{ textTransform: 'capitalize', fontSize: '16px' }}>
						{option?.text}
					</Typography>
				</MenuItem>
			))}
		</TextField>
	);
}

const measurementUnitEnums = {
	in: 'inches',
	cm: 'centimeters',
};

const measurementUnits = [
	{
		value: 'cm',
		text: 'CM',
	},
	{
		value: 'in',
		text: 'IN',
	},
];

const brands = [
	{
		text: 'Dell',
		value: 1,
	},
	{
		text: 'HP',
		value: 2,
	},
	{
		text: 'Intel',
		value: 3,
	},
];

const conditions = [
	{
		text: 'Used',
		value: 1,
	},
	{
		text: 'Refurbished',
		value: 2,
	},
	{
		text: 'Dabba packed',
		value: 3,
	},
];

const categories = [
	{
		text: 'BTO',
		value: 1,
	},
	{
		text: 'Laptops',
		value: 2,
	},
	{
		text: 'Gaming PC',
		value: 3,
	},
];

// styles
const labelStyle = {
	display: 'flex',
	alignItems: 'start',
};
