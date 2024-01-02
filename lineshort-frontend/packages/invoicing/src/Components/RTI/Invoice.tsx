import {
	Box,
	Divider,
	Grid,
	Paper,
	Stack,
	Table,
	TableBody,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Logo from '../../assets/Rti.png';
// import { convertDateToLongFormat } from '@/utils/helper';
import { TableBodyCell, TableHeadCell } from '@/Components/Table/Table';
import {
	Calculation,
	Column,
	InvoiceInfo,
	RTIInvoicePDFInput,
} from './PDFComponents';

const tableHeaders = ['No', 'Quantity', 'Weight(Ib)', 'Item Name', 'Amount'];

export default function RTInvoice({ data, onChange, isEdit }) {
	const [subTotal, setSubTotal] = useState(data?.sub_total || 0);

	const calculateSubTotal = () => {
		const itemSum = data?.invoice_items?.reduce(
			(accumulator, currentValue) =>
				accumulator + Number(currentValue.total || 0),
			0
		);

		if (itemSum !== subTotal) setSubTotal(itemSum);
	};

	const deductTenPercentFromSubTotal = (total: number): number => {
		let totalLocal = 0;
		if (typeof total !== 'number' || isNaN(total)) {
			totalLocal = 0;
		} else {
			totalLocal = total;
		}

		return (10 / 100) * totalLocal;
	};

	const calculateTotal = () => {
		console.log(data);
		if (!subTotal && !data?.discount) return 0;
		const subTotalAfterTax =
			Number(subTotal) - Number(deductTenPercentFromSubTotal(Number(subTotal)));
		return subTotalAfterTax - Number(data?.discount);
	};

	useEffect(() => {
		calculateSubTotal();
	}, [JSON.stringify(data?.invoice_items)]);

	useEffect(() => {
		const total = calculateTotal();
		onChange(total, 'total');
	}, [subTotal, data?.discount]);

	return (
		<Paper
			sx={{
				border: '.5px solid grey',
				margin: '2rem 0',
				position: 'relative',
			}}
		>
			<Box sx={{ padding: '1.4rem' }}>
				<Grid item container mt={2}>
					<Grid item xs={12}>
						<Stack
							direction='row'
							justifyContent='space-between'
							alignItems='center'
							spacing={1}
						>
							<img
								src={data?.logo || Logo}
								alt='logo'
								style={{ padding: 0, margin: 0 }}
							/>
							<Box
								sx={{
									width: '200px',
								}}
							>
								<Typography
									variant='templateHead'
									fontSize='2.5rem'
									letterSpacing={-1.5}
								>
									INVOICE
								</Typography>
								<InvoiceInfo name='Bol #' value={data?.bol_number} />
								<InvoiceInfo name='Invoice Date' value={data?.invoice_date} />
								<InvoiceInfo name='Invoice #' value={data?.invoice_number} />
							</Box>
						</Stack>
					</Grid>

					<Grid item sm={12} mt={5}>
						<Grid container spacing={2} mb={2} item>
							<Column take={2} name='Company Name' value={data?.company_name} />
							<Column take={4} name='Address' value={data?.company_address} />
							<Column take={2} name='Phone' value={data?.company_phone} />
						</Grid>
						<Divider />
						<Column
							sx={{ mt: 2 }}
							take={6}
							name='Sold To'
							value={'Lexi Renarje 1525 99th LN NE Blaine, MN 23897'}
						/>
					</Grid>
				</Grid>

				<Grid item container mt={4} p={0}>
					<Grid sm={12}>
						<TableContainer>
							<Table sx={{ minWidth: 650 }} aria-label='simple table'>
								<TableHead
									sx={{
										bgcolor: '#000000',
										height: '56px',
									}}
								>
									<TableRow>
										{tableHeaders.map(header => (
											<TableHeadCell
												width={header === 'Amount' ? 'auto' : '120'}
												align={header === 'Amount' ? 'right' : 'left'}
												key={header}
												sx={{ padding: '6px 16px', color: '#FFFFFF' }}
											>
												<Typography variant='body2Bold'>{header}</Typography>
											</TableHeadCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{data?.invoice_items?.length ? (
										data?.invoice_items.map((item, index) => {
											return (
												<TableRow
													key={index}
													sx={{
														'&:last-child td, &:last-child th': { border: 0 },
													}}
												>
													<RTITableBodyCell value={index + 1} />
													<RTITableBodyCell value={item.quantity} />
													<RTITableBodyCell value={item.weight} />
													<RTITableBodyCell value={item.item_name} />
													{isEdit ? (
														<TableBodyCell
															sx={{ p: '2px', pr: '2px' }}
															component='th'
															scope='row'
														>
															<RTIInvoicePDFInput
																onChange={e => onChange(e, index)}
																value={item.total}
															/>
														</TableBodyCell>
													) : (
														<RTITableBodyCell right value={item.total} />
													)}
												</TableRow>
											);
										})
									) : (
										<TableRow>
											<TableBodyCell align='center' colSpan={10}>
												No Data Found
											</TableBodyCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
				</Grid>

				<Box width='100%' my={4}>
					<Grid item container justifyContent={'flex-end'}>
						<Grid item sm={12} display='flex' justifyContent='end'>
							<Calculation name='Sub Total'>
								${Number(subTotal || 0)?.toFixed(2)}
							</Calculation>
						</Grid>

						<Grid item sm={12} display='flex' justifyContent='end'>
							<Calculation name='Tax 10%'>
								${deductTenPercentFromSubTotal(Number(subTotal || 0))}
							</Calculation>
						</Grid>
						<Grid item sm={12} display='flex' justifyContent='end'>
							<Calculation bold name='Discount'>
								{isEdit ? (
									<RTIInvoicePDFInput
										value={data?.discount}
										onChange={e => onChange(e, 'discount')}
										width={110}
									/>
								) : (
									`$${data?.discount || 0}`
								)}
							</Calculation>
						</Grid>
						<Grid item sm={12} display='flex' justifyContent='end'>
							<Calculation border={false} bold name='Total'>
								${calculateTotal() || '0.00'}
							</Calculation>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Paper>
	);
}

const RTITableBodyCell = ({ right = false, value }) => {
	return (
		<TableBodyCell sx={{ pr: '2px' }} component='th' scope='row'>
			<Typography
				pr={right ? '14px' : ''}
				textAlign={right ? 'right' : 'left'}
				variant='body2'
			>
				{value}
			</Typography>
		</TableBodyCell>
	);
};
