import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Dialog';
import MUIButton from '../Button/MUIButton';
import AddIcon from '@mui/icons-material/Add';
import CustomerContactsForm from './CustomerContactsForm';
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/system';
import PersonIcon from '@mui/icons-material/Person';

const CustomerContactsList = ({
	customerDetails,
	selectedEmails,
	setSelectedEmails,
	pageName,
	onSave,
}) => {
	const [open, setOpen] = useState(false);
	const [selectAll, setSelectAll] = useState(false);

	useEffect(() => {
		// Check if all items are selected
		const allSelected = selectedEmails?.every(item => item.is_selected === 1);
		setSelectAll(allSelected);
	}, [selectedEmails]);

	// Toggle "Select All" state
	const toggleSelectAll = () => {
		const newSelectAll = !selectAll;
		setSelectAll(newSelectAll);
		setSelectedEmails(prevEmailList =>
			prevEmailList.map(item => ({
				...item,
				is_selected: newSelectAll ? 1 : 0,
			}))
		);
	};

	// Handle the individual checkbox state
	const handleEmailCheckBoxes = (e, value) => {
		const newValue = e.target.checked ? 1 : 0;
		let allSelected = true;

		if (value === 'all') {
			setSelectAll(!selectAll);
			setSelectedEmails(prevEmailList =>
				prevEmailList.map(item => ({ ...item, is_selected: newValue }))
			);
		} else {
			setSelectedEmails(prevEmailList =>
				prevEmailList.map(item => {
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
			{customerDetails?.id && (
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
									selectedEmails?.length > 0 ? (
										<Stack direction='row' alignItems='center'>
											<CloseIcon fontSize='small' color='error' />
											<Typography variant='body2'>Clear Selection</Typography>
										</Stack>
									) : null
								) : selectedEmails?.length === 0 ? null : (
									<Typography variant='body2'>Select All</Typography>
								)}
							</Button>
						</Stack>
					</Grid>
					<Grid item xs={12}>
						<Divider />
					</Grid>
					<Grid item container p={0} mt={1} spacing={1}>
						<Grid item sm={1.2} mt={1}>
							<MUIButton
								startIcon={<AddIcon fontSize='small' />}
								onClick={() => setOpen(!open)}
								variant='text'
								sx={{ border: '1px dotted  black', borderRadius: '6px' }}
								px={1}
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
								<>
									{customerDetails?.email && (
										<Stack
											title='Primary email cannot be unchecked'
											direction='row'
											display='flex'
											alignItems='center'
											bgcolor='#eaeaf1'
											borderRadius='6px'
											px={1}
										>
											<Checkbox size='small' checked={true} disabled />
											<PersonIcon
												fontSize='small'
												sx={{
													color: 'white',
													background: 'grey',
													borderRadius: '4px',
												}}
											/>
											<Typography variant='body2' ml={1}>
												{`${customerDetails?.first_name} ${customerDetails?.last_name} `}
											</Typography>
											<Typography variant='body2' ml={1}>
												{`<${customerDetails?.email}>`}
											</Typography>
											<Chip
												sx={{ marginLeft: '5px' }}
												label='Primary'
												color='primary'
												size='small'
												variant='contained'
											/>
										</Stack>
									)}
								</>
								{selectedEmails?.map((list, index) => (
									<Box key={list.id}>
										<Stack
											direction='row'
											display='flex'
											alignItems='center'
											bgcolor='#eaeaf1'
											borderRadius='6px'
											px={1}
											// mt={1}
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
											<Typography variant='body2' ml={1}>
												{`${list?.first_name} ${list?.last_name} `}
											</Typography>
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
									onSave={onSave}
									onClose={() => setOpen(!open)}
									customer_id={customerDetails?.id}
								/>
							) : null}
						</Modal>
					) : (
						''
					)}
				</Grid>
			)}
		</>
	);
};

export default CustomerContactsList;
