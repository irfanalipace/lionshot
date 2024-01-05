import { Box, Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import {
	Button,
	Divider,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Typography,
} from '@mui/material';
import {
	CalendarMonth,
	ArrowDropDown,
	PictureAsPdf,
} from '@mui/icons-material';
import { MailOutline } from '@mui/icons-material';
import MinnesotaLogo from '../../../../assets/images/logos/computer.png';
import { formatDate } from '../../../../core/utils/helpers';
import DateRangeModal from '../../../Components/DateRangeModal/DateRangeModal';
import { statementDataAPI } from '../../../../core/api/customer';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';

// variables initialization
const entriesLimit = 10;

function StatementsTab({ customerID }) {
	const [calenderAnchor, setCalenderAnchor] = useState(null);
	// const [filterMenu, setFilterMenu] = useState();
	const [openCustomDateDialog, setOpenCustomDateDialog] = useState(false);
	const [statementData, setStatementData] = useState();
	const [loaderFlag, setLoaderFlag] = useState(false);
	const [durationFilter, setDurationFilter] = useState('this_month'); // Today, this week, this year,custom
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [typeFilter, setTypeFIlter] = useState('all'); // All and outstanding
	const [dateObject, setDateObject] = useState({
		start_date: null,
		end_date: null,
	});
	//  get Statement Data api
	const getStatementData = async (startDate, endDate) => {
		try {
			setLoaderFlag(true);
			const dateParams = {
				customer_id: customerID,
				duration: durationFilter || null,
				filter_by: typeFilter || null,
				start_date: startDate || null,
				end_date: endDate || null,
			};

			const res = await statementDataAPI(dateParams);
			setStatementData(res?.data);
			setLoaderFlag(false);
		} catch (e) {
			setLoaderFlag(false);
		}
	};
	useEffect(() => {
		if (customerID && durationFilter !== 'custom') getStatementData();
	}, [customerID, durationFilter, typeFilter]);

	const processAction = async action => {
		const params = {
			customer_id: customerID,
			duration: durationFilter || null,
			filter_by: typeFilter || null,
			download_pdf: action === 'downloadPDF' ? '1' : '0',
			send_email: action === 'sendMail' ? '1' : '0',
			...dateObject,
		};

		try {
			const res = await statementDataAPI(params);

			if (action === 'downloadPDF' && res?.data?.pdf_url) {
				window.open(res?.data?.pdf_url);
				notyf.success('PDF Downloaded Successfully');
			} else if (action === 'sendMail' && res?.data?.send_email === true) {
				notyf.success('Mail Sent Successfully');
			}
		} catch (error) {
			console.error('Error:', error);
			notyf.error('Something went wrong');
		}
	};

	const onSave = (startDate, endDate) => {
		setDateObject({
			start_date: startDate || null,
			end_date: endDate || null,
		});
		getStatementData(startDate, endDate);
		setCalenderAnchor(null);
	};
	let arrayOfObjects;
	if (Array.isArray(statementData?.statement_data)) {
		arrayOfObjects = statementData?.statement_data;
	} else {
		arrayOfObjects = Object.values(statementData?.statement_data || {});
	}
	return (
		<Box minHeight={'80vh'}>
			<OverlayLoader open={loaderFlag} />
			<Grid container>
				<Grid item md={6}>
					<Stack direction={'row'}>
						<Button
							onClick={e => setCalenderAnchor(e.currentTarget)}
							sx={{ boxShadow: 3 }}
						>
							<CalendarMonth fontSize='16px' />
							<Typography
								className='TextCapitalize'
								color='#000'
								fontSize='small'
							>
								Filter By Date
							</Typography>
							<ArrowDropDown fontSize='small' />
						</Button>
						<Menu
							anchorEl={calenderAnchor}
							open={Boolean(calenderAnchor)}
							onClose={() => setCalenderAnchor(null)}
							sx={{ '&.MuiPaper-root': { width: '250px' } }}
							aria-label='Calendar Month'
						>
							<MenuItem
								onClick={() => {
									setDurationFilter('today');
									setDateObject({
										start_date: null,
										end_date: null,
									});
									setCalenderAnchor(null);
								}}
							>
								Today
							</MenuItem>
							<MenuItem
								onClick={e => {
									e.stopPropagation();
									setDurationFilter('this_week');
									setDateObject({
										start_date: null,
										end_date: null,
									});
									setCalenderAnchor(null);
								}}
							>
								This Week
							</MenuItem>
							<MenuItem
								onClick={() => {
									setDurationFilter('this_month');
									setDateObject({
										start_date: null,
										end_date: null,
									});
									setCalenderAnchor(null);
								}}
							>
								This Month
							</MenuItem>
							<MenuItem
								onClick={() => {
									setDurationFilter('this_year');
									setDateObject({
										start_date: null,
										end_date: null,
									});
									setCalenderAnchor(null);
								}}
							>
								This Year
							</MenuItem>
							<MenuItem
								onClick={e => {
									e.stopPropagation();
									setDurationFilter('custom');
									setOpenCustomDateDialog(true);
								}}
							>
								Custom
								<DateRangeModal
									openModal={openCustomDateDialog}
									// setModal={setOpenCustomDateDialog}
									onSave={onSave}
									onClose={() => {
										setCalenderAnchor(null);
										setOpenCustomDateDialog(false);
									}}
								/>
							</MenuItem>
						</Menu>
						{/* filter by menu */}
						{/* <Button
							onClick={e => setFilterMenu(e.currentTarget)}
							sx={{ boxShadow: 3, marginLeft: '10px' }}
						>
							<Typography
								className='TextCapitalize'
								color='#000'
								fontSize='small'
							>
								Filter By:
							</Typography>
							<ArrowDropDown fontSize='small' />
						</Button>
						<Menu
							anchorEl={filterMenu}
							open={Boolean(filterMenu)}
							onClose={() => setFilterMenu(null)}
							sx={{ '&.MuiPaper-root': { width: '250px' } }}
							aria-label='Calendar Month'
						>
							<MenuItem
								onClick={() => {
									setTypeFIlter('all');
									setFilterMenu(null);
								}}
							>
								All
							</MenuItem>
							<MenuItem
								onClick={() => {
									setTypeFIlter('outstanding');
									setFilterMenu(null);
								}}
							>
								Outstanding
							</MenuItem>
						</Menu> */}
					</Stack>
				</Grid>
				<Grid
					item
					md={6}
					sx={{
						display: 'flex',
						justifyContent: 'right',
						alignItems: 'center',
					}}
				>
					<IconButton
						sx={{
							border: '2px solid #E3E3E3',
							padding: '4px 5px',
							borderRadius: '3px',
						}}
						onClick={() => processAction('downloadPDF')}
					>
						<PictureAsPdf />
					</IconButton>
					<Button
						sx={{ margin: '0 10px' }}
						variant='contained'
						onClick={() => processAction('sendMail')}
					>
						<MailOutline sx={{ marginRight: '5px' }} />
						Send an Email
					</Button>
				</Grid>
			</Grid>
			<Box sx={{ textAlign: 'center' }} my={3}>
				<Typography variant='body1'>
					Customer Statement for {statementData?.customer?.display_name}
				</Typography>
				<Typography variant='body2'>
					From {formatDate(statementData?.start_date)} to{' '}
					{statementData?.end_date}
				</Typography>
			</Box>
			<Divider />
			{/* Logo with address  */}
			<Grid container px={3}>
				<Grid item xs={6}>
					<img src={MinnesotaLogo} alt='' width={'50%'} />
				</Grid>
				<Grid
					item
					xs={6}
					sx={{
						display: 'flex',
						justifyContent: 'right',
						alignItems: 'center',
					}}
				>
					<Typography
						variant='caption'
						sx={{ textAlign: 'right', maxWidth: '150px' }}
					>
						2817 Eagandale Blvd.
						<br /> Eagan Minnesota 55121
					</Typography>
				</Grid>
			</Grid>
			{/* ship to address statement heading  */}
			<Grid container px={3}>
				<Grid item xs={6}>
					<Typography variant='caption' component={'p'}>
						To.
					</Typography>
					<Typography
						variant='caption'
						component={'p'}
						// sx={{ maxWidth: '150px' }}
						color={'primary'}
						className='TextCapitalize'
					>
						{statementData?.customer?.default_billing_address?.attention}
					</Typography>
					<Typography
						component={'p'}
						variant='caption'
						className='TextCapitalize'
					>
						{statementData?.customer?.default_billing_address?.country?.name}
					</Typography>
					<Typography component={'p'} variant='caption'>
						{statementData?.customer?.default_billing_address?.phone ||
							statementData?.customer?.phone}
					</Typography>
				</Grid>
				<Grid
					item
					xs={6}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-end',
						justifyContent: 'flex-end',
					}}
				>
					<Typography component={'p'} variant='h6' sx={{ textAlign: 'right' }}>
						Statement of Accounts
					</Typography>
					<Divider
						sx={{
							border: '1px solid #000',
							width: '245px',
							textAlign: 'right',
						}}
					/>
					<Typography component={'p'} variant='caption'>
						{formatDate(statementData?.start_date)} To{' '}
						{formatDate(statementData?.end_date)}
					</Typography>
					<Divider
						sx={{
							border: '1px solid #000',
							width: '245px',
							textAlign: 'right',
						}}
					/>
				</Grid>
			</Grid>
			{/* Account summary section  */}
			<Grid container px={3} mt={4}>
				<Grid item xs={6}></Grid>
				<Grid item xs={6}>
					<Box sx={{ backgroundColor: '#E8E8E8', paddingLeft: '10px' }}>
						<Typography variant='body1bold'>Account Summary</Typography>
					</Box>
					<Grid
						container
						sx={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<Grid item xs={6} p={1}>
							<Typography variant='body2'>Opening Balance</Typography>
						</Grid>
						<Grid item xs={6} sx={{ textAlign: 'right' }}>
							<Typography variant='body2'>
								${statementData?.opening_balance || 0}
							</Typography>
						</Grid>
						<Grid item xs={6} p={1}>
							<Typography variant='body2'>Invoiced Amount</Typography>
						</Grid>
						<Grid item xs={6} sx={{ textAlign: 'right' }}>
							<Typography variant='body2'>
								${statementData?.invoiced_amount || 0}
							</Typography>
						</Grid>
						<Grid item xs={6} p={1}>
							<Typography variant='body2'>Amount Received</Typography>
						</Grid>
						<Grid item xs={6} sx={{ textAlign: 'right' }}>
							<Typography variant='body2'>
								${statementData?.amount_received || 0}
							</Typography>
						</Grid>
						<Divider
							sx={{
								border: '1px solid #000',
								width: '100%',
							}}
						/>
						<Grid item xs={6} p={1}>
							<Typography variant='body2'>Balance Due</Typography>
						</Grid>
						<Grid item xs={6} sx={{ textAlign: 'right' }}>
							<Typography variant='body2'>
								${statementData?.balance_due || 0}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			{/* Details Table  */}
			<Grid
				container
				sx={{ marginLeft: '-10px', backgroundColor: '#3C3D3A', color: 'white' }}
				px={1}
				mt={5}
			>
				<Grid item xs={2}>
					<Typography variant='body2'>Date</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant='body2'>Invoice</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant='body2'>Description</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant='body2'>Debit (Sales)</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant='body2'>Credit (Payment)</Typography>
				</Grid>
				<Grid item xs={2} sx={{ textAlign: 'right' }}>
					<Typography variant='body2'>Outstanding Balance</Typography>
				</Grid>
			</Grid>
			{/* Static Opening Balance */}
			{/* <Grid container px={1} sx={{ marginLeft: '-10px' }}>
				<Grid item xs={2}>
					<Typography variant='caption'>
						{formatDate(statementData?.date)}
					</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant='caption'>***Opening Balance***</Typography>
				</Grid>
				<Grid item xs={2}>
				</Grid>
				<Grid item xs={2}>
					<Typography variant='caption'>0.00</Typography>
				</Grid>
				<Grid item xs={2}>
					<Typography variant='caption'></Typography>
				</Grid>
				<Grid item xs={2} sx={{ textAlign: 'right' }}>
					<Typography variant='caption'>
						{statementData?.opening_balance || '0.00'}
					</Typography>
				</Grid>
			</Grid> */}
			{/* <Divider width='100%' sx={{ marginLeft: '-10px' }} /> */}
			{arrayOfObjects?.slice(0, entriesLimit)?.map(invoice => (
				<Grid key={invoice.id} container px={1} sx={{ marginLeft: '-10px' }}>
					<Grid item xs={2}>
						<Typography variant='caption'>
							{formatDate(invoice?.date)}
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography variant='caption'>{invoice?.invoice}</Typography>
					</Grid>
					<Grid item xs={2}>
						{invoice?.invoice_items ? (
							<>
								<Box
									sx={{
										width: '120px',
										whiteSpace: ' nowrap',
										overflow: ' hidden',
										textOverflow: 'ellipsis',
										display: 'inline-block',
									}}
								>
									{invoice.invoice_items.map(items => (
										<Typography variant='caption' key={items?.id}>
											{items?.item_name} {', '}
										</Typography>
									))}
								</Box>
								<HoverPopover
									text={invoice.invoice_items
										.map(items => items?.item_name)
										.join(', ')}
								></HoverPopover>
							</>
						) : (
							<Typography variant='caption'>{invoice?.description}</Typography>
						)}
					</Grid>
					<Grid item xs={2}>
						{invoice?.debit && (
							<Typography variant='caption'>
								{'$'}
								{invoice?.debit}
							</Typography>
						)}
					</Grid>
					<Grid item xs={2}>
						{invoice?.credit && (
							<Typography variant='caption'>
								{'$'}
								{invoice?.credit}
							</Typography>
						)}
					</Grid>
					<Grid item xs={2} sx={{ textAlign: 'right' }}>
						<Typography variant='caption'>
							${invoice?.outstanding_balance || 0}
						</Typography>
					</Grid>
					<Divider width='100%' />
				</Grid>
			))}
			{arrayOfObjects?.length > entriesLimit && (
				<>
					<Typography
						variant='h6'
						sx={{
							borderLeft: '1px dotted gray',
							borderWidth: ' thick',
							padding: '10px',
						}}
						mt={2}
					>
						&nbsp;
					</Typography>
					<Typography
						variant='caption'
						// component={'p'}
						color={'red'}
						sx={{ display: 'inline-block' }}
						mt={2}
					>
						Entries are more then {entriesLimit} you can see all the entries by
						Clicking this button
					</Typography>
					<Button
						variant='contained'
						sx={{ marginLeft: '10px', padding: '2px 10px' }}
						onClick={() => processAction('downloadPDF')}
					>
						View All
					</Button>
				</>
			)}
			<Grid container px={1} mt={1}>
				<Grid item xs={2}></Grid>
				<Grid item xs={2}></Grid>
				<Grid item xs={2}></Grid>
				<Grid item xs={2} sx={{ marginLeft: '-10px' }}>
					<Typography variant='caption' sx={{ fontWeight: '500' }}>
						Outstanding Balance
					</Typography>
				</Grid>
				<Grid item xs={2}></Grid>
				<Grid item xs={2} sx={{ textAlign: 'right' }}>
					<Typography variant='caption'>
						{' '}
						${statementData?.total_outstanding_balance || 0.0}
					</Typography>
				</Grid>
			</Grid>

			{/* end grid  */}
		</Box>
	);
}

export default StatementsTab;
