import React, { useState } from 'react';
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
import CustomSelect from '../../../../Components/Select/Select';
import MUIButton from '../../../../Components/Button/MUIButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteItemByIndex } from '../../../../../core/utils/helpers';

// styles
const labelStyle = {
	display: 'flex',
	alignItems: 'start',
};

const ItemDetails = ({ formik }) => {
	const types = [
		{
			text: 'type 1',
			value: 1,
		},
		{
			text: 'type 2',
			value: 2,
		},
		{
			text: 'type 2',
			value: 3,
		},
	];

	const addBulletPointRow = () => {
		const rows = [...formik.values.bullet_points, ''];
		formik.setFieldValue('item_details.bullet_points', rows);
	};
	const deleteBulletPointRow = index => {
		const rows = deleteItemByIndex(formik.values.bullet_points, index);
		formik.setFieldValue('item_details.bullet_points', rows);
	};

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
						value={formik.values.title}
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
						value={formik.values.item_id}
						onChange={formik.handleChange}
						isTouched={formik.touched?.item_details?.item_id}
						error={
							formik.touched?.item_details?.item_id &&
							formik.errors.item_id &&
							formik.errors.item_id
						}
					/>
				</Grid>
			</GridRow>

			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Item Type<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						type={'select'}
						name='item_details.item_type'
						fullWidth
						placeholder='Select item type'
						value={formik.values.item_type}
						// onBlur={formik.handleBlur}
						options={types}
						onChange={formik.handleChange}
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
						value={formik.values.description}
						onChange={formik.handleChange}
						isTouched={formik.touched?.item_details?.description}
						error={
							formik.touched?.item_details?.description &&
							formik.errors.description &&
							formik.errors.description
						}
					/>
				</Grid>
			</GridRow>
			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Bullet Points<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={5.7}>
					{formik.values.bullet_points?.map((b, index) => (
						<Grid
							container
							justifyContent={'space-between'}
							mt={index > 0 ? 1 : 0}
							key={index}
						>
							<Grid item xs={8.2}>
								<FormField
									label='Bullet Point'
									name={'item_details.bullet_points[' + index + ']'}
									onChange={formik.handleChange}
									value={formik.values.bullet_points[index]}
								/>
							</Grid>

							<Grid item xs={3.6}>
								{index === formik.values.bullet_points.length - 1 ? (
									<MUIButton
										variant={'text'}
										startIcon={<AddIcon />}
										onClick={addBulletPointRow}
									>
										<Typography variant='body2'>Add More Rows</Typography>
									</MUIButton>
								) : (
									<>
										<MUIButton
											startIcon={<DeleteIcon />}
											onClick={() => deleteBulletPointRow(index)}
										>
											<Typography variant='body2'>Delete</Typography>
										</MUIButton>
									</>
								)}
							</Grid>
						</Grid>
					))}
				</Grid>
			</GridRow>
			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Created Date<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						value={formik.values.created_date}
						name={'item_details.created_date'}
						onChange={formik.handleChange}
						type='date'
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
						value={formik.values.quantity}
						label={'Quantity'}
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
						name={'item_details.brands'}
						value={formik.values.brands}
						label={'Brands'}
						options={[
							{
								text: 'Dell',
								value: '1',
							},
							{
								text: 'HP',
								value: '2',
							},
							{
								text: 'Intel',
								value: '3',
							},
						]}
						fullWidth
						onChange={formik.handleChange}
					/>
				</Grid>
			</GridRow>

			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Opertaing System<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						type={'select'}
						name={'item_details.operating_system'}
						label={'Operating System'}
						value={formik.values.operating_system}
						options={[
							{
								text: 'Windows',
								value: 1,
							},
							{
								text: 'Linux',
								value: 2,
							},
							{
								text: 'Mac OS X',
								value: 3,
							},
						]}
						fullWidth
						onChange={formik.handleChange}
					/>
				</Grid>
			</GridRow>

			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Item Dimensions<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<Grid container justifyContent={'space-between'}>
						<Grid item xs={5.8}>
							<DimensionsInputField
								label={'Item Length'}
								onChange={formik.handleChange}
								name='item_details.item_dimensions.item_length.value'
								value={formik.values.item_dimensions.item_length.value}
							/>
						</Grid>
						<Grid item xs={5.8}>
							<DimensionsSelectField
								type={'select'}
								name='item_details.item_dimensions.item_length.unit'
								value={formik.values.item_dimensions.item_length.unit}
								onChange={formik.handleChange}
								fullWidth
								options={measurementUnits}
							/>
						</Grid>
					</Grid>
					<Grid container justifyContent={'space-between'}>
						<Grid item xs={5.8}>
							<DimensionsInputField
								label={'Item Width'}
								onChange={formik.handleChange}
								name='item_details.item_dimensions.item_width.value'
								value={formik.values.item_dimensions.item_width.value}
							/>
						</Grid>
						<Grid item xs={5.8}>
							<DimensionsSelectField
								type={'select'}
								name='item_details.item_dimensions.item_width.unit'
								value={formik.values.item_dimensions.item_width.unit}
								onChange={formik.handleChange}
								fullWidth
								options={measurementUnits}
							/>
						</Grid>
					</Grid>
					<Grid container justifyContent={'space-between'}>
						<Grid item xs={5.8}>
							<DimensionsInputField
								label={'Item Height'}
								onChange={formik.handleChange}
								name='item_details.item_dimensions.item_height.value'
								value={formik.values.item_dimensions.item_height.value}
							/>
						</Grid>
						<Grid item xs={5.8}>
							<DimensionsSelectField
								type={'select'}
								name='item_details.item_dimensions.item_height.unit'
								value={formik.values.item_dimensions.item_height.unit}
								onChange={formik.handleChange}
								fullWidth
								options={measurementUnits}
							/>
						</Grid>
					</Grid>
				</Grid>
			</GridRow>
			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Package Dimensions<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<Grid container justifyContent={'space-between'}>
						<Grid item xs={5.8}>
							<DimensionsInputField
								label={'Package Length'}
								onChange={formik.handleChange}
								name='item_details.package_dimensions.package_length.value'
								value={formik.values.package_dimensions.package_length.value}
							/>
						</Grid>
						<Grid item xs={5.8}>
							<DimensionsSelectField
								type={'select'}
								name='item_details.package_dimensions.package_length.unit'
								value={formik.values.package_dimensions.package_length.unit}
								onChange={formik.handleChange}
								fullWidth
								options={measurementUnits}
							/>
						</Grid>
					</Grid>
					<Grid container justifyContent={'space-between'}>
						<Grid item xs={5.8}>
							<DimensionsInputField
								label={'Package Width'}
								onChange={formik.handleChange}
								name='item_details.package_dimensions.package_width.value'
								value={formik.values.package_dimensions.package_width.value}
							/>
						</Grid>
						<Grid item xs={5.8}>
							<DimensionsSelectField
								type={'select'}
								name='item_details.package_dimensions.package_width.unit'
								value={formik.values.package_dimensions.package_width.unit}
								onChange={formik.handleChange}
								fullWidth
								options={measurementUnits}
							/>
						</Grid>
					</Grid>
					<Grid container justifyContent={'space-between'}>
						<Grid item xs={5.8}>
							<DimensionsInputField
								label={'Package Height'}
								onChange={formik.handleChange}
								name='item_details.package_dimensions.package_height.value'
								value={formik.values.package_dimensions.package_height.value}
							/>
						</Grid>
						<Grid item xs={5.8}>
							<DimensionsSelectField
								type={'select'}
								name='item_details.package_dimensions.package_height.unit'
								value={formik.values.package_dimensions.package_height.unit}
								onChange={formik.handleChange}
								fullWidth
								options={measurementUnits}
							/>
						</Grid>
					</Grid>
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
						value={formik.values.sku}
						onChange={formik.handleChange}
						label={'SKU'}
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
						value={formik.values.cost}
						name='item_details.cost'
						onChange={formik.handleChange}
						label={'Cost'}
					/>
				</Grid>
			</GridRow>

			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Sales Price<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						value={formik.values.sales_price}
						name='item_details.sales_price'
						onChange={formik.handleChange}
						label={'Sales Price'}
					/>
				</Grid>
			</GridRow>

			<GridRow>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Sales Start Date<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						value={formik.values.sales_start_date}
						name='item_details.sales_start_date'
						onChange={formik.handleChange}
						type='date'
					/>
				</Grid>
				<Grid item xs={2} sx={{ ...labelStyle }}>
					<InputLabel>
						Sales End Date<span style={{ color: 'red' }}>*</span>
					</InputLabel>
				</Grid>
				<Grid item xs={4}>
					<FormField
						name='item_details.sales_end_date'
						value={formik.values.sales_end_date}
						onChange={formik.handleChange}
						type='date'
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
