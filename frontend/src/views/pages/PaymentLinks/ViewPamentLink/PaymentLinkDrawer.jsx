/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import CustomDrawer from '../../../Components/Drawer/Drawer';
import GridRow from '../../../Components/GridRow/GridRow';
import {
	Button,
	Divider,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	TextareaAutosize,
	Typography,
} from '@mui/material';
import {
	AccountBox,
	ArrowOutward,
	Close,
	ContentCopy,
	Edit,
	MoreVert,
} from '@mui/icons-material';
import { Box } from '@mui/system';
import {
	SinglePaymentLinkApi,
	UpdatePaymentLink,
} from '../../../../core/api/paymentLinks';
import { formatDate } from '../../../../core/utils/helpers';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import FormField from '../../../Components/InputField/FormField';
import Modal from '../../../Components/Modal/Dialog';
import { Link } from 'react-router-dom';
function PaymentLinkDrawer({
	open,
	onClose,
	paymentLinkID,
	handleDeletePaymentLink,
	setRefresh,
}) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const openMenu = Boolean(anchorEl);
	const [paymentLinkData, setpaymentLinkData] = useState();
	const [copySuccess, setCopySuccess] = useState(false);
	const [newDescription, setNewDescription] = useState();
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [dialogProps, setDialogProps] = useState({});
	const [expiryDateModal, setexpiryDateModal] = useState();
	const [newExpiryDate, setNewExpiryDate] = useState();

	const SinglePaymentLink = async () => {
		try {
			if (paymentLinkID) {
				const res = await SinglePaymentLinkApi(paymentLinkID);
				setpaymentLinkData(res);
				setNewDescription(res?.description);
				setNewExpiryDate(res?.link_expiration_date);
			}
		} catch (error) {
			console.log('error in payment link drawer', error);
		}
	};
	useEffect(() => {
		SinglePaymentLink();
	}, [paymentLinkID]);

	const handleClickMenu = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleCloseMenu = () => {
		setAnchorEl(null);
	};
	const CopyButtonCliked = PaymentLinkString => {
		navigator.clipboard.writeText(PaymentLinkString);
		setCopySuccess(true);
		setTimeout(() => {
			setCopySuccess(false);
		}, 1000);
	};
	const [editDescription, setEditDescription] = useState(false);
	const formattedDate = newExpiryDate?.replace(/^(\d{4}-\d{2}-\d{2}).*$/, '$1');
	const updatedValues = {
		customer_id: paymentLinkData?.customer_id,
		payment_amount: paymentLinkData?.payment_amount,
		link_expiration_date: formattedDate,
		description: newDescription,
		button_type: 'generate_link',
		invoice_id: paymentLinkData?.invoice_id,
	};
	const handleSaveClick = async () => {
		console.log('save clicked new Description: ', newDescription);
		const res = await UpdatePaymentLink(paymentLinkData?.id, updatedValues);
		if (res) {
			SinglePaymentLink();
			setEditDescription(false);
		}
	};
	const UpdateExpiryLinkClick = async () => {
		console.log('save clicked new expiry link: ', newExpiryDate);
		const res = await UpdatePaymentLink(paymentLinkData?.id, updatedValues);
		if (res) {
			SinglePaymentLink();
			setexpiryDateModal(false);
		}
	};

	return (
		<CustomDrawer open={open} onClose={onClose}>
			<GridRow
				style={{
					padding: '10px 30px',
					alignItems: 'center',
					margin: '0 0 10px -24px',
				}}
			>
				<Grid item xs={6}>
					<Typography variant='h6' component='span'>
						{paymentLinkData?.reference}
					</Typography>
					<Typography
						variant='caption'
						sx={{
							backgroundColor: '#BBBBBB',
							color: 'white',
							padding: '3px 4px',
							marginX: '5px',
							textTransform: 'capitalize',
							display: 'inline-block',
						}}
					>
						{paymentLinkData?.status || 'N/A'}
					</Typography>
				</Grid>
				<Grid item xs={6} sx={{ textAlign: 'right' }}>
					<Button
						onClick={handleClickMenu}
						sx={{
							'&:hover': { border: '1px solid #1976D2' },
							backgroundColor: 'transparent',
							border: '1px solid #1976D2',
							borderRadius: '4px',
							padding: '2px 5px',
							minWidth: '20px',
							margin: '0 8px',
						}}
					>
						<MoreVert sx={{ color: '#1976D2' }} />
					</Button>
					<Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
						<MenuItem
							onClick={() => {
								setOpenConfirmDialog(true);
								setDialogProps({
									onConfirm: () => handleDeletePaymentLink(paymentLinkID),
								});
							}}
						>
							Delete
						</MenuItem>
					</Menu>
					<IconButton variant='span' onClick={onClose}>
						<Close />
					</IconButton>
				</Grid>
			</GridRow>
			<Divider />
			<GridRow style={{ padding: '10px 30px', marginTop: '10px' }}>
				<Grid item xs={1}>
					<AccountBox fontSize='large' sx={{ color: '#C5C5C5' }} />
				</Grid>
				<Grid item xs={11}>
					<Typography component='p' variant='body1bold'>
						{paymentLinkData?.customers?.display_name || 'N/A'}
						<ArrowOutward
							sx={{
								color: window.themeColors.primary,
								fontSize: '18px',
								marginBottom: '-3px',
							}}
						/>
					</Typography>
					<Typography component='p' variant='body2Grey'>
						{paymentLinkData?.customers?.email || 'N/A'}
					</Typography>
				</Grid>
			</GridRow>
			<Box
				sx={{
					border: '1px solid #d2d4db',
					margin: '0 30px',
					borderRadius: '10px',
				}}
			>
				<Box sx={{ padding: '10px 30px' }}>
					<Typography variant='body2Grey'>Payment Amount</Typography>
					<Typography variant='h6'>
						${paymentLinkData?.payment_amount || '0'}
					</Typography>
				</Box>
				<Box sx={{ padding: '10px 30px', backgroundColor: '#EBEDF6' }}>
					<Link
						onClick={e => {
							e.stopPropagation();
						}}
						to={paymentLinkData?.payment_link}
						style={{ textDecoration: 'none' }}
					>
						<Typography variant='body1bold' color={window.themeColors.primary}>
							{paymentLinkData?.payment_link || 'N/A'}
						</Typography>
					</Link>
					{paymentLinkData?.payment_link && (
						<ContentCopy
							sx={{
								color: window.themeColors.primary,
								fontSize: '15px',
								margin: '0 0 -3px 10px',
								cursor: 'pointer',
							}}
							onClick={() => CopyButtonCliked(paymentLinkData?.payment_link)}
						/>
					)}
					{copySuccess && (
						<Typography
							component='span'
							variant='overline'
							sx={{ color: 'green' }}
						>
							Link Copied
						</Typography>
					)}
					<Box mt={1.5}>
						<Typography component='span' variant='body2'>
							Linked Expired:{' '}
						</Typography>
						<Typography
							component='span'
							variant='body2Bold'
							sx={{ textTransform: 'capitalize' }}
						>
							{formatDate(paymentLinkData?.link_expiration_date) || 'N/A'}
						</Typography>
						<Edit
							sx={{
								color: window.themeColors.primary,
								fontSize: '15px',
								margin: '0 0 -3px 10px',
								cursor: 'pointer',
							}}
							onClick={() => setexpiryDateModal(true)}
						/>
					</Box>
				</Box>
			</Box>
			<Box sx={{ margin: '50px 30px' }}>
				<Divider />
				<Typography
					component='p'
					variant='subtitle2Grey'
					sx={{ margin: '20px 0 10px 0' }}
				>
					OTHER DETAILS
				</Typography>
				<GridRow>
					<Grid item xs={3}>
						<Typography component='p' variant='body2Grey'>
							Created By
						</Typography>
						<Typography component='p' variant='body2Grey'>
							Created on
						</Typography>
						<Typography component='p' variant='body2Grey'>
							Description
						</Typography>
					</Grid>
					<Grid item xs={9}>
						<Typography
							component='p'
							variant='body2'
							className='TextCapitalize'
						>
							{paymentLinkData?.user?.first_name || ''}{' '}
							{paymentLinkData?.user?.last_name || 'N/A'}
						</Typography>
						<Typography component='p' variant='body2'>
							{formatDate(paymentLinkData?.created_at) || 'N/A'}
						</Typography>

						{editDescription ? (
							<>
								<TextareaAutosize
									style={textAreaStyle}
									value={newDescription}
									onChange={e => setNewDescription(e.target.value)}
									minRows={2}
									placeholder='Enter new description'
								/>{' '}
								<br />
								<Button
									variant='contained'
									size='small'
									onClick={() => handleSaveClick()}
								>
									Save
								</Button>
								<Button
									variant='contained'
									size='small'
									onClick={() => setEditDescription(false)}
									sx={{ marginLeft: '5px', background: 'grey' }}
								>
									Cancel
								</Button>
							</>
						) : (
							<>
								<Typography component='span' variant='body2'>
									{paymentLinkData?.description || 'N/A'}
								</Typography>
								<Edit
									sx={{
										color: window.themeColors.primary,
										fontSize: '15px',
										margin: '0 0 -3px 10px',
										cursor: 'pointer',
									}}
									onClick={() => setEditDescription(true)}
								/>
							</>
						)}
					</Grid>
				</GridRow>
			</Box>
			{expiryDateModal && (
				<Modal
					open={expiryDateModal}
					onClose={() => setexpiryDateModal(false)}
					title={'Update Expiration Date'}
				>
					<Box p={2}>
						<Typography variant='body2'>
							When you change the expiration date, a new payment link will be
							generated and you will have to share it again with your customer.
							The existing payment link will no longer work.
						</Typography>
						<Typography
							variant='body1'
							sx={{ color: 'red', margin: '20px 0 10px 0' }}
						>
							Link Expiration Date*
						</Typography>
						<FormField
							value={formattedDate}
							type={'date'}
							onChange={e => setNewExpiryDate(e.target.value)}
						/>
						<Divider />
						<Button
							sx={{ marginTop: '20px' }}
							variant='contained'
							onClick={UpdateExpiryLinkClick}
						>
							Update & Generate Link
						</Button>
					</Box>
				</Modal>
			)}

			<ConfirmDialog
				title='Are you sure you want to delete'
				isOpen={openConfirmDialog}
				onClose={() => setOpenConfirmDialog(false)}
				{...dialogProps}
			/>
		</CustomDrawer>
	);
}
const textAreaStyle = {
	width: '50%',
	borderRadius: '4px',
	borderColor: 'gray',
	padding: '5px',
	fontFamily: 'Roboto',
	margin: '.4rem 0',
	maxWidth: '50%',
};
export default PaymentLinkDrawer;
