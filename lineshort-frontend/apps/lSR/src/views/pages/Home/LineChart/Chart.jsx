import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';
import DateRangeModal from '../../../Components/DateRangeModal/DateRangeModal';

export default function Chart(props) {
	const {
		title,
		// fiscalYear,
		// dateMonth,
		// priviousYear,
		// lastYear,
		// cashAmount,
		// cashDate,
		inCommingAmmount,
		inComming,
		outGoing,
		outGoingAmmount,
		// cashLatestDate,
		// cashLatestAmmount,
		// /data,
		dataChart,
		onSave,
	} = props;
	// const [anchorEl, setAnchorEl] = useState(null);
	const [openDateRangeModal, setOpenDateRangeModal] = useState();
	// const [dateObject, setDateObject] = useState({
	// 	start_date: null,
	// 	end_date: null,
	// });

	const formatYAxisTick = tickValue => {
		if (tickValue >= 1000000) {
			return `${tickValue / 1000000}m`;
		} else if (tickValue >= 1000) {
			return `${tickValue / 1000}k`;
		} else {
			return tickValue;
		}
	};

	return (
		<Box>
			<Card variant='outlined' sx={{ width: '1020px', marginTop: '44px' }}>
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
							<HoverPopover text='Total Cash'>
								<HelpOutlineIcon sx={{ color: 'gray', fontSize: '12px' }} />
							</HoverPopover>
						</Typography>

						{/* select option of date  */}
						<Button
							variant='contained'
							onClick={() => setOpenDateRangeModal(true)}
						>
							Date Range
						</Button>
						{openDateRangeModal && (
							<DateRangeModal
								openModal={openDateRangeModal}
								onSave={onSave}
								onClose={() => setOpenDateRangeModal(false)}
							/>
						)}

						{/* <Button
							onClick={handleClick}
							sx={{
								color: '#9b9494ed',
								'&:hover': {
									backgroundColor: 'white',
									// You can define the hover color you desire
								},
							}}
						>
							{dateMonth} <ArrowDropDownIcon />
						</Button>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							<MenuItem onClick={handleClose}>{fiscalYear}</MenuItem>
							<MenuItem onClick={handleClose}> {priviousYear}</MenuItem>
							<MenuItem onClick={handleClose}> {lastYear}</MenuItem>
						</Menu> */}
					</Typography>
					<Divider></Divider>
					<Typography
						variant='body2'
						color='text.secondary'
						sx={{ marginTop: '10px', marginBottom: '8px' }}
					></Typography>
				</CardContent>

				<Box sx={{ display: 'flex', padding: '4px' }}>
					<ResponsiveContainer width='90%' height={320}>
						<LineChart data={dataChart}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='month' />
							<YAxis tickFormatter={formatYAxisTick} />

							<Tooltip />
							<Legend />

							<Line type='monotone' dataKey='incoming' stroke='#42A5F5' />
						</LineChart>
					</ResponsiveContainer>
					<Typography
						sx={{
							width: '256px',
							textAlign: 'end',
							fontSize: '12px',
							padding: '12px',
						}}
						color='textSecondary'
					>
						{/* {cashDate}
						<Typography sx={{ fontWeight: 'bold' }}>${cashAmount}</Typography> */}
						<Typography sx={{ color: 'green', marginTop: '28px' }}>
							{inComming}
						</Typography>
						<Typography>${inCommingAmmount} +</Typography>
						<Typography sx={{ color: 'red', marginTop: '28px' }}>
							{outGoing}
						</Typography>
						<Typography>${outGoingAmmount} =</Typography>
						{/* <Typography
							sx={{ marginTop: '28px', color: '#42A5F5', fontSize: '12px' }}
						>
							{cashLatestDate}
						</Typography>
						<Typography>${cashLatestAmmount} =</Typography> */}
					</Typography>
				</Box>
			</Card>
		</Box>
	);
}
