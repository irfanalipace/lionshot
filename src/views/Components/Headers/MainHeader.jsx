import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../core/store/auth/authThunks';
import { Avatar } from '@mui/material';
import { Add } from '@mui/icons-material';
///import { ExpandLessIcon } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Grid } from '@mui/material';

import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Stack } from '@mui/system';



const Header = memo(() => {
	const dispatch = useDispatch();
	const [anchorEl, setAnchorEl] = useState(null);
	const userDetails = useSelector(state => state.auth.user);
	const handleMenu = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogOut = () => {
		dispatch(logout());
	};

	const [anchorE2, setAnchorE2] = useState(null);

	const handleListClick = event => {
		setAnchorE2(event.currentTarget);
	};

	const handleListClose = () => {
		setAnchorE2(null);
	};

	return (
		<Box sx={{ height: '60px' }}>
			<AppBar>
				<Grid container alignItems='center' sx={{ background: '#2196F3'}} >
					<Grid item sm={1.9} xs>
						<Typography
							variant='h6'
							// component='div'
							sx={{
								//borderRight: '1px solid white',
								height: '64px',
								color:'white',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
						    
							Line Shot
						</Typography>
					</Grid>

					{/* <SearchBar /> */}

					<Typography
						variant='h6'
						// component='div'
						sx={{ flexGrow: 1 }}
					></Typography>

					{/* <Button onClick={handleListClick} sx={{ position: 'relative' }}>
						<Add sx={{ color: 'white' }} />
					</Button>

					<Box>
						<Menu
							onClose={handleListClose}
							anchorEl={anchorE2}
							id='account-menu'
							open={Boolean(anchorE2)}
							PaperProps={{
								elevation: 0,
								sx: {
									overflow: 'visible',
									filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
									mt: 1.5,
									'& .MuiAvatar-root': {
										width: 32,
										height: 32,
										ml: -0.5,
										mr: 1,
									},
									'&:before': {
										content: '""',
										display: 'block',
										position: 'absolute',
										top: 0,
										// left: 15, // arrow positionm
										right: 14,
										width: 15,
										height: 15,
										bgcolor: 'background.paper',
										transform: 'translateY(-50%) rotate(45deg)',
										zIndex: 0,
									},
								},
							}}
							transformOrigin={{
								horizontal: 'right',
								vertical: 'top',
							}}
							anchorOrigin={{
								horizontal: 'right',
								vertical: 'bottom',
							}}
						>
						
						</Menu>
					</Box> */}

					{/* <IconButton
						size='small'
						edge='start'
						color='inherit'
						aria-label='menu'
						sx={{ outline: 'none', border: 'none' }}
					>
						<NotificationsIcon
							sx={{
								color: 'white',
								marginRight: '10px',
								marginRight: '28px',
								marginLeft: '12px',
							}}
						/>
					</IconButton> */}

					{/* <HeaderDropDown /> */}

					<IconButton
						size='large'
						edge='start'
						color='inherit'
						aria-label='menu'
						style={{ outline: 'none' }}
						onClick={handleMenu} // Define handleMenu
					>
						{/* <AccountCircleIcon /> */}{' '}
						<Avatar>
							<Typography variant='h6' textTransform={'uppercase'}>
								{`${userDetails?.name?.split(' ')[0][0]}${
									userDetails?.name?.split(' ')[1][0]
								}`}
							</Typography>
						</Avatar>
					</IconButton>
					<Menu
						id='profile-menu'
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleClose} // Define handleClose
					>
						<MenuItem onClick={handleLogOut}>Logout</MenuItem>
					</Menu>

					<MenuItem value=''></MenuItem>
				</Grid>
			</AppBar>
		</Box>
	);
});

export default Header;
