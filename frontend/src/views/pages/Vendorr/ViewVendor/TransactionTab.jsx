import { useState, useEffect } from 'react';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	CircularProgress,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';
import {
	HeaderMenuButton,
	StyledListbox,
	StyledMenuItem,
} from '../VendorStylesConst';
import Box from '@mui/system/Box';
import useTheme from '@mui/system/useTheme';

import {
	AddCircle,
	// FilterAlt,
	KeyboardArrowDown,
	KeyboardArrowRight,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
	StatusColor,
	formatDate,
	generateEncryptedID,
	// snakeCaseToPrettyText,
} from '../../../../core/utils/helpers';
import { getVendorTransactions } from '../../../../core/api/vendor';
import GridRow from '../../../Components/GridRow/GridRow';
import { Link } from 'react-router-dom';

function TransactionTab({ vendorID }) {
	const theme = useTheme();
	const navigate = useNavigate();
	const [expanded, setExpanded] = useState('');
	const [transactionKey, setTransactionKey] = useState();
	const [transactionData, setTransactionData] = useState();
	const [loading, setLoading] = useState();
	const transactionsParams = {
		vendor_id: vendorID,
		search: transactionKey,
	};
	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			if (
				[
					'purchaseOrders', // purchase_order will replace with purchase-order key
					'bills', // this key will replace with bill key
					'accountPayables', // this key will replace with bill-payment key
					'vendorCredits', // this key will replace with vendor-credit key
				].includes(transactionKey)
			) {
				try {
					const transactions = await getVendorTransactions(transactionsParams);
					console.log('transactions', transactions?.data[0]);
					setTransactionData(transactions?.data);
				} catch (error) {
					console.error('Error fetching transactions:', error);
				}
			}
			setLoading(false);
		}
		fetchData();
	}, [transactionKey]);
	const handleChangeAcc = panel => (event, newExpanded) => {
		console.log('tabpanel', panel);
		setExpanded(newExpanded ? panel : false);
		if (newExpanded && panel === 'purchaseOrderTab')
			setTransactionKey('purchaseOrders');
		else if (newExpanded && panel === 'billsTab') setTransactionKey('bills');
		else if (newExpanded && panel === 'billPaymentTab')
			setTransactionKey('accountPayables');
		else if (newExpanded && panel === 'invoiceTab')
			setTransactionKey('invoices');
		else if (newExpanded && panel === 'VendorCreditTab')
			setTransactionKey('vendorCredits');
		else {
			setTransactionKey('');
		}
	};
	return (
		<Box>
			<Dropdown>
				<HeaderMenuButton
					onClick={e => e.stopPropagation()}
					style={{
						backgroundColor: 'transparent',
						marginBottom: '20px',
					}}
				>
					<Typography variant='body1' sx={{ fontSize: '18px' }}>
						Go to transactions
						<KeyboardArrowDown
							color='primary'
							sx={{ fontSize: '20px', marginBottom: '-3px' }}
						/>
					</Typography>
				</HeaderMenuButton>
				<Menu slots={{ listbox: StyledListbox }}>
					<StyledMenuItem
						onClick={() => {
							setExpanded('purchaseOrderTab');
							setTransactionKey('purchaseOrders');
						}}
					>
						Purchase Order
					</StyledMenuItem>
					<StyledMenuItem
						onClick={() => {
							setExpanded('billsTab');
							setTransactionKey('bills');
						}}
					>
						Bills
					</StyledMenuItem>
					<StyledMenuItem
						onClick={() => {
							setExpanded('billPaymentTab');
							setTransactionKey('accountPayables');
						}}
					>
						Account Payable
					</StyledMenuItem>
					<StyledMenuItem
						onClick={() => {
							setExpanded('VendorCreditTab');
							setTransactionKey('vendorCredits');
						}}
					>
						Vendor Credit
					</StyledMenuItem>
				</Menu>
			</Dropdown>
			{/* Purchase Order Accordion */}
			<Accordion
				expanded={expanded === 'purchaseOrderTab'}
				onChange={handleChangeAcc('purchaseOrderTab')}
				sx={{ marginTop: '20px' }}
			>
				<AccordionSummary
					aria-controls='panel4d-content'
					id='panel4d-header'
					sx={TransactionAccordion}
					expandIcon={<KeyboardArrowRight sx={{ color: '#408DFB' }} />}
				>
					<Typography>Purchase Orders</Typography>
					<IconButton
						sx={{
							position: 'absolute',
							right: '40px',
							marginTop: '-8px',
						}}
						onClick={e => {
							e.stopPropagation();
							navigate(
								`/purchase-orders/new?vendorId=${generateEncryptedID(vendorID)}`
							);
						}}
					>
						<AddCircle color='primary' sx={{ fontSize: '15px' }} />
						<Typography variant='body2' color='black'>
							Add New
						</Typography>
					</IconButton>
				</AccordionSummary>
				{loading ? (
					<Box sx={{ textAlign: 'center' }}>
						<CircularProgress />
					</Box>
				) : (
					<AccordionDetails>
						{transactionData?.length > 0 &&
						transactionData[0]?.purchase_orders?.length > 0 ? (
							<>
								<GridRow style={{ paddingBottom: '8px' }}>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Date</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Purchase Order#</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Vendor Name</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Status</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Billed Status</Typography>
									</Grid>
									<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Amount</Typography>
									</Grid>
									<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Status</Typography>
									</Grid>
								</GridRow>
								{transactionData[0]?.purchase_orders?.map(purchase_order => (
									<GridRow
										style={{ paddingBottom: '8px' }}
										key={purchase_order?.id}
									>
										<Grid item xs={1.7}>
											<Typography variant='body2'>
												{formatDate(purchase_order?.purchase_order_date)}
											</Typography>
										</Grid>
										<Grid item xs={1.7}>
											<Typography variant='body2'>
												<Link
													style={{
														color: window.themeColors.primary,
														textDecoration: 'auto',
													}}
													to={`/purchase-orders#/${generateEncryptedID(
														purchase_order?.id
													)}`}
												>
													{purchase_order?.purchase_order_number}
												</Link>
											</Typography>
										</Grid>
										<Grid item xs={1.7}>
											<Typography variant='body2'>
												{transactionData[0]?.display_name}
											</Typography>
										</Grid>
										<Grid
											item
											xs={1.7}
											sx={{
												color: StatusColor(purchase_order?.status, theme),
											}}
											className='TextCapitalize'
										>
											<Typography variant='body2'>
												{purchase_order?.status}
											</Typography>
										</Grid>
										<Grid
											item
											xs={1.7}
											sx={{
												color: StatusColor(purchase_order?.status, theme),
											}}
											className='TextCapitalize'
										>
											<Typography variant='body2'>
												{purchase_order?.bill_status}
											</Typography>
										</Grid>
										<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
											<Typography variant='body2'>
												$ {purchase_order?.total}
											</Typography>
										</Grid>
										<Grid
											item
											xs={1.7}
											sx={{
												textAlign: 'right',
											}}
										>
											<Typography variant='body2'>
												{formatDate(purchase_order?.expected_delivery_date)}
											</Typography>
										</Grid>
									</GridRow>
								))}
							</>
						) : (
							<Box sx={{ textAlign: 'center' }}>
								<Typography variant='body2Grey'>
									There are no Purchase Orders
									<Typography
										component={'span'}
										color='primary'
										fontSize='small'
										sx={{ cursor: 'pointer' }}
										onClick={e => {
											e.stopPropagation();
											navigate(
												`/purchase-orders/new?vendorId=${generateEncryptedID(
													vendorID
												)}`
											);
										}}
									>
										- Add New
									</Typography>
								</Typography>
							</Box>
						)}
					</AccordionDetails>
				)}
			</Accordion>
			{/* Bills Accordion */}
			<Accordion
				expanded={expanded === 'billsTab'}
				onChange={handleChangeAcc('billsTab')}
				sx={{ marginTop: '20px' }}
			>
				<AccordionSummary
					aria-controls='billsTabd-content'
					id='billsTabd-header'
					sx={TransactionAccordion}
					expandIcon={<KeyboardArrowRight sx={{ color: '#408DFB' }} />}
				>
					<Typography>Bills</Typography>
					{/* <IconButton
						sx={{
							position: 'absolute',
							right: '40px',
							marginTop: '-8px',
						}}
						onClick={e => {
							e.stopPropagation();
							navigate(`/bills/new?vendorId=${generateEncryptedID(vendorID)}`);
						}}
					>
						<AddCircle color='primary' sx={{ fontSize: '15px' }} />
						<Typography variant='body2' color='black'>
							Add New
						</Typography>
					</IconButton> */}
				</AccordionSummary>
				{loading ? (
					<Box sx={{ textAlign: 'center' }}>
						<CircularProgress />
					</Box>
				) : (
					<AccordionDetails>
						{transactionData?.length > 0 &&
						transactionData[0]?.bills?.length > 0 ? (
							<>
								<GridRow style={{ paddingBottom: '8px' }}>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Date</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Bill#</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Vendor Name</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Status</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Due Date</Typography>
									</Grid>
									<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Amount</Typography>
									</Grid>
									<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Balance Due</Typography>
									</Grid>
								</GridRow>
								{transactionData[0]?.bills?.map(bill => (
									<GridRow style={{ paddingBottom: '8px' }} key={bill?.id}>
										<Grid item xs={1.7}>
											<Typography variant='body2'>
												{formatDate(bill?.bill_date)}
											</Typography>
										</Grid>
										<Grid item xs={1.7}>
											<Typography variant='body2'>
												<Link
													style={{
														color: window.themeColors.primary,
														textDecoration: 'auto',
													}}
													to={`/bills#/${generateEncryptedID(bill?.id)}`}
												>
													{bill?.bill_number}
												</Link>
											</Typography>
										</Grid>
										<Grid item xs={1.7}>
											<Typography variant='body2'>
												{transactionData[0]?.display_name}
											</Typography>
										</Grid>
										<Grid
											item
											xs={1.7}
											sx={{
												color: StatusColor(bill?.status, theme),
											}}
											className='TextCapitalize'
										>
											<Typography variant='body2'>
												{bill?.status || 'unpaid'}
											</Typography>
										</Grid>

										<Grid item xs={1.7}>
											<Typography variant='body2'>
												{formatDate(bill?.due_date)}
											</Typography>
										</Grid>

										<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
											<Typography variant='body2'>$ {bill?.total}</Typography>
										</Grid>
										<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
											<Typography variant='body2'>
												{' '}
												$ {bill?.due_amount}
											</Typography>
										</Grid>
									</GridRow>
								))}
							</>
						) : (
							<Box sx={{ textAlign: 'center' }}>
								<Typography variant='body2Grey'>
									There are no Bills
									{/* <Typography
										component={'span'}
										color='primary'
										fontSize='small'
										sx={{ cursor: 'pointer' }}
										onClick={e => {
											e.stopPropagation();
											navigate(
												`/bills/new?vendorId=${generateEncryptedID(vendorID)}`
											);
										}}
									>
										- Add New
									</Typography> */}
								</Typography>
							</Box>
						)}
					</AccordionDetails>
				)}
			</Accordion>
			{/* Account Payable Accordion */}
			<Accordion
				expanded={expanded === 'billPaymentTab'}
				onChange={handleChangeAcc('billPaymentTab')}
				sx={{ marginTop: '20px' }}
			>
				<AccordionSummary
					aria-controls='panel3d-content'
					id='panel3d-header'
					sx={TransactionAccordion}
					expandIcon={<KeyboardArrowRight sx={{ color: '#408DFB' }} />}
				>
					<Typography>Account Payable</Typography>
					<Dropdown>
						<HeaderMenuButton
							onClick={e => e.stopPropagation()}
							style={{
								position: 'absolute',
								right: '150px',
								marginTop: '-3px',
								backgroundColor: 'transparent',
							}}
						></HeaderMenuButton>
						<Menu slots={{ listbox: StyledListbox }}>
							<StyledMenuItem> All</StyledMenuItem>
							<StyledMenuItem> Draft</StyledMenuItem>
							<StyledMenuItem> Client View</StyledMenuItem>
							<StyledMenuItem> Partially Paid</StyledMenuItem>
							<StyledMenuItem> Unpaid</StyledMenuItem>
							<StyledMenuItem> Paid</StyledMenuItem>
							<StyledMenuItem> Void</StyledMenuItem>
						</Menu>
					</Dropdown>
					<IconButton
						sx={{
							position: 'absolute',
							right: '40px',
							marginTop: '-8px',
						}}
						onClick={e => {
							e.stopPropagation();
							navigate(
								`/account-payable/new?vendorId=${generateEncryptedID(vendorID)}`
							);
						}}
					>
						<AddCircle color='primary' sx={{ fontSize: '15px' }} />
						<Typography variant='body2' color='black'>
							Add New
						</Typography>
					</IconButton>
				</AccordionSummary>
				{loading ? (
					<Box sx={{ textAlign: 'center' }}>
						<CircularProgress />
					</Box>
				) : (
					<AccordionDetails>
						{transactionData?.length > 0 &&
						transactionData[0]?.account_payables?.length > 0 ? (
							<>
								<GridRow style={{ paddingBottom: '8px' }}>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Date</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Bill#</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Vendor Name</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Status</Typography>
									</Grid>
									<Grid item xs={1.7}>
										<Typography variant='body2'>Due Date</Typography>
									</Grid>
									<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Amount</Typography>
									</Grid>
									<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Balance Due</Typography>
									</Grid>
								</GridRow>
								{transactionData[0]?.account_payables?.map(account_payable => (
									<GridRow
										style={{ paddingBottom: '8px' }}
										key={account_payable?.id}
									>
										<Grid item xs={1.7}>
											<Typography variant='body2'>
												{formatDate(account_payable?.payment_date)}
											</Typography>
										</Grid>
										<Grid item xs={1.7}>
											<Typography variant='body2'>
												<Link
													style={{
														color: window.themeColors.primary,
														textDecoration: 'auto',
													}}
													to={`/account-payable#/${generateEncryptedID(
														account_payable?.id
													)}`}
												>
													{
														account_payable?.account_payable_paid_bills[0]?.bill
															?.bill_number
													}
												</Link>
											</Typography>
										</Grid>
										<Grid item xs={1.7}>
											<Typography variant='body2'>
												{transactionData[0]?.display_name}
											</Typography>
										</Grid>
										<Grid item xs={1.7}>
											<Typography
												variant='body2'
												sx={{
													color: StatusColor(
														account_payable?.account_payable_paid_bills[0]?.bill
															?.status,
														theme
													),
													textTransform: 'capitalize',
												}}
											>
												{
													account_payable?.account_payable_paid_bills[0]?.bill
														?.status
												}
											</Typography>
										</Grid>
										<Grid item xs={1.7}>
											<Typography variant='body2'>
												{formatDate(
													account_payable?.account_payable_paid_bills[0]?.bill
														?.due_date
												)}
											</Typography>
										</Grid>
										<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
											<Typography variant='body2'>
												${' '}
												{
													account_payable?.account_payable_paid_bills[0]?.bill
														?.total
												}
											</Typography>
										</Grid>
										<Grid item xs={1.7} sx={{ textAlign: 'right' }}>
											<Typography variant='body2'>
												${' '}
												{
													account_payable?.account_payable_paid_bills[0]?.bill
														?.due_amount
												}
											</Typography>
										</Grid>
									</GridRow>
								))}
							</>
						) : (
							<Box sx={{ textAlign: 'center' }}>
								<Typography variant='body2Grey'>
									There is no Account Payable
									<Typography
										component={'span'}
										color='primary'
										fontSize='small'
										sx={{ cursor: 'pointer' }}
										onClick={e => {
											e.stopPropagation();
											navigate(
												`/account-payable/new?vendorId=${generateEncryptedID(
													vendorID
												)}`
											);
										}}
									>
										- Add New
									</Typography>
								</Typography>
							</Box>
						)}
					</AccordionDetails>
				)}
			</Accordion>
			{/* Vendor Credit Accordion */}
			<Accordion
				expanded={expanded === 'VendorCreditTab'}
				onChange={handleChangeAcc('VendorCreditTab')}
				sx={{ marginTop: '20px' }}
			>
				<AccordionSummary
					aria-controls='panel9d-content'
					id='panel9d-header'
					sx={TransactionAccordion}
					expandIcon={<KeyboardArrowRight sx={{ color: '#408DFB' }} />}
				>
					<Typography>Vendor Credit</Typography>
					<IconButton
						sx={{
							position: 'absolute',
							right: '40px',
							marginTop: '-8px',
						}}
						onClick={e => {
							e.stopPropagation();
							navigate(
								`/vendor-credits/new?vendorId=${generateEncryptedID(vendorID)}`
							);
						}}
					>
						<AddCircle color='primary' sx={{ fontSize: '15px' }} />
						<Typography variant='body2' color='black'>
							Add New
						</Typography>
					</IconButton>
				</AccordionSummary>
				{loading ? (
					<Box sx={{ textAlign: 'center' }}>
						<CircularProgress />
					</Box>
				) : (
					<AccordionDetails>
						{transactionData?.length > 0 &&
						transactionData[0]?.vendor_credits?.length >= 0 ? (
							<>
								<GridRow style={{ paddingBottom: '8px' }}>
									<Grid item xs>
										<Typography variant='body2'>Date</Typography>
									</Grid>
									<Grid item xs>
										<Typography variant='body2'>Vendor Credits</Typography>
									</Grid>
									<Grid item xs>
										<Typography variant='body2'>Vendor Name</Typography>
									</Grid>
									<Grid item xs>
										<Typography variant='body2'>Status</Typography>
									</Grid>
									<Grid item xs>
										<Typography variant='body2'>Bill#</Typography>
									</Grid>
									<Grid item xs sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Amount</Typography>
									</Grid>
									{/* <Grid item xs={1.7} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Balance</Typography>
									</Grid> */}
								</GridRow>
								{transactionData[0]?.vendor_credits?.map(vendor_credit => (
									<GridRow
										style={{ paddingBottom: '8px' }}
										key={vendor_credit?.id}
									>
										<Grid item xs>
											<Typography variant='body2'>
												{formatDate(vendor_credit?.vendor_credit_date)}
											</Typography>
										</Grid>
										<Grid item xs>
											<Typography variant='body2'>
												<Link
													style={{
														color: window.themeColors.primary,
														textDecoration: 'auto',
													}}
													to={`/vendor-credits#/${generateEncryptedID(
														vendor_credit?.id
													)}`}
												>
													{vendor_credit?.vendor_credit_number}
												</Link>
											</Typography>
										</Grid>
										<Grid item xs>
											<Typography variant='body2'>
												{transactionData[0]?.display_name}
											</Typography>
										</Grid>
										<Grid item xs>
											<Typography
												variant='body2'
												sx={{
													color: StatusColor('draft', theme),
													textTransform: 'capitalize',
												}}
											>
												{vendor_credit?.status}
											</Typography>
										</Grid>
										<Grid item xs>
											<Typography variant='body2'>
												{vendor_credit?.bill?.bill_number}
											</Typography>
										</Grid>
										<Grid item xs sx={{ textAlign: 'right' }}>
											<Typography variant='body2'>
												$ {vendor_credit?.total}
											</Typography>
										</Grid>
										{/* <Grid item xs={1.7} sx={{ textAlign: 'right' }}>
											<Typography variant='body2'>
												$ {vendor_credit?.due_balance}
											</Typography>
										</Grid> */}
									</GridRow>
								))}
							</>
						) : (
							<Box sx={{ textAlign: 'center' }}>
								<Typography variant='body2Grey'>
									There are no Vendor Credits
									<Typography
										component={'span'}
										color='primary'
										fontSize='small'
										sx={{ cursor: 'pointer' }}
										onClick={e => {
											e.stopPropagation();
											navigate(
												`/vendor-credits/new?vendorId=${generateEncryptedID(
													vendorID
												)}`
											);
										}}
									>
										- Add New
									</Typography>
								</Typography>
							</Box>
						)}
					</AccordionDetails>
				)}
			</Accordion>
		</Box>
	);
}
const TransactionAccordion = {
	backgroundColor: '#E4F2FE',
	color: 'black',
	flexDirection: 'row-reverse',
	'& .MuiAccordionSummary-content': {
		'.MuiTypography-root': {
			fontSize: '15px',
			fontWeight: '500',
		},
	},
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(90deg)',
	},
};
export default TransactionTab;
