import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Add from '@mui/icons-material/Add';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HoverPopover from '../HoverPopover/ErrorOutlinePopover';
import { Link } from 'react-router-dom';
export default function MyCard(props) {
	const {
		title,
		totalUnpaidInvoices,
		currentAmount,
		overdueAmount,
		progressValue,
		option1,
		url1,
		option2,
		url2,
		option3,
		url3,
	} = props;
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<Box>
			<Card variant='outlined' sx={{ width: '500px' }}>
				<CardContent>
					<Typography
						variant='div'
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							marginBottom: '8px',
						}}
					>
						<Typography>
							{title}{' '}
							<HoverPopover text='Total Receivable'>
								<HelpOutlineIcon sx={{ color: 'gray', fontSize: '12px' }} />
							</HoverPopover>
						</Typography>
						<Button onClick={handleClick}>
							<Add /> <Typography>New</Typography>
						</Button>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							<Link
								to={url1}
								style={{
									textDecoration: 'none',
									color: 'black',
								}}
							>
								<MenuItem onClick={handleClose}>
									{' '}
									<Typography sx={{ marginLeft: '-22px' }}>
										<Button>
											<Add />
										</Button>
										{option1}
									</Typography>
								</MenuItem>
							</Link>
							<Link
								to={url2}
								style={{
									textDecoration: 'none',
									color: 'black',
								}}
							>
								<MenuItem onClick={handleClose}>
									<Typography sx={{ marginLeft: '-22px' }}>
										<Button>
											<Add />
										</Button>
										{option2}
									</Typography>
								</MenuItem>
							</Link>
							{option3 && (
								<Link
									to={url3}
									style={{
										textDecoration: 'none',
										color: 'black',
									}}
								>
									<MenuItem onClick={handleClose}>
										{' '}
										<Typography sx={{ marginLeft: '-22px' }}>
											<Button>
												<Add />
											</Button>
											{option3}
										</Typography>
									</MenuItem>
								</Link>
							)}
						</Menu>
					</Typography>
					<Divider></Divider>
					<Typography
						variant='body2'
						sx={{ marginTop: '10px', marginBottom: '8px' }}
					>
						{totalUnpaidInvoices}
					</Typography>
					<LinearProgress
						variant='determinate'
						value={progressValue || 0}
						sx={{
							height: '12px',
							backgroundColor: '#42A5F5',
							marginTop: '4px',
						}}
					/>
				</CardContent>
				<Divider></Divider>
				<Typography variant='div' sx={{ display: 'flex', padding: '12px' }}>
					<Typography
						sx={{
							borderRight: '1px solid gray',
							width: '269px',
							marginRight: '14px',
						}}
					>
						<Typography sx={{ color: '#42A5F5' }}> Current</Typography>
						<Typography sx={{ fontWeight: 'bold', paddingTop: '5px' }}>
							${currentAmount}
						</Typography>
					</Typography>
					<Typography>
						<Typography sx={{ color: 'red' }}> Overdue</Typography>
						<Typography sx={{ fontWeight: 'bold', paddingTop: '5px' }}>
							${overdueAmount}
						</Typography>
						{/* <Button
							sx={{
								fontWeight: 'bold',
								color: 'black',
								'&:hover': { background: 'white' },
								padding: '5px 0px',
							}}
						>
							{overdueAmount}{' '}
							<ArrowDropDownIcon sx={{ paddingTop: '0px', color: 'black' }} />
						</Button> */}
					</Typography>
				</Typography>
			</Card>
		</Box>
	);
}
