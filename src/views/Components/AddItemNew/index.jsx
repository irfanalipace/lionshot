/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback } from 'react';
import Select from '@mui/material/Select';
import {
	Box,
	Grid,
	Typography,
	Paper,
	styled,
	Stack,
	MenuItem,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CreatableSelect from 'react-select/creatable';
import { FieldArray } from 'formik';

import {
	calculateSubtotal,
	isGreaterThanZero,
} from '../../../core/utils/helpers';
import ErrorMessage from '../ErroMessage';
import MUIButton from '../Button/MUIButton';
import HoverPopover from '../HoverPopover/ErrorOutlinePopover';
import FormField from '../InputField/FormField';
import { getAllItems } from '../../../core/api/items';
import { getTaxesApi } from '../../../core/api/customer';
import CustomSelect from '../Select/Select';
import useResponsiveStyles from '../../../core/hooks/useMedaiQuery';
import InputLabel from '../InputLabel/InputLabel';
import NewTaxModal from '../../pages/Estimate/NewEstimate/AddItem/NewTaxModal';

const createOption = label => ({
	label,
	value: label.toLowerCase().replace(/\W/g, ''),
});

const selectStyle = {};
// eslint-disable-next-line react-refresh/only-export-components
const AddRowTitle = styled(Typography)(() => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	margin: '1rem 1rem 1rem 1rem',
	fontWeight: '500',
}));

// eslint-disable-next-line react-refresh/only-export-components
const FieldTitle = styled(Typography)(props => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	margin: '1rem 0 .4rem 0',
	fontFamily: 'Roboto',
	fontWeight: props.fontWeight || 400,
}));

const BillsAddItem = ({
	formiks,
	loading,
	isEdit,
	customerTax,
	taxId,
	itemName,
	type = '',
}) => {
	const itemNameKey = type === 'invoice' ? 'name' : 'item_name';
	const { values, setFieldValue, handleChange, errors, touched } = formiks;
	const [itemOptions, setItemOptions] = useState([]);

	const [isItemLoading, setIsItemLoading] = useState([]);
	const [shapedValues, setShapedValues] = useState([]);

	useEffect(() => {
		const shallowCopy = [...values.items];
		const newValues = shallowCopy?.map(item => {
			let shapedTax = { ...item.tax };
			if (Object.keys(shapedTax).length === 0) {
				shapedTax = {
					label: 'Non-Taxable',
					name: 'Non-Taxable',
					id: 1,
					rate: 0,
				};
			} else {
				shapedTax.label = item?.tax?.name;
			}
			return {
				...item,
				tax: shapedTax,
			};
		});
		setShapedValues([...newValues]);
	}, [JSON.stringify(values.items)]);

	const [texValues, setTexValues] = useState([]);
	const [total, setTotal] = useState(0);
	const [subTotal, setSubTotal] = useState(0);
	const [isNewTaxModalOpen, setIsNewTaxModalOpen] = useState(false);
	const [isNewTaxAdded, setIsNewTaxAdded] = useState(false);

	const labelValueMap = values?.items?.reduce((map, taxValue) => {
		//taxValue?.label !== "Non Taxable"
		if (taxValue.tax?.id !== 1 && taxValue.tax?.id) {
			if (!map[taxValue.tax?.name]) {
				map[taxValue.tax?.name] = taxValue.tax?.id;
			}
		}
		return map;
	}, {});

	const labelToTaxAmountMap = values?.items?.reduce((map, invoice) => {
		if (invoice.tax?.id !== 1) {
			if (!map[invoice.tax?.name]) {
				map[invoice.tax?.name] = 0;
			}
			map[invoice.tax?.name] += (invoice?.total * invoice.tax?.rate) / 100;
		}
		return map;
	}, {});

	const DISCOUNT_TYPE = [
		{
			value: 'percent',
			text: '%',
		},
		{
			value: 'dollar',
			text: '$',
		},
	];

	useEffect(() => {
		const invoice_items_copy = values.items;

		if (customerTax && isEdit === false) {
			invoice_items_copy.forEach(item => {
				if (!item?.[itemNameKey]) {
					item.tax = {
						name: customerTax.name,
						label: customerTax.name,
						id: customerTax.id,
						rate: customerTax?.rate,
					};
				}
			});
			setFieldValue(itemName, invoice_items_copy);
		} else {
			let detail;
			invoice_items_copy.forEach(item => {
				if (item?.detail) {
					detail = JSON.parse(item.detail);
				}
				if (!item?.[itemNameKey]) {
					item.tax = {
						label: 'Non-Taxable',
						name: 'Non-Taxable',
						id: 1,
						rate: 0,
					};
				} else if (detail?.tax?.id) {
					item.tax = detail.tax;
				}
			});
			setFieldValue(itemName, invoice_items_copy);
		}
	}, [taxId]);

	useEffect(() => {
		// invoice?.total * invoice.tax?.rate
		calculateSubtotal(values.items);

		// const taAamount = values.items?.reduce(
		// 	(accumulator: number, currentValue: any) =>
		// 		(accumulator = currentValue?.tax.rate + values.total / 100),

		// 	0
		// );
		// setFieldValue('tax_amount', taAamount);
	}, [values.items]);

	useEffect(() => {
		const res = calculateSubtotal(values.items);
		setSubTotal(res);
		if (values.sub_total !== res) {
			setFieldValue('sub_total', res);
		}
	}, [JSON.stringify(values.items)]);

	const calculateTotal = useCallback(() => {
		const subtotal = calculateSubtotal(values.items);

		let total = subtotal;
		let tax_amount = 0;
		if (values.items_rates_are === 'tax_exclusive') {
			for (const label in labelToTaxAmountMap) {
				total += labelToTaxAmountMap[label];
				tax_amount += labelToTaxAmountMap[label];
			}
		}
		let discount = 0;
		if (values.discount_type === 'percent') {
			discount = (subtotal * values.discount) / 100;
		} else if (values.discount_type === 'dollar') {
			discount = values.discount;
		}

		// Add Shipping Charges if greater than zero
		if (isGreaterThanZero(values.shipping_charges)) {
			total += parseFloat(values.shipping_charges);
		}

		// Add Adjustment if greater than zero
		if (isGreaterThanZero(values.adjustment)) {
			total += parseFloat(values.adjustment);
		}
		total -= discount;

		if (total !== values.total) {
			setFieldValue('total', total);
		}
		setFieldValue('tax_amount', tax_amount);
		return total;
	}, [values]);

	useEffect(() => {
		const res = calculateTotal();
		setTotal(res);
	}, [
		values.subTotal,
		values.items,
		values.discount,
		values.adjustment,
		values.discount_type,
	]);

	const getTaxes = async () => {
		try {
			const respTax = await getTaxesApi();
			const taxList = respTax.data.map(tax => {
				return {
					...tax,
					label: tax.name,
				};
			});
			setTexValues(taxList);
		} catch (error) {
			console.error(error.message);
		}
	};

	const getItems = async () => {
		try {
			const resp = await getAllItems({});
			const updatedOptions = resp.data.data.map(
				({ id, title, selling_price }) => ({
					value: id,
					label: title,
					price: selling_price,
				})
			);
			setItemOptions(updatedOptions);
		} catch (error) {
			console.error(error.message);
		}
	};
	useEffect(() => {
		getItems();
	}, []);

	useEffect(() => {
		getTaxes();
	}, [isNewTaxAdded]);

	const handleItemName = (e, index) => {
		setFieldValue(`${itemName}.${index}.item_name_object`, e);
		setFieldValue(`${itemName}.${index}.${itemNameKey}`, e.label);
		if (e.custom_item) {
			setFieldValue(`${itemName}[${index}.item_id`, null);
		} else setFieldValue(`${itemName}[${index}.item_id`, e.value);
		// setFieldValue(`${itemName}.${index}.item_id`, e.value);
		setFieldValue(
			`${itemName}.[${index}].rate`,
			isNaN(e.price) ? 0 : e.price * values.items[index].quantity
		);

		setFieldValue(`${itemName}[${index}].quantity`, 1);
		setFieldValue(
			`${itemName}[${index}].total`,
			(e.price || 0) * values.items[index].quantity
		);
		// if(e.custom_item){
		// 	setFieldValue(`${itemName}[${index}.custom_item`,true);
		// }
	};

	const discountCalculate = useCallback(() => {
		return values.discount_type === 'percent'
			? isNaN((calculateSubtotal(values.items) * values.discount) / 100)
				? '0.00'
				: `-${(
						(calculateSubtotal(values.items) * values.discount) /
						100
				  )?.toFixed(2)}`
			: isNaN(values.discount) || values.discount === ''
			? '0.00'
			: `-${parseFloat(values?.discount)?.toFixed(2)}`;
	}, [values.discount_type, values.discount, JSON.stringify(values.items)]);

	return (
		<>
			<Grid container columnSpacing={1}>
				<Grid item xs={2.5}>
					<AddRowTitle>Item Details</AddRowTitle>
				</Grid>

				<Grid item xs={1.8}>
					<AddRowTitle>Quantity</AddRowTitle>
				</Grid>

				<Grid item xs={1.8}>
					<AddRowTitle>Rate</AddRowTitle>
				</Grid>

				<Grid item xs={2}>
					<AddRowTitle>Tax</AddRowTitle>
				</Grid>

				<Grid item xs={1}>
					<AddRowTitle>Amount</AddRowTitle>
				</Grid>

				<Grid item xs={0.5}>
					<AddRowTitle>Actions</AddRowTitle>
				</Grid>

				<Grid item xs={12} mt={0} mb={3}>
					<Divider />
				</Grid>
			</Grid>

			<FieldArray
				name={itemName}
				render={arrayHelpers => (
					<>
						{shapedValues?.map((row, index) => (
							<Grid container columnSpacing={1} key={index}>
								{/* Item Details */}
								<Grid item xs={2.5}>
									<CreatableSelect
										key={index}
										placeholder='Select Item'
										isDisabled={loading}
										isLoading={loading}
										name={`${itemName}[${index}].item_name_object`}
										onChange={newValue => {
											handleItemName(newValue, index);
										}}
										value={row.item_name_object}
										onCreateOption={inputValue => {
											const newITem = {
												value: `ci-+${index}`,
												label: inputValue,
												price: 0,
												custom_item: true,
											};
											handleItemName(newITem, index);
											// setFieldValue(`${itemName}.${index}.item_name_object`, newITem);
											setItemOptions(prev => [...prev, newITem]);
										}}
										options={itemOptions}
										styles={{
											control: provided => ({
												...provided,
												fontFamily: 'Roboto',
												fontSize: '16px',
												height: '40px',
												marginBottom: '4px',
												borderColor:
													touched?.items?.[index]?.[itemNameKey] &&
													errors?.items?.[index]?.[itemNameKey]
														? '#d32f2f'
														: 'rgba(0, 0, 0, 0.2)',
											}),
											option: baseStyles => ({
												...baseStyles,
												fontFamily: 'Roboto',
												fontSize: '16px',
											}),
										}}
									/>
									<ErrorMessage
										message={errors?.items?.[index]?.[itemNameKey]}
										touched={touched?.items?.[index]?.[itemNameKey]}
									/>
								</Grid>

								{/* Quantity */}

								<Grid item xs={1.8}>
									<FormField
										key={index}
										fullWidth
										name={`${itemName}[${index}].quantity`}
										value={row.quantity}
										handleChange={e => {
											setFieldValue(
												`${itemName}[${index}].quantity`,
												e.target.value
											);
											setFieldValue(
												`${itemName}[${index}].total`,
												(values.items[index].rate || 0) * Number(e.target.value)
											);
										}}
										type='number'
										error={errors?.items?.[index]?.quantity}
										isTouched={touched.items?.[index]?.quantity}
									/>
								</Grid>

								{/* Rate */}
								<Grid item xs={1.8}>
									<FormField
										key={index}
										type='number'
										placeholder='0'
										fullWidth
										name={`${itemName}[${index}].rate`}
										value={row.rate}
										isTouched={touched.items?.[index]?.rate}
										error={errors?.items?.[index]?.rate}
										handleChange={e => {
											handleChange(e);
											setFieldValue(
												`${itemName}[${index}].total`,
												(values.items[index].quantity || 0) *
													Number(e.target.value)
											);
										}}
									/>
								</Grid>

								{/* Tax */}
								<Grid item xs={2}>
									<CustomSelect
										key={index}
										placeholder='Select Tax'
										name={`${itemName}[${index}].tax`}
										value={row.tax}
										// getOptionLabel={option => `${option.name}`}
										isOptionSelected={option =>
											values.items[index].tax.id === option.id ? true : false
										}
										onChange={newValue => {
											// Check if the newValue is not the "button" option
											if (newValue.value !== 'Add Modal Button') {
												setFieldValue(`${itemName}.${index}.tax`, newValue);
												setFieldValue(
													`${itemName}.${index}.tax_id`,
													newValue.id
												);
												setFieldValue(
													`${itemName}.${index}.tax_amount`,
													newValue.rate
												);
											}
										}}
										isSearchable
										options={[
											...texValues,
											{
												label: (
													<>
														<Divider style={{ marginBottom: '5px' }} />
														<MUIButton
															onClick={() => setIsNewTaxModalOpen(true)}
															size='small'
															startIcon={<AddIcon />}
														>
															New Tax
														</MUIButton>
													</>
												),
												// name:'Something else',
												isDisabled: true,
												value: 'Add Modal Button',
											},
										]}
										styles={{ ...selectStyle }}
										touched={touched?.items?.[index]?.tax}
										error={
											touched?.items?.[index]?.tax &&
											errors?.items?.[index]?.tax
										}
									/>
								</Grid>

								{/* Amount */}

								<Grid item xs={1} display='flex' justifyContent='flex-start'>
									<InputLabel sx={{ mt: 1, ml: 2 }}>
										$
										{!isNaN(values.items[index]?.rate)
											? (
													values.items[index].quantity *
													values.items[index]?.rate
											  )?.toFixed(2)
											: 0}
									</InputLabel>
								</Grid>

								{/* Actions */}
								<Grid item xs={0.5} display='flex' justifyContent='center'>
									<Box mt={1}>
										<DeleteIcon
											style={{ cursor: 'pointer' }}
											color='primary'
											onClick={() => {
												if (shapedValues.length === 1) {
													return;
												}

												arrayHelpers.remove(index);
											}}
											fontSize='small'
										/>
									</Box>
								</Grid>

								<Grid item xs={12} mt={1} mb={3}>
									<Divider />
								</Grid>
							</Grid>
						))}

						<Grid item xs={12} my={2} mt={0}>
							<MUIButton
								onClick={() =>
									arrayHelpers.push({
										[itemNameKey]: '',
										item_id: '',
										quantity: 1,

										amount: 0,
										rate: 0,
										customer_details: '',
										tax_amount: customerTax?.rate || 0,
										tax_id: taxId,
										tax: customerTax
											? {
													name: customerTax.name,
													label: customerTax.name,
													id: customerTax.id,
													tax_id: customerTax.id,
													rate: customerTax?.rate || 0,
											  }
											: {
													label: 'Non-Taxable',
													name: 'Non-Taxable',
													id: 1,
													tax_id: 1,
													rate: 0,
											  },
										total: 0,
									})
								}
								endIcon={<AddIcon />}
							>
								Add row
							</MUIButton>
						</Grid>
					</>
				)}
			/>

			<Grid
				container
				sx={{ marginY: '2rem' }}
				display='flex'
				justifyContent='flex-end'
			>
				<Grid item xs={12} md={6}>
					<Paper
						elevation={1}
						sx={{
							display: 'flex',
							'& > :not(style)': {
								p: 3,
								paddingTop: 3,
								paddingBottom: 3,
								backgroundColor: '#F5F5F5',
								borderRadius: 2,
							},
						}}
					>
						<Grid container rowSpacing={2}>
							{/* Sub Total */}
							<Grid item xs={12} display='flex' justifyContent='space-between'>
								<Grid item xs={4}>
									<InputLabel variant='body2' sx={{ fontSize: 16 }}>
										Sub Total
									</InputLabel>
								</Grid>
								<Grid item xs={4} display='flex' justifyContent='flex-end'>
									<InputLabel sx={{ fontSize: 16 }} variant='body2'>
										$
										{isNaN(Number(subTotal?.toFixed(2)))
											? '0.00'
											: subTotal?.toFixed(2)}
									</InputLabel>
								</Grid>
							</Grid>

							{/* Discount */}
							<Grid item xs={12} display='flex' justifyContent='space-between'>
								<Grid item xs={3}>
									<InputLabel sx={{ fontSize: 16 }} variant='body2'>
										Discount
									</InputLabel>
								</Grid>
								<Grid item xs={5} display='flex' justifyContent='space-between'>
									<Stack direction='row' spacing={2}>
										<Box sx={{ width: '100%' }}>
											<FormField
												type='number'
												name='discount'
												value={values.discount || ''}
												handleChange={handleChange}
												placeholder='0'
												variant='outlined'
												error={errors.discount}
												isTouched={!!touched.discount}
												sx={{ backgroundColor: '#FFFFFF' }}
											/>
										</Box>
										<Select
											sx={{ width: '100px', height: '40px' }}
											name='discount_type'
											value={values.discount_type}
											onChange={handleChange}
										>
											{DISCOUNT_TYPE.map(item => (
												<MenuItem key={item.text} value={item.value}>
													{item.text}
												</MenuItem>
											))}
										</Select>
									</Stack>
								</Grid>
								<Grid item xs={3} display='flex' justifyContent='flex-end'>
									<InputLabel sx={{ fontSize: 16 }} variant='body2'>
										${discountCalculate()}
									</InputLabel>
								</Grid>
							</Grid>

							{labelValueMap &&
								Object.entries(labelValueMap).map(([label, value], index) =>
									label !== undefined && value !== 0 && value !== 'NaN' ? (
										<Grid
											item
											xs={12}
											display='flex'
											justifyContent='space-between'
											key={index}
										>
											<Grid item xs={4}>
												<InputLabel sx={{ fontSize: 16 }} variant='body2'>
													{label}
												</InputLabel>
											</Grid>
											<Grid item xs={4}></Grid>
											<Grid
												item
												xs={4}
												display='flex'
												justifyContent='flex-end'
											>
												<InputLabel sx={{ fontSize: 16 }} variant='body2'>
													$ {labelToTaxAmountMap[label]?.toFixed(2)}
												</InputLabel>
											</Grid>
										</Grid>
									) : (
										''
									)
								)}

							{/* Adjustment */}
							<Grid item xs={12} display='flex' justifyContent='space-between'>
								<Grid item xs={3}>
									<InputLabel sx={{ fontSize: 16 }} variant='body2'>
										Adjustment
									</InputLabel>
								</Grid>
								<Grid item xs={5} display='flex' justifyContent='space-between'>
									<Stack alignItems={'center'} direction='row' spacing={2}>
										<Box sx={{ width: '100%' }}>
											<FormField
												type='number'
												name='adjustment'
												fullWidth
												value={values.adjustment || ''}
												placeholder='0'
												handleChange={handleChange}
												sx={{ backgroundColor: '#FFFFFF' }}
												error={errors.adjustment}
												isTouched={!!touched.adjustment}
											/>
										</Box>
										<Box sx={{ width: '100px' }}>
											<HoverPopover
												iconSize={25}
												text='Add any other +ve or -ve charges that need to be applied to adjust the total amount of the transaction Eg. +10 or -10.'
											/>
										</Box>
									</Stack>
								</Grid>

								<Grid item xs={3} display='flex' justifyContent='flex-end'>
									<InputLabel sx={{ fontSize: 16 }} variant='body2'>
										${' '}
										{isGreaterThanZero(values.adjustment)
											? parseFloat(values.adjustment)?.toFixed(2)
											: '0.00'}
									</InputLabel>
								</Grid>
							</Grid>
							{/* Total */}
							<Grid item xs={12} display='flex' justifyContent='space-between'>
								<FieldTitle
									sx={{ fontSize: 16 }}
									variant='body2'
									fontWeight={700}
								>
									Total ( $ )
								</FieldTitle>
								<FieldTitle sx={{ fontSize: 16 }} fontWeight={700}>
									$
									{isNaN(Number(total?.toFixed(2)))
										? '0.00'
										: total?.toFixed(2)}
								</FieldTitle>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Grid>
			<NewTaxModal
				setIsNewTaxAdded={setIsNewTaxAdded}
				open={isNewTaxModalOpen}
				onClose={() => setIsNewTaxModalOpen(false)}
				newTax={isNewTaxAdded}
			/>
		</>
	);
};

export default BillsAddItem;
