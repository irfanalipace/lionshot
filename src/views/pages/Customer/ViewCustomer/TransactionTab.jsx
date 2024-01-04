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
} from '../CustomerStylesConst';
import { Box, useTheme } from '@mui/system';
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
	snakeCaseToPrettyText,
} from '../../../../core/utils/helpers';
import { getCustomerTransactions } from '../../../../core/api/customer';
import GridRow from '../../../Components/GridRow/GridRow';
import { Link } from 'react-router-dom';

function TransactionTab({ customerID }) {
	const theme = useTheme();
	const navigate = useNavigate();
	const [expanded, setExpanded] = useState('');
	const [transactionKey, setTransactionKey] = useState();
	const [transactionData, setTransactionData] = useState();
	const [loading, setLoading] = useState();
	const transactionsParams = {
		customer_id: customerID,
		search: transactionKey,
	};
	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			if (
				[
					'invoices',
					'estimate',
					'paymentLinks',
					'saleOrder',
					'PaymentReceive',
					'creditMemo',
				].includes(transactionKey)
			) {
				try {
					const transactions = await getCustomerTransactions(
						transactionsParams
					);
					console.log('transactions', transactions?.data);
					setTransactionData(transactions?.data);
					// setLoading(false);
				} catch (error) {
					console.error('Error fetching transactions:', error);
					// setLoading(false);
				}
			}
			setLoading(false);
		}
		fetchData();
	}, [transactionKey, customerID]);
	const handleChangeAcc = panel => (event, newExpanded) => {
		console.log('tabpanel', panel);
		setExpanded(newExpanded ? panel : false);
		if (newExpanded && panel === 'invoiceTab') setTransactionKey('invoices');
		else if (newExpanded && panel === 'paymentLinkTab')
			setTransactionKey('paymentLinks');
		else if (newExpanded && panel === 'priceQuoteTab')
			setTransactionKey('estimate');
		else if (newExpanded && panel === 'salesOrderTab')
			setTransactionKey('saleOrder');
		else if (newExpanded && panel === 'paymentsReceivedTab')
			setTransactionKey('PaymentReceive');
		else if (newExpanded && panel === 'creditNoteTab')
			setTransactionKey('creditMemo');
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
					<StyledMenuItem disabled sx={{ color: 'grey' }}>
						Sale
					</StyledMenuItem>
					<StyledMenuItem
						onClick={() => {
							setExpanded('priceQuoteTab');
							setTransactionKey('estimate');
						}}
					>
						Price Quotes
					</StyledMenuItem>
					<StyledMenuItem
						onClick={() => {
							setExpanded('salesOrderTab');
							setTransactionKey('saleOrder');
						}}
					>
						Sales Order
					</StyledMenuItem>
					<StyledMenuItem
						onClick={() => {
							setExpanded('invoiceTab');
							setTransactionKey('invoices');
						}}
					>
						Invoice
					</StyledMenuItem>
					<StyledMenuItem
						onClick={() => {
							setExpanded('paymentLinkTab');
							setTransactionKey('paymentLinks');
						}}
					>
						Payment Links
					</StyledMenuItem>
					<StyledMenuItem
						onClick={() => {
							setExpanded('paymentsReceivedTab');
							setTransactionKey('PaymentReceive');
						}}
					>
						Account Receivable
					</StyledMenuItem>
					<StyledMenuItem
						onClick={() => {
							setExpanded('creditNoteTab');
							setTransactionKey('creditMemo');
						}}
					>
						Credit Memo
					</StyledMenuItem>
				</Menu>
			</Dropdown>
			{/* Price QUote Accordion */}
			<Accordion
				expanded={expanded === 'priceQuoteTab'}
				onChange={handleChangeAcc('priceQuoteTab')}
				sx={{ marginTop: '20px' }}
			>
				<AccordionSummary
					aria-controls='panel4d-content'
					id='panel4d-header'
					sx={TransactionAccordion}
					expandIcon={<KeyboardArrowRight sx={{ color: '#408DFB' }} />}
				>
					<Typography>Price Quotes</Typography>
					{/* <Dropdown>
						<HeaderMenuButton
							onClick={e => e.stopPropagation()}
							style={{
								position: 'absolute',
								right: '150px',
								marginTop: '-3px',
								backgroundColor: 'transparent',
							}}
						>
							{expanded === 'priceQuoteTab' && (
								<>
									<FilterAlt
										color='primary'
										sx={{ fontSize: '15px', marginBottom: '-3px' }}
									/>
									Status: All
									<KeyboardArrowDown
										color='primary'
										sx={{ fontSize: '15px', marginBottom: '-3px' }}
									/>
								</>
							)}
						</HeaderMenuButton>
						<Menu slots={{ listbox: StyledListbox }}>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								All
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Draft
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Sent
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Client Viewed
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Accepted
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Invoiced
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Declined
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Expired
							</StyledMenuItem>
						</Menu>
					</Dropdown> */}
					<IconButton
						sx={{
							position: 'absolute',
							right: '40px',
							marginTop: '-8px',
						}}
						onClick={e => {
							e.stopPropagation();
							navigate(
								`/price-quote/new?customerId=${generateEncryptedID(customerID)}`
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
						transactionData[0]?.estimate?.length > 0 ? (
							<>
								<GridRow style={{ paddingBottom: '8px' }}>
									<Grid item xs={2.5}>
										<Typography variant='body2'>Date</Typography>
									</Grid>
									<Grid item xs={2.5}>
										<Typography variant='body2'>Price Quote #</Typography>
									</Grid>
									<Grid item xs={2}></Grid>
									<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Amount</Typography>
									</Grid>
									<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Status</Typography>
									</Grid>
								</GridRow>
								{transactionData[0]?.estimate?.map(estimate => (
									<GridRow style={{ paddingBottom: '8px' }} key={estimate?.id}>
										<Grid item xs={2.5}>
											<Typography variant='body2'>
												{formatDate(estimate?.estimate_date)}
											</Typography>
										</Grid>
										<Grid item xs={2.5}>
											<Typography variant='body2'>
												<Link
													style={{
														color: window.themeColors.primary,
														textDecoration: 'auto',
													}}
													to={`/price-quote#/${generateEncryptedID(
														estimate?.id
													)}`}
												>
													{estimate?.estimate_number}
												</Link>
											</Typography>
										</Grid>
										<Grid item xs={2}></Grid>
										<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
											<Typography variant='body2'>
												$ {estimate?.total}
											</Typography>
										</Grid>
										<Grid
											item
											xs={2.5}
											sx={{
												textAlign: 'right',
												color: StatusColor(estimate?.status, theme),
											}}
											className='TextCapitalize'
										>
											<Typography variant='body2'>
												{estimate?.status || 'unpaid'}
											</Typography>
										</Grid>
									</GridRow>
								))}
							</>
						) : (
							<Box sx={{ textAlign: 'center' }}>
								<Typography variant='body2Grey'>
									There are no Price Quotes
									<Typography
										component={'span'}
										color='primary'
										fontSize='small'
										sx={{ cursor: 'pointer' }}
										onClick={e => {
											e.stopPropagation();
											navigate(
												`/price-quote/new?customerId=${generateEncryptedID(
													customerID
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
			{/* Sales Order Accordion */}
			<Accordion
				expanded={expanded === 'salesOrderTab'}
				onChange={handleChangeAcc('salesOrderTab')}
				sx={{ marginTop: '20px' }}
			>
				<AccordionSummary
					aria-controls='salesOrderTabd-content'
					id='salesOrderTabd-header'
					sx={TransactionAccordion}
					expandIcon={<KeyboardArrowRight sx={{ color: '#408DFB' }} />}
				>
					<Typography>Sales Orders</Typography>
					{/* <Dropdown>
						<HeaderMenuButton
							onClick={e => e.stopPropagation()}
							style={{
								position: 'absolute',
								right: '150px',
								marginTop: '-3px',
								backgroundColor: 'transparent',
							}}
						>
							{expanded === 'priceQuoteTab' && (
								<>
									<FilterAlt
										color='primary'
										sx={{ fontSize: '15px', marginBottom: '-3px' }}
									/>
									Status: All
									<KeyboardArrowDown
										color='primary'
										sx={{ fontSize: '15px', marginBottom: '-3px' }}
									/>
								</>
							)}
						</HeaderMenuButton>
						<Menu slots={{ listbox: StyledListbox }}>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								All
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Draft
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Sent
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Client Viewed
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Accepted
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Invoiced
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Declined
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Expired
							</StyledMenuItem>
						</Menu>
					</Dropdown> */}
					<IconButton
						sx={{
							position: 'absolute',
							right: '40px',
							marginTop: '-8px',
						}}
						onClick={e => {
							e.stopPropagation();
							navigate(
								`/sales-orders/new?customerId=${generateEncryptedID(
									customerID
								)}`
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
						transactionData[0]?.sale_order?.length > 0 ? (
							<>
								<GridRow style={{ paddingBottom: '8px' }}>
									<Grid item xs={2.5}>
										<Typography variant='body2'>Date</Typography>
									</Grid>
									<Grid item xs={2.5}>
										<Typography variant='body2'>Sales Order Number</Typography>
									</Grid>
									<Grid item xs={2}></Grid>
									<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Amount</Typography>
									</Grid>
									<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Status</Typography>
									</Grid>
								</GridRow>
								{transactionData[0]?.sale_order?.map(salesorder => (
									<GridRow
										style={{ paddingBottom: '8px' }}
										key={salesorder?.id}
									>
										<Grid item xs={2.5}>
											<Typography variant='body2'>
												{formatDate(salesorder?.sale_order_date)}
											</Typography>
										</Grid>
										<Grid item xs={2.5}>
											<Typography variant='body2'>
												<Link
													style={{
														color: window.themeColors.primary,
														textDecoration: 'auto',
													}}
													to={`/sales-orders#/${generateEncryptedID(
														salesorder?.id
													)}`}
												>
													{salesorder?.sale_order_number}
												</Link>
											</Typography>
										</Grid>
										<Grid item xs={2}></Grid>
										<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
											<Typography variant='body2'>
												$ {salesorder?.total}
											</Typography>
										</Grid>
										<Grid
											item
											xs={2.5}
											sx={{
												textAlign: 'right',
												color: StatusColor(salesorder?.status, theme),
											}}
											className='TextCapitalize'
										>
											<Typography variant='body2'>
												{salesorder?.status || 'unpaid'}
											</Typography>
										</Grid>
									</GridRow>
								))}
							</>
						) : (
							<Box sx={{ textAlign: 'center' }}>
								<Typography variant='body2Grey'>
									There are no Sale Orders
									<Typography
										component={'span'}
										color='primary'
										fontSize='small'
										sx={{ cursor: 'pointer' }}
										onClick={e => {
											e.stopPropagation();
											navigate(
												`/sales-orders/new?customerId=${generateEncryptedID(
													customerID
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
			{/* invoices Tab  */}
			<Accordion
				expanded={expanded === 'invoiceTab'}
				onChange={handleChangeAcc('invoiceTab')}
				sx={{ marginTop: '20px' }}
			>
				<AccordionSummary
					sx={TransactionAccordion}
					expandIcon={<KeyboardArrowRight sx={{ color: '#408DFB' }} />}
				>
					<Typography>Invoices</Typography>
					{/* <Dropdown>
						<HeaderMenuButton
							onClick={e => e.stopPropagation()}
							style={{
								position: 'absolute',
								right: '150px',
								marginTop: '-3px',
								backgroundColor: 'transparent',
							}}
						>
							{expanded === 'invoiceTab' && (
								<>
									<FilterAlt
										color='primary'
										sx={{ fontSize: '15px', marginBottom: '-3px' }}
									/>
									Status: All
									<KeyboardArrowDown
										color='primary'
										sx={{ fontSize: '15px', marginBottom: '-3px' }}
									/>
								</>
							)}
						</HeaderMenuButton>
						<Menu slots={{ listbox: StyledListbox }}>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								All
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Draft
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Client View
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Partially Paid
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Unpaid
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Paid
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Void
							</StyledMenuItem>
						</Menu>
					</Dropdown> */}
					<IconButton
						sx={{
							position: 'absolute',
							right: '40px',
							marginTop: '-8px',
						}}
						onClick={e => {
							e.stopPropagation();
							navigate(
								`/invoices/new?customerId=${generateEncryptedID(customerID)}`
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
						transactionData[0]?.invoices?.length > 0 ? (
							<>
								<GridRow style={{ paddingBottom: '8px' }}>
									<Grid item xs={2.5}>
										<Typography variant='body2'>Date</Typography>
									</Grid>
									<Grid item xs={2.5}>
										<Typography variant='body2'>Invoice Number</Typography>
									</Grid>
									<Grid item xs={2}></Grid>
									<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Amount</Typography>
									</Grid>
									<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Status</Typography>
									</Grid>
								</GridRow>
								{transactionData[0]?.invoices?.map(invoice => (
									<GridRow
										style={{ paddingBottom: '8px' }}
										key={invoice?.invoice_number}
									>
										<Grid item xs={2.5}>
											<Typography variant='body2'>
												{formatDate(invoice?.invoice_date)}
											</Typography>
										</Grid>
										<Grid item xs={2.5}>
											<Typography variant='body2'>
												<Link
													style={{
														color: window.themeColors.primary,
														textDecoration: 'auto',
													}}
													to={`/invoices#/${invoice?.id}`}
												>
													{invoice?.invoice_number}
												</Link>
											</Typography>
										</Grid>
										<Grid item xs={2}></Grid>
										<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
											<Typography variant='body2'>
												$ {invoice?.total}
											</Typography>
										</Grid>
										<Grid
											item
											xs={2.5}
											sx={{
												textAlign: 'right',
												color: StatusColor(invoice?.status, theme),
											}}
										>
											<Typography variant='body2'>
												{snakeCaseToPrettyText(invoice?.status) || 'unpaid'}
											</Typography>
										</Grid>
									</GridRow>
								))}
							</>
						) : (
							<Box sx={{ textAlign: 'center' }}>
								<Typography variant='body2Grey'>
									There are no Invoices
									<Typography
										component={'span'}
										color='primary'
										fontSize='small'
										sx={{ cursor: 'pointer' }}
										onClick={e => {
											e.stopPropagation();
											navigate(
												`/invoices/new?customerId=${generateEncryptedID(
													customerID
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
			{/* Payments Links Accordion */}
			<Accordion
				expanded={expanded === 'paymentLinkTab'}
				onChange={handleChangeAcc('paymentLinkTab')}
				sx={{ marginTop: '20px' }}
			>
				<AccordionSummary
					aria-controls='panel3d-content'
					id='panel3d-header'
					sx={TransactionAccordion}
					expandIcon={<KeyboardArrowRight sx={{ color: '#408DFB' }} />}
				>
					<Typography>Payments Links</Typography>
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
								`/payment-links/?customerId=${generateEncryptedID(customerID)}`
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
						transactionData[0]?.payment_links?.length > 0 ? (
							<>
								<GridRow style={{ paddingBottom: '8px' }}>
									<Grid item xs={2.5}>
										<Typography variant='body2'>Date</Typography>
									</Grid>
									<Grid item xs={2.5}>
										<Typography variant='body2'>Reference Number</Typography>
									</Grid>
									<Grid item xs={2}>
										<Typography variant='body2'>Status</Typography>
									</Grid>
									<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Expiry Date</Typography>
									</Grid>
									<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Amount</Typography>
									</Grid>
								</GridRow>
								{transactionData[0]?.payment_links?.map(paymentLink => (
									<GridRow
										style={{ paddingBottom: '8px' }}
										key={paymentLink?.id}
									>
										<Grid item xs={2.5}>
											<Typography variant='body2'>
												{formatDate(paymentLink?.created_at)}
											</Typography>
										</Grid>
										<Grid item xs={2.5}>
											<Typography variant='body2'>
												<Link
													style={{
														color: window.themeColors.primary,
														textDecoration: 'auto',
													}}
													// to={`/payment-links#/${paymentLink?.id}`}
													to={`/payment-links`}
												>
													{paymentLink?.reference || 'N/A'}
												</Link>
											</Typography>
										</Grid>
										<Grid item xs={2}>
											<Typography
												variant='body2'
												sx={{
													color: StatusColor(paymentLink?.status, theme),
													textTransform: 'capitalize',
												}}
											>
												{paymentLink?.status}
											</Typography>
										</Grid>
										<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
											<Typography variant='body2'>
												{formatDate(paymentLink?.link_expiration_date)}
											</Typography>
										</Grid>
										<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
											<Typography variant='body2'>
												$ {paymentLink?.payment_amount}
											</Typography>
										</Grid>
									</GridRow>
								))}
							</>
						) : (
							<Box sx={{ textAlign: 'center' }}>
								<Typography variant='body2Grey'>
									There are no Payments Links
									<Typography
										component={'span'}
										color='primary'
										fontSize='small'
										sx={{ cursor: 'pointer' }}
										onClick={e => {
											e.stopPropagation();
											navigate(
												`/payment-links/?customerId=${generateEncryptedID(
													customerID
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
			{/* Account Receivable Accordion */}
			<Accordion
				expanded={expanded === 'paymentsReceivedTab'}
				onChange={handleChangeAcc('paymentsReceivedTab')}
				sx={{ marginTop: '20px' }}
			>
				<AccordionSummary
					aria-controls='panel2d-content'
					id='panel2d-header'
					sx={TransactionAccordion}
					expandIcon={<KeyboardArrowRight sx={{ color: '#408DFB' }} />}
				>
					<Typography>Account Receivable</Typography>
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
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								All
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Draft
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Client View
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Partially Paid
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Unpaid
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Paid
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Void
							</StyledMenuItem>
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
								`/payment-received/new?customerId=${generateEncryptedID(
									customerID
								)}`
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
						transactionData[0]?.payment_receive?.length > 0 ? (
							<>
								<GridRow style={{ paddingBottom: '8px' }}>
									<Grid item xs>
										<Typography variant='body2'>Date</Typography>
									</Grid>
									<Grid item xs>
										<Typography variant='body2'>Reference Number</Typography>
									</Grid>
									<Grid item xs sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Payment Mode</Typography>
									</Grid>
									<Grid item xs sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Amount Received</Typography>
									</Grid>
								</GridRow>
								{transactionData[0]?.payment_receive?.map(paymentReceived => (
									<GridRow
										style={{ paddingBottom: '8px' }}
										key={paymentReceived?.id}
									>
										<Grid item xs>
											<Typography variant='body2'>
												{formatDate(paymentReceived?.payment_date)}
											</Typography>
										</Grid>
										<Grid item xs>
											<Typography variant='body2'>
												<Link
													style={{
														color: window.themeColors.primary,
														textDecoration: 'auto',
													}}
													to={`/payment-received#/${generateEncryptedID(
														paymentReceived?.id
													)}`}
												>
													{paymentReceived?.reference_number}
												</Link>
											</Typography>
										</Grid>
										<Grid
											item
											xs
											sx={{ textAlign: 'right' }}
											className='TextCapitalize'
										>
											<Typography variant='body2'>
												{paymentReceived?.payment_mode_value}
											</Typography>
										</Grid>
										<Grid item xs sx={{ textAlign: 'right' }}>
											<Typography variant='body2'>
												$ {paymentReceived?.payment_made}
											</Typography>
										</Grid>
									</GridRow>
								))}
							</>
						) : (
							<Box sx={{ textAlign: 'center' }}>
								<Typography variant='body2Grey'>
									There are no Account Receivables
									<Typography
										component={'span'}
										color='primary'
										fontSize='small'
										sx={{ cursor: 'pointer' }}
										onClick={e => {
											e.stopPropagation();
											navigate(
												`/payment-received/new?customerId=${generateEncryptedID(
													customerID
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
			{/* Credit Memos Accordion */}
			<Accordion
				expanded={expanded === 'creditNoteTab'}
				onChange={handleChangeAcc('creditNoteTab')}
				sx={{ marginTop: '20px' }}
			>
				<AccordionSummary
					aria-controls='panel9d-content'
					id='panel9d-header'
					sx={TransactionAccordion}
					expandIcon={<KeyboardArrowRight sx={{ color: '#408DFB' }} />}
				>
					<Typography>Credit Memo</Typography>
					{/* <Dropdown>
						<HeaderMenuButton
							onClick={e => e.stopPropagation()}
							style={{
								position: 'absolute',
								right: '150px',
								marginTop: '-3px',
								backgroundColor: 'transparent',
							}}
						>
							{expanded === 'creditNoteTab' && (
								<>
									<FilterAlt
										color='primary'
										sx={{ fontSize: '15px', marginBottom: '-3px' }}
									/>
									Status: All
									<KeyboardArrowDown
										color='primary'
										sx={{ fontSize: '15px', marginBottom: '-3px' }}
									/>
								</>
							)}
						</HeaderMenuButton>
						<Menu slots={{ listbox: StyledListbox }}>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								All
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Open
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Close
							</StyledMenuItem>
							<StyledMenuItem onClick={e => e.stopPropagation()}>
								{' '}
								Void
							</StyledMenuItem>
						</Menu>
					</Dropdown> */}
					<IconButton
						sx={{
							position: 'absolute',
							right: '40px',
							marginTop: '-8px',
						}}
						onClick={e => {
							e.stopPropagation();
							navigate(
								`/credit-memo/new?customerId=${generateEncryptedID(customerID)}`
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
						transactionData[0]?.credit_memo?.length > 0 ? (
							<>
								<GridRow style={{ paddingBottom: '8px' }}>
									<Grid item xs={2.5}>
										<Typography variant='body2'>Date</Typography>
									</Grid>
									<Grid item xs={2.5}>
										<Typography variant='body2'>Credit Memo Number</Typography>
									</Grid>
									<Grid item xs={2}></Grid>
									<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Amount</Typography>
									</Grid>
									<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
										<Typography variant='body2'>Status</Typography>
									</Grid>
								</GridRow>
								{transactionData[0]?.credit_memo?.map(creditmemo => (
									<GridRow
										style={{ paddingBottom: '8px' }}
										key={creditmemo?.id}
									>
										<Grid item xs={2.5}>
											<Typography variant='body2'>
												{formatDate(creditmemo?.credit_memo_date)}
											</Typography>
										</Grid>
										<Grid item xs={2.5}>
											<Typography variant='body2'>
												<Link
													style={{
														color: window.themeColors.primary,
														textDecoration: 'auto',
													}}
													to={`/credit-memo#/${generateEncryptedID(
														creditmemo?.id
													)}`}
												>
													{creditmemo?.credit_memo_number}
												</Link>
											</Typography>
										</Grid>
										<Grid item xs={2}></Grid>
										<Grid item xs={2.5} sx={{ textAlign: 'right' }}>
											<Typography variant='body2'>
												$ {creditmemo?.total}
											</Typography>
										</Grid>
										<Grid
											item
											xs={2.5}
											sx={{ textAlign: 'right' }}
											className='TextCapitalize'
										>
											<Typography variant='body2'>
												{creditmemo?.status || 'unpaid'}
											</Typography>
										</Grid>
									</GridRow>
								))}
							</>
						) : (
							<Box sx={{ textAlign: 'center' }}>
								<Typography variant='body2Grey'>
									There are no Credit Memos
									<Typography
										component={'span'}
										color='primary'
										fontSize='small'
										sx={{ cursor: 'pointer' }}
										onClick={e => {
											e.stopPropagation();
											navigate(
												`/credit-memo/new?customerId=${generateEncryptedID(
													customerID
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
