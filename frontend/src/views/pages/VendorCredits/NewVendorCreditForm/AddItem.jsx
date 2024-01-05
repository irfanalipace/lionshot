import React, { useState, useEffect } from 'react';
import {
	Grid,
	Typography,
	Paper,
	styled,
	CircularProgress,
	Checkbox,
	InputAdornment,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import CreatableSelect from 'react-select/creatable';
import FormField from '../../../Components/InputField/FormField';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import useResponsiveStyles from '../../CreditMemo/AddItem/useResponsiveStyles';

const AddRowTitle = styled(Typography)(() => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	margin: '1rem 1rem 1rem 1rem',
	fontWeight: '500',
}));

export const FieldTitle = styled(Typography)(({ fontWeight }) => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	margin: '1rem 0 .4rem 0',
	fontFamily: 'Roboto',
	fontWeight: fontWeight || 400,
}));

const areEqual = (prevProps, nextProps) => {
	// Compare relevant props to decide whether to re-render
	//	console.log('prevProps,', prevProps, ' nextProps', nextProps);
	return (
		prevProps.clicked === nextProps.clicked &&
		prevProps.isEdit === nextProps.isEdit &&
		prevProps.formik.submitCount === nextProps.formik.submitCount &&
		prevProps.formik.isValid === nextProps.formik.isValid &&
		prevProps.formik.values.vendor_id === nextProps.formik.values.vendor_id &&
		prevProps.loading === nextProps.loading &&
		prevProps.loading === nextProps.loading &&
		prevProps.venderCreditState === nextProps.venderCreditState &&
		prevProps.bill_Item === nextProps.bill_Item
	);
};

const AddItem = React.memo(
	({
		initialValues,
		formik,
		isEdit,
		venderCreditState,
		bill_Item,
		loading,
		setLoading,
	}) => {
		const [values, setValues] = useState(initialValues?.vendor_credit_items);
		const [valuesIsCheckedTrue, setValuesIsCheckedTrue] = useState([]);
		const [fixedDiscountAmount, setFixedDiscountAmount] = useState(0);
		const [searchText, setSearchText] = useState('');
		const [searchResults, setSearchResults] = useState([]);
		const [totalTaxAmount, setTotalTaxAmount] = useState(0);
		const [subTotal, setSubTotal] = useState(0);
		const [total_, setTotal_] = useState(0);

		useEffect(() => {
			if (formik?.values?.bill_id !== '') {
				let newTotalTaxAmount = 0;
				let totalDiscount = 0;
				console.log('values', values);
				const selectedItems = values?.filter(item => item.isChecked);
				selectedItems?.forEach(item => {
					const taxPercentage = (item.tax_amount / item.quantity) * 100;
					const newTaxAmount = (item.quantity * taxPercentage) / 100;
					newTotalTaxAmount += newTaxAmount;

					const discount = parseFloat(item.discount_per_item);
					if (!isNaN(discount)) {
						totalDiscount += discount;
					}
				});
				setFixedDiscountAmount(totalDiscount.toFixed(2));
				if (isNaN(newTotalTaxAmount)) {
					newTotalTaxAmount = 0;
				}
				setTotalTaxAmount(newTotalTaxAmount);

				var subTotal_ = selectedItems?.reduce(
					(sum, value) => sum + value.amount,
					0
				);
				subTotal_ = !isNaN(subTotal_)
					? parseFloat(subTotal_ ?? 0)?.toFixed(2)
					: 0 || 0;
				setSubTotal(subTotal_);
			}
			if (values.length == 0) {
				setLoading(true);

				var updatedItems = initialValues?.vendor_credit_items.map(
					(item, index) => {
						const quantity = parseFloat(item.quantity);
						const rate = parseFloat(item.rate);
						const amount = quantity * rate;

						return index === 0
							? { ...item, amount, isChecked: true }
							: { ...item, amount };
					}
				);

				setValues(updatedItems);
				setLoading(false);
			}
		}, [values]);

		useEffect(() => {
			var total;
			if (subTotal === 0) {
				total = 0;
			} else {
				const adjustment = parseFloat(venderCreditState?.adjustment);
				const taxAmount = parseFloat(totalTaxAmount);
				// Add checks to ensure non-NaN values
				const validAdjustment = Number.isNaN(adjustment) ? 0 : adjustment;
				const validTaxAmount = Number.isNaN(taxAmount) ? 0 : taxAmount;
				// if (isNaN(newTotalTaxAmount)) {
				// 	newTotalTaxAmount = 0;
				// }
				total =
					parseFloat(subTotal) +
					validAdjustment +
					validTaxAmount -
					fixedDiscountAmount;
			}
			total = parseFloat(total).toFixed(2);
			// Ensure total is not negative
			total = Math.max(total, 0);
			setTotal_(total);
		}, [subTotal, totalTaxAmount, fixedDiscountAmount]);

		useEffect(() => {
			handleNumberChange(initialValues.discount);
		}, [initialValues?.discount]);

		useEffect(() => {
			// console.log('venderCreditState .isEdit', isEdit);
			// console.log(
			// 	'venderCreditState .venderCreditState,',
			// 	venderCreditState,
			// 	bill_Item
			// );
			var discount_per_item;
			if (venderCreditState?.discount_type !== null) {
				const totle_item = isEdit
					? venderCreditState?.vendor_credit_items &&
					  venderCreditState?.vendor_credit_items.length
					: venderCreditState?.bill_item && venderCreditState?.bill_item.length;
				// console.log(
				// 	'venderCreditState .venderCreditState, bill_Item totole item',
				// 	totle_item
				// );
				if (venderCreditState?.discount_type === 'percent') {
					//	if (venderCreditState?.discount_type === 'Percentage') {
					var discount =
						(venderCreditState?.sub_total * venderCreditState?.discount) / 100;
					discount = !isNaN(discount)
						? parseFloat(discount ?? 0)?.toFixed(2)
						: 0 || 0;
						var discountAmount = !isNaN(venderCreditState?.discount_amount)
						? parseFloat(venderCreditState?.discount_amount ?? 0)?.toFixed(2)
						: 0 || 0;
						// console.log("discountAmount",discountAmount)

					discount_per_item =isEdit? discountAmount / totle_item :discount / totle_item;
				} else if (venderCreditState?.discount_type === 'dollar') {
					// } else if (venderCreditState?.discount_type === 'Dollar') {
					discount_per_item = venderCreditState?.discount / totle_item;
				}
				discount_per_item = parseFloat(discount_per_item ?? 0)?.toFixed(2);
			} else {
				setFixedDiscountAmount(0);
			}
			if (isEdit === true) {
				handleNumberChange(venderCreditState?.discount);

				// console.log(
				// 	'venderCreditState-- bill_Item',
				// 	bill_Item,
				// 	venderCreditState.vendor_credit_items
				// );
				if (
					bill_Item.length !== 0 &&
					venderCreditState?.vendor_credit_items !== 0
				) {
					setLoading(true);
					const updatedState = bill_Item.map(billItem => {
						const matchingVendorCredit =
							venderCreditState?.vendor_credit_items.find(
								creditItem => creditItem.bill_item_id === billItem.id
							);

						if (matchingVendorCredit) {
							// If there's a matching vender credit, set isChecked to true
							const updatedTotal =
								parseFloat(matchingVendorCredit.quantity) *
								parseFloat(matchingVendorCredit.rate);

							return {
								...matchingVendorCredit,
								amount: updatedTotal,
								isChecked: true,
								discount_per_item: discount_per_item,
							};
						} else {
							// If no matching Vendor Credit, add a new item with isChecked set to false
							const updatedTotal =
								parseFloat(billItem.quantity) * parseFloat(billItem.rate);

							return {
								...billItem,
								amount: updatedTotal,
								discount_per_item: discount_per_item,
								isChecked: false,
							};
						}
					});
					// console.log('discount_per_item', discount_per_item);
					setValues(updatedState);
					setLoading(false);
				}
			} else {
				handleNumberChange(venderCreditState?.discount);
				setLoading(true);

				if (formik?.values?.bill_id !== '') {
					const updatedItems =
						venderCreditState?.bill_item &&
						venderCreditState?.bill_item?.map(item => {
							const quantity = parseFloat(item.quantity);
							const rate = parseFloat(item.rate);
							const amount = quantity * rate;
							const bill_Quantity = quantity;
							return {
								...item,
								amount,
								bill_Quantity,
								isChecked: true,
								discount_per_item: discount_per_item,
							};
						});
					setValues(updatedItems);
					setLoading(false);
				} else {
					setLoading(true);

					var updatedItems = initialValues?.vendor_credit_items.map(
						(item, index) => {
							const quantity = parseFloat(item.quantity);
							const rate = parseFloat(item.rate);
							const amount = quantity * rate;

							return index === 0
								? { ...item, amount, isChecked: true }
								: { ...item, amount };
						}
					);

					setValues(updatedItems);
					setLoading(false);
				}
			}
		}, [venderCreditState, bill_Item]);

		const handleNumberChange = event => {
			var newValue;
			if (typeof event === 'number' && !(newValue < 0)) {
				newValue = parseFloat(event);
			} else if (typeof event === 'object') {
				newValue = parseFloat(event?.target?.value);
			}
			if (Number.isNaN(newValue)) newValue = 0;
		};

		useEffect(() => {
			if (
				formik?.errors &&
				typeof formik?.errors === 'object' &&
				formik?.errors !== null
			) {
				const updatedInvoiceItemss = values.map(item => {
					const matchingItem = valuesIsCheckedTrue.find(
						checkedItem => checkedItem.id === item.id
					);
					const errorMessage = matchingItem
						? formik.errors[
								`vendor_credit_items.${valuesIsCheckedTrue.indexOf(
									matchingItem
								)}`
						  ]
						: '';
					console.log('values updatedInvoiceItemss values item', item);

					return { ...item, ErrorMessage: errorMessage };
				});
				console.log('values updatedInvoiceItemss values', updatedInvoiceItemss);

				setValues(updatedInvoiceItemss);
			}
		}, [formik?.errors]);

		const { submitCount, isValid, values: formikValues } = formik;

		useEffect(() => {
			if (submitCount > 0 && isValid) {
				console.log(
					'submitCount, isValid, values: formikValues',
					submitCount,
					isValid,
					formikValues
				);
				formik.setFieldValue(`sub_total`, subTotal);
				// formik.setFieldValue(`discount`, fixedDiscountAmount);
				formik.setFieldValue(`discount_amount`, fixedDiscountAmount);
				formik.setFieldValue(`discount_type`, venderCreditState?.discount_type);
				formik.setFieldValue(
					`shipping_charges`,
					venderCreditState?.shipping_charges
				);

				formik.setFieldValue(`adjustment`, venderCreditState?.adjustment);
				console.log('total_', total_);
				formik.setFieldValue(`total`, total_);
				formik.setFieldValue(
					`tax_amount`,
					!isNaN(totalTaxAmount)
						? parseFloat(totalTaxAmount ?? 0)?.toFixed(2)
						: 0 || 0
				);
				const filteredItems = values.filter(item => item.isChecked === true);
				setValuesIsCheckedTrue(filteredItems);

				filteredItems.forEach((item, index) => {
					const updateFieldValues = () => {
						formik.setFieldValue(`vendor_credit_items.${index}.id`, item?.id);
						console.log('item_id.. ', item?.item_id);
						if (item?.item_id === null) {
							formik.setFieldValue(
								`vendor_credit_items.${index}.item_id`,
								'null'
							);
						} else {
							formik.setFieldValue(
								`vendor_credit_items.${index}.item_id`,
								item?.item_id
							);
						}
						formik.setFieldValue(
							`vendor_credit_items.${index}.item_name`,
							item?.item_name
						);

						if (item.quantity !== undefined && item.quantity !== null) {
							formik.setFieldValue(
								`vendor_credit_items.${index}.quantity`,
								item.quantity
							);
						}
						if (item.rate !== undefined && item.rate !== null) {
							formik.setFieldValue(
								`vendor_credit_items.${index}.rate`,
								item.rate
							);
						}
						if (item.amount !== undefined && item.amount !== null) {
							formik.setFieldValue(
								`vendor_credit_items.${index}.total`,
								!isNaN(item?.amount)
									? parseFloat(item?.amount ?? 0)?.toFixed(2)
									: 0 || 0
							);
						}
						formik.setFieldValue(
							`vendor_credit_items.${index}.tax_id`,
							item?.tax_id
						);
					};
					updateFieldValues();
				});
			}
		}, [submitCount, isValid, formikValues]);

		const handleIsChecked = (itemId, index) => {
			if (values[0]?.item_name === 'Type or click to select an item') {
				setValues(prevItems => {
					return prevItems.map(item => {
						if (item.id === itemId) {
							return { ...item, isChecked: false };
						}
						return item;
					});
				});
			} else {
				setValues(prevItems => {
					const updatedItems = prevItems.map(item => {
						if (item.id === itemId) {
							return { ...item, isChecked: !item.isChecked };
						}
						return item;
					});

					//	Remove the item from the array if isChecked is true
					const removedItems = updatedItems.filter(item => item.isChecked);
					//	console.log('removedItems', removedItems,
					//		formik.values);
					//	Update the formik field with the modified array
					formik.setFieldValue('vendor_credit_items', removedItems);

					return updatedItems;
				});

				setSearchResults(prevItems => {
					return prevItems.map(item => {
						if (item.id === itemId) {
							return { ...item, isChecked: !item.isChecked };
						}
						return item;
					});
				});
			}
		};

		// Create an onChange function to handle changes to the input value
		const handleSearchInputChange = event => {
			const searchQuery = event.target.value;
			setSearchText(searchQuery);

			if (!searchQuery) {
				// Clear search results if the search query is empty
				setSearchResults([]);
				return;
			}

			// Filter items based on the searchQuery
			const filteredItems = values
				.map((item, index) => ({ ...item, index }))
				.filter(item =>
					item.item_name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
				);
			setSearchResults(filteredItems);
		};

		let itemsToMap =
			formik?.values?.bill_id === ''
				? initialValues?.vendor_credit_items
				: searchResults?.length > 0
				? searchResults
				: values;
		// below useEffect will remove
		return (
			<>
				<Grid item container>
					<Grid item xs={12} mt={1} mb={3}>
						<Divider />
					</Grid>
					<Grid item container mb={2} display='flex' justifyContent='flex-end'>
						<Grid item xs={4}>
							<FormField
								InputProps={{
									readOnly: false,
									value: searchText,
									endAdornment: (
										<InputAdornment position='end'>
											<SearchIcon />
										</InputAdornment>
									),
								}}
								handleChange={handleSearchInputChange}
								placeholder='Search Item'
							/>
						</Grid>
					</Grid>
					<Grid item xs={3}>
						<AddRowTitle>Item Details</AddRowTitle>
					</Grid>

					<Grid item xs={2.25}>
						<AddRowTitle>Quantity</AddRowTitle>
					</Grid>

					<Grid item xs={2.25}>
						<AddRowTitle>Amount</AddRowTitle>
					</Grid>

					<Grid item xs={3}>
						<AddRowTitle>Tax</AddRowTitle>
					</Grid>

					<Grid item xs={1.5}>
						<AddRowTitle>Discount</AddRowTitle>
					</Grid>
					<Grid item xs={12} mt={0} mb={3}>
						<Divider />
					</Grid>
					{/* {allUncheckedError && (
						<InputLabel
							sx={{ marginLeft: '3.5%' }}
							variant='caption'
							color='error'
							className='Mui-error'
						>
							Please select at least one item.
						</InputLabel>
					)} */}
					{formik.errors.vendor_credit_items && (
						<InputLabel
							sx={{ marginLeft: '3.5%', marginTop: '0.5rem' }}
							variant='caption'
							color='error'
							className='Mui-error'
						>
							{formik.errors.vendor_credit_items}
						</InputLabel>
					)}
					{/* <ErrorMessage name="vendor_credit_items" component="div" className="error-message" /> */}

					{/* ///////////  Table ///////////*/}
					{loading || itemsToMap.length == 0 ? (
						<Grid
							item
							xs={12}
							sx={{ mb: 2 }}
							display='flex'
							justifyContent='center'
						>
							<CircularProgress />
						</Grid>
					) : (
						itemsToMap?.map((row, index) => (
							<Grid container columnSpacing={1} key={index}>
								{/* Item Details */}
								<Grid item xs={0.4}>
									<Checkbox
										checked={row.isChecked == undefined ? true : row.isChecked}
										onChange={() => handleIsChecked(row.id, index)}
									/>
								</Grid>
								<Grid item xs={2.6}>
									<CreatableSelect
										key={index}
										defaultValue={null}
										//  isDisabled={row.isChecked}
										isDisabled={true}
										value={{
											label: row?.item_name,
											//         value: row?.item_id,
										}}
										// Apply font family through style attribute
										styles={{
											control: provided => ({
												...provided,
												fontFamily: 'Roboto',
												fontSize: '14px',
											}),
											option: baseStyles => ({
												...baseStyles,
												fontFamily: 'Roboto',
											}),
										}}
									/>
									<InputLabel variant='caption' color='error'>
										{values && values[index]?.ErrorMessage}
									</InputLabel>
								</Grid>
								{/* Quantity */}
								<Grid item xs={2.25}>
									<FormField
										key={index}
										fullWidth
										type='number'
										disabled={!row.isChecked}
										value={values[index]?.quantity}
										onBlur={e => {
											const event = e.target.value;
											if (event == '') {
												const newQuantity = 1;
												setValues(prevValues => {
													const updatedValues = [...prevValues];
													updatedValues[index].quantity = newQuantity;
													updatedValues[index].amount =
														newQuantity * updatedValues[index].rate;
													return updatedValues;
												});
											}
										}}
										onChange={event => {
											const newQuantity = parseInt(event.target.value);
											if (!isNaN(newQuantity) && !(newQuantity < 1)) {
												// Calculate new tax based on the tax percentage and new quantity
												const taxPercentage =
													(row.tax_amount / row.quantity) * 100;
												const newTaxAmount =
													(newQuantity * taxPercentage) / 100;
												// Update the tax_amount and quantity for the specific item
												const updatedValues = [...values];
												updatedValues[index].amount =
													newQuantity * updatedValues[index].rate;
												updatedValues[index] = {
													...row,
													quantity: newQuantity,
													tax_amount: newTaxAmount,
												};
												setValues(updatedValues);
											}
										}}
									/>
									<InputLabel variant='caption' color='error'>
										{(values && values[index]?.ErrorMessage === undefined) ||
											(values[index]?.ErrorMessage === '' &&
												//	values[index]?.ErrorMessage == '' &&
												values[index]?.bill_Quantity <
													values[index]?.quantity &&
												`Last Quantity : ${values[index]?.bill_Quantity}`)}
									</InputLabel>
								</Grid>

								{/* Rate */}
								<Grid item xs={2.25}>
									<FormField
										key={index}
										type='number'
										//	disabled={!row.isChecked}
										disabled={true}
										fullWidth
										value={values[index].rate}
										onBlur={e => {
											const event = e.target.value;
											if (event == '') {
												const newRate = 0;
												setValues(prevValues => {
													const updatedValues = [...prevValues];
													updatedValues[index].rate = newRate;
													updatedValues[index].amount =
														newRate * updatedValues[index].quantity;
													return updatedValues;
												});
											}
										}}
										onChange={event => {
											const newRate = parseFloat(event.target.value).toFixed(2);
											if (!(newRate < 0)) {
												setValues(prevValues => {
													const updatedValues = [...prevValues];
													updatedValues[index].rate = newRate;
													updatedValues[index].amount =
														newRate * updatedValues[index].quantity;
													return updatedValues;
												});
											}
										}}
									/>
								</Grid>
								{/* Tax */}
								<Grid item xs={3}>
									<InputLabel mt={1} ml={2}>
										{!isNaN(row?.tax_amount)
											? parseFloat(row?.tax_amount).toFixed(2)
											: 0 || 0}
									</InputLabel>
								</Grid>
								<Grid item xs={1.5}>
									<InputLabel mt={1} ml={2}>
										{!isNaN(row?.discount_per_item)
											? parseFloat(row?.discount_per_item).toFixed(2)
											: 0 || 0}
									</InputLabel>
								</Grid>
								<Grid item xs={12} mt={1} mb={3}>
									<Divider />
								</Grid>
							</Grid>
						))
					)}
					{/*//////////// Table End ///////////// */}
				</Grid>

				{/*//////////// Sub Total Div ////////////*/}

				<Grid
					container
					sx={{ marginTop: '2rem' }}
					display='flex'
					justifyContent='flex-end'
				>
					<Grid item xs={12} md={5}></Grid>
					<Grid item xs={12} md={7}>
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
							<Grid container>
								{/* Sub Total */}
								<Grid
									item
									xs={12}
									display='flex'
									justifyContent='space-between'
								>
									<Grid item xs={4}>
										<InputLabel variant='body2'>Sub Total</InputLabel>
									</Grid>
									<Grid item xs={4}></Grid>
									<Grid item xs={4} display='flex' justifyContent='flex-end'>
										<InputLabel variant='body2'>{subTotal || 0}</InputLabel>
									</Grid>
								</Grid>

								{/* Discount */}
								<Grid
									item
									xs={12}
									display='flex'
									justifyContent='space-between'
									sx={{ marginTop: '1rem' }}
								>
									<Grid item xs={4}>
										<InputLabel variant='body2'>Discount</InputLabel>
									</Grid>
									<Grid item xs={4} display='flex' justifyContent='flex-end'>
										<InputLabel variant='body2'>
											{!isNaN(fixedDiscountAmount)
												? fixedDiscountAmount
												: 0 || 0}
										</InputLabel>
									</Grid>
								</Grid>
								{/* Tax */}
								<Grid
									item
									xs={12}
									display='flex'
									justifyContent='space-between'
									sx={{ marginTop: '1rem' }}
								>
									<Grid item xs={4}>
										<InputLabel variant='body2'>Tax</InputLabel>
									</Grid>

									<Grid item xs={4} display='flex' justifyContent='flex-end'>
										<InputLabel variant='body2'>
											{!isNaN(totalTaxAmount)
												? parseFloat(totalTaxAmount ?? 0)?.toFixed(2)
												: 0 || 0}
										</InputLabel>
									</Grid>
								</Grid>

								{/* Shipping Charges */}
								{/* <Grid
									item
									xs={12}
									display='flex'
									justifyContent='space-between'
									sx={{ marginTop: '1rem' }}
								>
									<Grid item xs={4}>
										<InputLabel variant='body2'>Shipping Charges</InputLabel>
									</Grid>

									<Grid item xs={4} display='flex' justifyContent='flex-end'>
										<InputLabel variant='body2'>
											{(formik?.values?.bill_id !== '' &&
												venderCreditState?.shipping_charges) ||
												0}
										</InputLabel>
									</Grid>
								</Grid> */}
								{/* Adjustment */}
								<Grid
									item
									xs={12}
									display='flex'
									justifyContent='space-between'
									sx={{ marginTop: '1rem' }}
								>
									<Grid item xs={4}>
										<InputLabel variant='body2'>Adjustment</InputLabel>
									</Grid>

									<Grid item xs={4} display='flex' justifyContent='flex-end'>
										<InputLabel variant='body2'>
											{(formik?.values?.bill_id !== '' &&
												venderCreditState?.adjustment) ||
												0}
										</InputLabel>
									</Grid>
								</Grid>
								{/* Total */}
								<Grid
									item
									xs={12}
									display='flex'
									justifyContent='space-between'
									sx={{ marginTop: '1rem' }}
								>
									<FieldTitle variant='body2' fontWeight={700}>
										Total ( $ )
									</FieldTitle>
									<FieldTitle fontWeight={700}>
										{!isNaN(total_) ? total_ : 0 || 0}
									</FieldTitle>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</>
		);
	},
	areEqual
);

export default AddItem;
