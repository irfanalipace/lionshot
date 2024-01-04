import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import MUIButton from '../Button/MUIButton';

const DropdownMenuExample = ({ name, list, selected, dlt, deletingBulk }) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const handleMenuOpen = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<MUIButton
				aria-controls='dropdown-menu'
				aria-haspopup='true'
				onClick={selected && selected.length > 0 && handleMenuOpen}
				variant='contained'
			>
				{name}&ensp;
				<ExpandMoreIcon />
			</MUIButton>
			<Menu
				id='dropdown-menu'
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
			>
				{list?.map(row => (
					<MenuItem
						onClick={() => {
							deletingBulk(selected);
							handleMenuClose();
						}}
						sx={{
							color: window.themeColors.primary,
							width: '165px',
							display: 'flex',
							justifyContent: 'space-between',
						}}
						key={row.id}
					>
						{row.name} {dlt && <DeleteIcon fontSize='small' />}{' '}
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default DropdownMenuExample;
