import React, { useState, useEffect } from 'react';
import {
	Checkbox,
	Divider,
	Grid,
	Typography,
	Stack,
	Button,
	Chip,
} from '@mui/material';
import Modal from '@/Components/Modal/Dialog';
import MUIButton from '@/Components/Button/MUIButton';
import AddIcon from '@mui/icons-material/Add';
import CustomerContactsForm from './CustomerContactsForm';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import PersonIcon from '@mui/icons-material/Person';

interface CustomerContact {
	id: number;
	is_selected: number;
	display_name: string;
	email: string;
	first_name: string;
	// Add other properties as needed
}

interface CustomerContactsListProps {
	customerList: any; // Replace 'any' with the actual type
	customer_id: string; // Replace 'number' with the actual type
	customerEmailsList: CustomerContact[];
	setCustomerEmailsList: any;
	gettingCUstomerList: any; // Replace 'any' with the actual type
	pageName?: string; // Replace 'string' with the actual type
}

const CustomerContactsList: React.FC<CustomerContactsListProps> = ({
	customerList,
	customer_id,
	customerEmailsList,
	setCustomerEmailsList,
	gettingCUstomerList,
	pageName,
}) => {
	const [open, setOpen] = useState(false);
	const [selectAll, setSelectAll] = useState(false);

	useEffect(() => {
		// Check if all items are selected
		const allSelected = customerEmailsList.every(
			item => item.is_selected === 1
		);
		setSelectAll(allSelected);
	}, [customerEmailsList]);

	const toggleSelectAll = () => {
		const newSelectAll = !selectAll;
		setSelectAll(newSelectAll);
		setCustomerEmailsList((prevEmailList: any[]) =>
			prevEmailList.map(item => ({
				...item,
				is_selected: newSelectAll ? 1 : 0,
			}))
		);
	};

	const handleEmailCheckBoxes = (
		e: React.ChangeEvent<HTMLInputElement>,
		value: number | 'all'
	) => {
		const newValue = e.target.checked ? 1 : 0;
		let allSelected = true;

		if (value === 'all') {
			setSelectAll(!selectAll);
			setCustomerEmailsList((prevEmailList: any[]) =>
				prevEmailList.map(item => ({ ...item, is_selected: newValue }))
			);
		} else {
			setCustomerEmailsList((prevEmailList: any[]) =>
				prevEmailList.map(item => {
					console.log(prevEmailList);

					if (item.id === value) {
						item.is_selected = newValue;
					}
					if (item.is_selected === 0) {
						allSelected = false;
					}
					return item;
				})
			);
			setSelectAll(allSelected);
		}
	};

	return (
		<>
			<Grid container my={5}>
				<Grid
					item
					xs={12}
					display='flex'
					justifyContent='space-between'
					alignItems='center'
				>
					<Stack direction='row' display='flex' alignItems='center'>
						{pageName === 'paymentRecived' ? (
							<Typography variant='body2' fontWeight='500'>
								Email a "Thank you" Note fot this Payment
							</Typography>
						) : (
							<Typography variant='body2' fontWeight='500'>
								Email Communications
							</Typography>
						)}
						<Button
							variant='text'
							size='small'
							onClick={toggleSelectAll}
							sx={{
								textTransform: 'capitalize',
								fontSize: '15px',
								padding: 0,
								marginLeft: '5px',
							}}
							startIcon={
								<Checkbox
									checked={selectAll}
									onChange={e => handleEmailCheckBoxes(e, 'all')}
									color='primary'
									sx={{ display: 'none' }}
								/>
							}
						>
							{selectAll ? (
								<Stack direction='row' alignItems='center'>
									<CloseIcon fontSize='small' color='error' />
									<Typography variant='body2'>Clear Selection</Typography>
								</Stack>
							) : (
								<Typography variant='body2'>Select All</Typography>
							)}
						</Button>
					</Stack>
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid
					item
					alignItems={'center'}
					alignContent={'center'}
					container
					p={0}
					mt={3}
					spacing={1}
				>
					<Grid item sm={1.2}>
						<MUIButton
							startIcon={<AddIcon fontSize='small' />}
							onClick={() => setOpen(!open)}
							variant='text'
							sx={{ border: '1px dotted  black', borderRadius: '6px' }}
						>
							Add New
						</MUIButton>
					</Grid>
					<Grid item sm={10}>
						<Stack
							direction='row'
							display='flex'
							alignItems='start'
							flexWrap='wrap'
							rowGap={1}
							columnGap={1}
						>
							<Stack
								direction='row'
								display='flex'
								alignItems='center'
								bgcolor='#eaeaf1'
								borderRadius='6px'
								px={1}
							>
								<Checkbox
									size='small'
									checked={true}
									// onChange={e => handleEmailCheckBoxes(e, list.id)}
								/>
								<PersonIcon
									fontSize='small'
									sx={{
										color: 'white',
										background: 'grey',
										borderRadius: '4px',
									}}
								/>

								<Typography variant='body2' ml={1}>
									{`<${customerList?.email}>`}
								</Typography>
							</Stack>
							{customerEmailsList &&
								customerEmailsList.length &&
								customerEmailsList.map((list, index) => (
									<Box key={list.id}>
										<Stack
											direction='row'
											display='flex'
											alignItems='center'
											bgcolor='#eaeaf1'
											borderRadius='6px'
											px={1}
										>
											<Checkbox
												size='small'
												checked={list.is_selected === 1}
												onChange={e => handleEmailCheckBoxes(e, list.id)}
											/>
											<PersonIcon
												fontSize='small'
												sx={{
													color: 'white',
													background: 'grey',
													borderRadius: '4px',
												}}
											/>
											{/* <Typography variant='body2' ml={1}>
												{`${list?.first_name} `}
											</Typography> */}
											<Typography variant='body2' ml={1}>
												{`<${list?.email}>`}
											</Typography>
										</Stack>
									</Box>
								))}
						</Stack>
					</Grid>
				</Grid>
				{open ? (
					<Modal
						title='Add contact person'
						open={open}
						onClose={() => setOpen(!open)}
					>
						{open ? (
							<CustomerContactsForm
								setCustomerEmailsList={setCustomerEmailsList}
								onClose={() => setOpen(!open)}
								customer_id={customer_id}
								gettingCUstomerList={gettingCUstomerList}
							/>
						) : null}
					</Modal>
				) : (
					''
				)}
			</Grid>
		</>
	);
};

export default CustomerContactsList;
