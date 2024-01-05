import {
	Button,
	Divider,
	Grid,
	IconButton,
	Tab,
	Typography,
} from '@mui/material';
import { Menu } from '@mui/base/Menu';
import HeaderPaper from '../../../../Components/Containers/HeaderPaper';
import GridRow from '../../../../Components/GridRow/GridRow';
import { Box } from '@mui/system';
import { ArrowDropDown } from '@mui/icons-material';
import ContainerPaper from '../../../../Components/Containers/ContainerPaper';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useEffect, useState } from 'react';
import ConfirmDialog from '../../../../Components/ConfirmDialog/ConfirmDialog';
import {
	HeaderMenuButton,
	StyledListbox,
	headerIconButton,
	headerMenuBox,
} from '../../../Customer/CustomerStylesConst';
import EditIcon from '@mui/icons-material/Edit';
import { deleteItem, itemsSingleApi } from '../../../../../core/api/items';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from '@mui/base/Dropdown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
	HistoryList,
	PriceList,
	PriceListHeader,
	PriceListHeader2,
	PriceListRow,
	StyledMenuItem,
} from '../ItemStyle';

const ItemViewOld = ({ id, setRefresh }) => {
	const navigate = useNavigate();
	const [value, setValue] = useState('1');
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [dialogProps, setDialogProps] = useState({});
	const [itemData, setItemData] = useState({});
	const [priceList, setPricList] = useState(false);
	const [isSales, setIsSales] = useState(false);
	const [selectedItem, setSelectedItem] = useState('Price Quote');
	const [selectedStatus, setSelectedStatus] = useState('All');

	const handleMenuItemClick = itemName => {
		setSelectedItem(itemName);
	};
	const handleStatusFilter = name => {
		setSelectedStatus(name);
	};
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const getSingleitem = async () => {
		try {
			const singleItem = await itemsSingleApi(id);
			console.log('singleCustomer', singleItem);
			setItemData(singleItem);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getSingleitem();
	}, [id]);

	const handleDelete = async id => {
		try {
			const res = await deleteItem(id);
			if (res) {
				navigate('/items');
				setRefresh(prev => prev + 1);
			}
		} catch (err) {
			console.log('err', err);
		}
	};

	return (
		<>
			<>
				<HeaderPaper>
					<GridRow style={{ marginBottom: '0px' }}>
						<Grid item xs={6}>
							<Typography variant='h6'>{itemData?.name}</Typography>
						</Grid>
						<Grid
							item
							xs={6}
							style={{ display: 'flex', justifyContent: 'end' }}
						>
							<Box sx={headerMenuBox}>
								<IconButton
									sx={headerIconButton}
									style={{ color: 'black' }}
									onClick={() => navigate(`/items/edit/${itemData?.id}`)}
								>
									<EditIcon sx={{ color: '#0000008F', fontSize: '15px' }} />
								</IconButton>
								<Dropdown>
									<HeaderMenuButton
										style={{
											color: 'black',
											padding: '10px 10px 10px 15px',
											marginLeft: '10px',
										}}
									>
										More
										<ArrowDropDown sx={{ margin: '-3px 0 -8px 0' }} />
									</HeaderMenuButton>
									<Menu slots={{ listbox: StyledListbox }}>
										<StyledMenuItem> Clone Item</StyledMenuItem>
										<StyledMenuItem> Mark as Inactive</StyledMenuItem>
										<StyledMenuItem
											onClick={() => {
												setOpenConfirmDialog(true);
												setDialogProps({
													onConfirm: () => handleDelete(itemData.id),
												});
											}}
										>
											{' '}
											Delete
										</StyledMenuItem>
									</Menu>
								</Dropdown>
								<IconButton
									style={{ color: 'black' }}
									onClick={() => navigate('/items')}
								>
									<CloseIcon sx={{ color: '#0000008F' }} />
								</IconButton>
							</Box>
						</Grid>
					</GridRow>
				</HeaderPaper>
				<ContainerPaper sx={{ paddingLeft: '0px' }}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<TabContext value={value}>
							<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
								<TabList
									onChange={handleChange}
									aria-label='lab API tabs example'
								>
									<Tab sx={TransactionTabHead} label='Overview' value='1' />
									<Tab sx={TransactionTabHead} label='Transactions' value='2' />
									<Tab sx={TransactionTabHead} label='History' value='3' />
								</TabList>
							</Box>
							<TabPanel value='1' araia-label='OverView-Tab'>
								<GridRow>
									<Grid item xs={3}>
										<Typography variant='body2' sx={{ color: '#777777' }}>
											item Type
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<Typography variant='body2'>{itemData?.type}</Typography>
									</Grid>
								</GridRow>
								<GridRow>
									<Grid item xs={3}>
										<Typography variant='body2' sx={{ color: '#777777' }}>
											Created Source
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<Typography variant='body2'>{itemData?.name}</Typography>
									</Grid>
								</GridRow>
								<GridRow>
									<Grid item xs={3}>
										<Typography variant='body2' sx={{ color: '#777777' }}>
											Tax Preference
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<Typography variant='body2'>
											{itemData?.tax_preference}
										</Typography>
									</Grid>
								</GridRow>
								{itemData?.item_purchase && (
									<>
										<GridRow>
											<Grid item xs={3}>
												<Typography sx={{ pt: 3, pb: 1 }} variant='subtitle2'>
													Purchase Information
												</Typography>
											</Grid>
										</GridRow>
										<GridRow>
											<Grid item xs={3}>
												<Typography variant='body2' sx={{ color: '#777777' }}>
													Cost Price
												</Typography>
											</Grid>
											<Grid item xs={4}>
												<Typography variant='body2'>
													{itemData?.item_purchase?.price}
												</Typography>
											</Grid>
										</GridRow>
										<GridRow>
											<Grid item xs={3}>
												<Typography variant='body2' sx={{ color: '#777777' }}>
													Purchase Account
												</Typography>
											</Grid>
											<Grid item xs={4}>
												<Typography variant='body2'>
													{itemData?.item_purchase?.account_id}
												</Typography>
											</Grid>
										</GridRow>
										<GridRow>
											<Grid item xs={3}>
												<Typography variant='body2' sx={{ color: '#777777' }}>
													Description
												</Typography>
											</Grid>
											<Grid item xs={4}>
												<Typography variant='body2'>
													{itemData?.item_purchase?.description}
												</Typography>
											</Grid>
										</GridRow>
									</>
								)}
								{itemData?.item_sale && (
									<>
										<GridRow>
											<Grid item xs={3}>
												<Typography sx={{ pt: 3, pb: 1 }} variant='subtitle2'>
													Sales Information
												</Typography>
											</Grid>
										</GridRow>
										<GridRow>
											<Grid item xs={3}>
												<Typography variant='body2' sx={{ color: '#777777' }}>
													Selling Price
												</Typography>
											</Grid>
											<Grid item xs={4}>
												<Typography variant='body2'>
													{' '}
													{itemData?.item_sale?.price}
												</Typography>
											</Grid>
										</GridRow>
										<GridRow>
											<Grid item xs={3}>
												<Typography variant='body2' sx={{ color: '#777777' }}>
													Sales Account
												</Typography>
											</Grid>
											<Grid item xs={4}>
												<Typography variant='body2'>
													{' '}
													{itemData?.item_sale?.account_id}
												</Typography>
											</Grid>
										</GridRow>
										<GridRow>
											<Grid item xs={3}>
												<Typography variant='body2' sx={{ color: '#777777' }}>
													Description
												</Typography>
											</Grid>
											<Grid item xs={4}>
												<Typography variant='body2'>
													{itemData?.item_sale?.description}
												</Typography>
											</Grid>
										</GridRow>
									</>
								)}
								<br />
								<GridRow>
									<Grid item xs={4}>
										<Button
											onClick={() => setPricList(!priceList)}
											size='small'
										>
											Associated Price List &nbsp;
											{priceList ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
										</Button>
									</Grid>
								</GridRow>
								{priceList && (
									<Box sx={{ width: '75%' }}>
										<Grid container justifyContent='flex-end'>
											<Grid item>
												<Box>
													<Button
														size='small'
														variant={isSales ? 'contained' : 'outlined'}
														sx={{ borderRadius: '0px' }}
														onClick={() => setIsSales(true)}
													>
														Sales
													</Button>
													<Button
														size='small'
														variant={isSales ? 'outlined' : 'contained'}
														sx={{ borderRadius: '0px' }}
														onClick={() => setIsSales(false)}
													>
														Purchase
													</Button>
												</Box>
											</Grid>
										</Grid>
										{isSales && (
											<>
												<br />
												<PriceList>
													<PriceListRow>
														<PriceListHeader>Name</PriceListHeader>
														<PriceListHeader>Price</PriceListHeader>
														<PriceListHeader>Discount</PriceListHeader>
													</PriceListRow>
												</PriceList>
												<PriceList>
													<PriceListRow>
														<Grid
															container
															direction='row'
															justifyContent='center'
															alignItems='center'
														>
															<Typography variant='caption'>
																No Sales Data
															</Typography>
														</Grid>
													</PriceListRow>
												</PriceList>
											</>
										)}
										{!isSales && (
											<>
												<br />
												<PriceList>
													<PriceListRow>
														<PriceListHeader>Name</PriceListHeader>
														<PriceListHeader>Discount</PriceListHeader>
													</PriceListRow>
												</PriceList>
												<PriceList>
													<PriceListRow>
														<Grid
															container
															direction='row'
															justifyContent='center'
															alignItems='center'
														>
															<Typography variant='caption'>
																No Purchase Data
															</Typography>
														</Grid>
													</PriceListRow>
												</PriceList>
											</>
										)}
									</Box>
								)}
							</TabPanel>
							<TabPanel value='2' araia-label='Comments-Tab'>
								<Dropdown>
									<HeaderMenuButton
										style={{
											color: 'black',
											padding: '10px 10px 10px 15px',
											marginLeft: '10px',
										}}
									>
										<Typography variant='caption' sx={{ color: '#6C7184' }}>
											Filter by : &nbsp;
										</Typography>
										<Typography variant='caption'>
											{selectedItem ? selectedItem : ''}
										</Typography>

										<ArrowDropDown sx={{ margin: '-3px 0 -8px 0' }} />
									</HeaderMenuButton>
									<Menu slots={{ listbox: StyledListbox }}>
										<StyledMenuItem
											onClick={() => handleMenuItemClick('Price Quote')}
										>
											Price Quote
										</StyledMenuItem>
										<StyledMenuItem
											onClick={() => handleMenuItemClick('Invoice')}
										>
											Invoice
										</StyledMenuItem>
										<StyledMenuItem
											onClick={() => handleMenuItemClick('Credit Notes')}
										>
											Credit Notes
										</StyledMenuItem>
										<StyledMenuItem
											onClick={() => handleMenuItemClick('Purchase Orders')}
										>
											Purchase Orders
										</StyledMenuItem>
										<StyledMenuItem
											onClick={() => handleMenuItemClick('Bills')}
										>
											Bills
										</StyledMenuItem>
										<StyledMenuItem
											onClick={() => handleMenuItemClick('Vendor Credits')}
										>
											Vendor Credits
										</StyledMenuItem>
									</Menu>
								</Dropdown>
								<Dropdown>
									<HeaderMenuButton
										style={{
											color: 'black',
											padding: '10px 10px 10px 15px',
											marginLeft: '10px',
										}}
									>
										<Typography variant='caption' sx={{ color: '#6C7184' }}>
											Status : &nbsp;
										</Typography>
										<Typography variant='caption'>
											{selectedStatus ? selectedStatus : ''}
										</Typography>

										<ArrowDropDown sx={{ margin: '-3px 0 -8px 0' }} />
									</HeaderMenuButton>
									<Menu slots={{ listbox: StyledListbox }}>
										<StyledMenuItem
											sx={{ width: '20%' }}
											onClick={() => handleStatusFilter('All')}
										>
											All
										</StyledMenuItem>
										<StyledMenuItem onClick={() => handleStatusFilter('Draft')}>
											Draft
										</StyledMenuItem>
										<StyledMenuItem onClick={() => handleStatusFilter('Sent')}>
											Sent
										</StyledMenuItem>
										<StyledMenuItem
											onClick={() => handleStatusFilter('Client Viewed')}
										>
											Client Viewed
										</StyledMenuItem>
										<StyledMenuItem
											onClick={() => handleStatusFilter('Accepted')}
										>
											Accepted
										</StyledMenuItem>
										<StyledMenuItem
											onClick={() => handleStatusFilter('Invoiced')}
										>
											Invoiced
										</StyledMenuItem>
										<Divider />
										<StyledMenuItem
											onClick={() => handleStatusFilter('Declined')}
										>
											Declined
										</StyledMenuItem>
										<StyledMenuItem
											onClick={() => handleStatusFilter('Expired')}
										>
											Expired
										</StyledMenuItem>
									</Menu>
								</Dropdown>
								<Grid
									container
									direction='row'
									justifyContent='center'
									alignItems='center'
									sx={{ pt: 14, pb: 14 }}
								>
									<Typography variant='caption'>
										There are no Price Quotes
									</Typography>
								</Grid>
							</TabPanel>
							<TabPanel
								sx={{ paddingLeft: '0px' }}
								value='3'
								araia-label='Transaction-Tab'
							>
								<HistoryList>
									<PriceListRow>
										<PriceListHeader>Date</PriceListHeader>
										<PriceListHeader>{/* Details */}</PriceListHeader>
										<PriceListHeader> </PriceListHeader>
									</PriceListRow>
								</HistoryList>
								<HistoryList>
									<PriceListRow>
										<PriceListHeader>
											{new Date(itemData?.created_at).toLocaleString()}
										</PriceListHeader>
										<PriceListHeader2>
											{/* created by : */}
											<PriceListHeader>
												{/* &ensp;
                        <i>{itemData?.name}</i>{" "} */}
											</PriceListHeader>
										</PriceListHeader2>
										<PriceListHeader> </PriceListHeader>
									</PriceListRow>
								</HistoryList>
							</TabPanel>
						</TabContext>
					</Box>
				</ContainerPaper>
				<ConfirmDialog
					title='Are you sure you want to delete'
					isOpen={openConfirmDialog}
					onClose={() => setOpenConfirmDialog(false)}
					{...dialogProps}
				/>
			</>
		</>
	);
};

export default ItemViewOld;

const TransactionTabHead = {
	textTransform: 'none',
	color: '#000',
	fontWeight: '400',
	'&.Mui-selected': {
		color: '#000',
		fontWeight: '500',
	},
};
