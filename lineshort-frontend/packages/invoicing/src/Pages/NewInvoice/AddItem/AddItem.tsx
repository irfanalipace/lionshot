import { useState, useEffect, useCallback } from 'react';
import Select from '@mui/material/Select';
import {
	Box,
	Grid,
	Typography,
	Paper,
	styled,
	CircularProgress,
	Stack,
	MenuItem,
} from '@mui/material';
import useResponsiveStyles from './useResponsiveStyles';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import InputLabel from '@/Components/InputLabel/InputLabel';
import HoverPopover from '@/Components/HoverPopover/ErrorOutlinePopover';
import AddIcon from '@mui/icons-material/Add';
import CreatableSelect from 'react-select/creatable';
import FormField from '@/Components/InputField/FormField';
import { default as ReactSelect } from 'react-select';
import { getAllItems } from '@/apis/items';
import { getTaxesApi } from '@/apis/customer';
import React from 'react';
import MUIButton from '@/Components/MUIButton';
import { FieldArray } from 'formik';
import ErrorMessage from '@/Components/ErrorMessage';
import { calculateSubtotal, isGreaterThanZero } from '@/utils/helper';

const createOption = label => ({
	label,
	value: label.toLowerCase().replace(/\W/g, ''),
});

const selectStyle = {
	control: provided => ({
		...provided,
		fontFamily: 'Roboto',
		fontSize: '16px',
	}),
	option: baseStyles => ({
		...baseStyles,
		fontFamily: 'Roboto',
		fontSize: '16px',
	}),
};

// eslint-disable-next-line react-refresh/only-export-components
const AddRowTitle = styled(Typography)(() => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	margin: '1rem 1rem 1rem 1rem',
	fontWeight: '500',
}));

interface FieldTitleProps {
	fontWeight?: number;
}

// eslint-disable-next-line react-refresh/only-export-components
const FieldTitle = styled(Typography)<FieldTitleProps>(props => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	margin: '1rem 0 .4rem 0',
	fontFamily: 'Roboto',
	fontWeight: props.fontWeight || 400,
}));

const AddItem = ({
	formiks,
	loading,
	isEdit,
	customerTax,
	taxIdCustomer,
}: any) => {
	const { values, setFieldValue, handleChange, errors, touched } = formiks;
	const [itemOptions, setItemOptions] = useState([]);

	const [isItemLoading, setIsItemLoading] = useState([]);

	const [texValues, setTexValues] = useState([]);
	const [total, setTotal] = useState<number>(0);
	const [subTotal, setSubTotal] = useState<number>(0);

	const labelValueMap = values?.invoice_items.reduce((map, taxValue) => {
		//taxValue?.label !== "Non Taxable"
		if (taxValue.tax?.id !== 1 && taxValue.tax?.id) {
			if (!map[taxValue.tax?.name]) {
				map[taxValue.tax?.name] = taxValue.tax?.id;
			}
		}
		console.log(map);
		return map;
	}, {});
	console.log('🚀 ~ file: AddItem.tsx:100 ~ labelValueMap:', labelValueMap);

	const labelToTaxAmountMap = values?.invoice_items.reduce(
		(map, invoice, index) => {
			if (invoice.tax?.id !== 1) {
				if (!map[invoice.tax?.name]) {
					map[invoice.tax?.name] = 0;
				}
				map[invoice.tax?.name] += (invoice?.total * invoice.tax?.rate) / 100;
			}
			console.log(map);

			return map;
		},
		{}
	);

	const DISCOUNT_TYPE = [
		{
			value: 'Percentage',
			text: '%',
		},
		{
			value: 'Dollar',
			text: '$',
		},
	];

	const taxInclusiveOption_ = [
		{
			value: 'tax_inclusive',
			text: 'Tax Inclusive',
		},
		{
			value: 'tax_exclusive',
			text: 'Tax Exclusive',
		},
	];

	useEffect(() => {
		const invoice_items_copy = values.invoice_items;
		if (customerTax && !isEdit) {
			invoice_items_copy.forEach(item => {
				if (!item.tax || !item.item_name) {
					item.tax = {
						name: customerTax.name,
						id: customerTax.id,
						rate: customerTax?.rate,
					};
				}
				setFieldValue('invoice_items', invoice_items_copy);
			});
		} else {
			invoice_items_copy.forEach(item => {
				item.tax = {
					name: 'Non-Taxable',
					id: 1,
					rate: 0,
				};

				setFieldValue('invoice_items', invoice_items_copy);
			});
		}
	}, [taxIdCustomer]);

	useEffect(() => {
		// invoice?.total * invoice.tax?.rate
		calculateSubtotal(values.invoice_items);

		// console.log(values);
		// debugger;
		// const taAamount = values.invoice_items?.reduce(
		// 	(accumulator: number, currentValue: any) =>
		// 		(accumulator = currentValue?.tax.rate + values.total / 100),

		// 	0
		// );
		// setFieldValue('tax_amount', taAamount);
		// console.log({ taAamount });
	}, [values.invoice_items]);

	const handleCreate = (inputValue, rowIndex) => {
		setIsItemLoading(prevIsLoading => {
			const newIsLoading = [...prevIsLoading];
			newIsLoading[rowIndex] = true;
			return newIsLoading;
		});

		setTimeout(() => {
			const newOption: any = createOption(inputValue);
			setIsItemLoading(prevIsLoading => {
				const newIsLoading = [...prevIsLoading];
				newIsLoading[rowIndex] = false;
				return newIsLoading;
			});

			const newITem = {
				value: '',
				label: newOption.label,
				price: 0,
			};
			setItemOptions(prev => [...prev, newITem]);
		}, 1000);
	};

	useEffect(() => {
		const res = calculateSubtotal(values.invoice_items);
		setSubTotal(res);
		if (values.sub_total !== res) {
			setFieldValue('sub_total', res);
		}
	}, [JSON.stringify(values.invoice_items)]);

	const calculateTotal = useCallback(() => {
		const subtotal = calculateSubtotal(values.invoice_items);

		let total = subtotal;
		if (values.items_rates_are === 'tax_exclusive') {
			for (const label in labelToTaxAmountMap) {
				total += labelToTaxAmountMap[label];
			}
		}

		const taxAmount = total - subTotal;
		setFieldValue('tax_amount', taxAmount || 0);

		let discount = 0;
		if (values.discount_type === 'Percentage') {
			discount = (subtotal * values.discount) / 100;
		} else if (values.discount_type === 'Dollar') {
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

		return total;
	}, [values]);

	useEffect(() => {
		const res = calculateTotal();
		setTotal(res);
	}, [values]);

	useEffect(() => {
		const respTax = getTaxesApi();
		respTax
			.then((data: any) => {
				const repsTax = data.data;
				setTexValues(repsTax);
			})
			.catch(error => {
				console.error(error.message);
			});

		const resp = getAllItems({});
		resp
			.then((data: any) => {
				const reps = data.data.data;

				const updatedOptions = reps.map(({ id, title, selling_price }) => ({
					value: id,
					label: title,
					price: selling_price,
				}));
				setItemOptions(updatedOptions);
			})
			.catch(error => {
				console.error(error.message);
			});
	}, []);

	const handleItemName = (e: any, index: number) => {
		setFieldValue(`invoice_items.${index}.item_name_object`, e);
		setFieldValue(`invoice_items.${index}.item_name`, e.label);
		setFieldValue(`invoice_items.${index}.item_id`, e.value);
		setFieldValue(
			`invoice_items[${index}].rate`,
			isNaN(e.price) ? 0 : e.price * values.invoice_items[index].quantity
		);

		setFieldValue(`invoice_items[${index}].quantity`, 1);
		console.log(values);
		setFieldValue(
			`invoice_items[${index}].total`,
			(e.price || 0) * values.invoice_items[index].quantity
		);
	};

	const discountCalculate = useCallback(() => {
		return values.discount_type === 'Percentage'
			? isNaN((calculateSubtotal(values.invoice_items) * values.discount) / 100)
				? '0.00'
				: `-${(
						(calculateSubtotal(values.invoice_items) * values.discount) /
						100
				  ).toFixed(2)}`
			: isNaN(values.discount) || values.discount === ''
			? '0.00'
			: `-${values?.discount.toFixed(2)}`;
	}, [
		values.discount_type,
		values.discount,
		JSON.stringify(values.invoice_items),
	]);

	console.log('Invoice Add Item Component Render', formiks);

	return (
		<>
			<Grid item container>
				{/* Items Rates Are */}
				<Grid
					item
					xs={12}
					sx={{ mb: 2 }}
					display='flex'
					justifyContent='flex-start'
				>
					<Grid item xs={2} display='flex' alignItems='center'>
						<InputLabel>Item Rates Are</InputLabel>
					</Grid>
					<Grid item xs={4}>
						<FormField
							loading={loading}
							name='items_rates_are'
							type={'select'}
							value={values.items_rates_are}
							onChange={handleChange}
							options={taxInclusiveOption_}
							fullWidth
							fontSize='16px'
						/>
					</Grid>
				</Grid>
				<Grid item xs={12} mt={1} mb={3}>
					<Divider />
				</Grid>
				<Grid item xs={3}>
					<AddRowTitle>Item Details</AddRowTitle>
				</Grid>

				<Grid item xs={2.25}>
					<AddRowTitle>Quantity</AddRowTitle>
				</Grid>

				<Grid item xs={2.25}>
					<AddRowTitle>Rate</AddRowTitle>
				</Grid>

				<Grid item xs={3}>
					<AddRowTitle>Tax</AddRowTitle>
				</Grid>

				<Grid item xs={1} display='flex' justifyContent='flex-start'>
					<AddRowTitle>Amount</AddRowTitle>
				</Grid>

				<Grid item xs={0.5} display='flex' justifyContent='center'>
					<AddRowTitle sx={{ textAlign: 'center' }}>Actions</AddRowTitle>
				</Grid>

				<Grid item xs={12} mt={0} mb={3}>
					<Divider />
				</Grid>

				{isEdit && !values.invoice_items.length ? (
					<Grid
						item
						xs={12}
						sx={{ mb: 2 }}
						display='flex'
						justifyContent='center'
					>
						{/* Show laoder of any text while items or laoding form api */}
					</Grid>
				) : (
					<FieldArray
						name='invoice_items'
						render={arrayHelpers => (
							<>
								{values.invoice_items?.map((row, index) => (
									<Grid container columnSpacing={6} key={index}>
										{/* Item Details */}
										<Grid item xs={3}>
											<CreatableSelect
												key={index}
												placeholder='Select Item'
												isDisabled={loading}
												isLoading={loading}
												name={`invoice_items[${index}].item_name_object`}
												onChange={e => handleItemName(e, index)}
												value={values.invoice_items[index].item_name_object}
												onCreateOption={inputValue => {
													const val = texValues.find(
														item => item.id === row?.tax.id
													);

													setFieldValue(`invoice_items.${index}.tax`, val);
													handleCreate(inputValue, index);
												}}
												options={itemOptions}
												styles={{ ...selectStyle }}
											/>
											<ErrorMessage
												message={errors?.invoice_items?.[index]?.item_name}
												touched={touched?.invoice_items?.[index]?.item_name}
											/>
										</Grid>

										{/* Quantity */}

										<Grid item xs={2.25}>
											<FormField
												loading={loading}
												key={index}
												fullWidth
												name={`invoice_items[${index}].quantity`}
												value={~~values.invoice_items[index].quantity}
												onChange={e => {
													setFieldValue(
														`invoice_items[${index}].quantity`,
														e.target.value
													);
													setFieldValue(
														`invoice_items[${index}].total`,
														(values.invoice_items[index].rate || 0) *
															Number(e.target.value)
													);
												}}
												type='number'
												error={errors.invoice_items?.[index]?.quantity}
												isTouched={touched.invoice_items?.[index]?.quantity}
											/>
										</Grid>

										{/* Rate */}
										<Grid item xs={2.25}>
											<FormField
												loading={loading}
												key={index}
												type='number'
												fullWidth
												name={`invoice_items[${index}].rate`}
												value={values.invoice_items[index].rate}
												isTouched={touched.invoice_items?.[index]?.rate}
												error={errors.invoice_items?.[index]?.rate}
												onChange={e => {
													handleChange(e);
													setFieldValue(
														`invoice_items[${index}].total`,
														(values.invoice_items[index].quantity || 0) *
															Number(e.target.value)
													);
												}}
											/>
										</Grid>

										{/* Tax */}
										<Grid item xs={3}>
											<ReactSelect
												key={index}
												placeholder='Select Tax'
												name={`invoice_items[${index}].tax`}
												value={values.invoice_items[index].tax}
												getOptionLabel={option => `${option.name}`}
												isOptionSelected={option =>
													values.invoice_items[index].tax.id === option.id
														? true
														: false
												}
												onChange={e => {
													setFieldValue(`invoice_items.${index}.tax`, e);
													setFieldValue(`invoice_items.${index}.tax_id`, e.id);
													setFieldValue(
														`invoice_items.${index}.tax_amount`,
														e.rate
													);
												}}
												isSearchable
												options={[
													// eslint-disable-next-line no-unsafe-optional-chaining
													...texValues,
												]}
												styles={{ ...selectStyle }}
											/>
											<ErrorMessage
												message={errors?.invoice_items?.[index]?.tax}
												touched={touched?.invoice_items?.[index]?.tax}
											/>
										</Grid>

										{/* Amount */}

										<Grid
											item
											xs={1}
											display='flex'
											justifyContent='flex-start'
										>
											<InputLabel sx={{ mt: 1, ml: 2 }}>
												$
												{!isNaN(values.invoice_items[index]?.rate)
													? values.invoice_items[index].quantity *
													  values.invoice_items[index]?.rate
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
														if (values.invoice_items.length === 1) {
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
												item_name: '',
												item_id: '',
												quantity: 1,
												item_rate: 0,
												amount: 0,
												rate: 0,
												tax_amount: customerTax?.rate || 0,
												tax_id: taxIdCustomer || 1,
												tax: customerTax
													? {
															name: customerTax.name,
															id: customerTax.id,
															rate: customerTax?.rate || 0,
													  }
													: '',
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
				)}
			</Grid>

			<Grid
				container
				sx={{ marginY: '2rem' }}
				display='flex'
				justifyContent='flex-end'
			>
				<Grid item xs={12} md={5}></Grid>
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
								<Grid item xs={4}>
									<InputLabel sx={{ fontSize: 16 }} variant='body2'>
										Discount
									</InputLabel>
								</Grid>
								<Grid item xs={4} display='flex' justifyContent='space-between'>
									<Stack direction='row' spacing={2}>
										<Box sx={{ width: '100%' }}>
											<FormField
												loading={loading}
												type='number'
												name='discount'
												value={values.discount || ''}
												onChange={handleChange}
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
								<Grid item xs={4} display='flex' justifyContent='flex-end'>
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

							{/* Shipping Charges */}
							<Grid
								item
								xs={12}
								display='flex'
								justifyContent='space-between'
								alignItems='center'
							>
								<Grid item xs={4}>
									<InputLabel sx={{ fontSize: 16 }} variant='body2'>
										Shipping Charges
									</InputLabel>
								</Grid>
								<Grid item xs={4} display='flex' justifyContent='space-between'>
									<Stack alignItems={'center'} direction='row' spacing={2}>
										<Box sx={{ width: '100%' }}>
											<FormField
												loading={loading}
												type='number'
												name='shipping_charges'
												fullWidth
												placeholder='0'
												value={values.shipping_charges || ''}
												onChange={handleChange}
												sx={{ backgroundColor: '#FFFFFF' }}
												error={errors.shipping_charges}
												isTouched={!!touched.shipping_charges}
											/>
										</Box>
										<Box sx={{ width: '100px' }}>
											<HoverPopover text='Amount spent on shipping the goods' />
										</Box>
									</Stack>
								</Grid>
								<Grid item xs={4} display='flex' justifyContent='flex-end'>
									<InputLabel sx={{ fontSize: 16 }} variant='body2'>
										${' '}
										{isGreaterThanZero(values.shipping_charges)
											? values.shipping_charges
											: '0.00'}
									</InputLabel>
								</Grid>
							</Grid>
							{/* Adjustment */}
							<Grid item xs={12} display='flex' justifyContent='space-between'>
								<Grid item xs={4}>
									<InputLabel sx={{ fontSize: 16 }} variant='body2'>
										Adjustment
									</InputLabel>
								</Grid>
								<Grid item xs={4} display='flex' justifyContent='space-between'>
									<Stack alignItems={'center'} direction='row' spacing={2}>
										<Box sx={{ width: '100%' }}>
											<FormField
												loading={loading}
												type='number'
												name='adjustment'
												fullWidth
												value={values.adjustment || ''}
												placeholder='0'
												onChange={handleChange}
												sx={{ backgroundColor: '#FFFFFF' }}
												error={errors.adjustment}
												isTouched={!!touched.adjustment}
											/>
										</Box>
										<Box sx={{ width: '100px' }}>
											<HoverPopover text='Add any other +ve or -ve charges that need to be applied to adjust the total amount of the transaction Eg. +10 or -10.' />
										</Box>
									</Stack>
								</Grid>

								<Grid item xs={4} display='flex' justifyContent='flex-end'>
									<InputLabel sx={{ fontSize: 16 }} variant='body2'>
										${' '}
										{isGreaterThanZero(values.adjustment)
											? values.adjustment
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
		</>
	);
};

export default React.memo(AddItem, (prevProps, nextProps) => {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});

// export default AddItem;
