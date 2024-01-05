import React, { useState } from 'react';
import './saleOrder.css';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';

import CloseIcon from '@mui/icons-material/Close';
import NoteIcon from '@mui/icons-material/Note';
import EmailIcon from '@mui/icons-material/Email';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WarningIcon from '@mui/icons-material/Warning';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import TabletMacIcon from '@mui/icons-material/TabletMac';
import {
	ApartmentOutlined,
	EditNote,
	LibraryBooksOutlined,
	LocalShippingOutlined,
	StopCircle,
	Timeline,
} from '@mui/icons-material';
import {
	TabContext,
	TabList,
	TabPanel,
	TimelineConnector,
	TimelineContent,
	TimelineDot,
	TimelineItem,
	TimelineSeparator,
} from '@mui/lab';
import ActivityTimeLine from '../ActivityTimeLine/ActivityTimeLine';
import { padding } from '@mui/system';
import {
	capitalizeFirstLetter,
	snakeCaseToPrettyText,
} from '../../../core/utils/helpers';

const contactPersonList = [
	{
		name: 'Hassan',
		email: '123@gmail.com',
		role: 'project manager',
		phone: '123456789',
		id: 1,
	},
	{
		name: 'Hassan',
		email: '123@gmail.com',
		role: 'project manager',
		phone: '123456789',
		id: 1,
	},
	{
		name: 'Hassan',
		email: '123@gmail.com',
		role: 'project manager',
		phone: '123456789',
		id: 1,
	},
];
const TABS = {
	DETAIL: 'Details',
	CONTACT_PERSONS: 'Contact Persons',
	// ACTIVITY_LOG: 'Actvity log',
};

const CustomerViewDrawer = ({ type, onClose, customerDetails }) => {
	const [activeTab, setActiveTab] = useState(TABS.DETAIL);

	// const tabUnderlineStyles = {
	// 	borderBottom: '2px solid #66B2FF',
	// 	fontWeight: 550,
	// 	cursor: 'pointer',
	// 	borderRadius: '3px',
	// };

	const contactStyle = {
		margin: '.1rem 0',
		display: 'flex',
		alignItems: 'center',
	};

	const getBillingAddress = () => {
		switch (type) {
			case 'customer':
				return customerDetails?.customer_billing_address;
			case 'vendor':
				return customerDetails?.vendor_billing_address;
			default:
				return [];
		}
	};

	const getShippingAddress = () => {
		switch (type) {
			case 'customer':
				return customerDetails?.customer_shipping_address;
			case 'vendor':
				return customerDetails?.vendor_shipping_address;
			default:
				return [];
		}
	};

	const getContacts = () => {
		switch (type) {
			case 'customer':
				return customerDetails?.customer_contacts;
			case 'vendor':
				return customerDetails?.vendor_contacts;
			default:
				return [];
		}
	};

	return (
		<Grid container p={3} bgcolor='white'>
			<Grid
				item
				xs={6}
				display='flex'
				// justifyContent='space-between'
				alignItems='start'
			>
				<Typography
					variant='h5'
					color={'white'}
					backgroundColor='#BDBDBD'
					paddingX={1}
					borderRadius={2}
					textTransform={'capitalize'}
					width={'40px'}
					height={'40px'}
					display={'flex'}
					alignItems={'center'}
					justifyContent={'center'}
				>
					{`${
						customerDetails?.first_name ? customerDetails?.first_name[0] : ''
					}${customerDetails?.last_name ? customerDetails?.last_name[0] : ''}`}
				</Typography>
				<div style={{ margin: '0 5px' }}>
					<Typography variant='caption'>
						{capitalizeFirstLetter(type)}
					</Typography>
					<Typography variant='body2' fontWeight='550'>
						{`${customerDetails?.first_name || ''} ${
							customerDetails?.last_name || ''
						}`}
					</Typography>
				</div>
			</Grid>
			<Grid item mt={2} xs={6} sx={{ textAlign: 'right' }}>
				<CloseIcon sx={{ cursor: 'pointer' }} onClick={onClose} />
			</Grid>
			<Grid item xs={12} mt={3}>
				<Divider />
			</Grid>
			<Grid item xs={12} my={2}>
				<Stack direction='row' display='flex' alignItems='center'>
					<ApartmentOutlined fontSize='small' sx={{ color: '#838195' }} />
					<Typography ml={1} variant='body2Grey'>
						{customerDetails?.company_name}
					</Typography>
				</Stack>
				<Stack direction='row' display='flex' alignItems='center'>
					<MailOutlineIcon fontSize='small' sx={{ color: '#838195' }} />
					<Typography ml={1} variant='body2Grey'>
						{customerDetails?.email}
					</Typography>
				</Stack>
			</Grid>
			<TabContext value={activeTab}>
				<Grid item xs={12} container justifyContent={'center'} mt={1}>
					<TabList
						onChange={(e, value) => setActiveTab(value)}
						aria-label='lab API tabs example'
					>
						{Object.entries(TABS).map(([key, value]) => (
							<Tab key={key} label={value} value={value} />
						))}
					</TabList>
					{/* <Typography
					onClick={() => setActiveTab(TABS.DETAIL)}
					sx={
						activeTab === TABS.DETAIL
							? { ...tabUnderlineStyles, padding: '0 .5rem' }
							: { cursor: 'pointer', padding: '0 .5rem' }
					}
				>
					{TABS.DETAIL}
				</Typography>
				<Typography
					onClick={() => setActiveTab(TABS.CONTACT_PERSONS)}
					sx={
						activeTab === TABS.CONTACT_PERSONS
							? { ...tabUnderlineStyles, marginLeft: '3rem' }
							: { marginLeft: '3rem', cursor: 'pointer' }
					}
				>
					{TABS.CONTACT_PERSONS}
				</Typography> */}
					{/* <Typography
					onClick={() => setActiveTab(TABS.ACTIVITY_LOG)}
					sx={
						activeTab === TABS.ACTIVITY_LOG
							? { ...tabUnderlineStyles, marginLeft: '3rem' }
							: { marginLeft: '3rem', cursor: 'pointer' }
					}
				>
					{TABS.ACTIVITY_LOG}
				</Typography> */}
				</Grid>
				<Grid item xs={12}>
					<TabPanel
						sx={{ '&.MuiTabPanel-root': { padding: '0px' } }}
						value={TABS.DETAIL}
					>
						<div>
							{/* <Grid item container>
							<Grid item xs={12}>
								<Paper
									sx={{
										padding: '1rem',
										display: 'flex',
										justifyContent: 'space-around',
									}}
									elavation={0.5}
								>
									<Box
										pr={3}
										mr={5}
										sx={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											flexDirection: 'column',
											borderRight: '1px solid #ccc',
											width: '50%',
										}}
									>
										<WarningIcon
											fontSize='small'
											sx={{ color: '#FC8F31' }}
											my={1}
										/>
										<Typography variant='body2' mt={2}>
											Outstanding Receivables
										</Typography>
										<Typography my={1} fontWeight='550'>
											$ 0.00
										</Typography>
									</Box>
									<Box
										my={1}
										sx={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											flexDirection: 'column',
										}}
									>
										<StopCircle
											fontSize='small'
											sx={{ color: '#07B57F', transform: 'rotate(45deg)' }}
											my={1}
										/>
										<Typography mt={2} variant='body2'>
											Unused Credits
										</Typography>
										<Typography my={1} variant='body2' fontWeight='550'>
											$ 0.00
										</Typography>
									</Box> 
								</Paper>
							</Grid>
						</Grid> */}

							<Grid item container mt={2}>
								<Paper
									sx={{ padding: '1rem 4px', width: '100%' }}
									elavation={0.5}
								>
									<Grid xs={12}>
										<Typography
											variant='body2'
											sx={{
												padding: '1rem .5rem',
												fontWeight: 550,
												borderBottom: '1px solid #ccc',
												textTransform: 'capitalize',
											}}
										>
											{type} Details
										</Typography>
									</Grid>
									<Grid
										xs={12}
										mt={1}
										sx={{ padding: '1rem .5rem', textTransform: 'capitalize' }}
									>
										{type !== 'vendor' && (
											<Grid item container sx={{ display: 'flex' }}>
												<Grid xs={7} display='felx' alignItems='center'>
													<Typography variant='body2Grey'>
														Customer Type
													</Typography>
												</Grid>
												<Grid xs={5} display='felx' alignItems='center'>
													<Typography variant='body2'>
														{customerDetails?.type}
													</Typography>
												</Grid>
											</Grid>
										)}
										<Grid item container sx={{ display: 'flex' }} mt={2}>
											<Grid xs={7}>
												<Typography variant='body2Grey'>Currency</Typography>
											</Grid>
											<Grid xs={5}>
												<Typography variant='body2'>
													{customerDetails?.currency?.toUpperCase() || 'N/A'}
												</Typography>
											</Grid>
										</Grid>
										<Grid item container sx={{ display: 'flex' }} mt={2}>
											<Grid xs={7}>
												<Typography variant='body2Grey'>
													Portal Status
												</Typography>
											</Grid>
											<Grid xs={5}>
												<Typography variant='body2'>
													{customerDetails?.is_portal_access === 0
														? 'Disabled'
														: 'Enabled'}
												</Typography>
											</Grid>
										</Grid>
										{type !== 'vendor' && (
											<Grid item container sx={{ display: 'flex' }} mt={2}>
												<Grid xs={7}>
													<Typography variant='body2Grey'>
														Tax Preferences
													</Typography>
												</Grid>
												<Grid xs={5}>
													<Typography variant='body2'>
														{snakeCaseToPrettyText(
															customerDetails?.tax_preference
														)}
													</Typography>
												</Grid>
											</Grid>
										)}
										{/* <Grid item container sx={{ display: 'flex' }} mt={2}>
											<Grid xs={7}>
												<Typography variant='body2Grey'>Source</Typography>
											</Grid>
											<Grid xs={5}>
												<Typography variant='body2'>CSV</Typography>
											</Grid>
										</Grid> */}
									</Grid>
								</Paper>
							</Grid>
							<Grid item container mt={2}>
								<Paper
									sx={{ padding: '1rem 5px', width: '100%' }}
									elavation={0.5}
								>
									<Grid xs={12}>
										<Typography
											variant='body2'
											sx={{
												padding: '1rem .5rem',
												fontWeight: 550,
												borderBottom: '1px solid #ccc',
											}}
										>
											Address
										</Typography>
									</Grid>
									<Grid item xs={12} mt={2}>
										<Stack direction='row'>
											<LibraryBooksOutlined
												fontSize='12px'
												sx={{ color: '#838195' }}
											/>
											<Typography variant='body2Grey' ml={1}>
												Billing Address
											</Typography>
										</Stack>
										{getBillingAddress()?.length > 0 ? (
											getBillingAddress().map((add, index) => (
												<React.Fragment key={index}>
													<Box
														mt={2}
														ml={1.3}
														paddingBottom={1}
														borderBottom='1px solid #ccc'
													>
														<Box
															borderLeft='2px solid #ccc'
															display='flex'
															flexDirection='column'
															pl={1.3}
														>
															<Typography variant='caption'>
																{add?.attention}
															</Typography>
															<Typography variant='caption'>
																{add?.address}
															</Typography>
															{/* <Typography variant='caption'>
																{add?.address2}
															</Typography> */}
															<Typography
																variant='caption'
																textTransform={'capitalize'}
															>
																{add.city}
																{', '}
																{add.state?.name}
																{', '}
																{add.zipcode}
															</Typography>
															<Typography
																variant='caption'
																textTransform={'capitalize'}
															>
																{add?.country?.name}
															</Typography>
															<Typography variant='caption'>
																{add?.phone}
															</Typography>
														</Box>
													</Box>
												</React.Fragment>
											))
										) : (
											<Typography variant='caption' ml={1.3}>
												No Billing Address
											</Typography>
										)}
									</Grid>
									<Grid item xs={12} mt={2}>
										<Stack direction='row'>
											<LocalShippingOutlined
												fontSize='12px'
												sx={{ color: '#838195' }}
											/>
											<Typography variant='body2Grey' ml={1}>
												Shipping Address
											</Typography>
										</Stack>

										{getShippingAddress()?.length > 0 ? (
											getShippingAddress()?.map((add, index) => (
												<React.Fragment key={index}>
													<Box
														mt={2}
														ml={1.3}
														paddingBottom={1}
														borderBottom='1px solid #ccc'
													>
														<Box
															borderLeft='2px solid #ccc'
															display='flex'
															flexDirection='column'
															pl={1.3}
														>
															<Typography variant='caption'>
																{add?.attention}
															</Typography>
															<Typography variant='caption'>
																{add?.address}
															</Typography>
															{/* <Typography variant='caption'>
																{add?.address2}
															</Typography> */}
															<Typography
																variant='caption'
																textTransform={'capitalize'}
															>
																{add.city}
																{', '}
																{add.state?.name}
																{', '}
																{add.zipcode}
															</Typography>
															<Typography
																variant='caption'
																textTransform={'capitalize'}
															>
																{add?.country?.name}
															</Typography>
															<Typography variant='caption'>
																{add?.phone}
															</Typography>
														</Box>
													</Box>
												</React.Fragment>
											))
										) : (
											<Typography variant='caption' ml={1.3}>
												No Shipping Address
											</Typography>
										)}
									</Grid>
								</Paper>
							</Grid>
						</div>
					</TabPanel>
					<TabPanel
						sx={{ '&.MuiTabPanel-root': { padding: '0px' } }}
						value={TABS.CONTACT_PERSONS}
					>
						<div>
							<Grid item container>
								<Grid item xs={12}>
									<Paper sx={{ padding: '1rem' }} elavation={0.5}>
										<Box>
											{getContacts()?.length > 0 ? (
												getContacts()?.map(contact => (
													<Box
														key={contact.id}
														borderBottom='1px solid #ccc'
														display='flex'
														mt={2}
														p={2}
													>
														<Box
															sx={{
																display: 'flex',
																justifyContent: 'center',
																alignContent: 'center',
																alignItems: 'center',
															}}
														>
															<Typography
																variant='body2'
																textTransform={'uppercase'}
																sx={{
																	height: '50px',
																	width: '40px',
																	backgroundColor: '#F5F5F5',
																	padding: '4px 6px',
																	borderRadius: '10px',
																	display: 'flex',
																	justifyContent: 'center',
																	alignContent: 'center',
																	alignItems: 'center',
																}}
															>
																{`${
																	contact?.first_name
																		? contact?.first_name[0]
																		: ''
																}${
																	contact?.last_name
																		? contact?.last_name[0]
																		: ''
																}`}
															</Typography>
														</Box>

														<Box pl={2}>
															<Typography>{`${contact?.first_name || ''} ${
																contact?.last_name || ''
															}`}</Typography>
															<Box display='flex' flexDirection='column'>
																<Stack direction='row' sx={{ ...contactStyle }}>
																	<MailOutlineIcon sx={{ fontSize: '12px' }} />
																	<Typography variant='caption'>
																		{contact.email}
																	</Typography>
																</Stack>

																<Stack direction='row' sx={{ ...contactStyle }}>
																	<LocalPhoneIcon sx={{ fontSize: '12px' }} />
																	<Typography variant='caption'>
																		{contact?.work_phone}
																	</Typography>
																</Stack>
																<Stack direction='row' sx={{ ...contactStyle }}>
																	<TabletMacIcon sx={{ fontSize: '12px' }} />
																	<Typography variant='caption'>
																		{contact?.mobile}
																	</Typography>
																</Stack>
																<Typography
																	variant='caption'
																	sx={
																		customerDetails?.is_portal_access === 0
																			? { color: 'red' }
																			: { color: 'green' }
																	}
																>
																	{customerDetails?.is_portal_access === 0
																		? 'Portal not Enabled'
																		: 'Portal Enabled'}
																</Typography>
															</Box>
														</Box>
													</Box>
												))
											) : (
												<Typography>No Contact Present</Typography>
											)}
										</Box>
									</Paper>
								</Grid>
							</Grid>
						</div>
					</TabPanel>
					{/* <TabPanel value={TABS.ACTIVITY_LOG}>
					<Box>
						 <ActivityTimeLine /> 
					</Box>
					</TabPanel> */}
				</Grid>
			</TabContext>
		</Grid>
	);
};

export default CustomerViewDrawer;
