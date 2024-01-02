import React, { useEffect, useState } from 'react';
import {
	Box,
	IconButton,
	Typography,
	List,
	Divider,
	Menu,
	MenuItem,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import AddressForm from '@/Components/AddressForm/AddressForm';
import Modal from '@/Components/Modal/Dialog';
import MUIButton from '@/Components/Button/MUIButton';
import notyf from '@/Components/NotificationMessage/notyfInstance';
import { markAddressDefaultApi } from '@/apis/invoice';

interface AddressProps {
	customer_billing_address: any[];
	billing?: boolean;
	shipping?: boolean;
	gettingCUstomerList: () => void;
	customer_id: string;
	customerList: any;
	selectedCustomer: any;
}

const Address: React.FC<AddressProps> = ({
	customer_billing_address,
	billing,
	shipping,
	gettingCUstomerList,
	customer_id,
	customerList,
	selectedCustomer,
}) => {
	// const [addAddressOpen, setAddAddressOpen] = useState<boolean>(false);
	const [selectedAddress, setSelectedAddress] = useState<any>();
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [defaultAddress, setDefaultAddress] = useState<JSX.Element[]>([]);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [addressFormOpen, setAddressFormOpen] = useState<boolean>(false);
	const [addressType, setAddressType] = useState<string>('');

	const handleAddAddressForm1 = (addressType: string) => {
		setAddressFormOpen(!addressFormOpen);
		setAddressType(addressType);
	};

	const handleAddAddressForm = (address?: any) => {
		setAddressFormOpen(!addressFormOpen);
		if (address?.id) {
			setSelectedAddress(address);
			setIsEdit(true);
		}
	};

	const handleAddressMenu = (
		event: React.MouseEvent<HTMLElement>,
		type: string
	) => {
		setAnchorEl(event.currentTarget);
		setAddressType(type);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
		setSelectedAddress(null);
	};

	useEffect(() => {
		const defaultAddressData = customer_billing_address?.filter(
			(list) => list.is_default === 1
		);
		setDefaultAddress(
			defaultAddressData?.map((address) => (
				<Box
					key={address.id}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'start',
					}}>
					<Typography variant='caption' textTransform='capitalize'>{address.country_name}</Typography>
					<Typography variant='caption'>{address.phone}</Typography>
					<Typography variant='caption'>{address.address}</Typography>
					<Typography variant='caption'>{address.address2}</Typography>
					<Typography variant='caption'>{address.zipcode}</Typography>
					<Typography variant='caption'>{address.fax}</Typography>
				</Box>
			))
		);
	}, [customer_id, customerList]);

	const renderAddressSection = (addressName: string, addressType: string) => {
		return customer_billing_address?.length > 0 &&
			defaultAddress?.length === 1 ? (
			<>
				<Typography variant='body2Grey'>{addressName}</Typography>
				<IconButton
					onClick={(event) => handleAddressMenu(event, addressType)}
					sx={{ cursor: 'pointer' }}>
					<EditOutlinedIcon fontSize='small' />
				</IconButton>
			</>
		) : customer_billing_address?.length === 0 ? (
			<Box
				sx={{ mt: 1 }}
				display='flex'
				flexDirection='column'
				justifyContent='start'
				alignItems='start'>
				<Typography variant='body2Grey'>{addressName} </Typography>
				<MUIButton
					variant='text'
					onClick={() => {
						handleCloseMenu();
						handleAddAddressForm1(addressType);
					}}>
					Add New Address
				</MUIButton>
			</Box>
		) : null;
	};

	const handleMarkAsDefault = async (address: any) => {
		const updatedData = {
			id: address?.id,
			customer_id,
			type: address?.type,
		};
		try {
			// Assuming you have a function markAddressDefaultApi
			const resp: any = await markAddressDefaultApi(updatedData);
			notyf.success(resp?.message);
			gettingCUstomerList();
		} catch (error) {
		} finally {
			handleCloseMenu();
		}
	};

	// const title =
	// 	isEdit && shipping
	// 		? 'Shipping Address'
	// 		: isEdit && billing
	// 		? 'Billing Address'
	// 		: 'Additional Address';

	if (selectedCustomer === null) {
		return null;
	}
	return (
		<Box sx={{ ml: billing ? 2 : 0 }}>
			{billing && renderAddressSection('BILLING ADDRESS', 'billing')}
			{shipping && renderAddressSection('SHIPPING ADDRESS', 'shipping')}
			<Box>{defaultAddress}</Box>
			<Menu
				anchorEl={anchorEl}
				id='account-menu'
				open={Boolean(anchorEl)}
				onClose={handleCloseMenu}
				PaperProps={{
					elevation: 0,
					sx: {
						...MenuSx,
					},
				}}
				transformOrigin={{ horizontal: 'left', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
				<List sx={{ width: 400, maxHeight: 200, overflowY: 'auto' }}>
					{customer_billing_address?.map((address, index) => (
						<React.Fragment key={index}>
							<MenuItem
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'start',
								}}
								onClick={(event) => {
									event.stopPropagation();
									handleMarkAsDefault(address);
								}}>
								<Box width='100%' display='flex' justifyContent='flex-end'>
									<IconButton
										onClick={(event) => {
											event.stopPropagation();
											handleCloseMenu();
											handleAddAddressForm(address);
										}}
										sx={{ cursor: 'pointer' }}>
										<EditOutlinedIcon fontSize='small' />
									</IconButton>
								</Box>
								<Typography variant='caption' textTransform='capitalize'>
									{address.country_name}
								</Typography>
								<Typography variant='caption'>{address.phone}</Typography>
								<Typography variant='caption'>{address.address}</Typography>
								<Typography variant='caption'>{address.address2}</Typography>
								<Typography variant='caption'>{address.zipcode}</Typography>
								<Typography variant='caption'>{address.fax}</Typography>
							</MenuItem>
							<Divider />
						</React.Fragment>
					))}
				</List>

				<Divider />
				<MenuItem sx={{ justifyContent: 'center' }}>
					<MUIButton
						fullWidth
						onClick={() => {
							handleCloseMenu();
							handleAddAddressForm();
						}}
						variant='text'
						startIcon={<AddIcon />}>
						Add New Address
					</MUIButton>
				</MenuItem>
			</Menu>

			<Modal
				title={''}
				open={addressFormOpen}
				onClose={handleAddAddressForm}
				sx={{
					position: 'absolute',
					right: 20,
					top: 18,
				}}>
				{addressFormOpen && (
					<AddressForm
						handleClose={handleAddAddressForm}
						addressFormOpen={addressFormOpen}
						type={addressType}
						address={isEdit && selectedAddress}
						customerList={customerList}
						customer_id={customer_id}
						gettingCUstomerList={gettingCUstomerList}
					/>
				)}
			</Modal>
		</Box>
	);
};

export default Address;

const MenuBeforeStyles = {
	content: '""',
	display: 'block',
	position: 'absolute',
	top: 0,
	left: 15,
	right: 14,
	width: 15,
	height: 15,
	bgcolor: 'background.paper',
	transform: 'translateY(-50%) rotate(45deg)',
	zIndex: 0,
};

const MenuSx = {
	overflow: 'visible',
	filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
	mt: 1.5,
	'& .MuiAvatar-root': {
		width: 32,
		height: 32,
		ml: -0.5,
		mr: 1,
	},
	'&:before': { ...MenuBeforeStyles },
};
