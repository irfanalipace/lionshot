import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { Button } from '@mui/material';

const DotMenu = () => {
	const [anchorEl, setAnchorEl] = useState(null);

	const handleMenuClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<Button
				sx={{
					backgroundColor: '#E5E4E2',
					color: 'black',
					'&:hover': { backgroundColor: 'transparent' },
				}}
				aria-controls='dots-menu'
				aria-haspopup='true'
				onClick={handleMenuClick}
			>
				<MenuRoundedIcon />
			</Button>
			<Menu
				id='dots-menu'
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
			>
				<MenuItem onClick={handleMenuClose}>Option 1</MenuItem>
				<MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
				<MenuItem onClick={handleMenuClose}>Option 3</MenuItem>
			</Menu>
		</div>
	);
};

export default DotMenu;
