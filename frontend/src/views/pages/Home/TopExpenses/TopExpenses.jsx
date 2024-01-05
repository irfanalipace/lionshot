import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';
import DateRangeModal from '../../../Components/DateRangeModal/DateRangeModal';
const valueFormatter = value => `$${value.toFixed(2)}`;

export default function TopExpenses({
	title,
	onSave,
	top_selling_itemsObject,
}) {
	const [openDateRangeModal, setOpenDateRangeModal] = useState();
	// const data = [
	// 	// { value: 123456.789, label: 'Operating Expenses' },
	// 	// { value: 98765.432, label: 'Marketing Costs' },
	// 	// { value: 2398765.432, label: 'dd Costs' },
	// 	// Add more data points as needed
	// ];
	let arrayOfObjects;
	if (Array.isArray(top_selling_itemsObject)) {
		arrayOfObjects = top_selling_itemsObject;
	} else {
		arrayOfObjects = Object.values(top_selling_itemsObject || {});
	}
	const data = arrayOfObjects.map(item => ({
		value: item?.quantity_sold || 0,
		label: item?.item_name,
	}));
	return (
		<Box>
			<Card
				variant='outlined'
				sx={{
					width: '490px',
					marginTop: '44px',
					marginLeft: '12px',
					position: 'relative',
				}}
			>
				<CardContent>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							marginBottom: '8px',
						}}
					>
						<Typography>
							{title}{' '}
							<HoverPopover text='Your Top Expenses'>
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
						{/* <Typography sx={{ marginTop: '-6px' }}>
							<Button
								onClick={handleClick}
								sx={{
									color: '#9b9494ed',
									'&:hover': {
										backgroundColor: 'white',
										// You can define the hover color you desire
									},
								}}
							>
								{' '}
								{fiscalYear}
								<ArrowDropDownIcon />
							</Button>
						</Typography>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							<MenuItem onClick={handleClose}>{fiscalYear}</MenuItem>
							<MenuItem onClick={handleClose}> {quarter}</MenuItem>
							<MenuItem onClick={handleClose}> {month}</MenuItem>
							<MenuItem onClick={handleClose}>{priviousYear}</MenuItem>
							<MenuItem onClick={handleClose}> {priviousQuarter}</MenuItem>
							<MenuItem onClick={handleClose}> {priviousMonth}</MenuItem>
							<MenuItem onClick={handleClose}> {last6Month}</MenuItem>
							<MenuItem onClick={handleClose}> {last12Month}</MenuItem>
						</Menu> */}
					</Box>
					<Divider></Divider>
					{/* <Box
						sx={{
							position: 'absolute',
							zIndex: '999',

							width: '100%',
							textAlign: 'right',
							marginTop: '45px',
							paddingRight: '29px',
						}}
					>
						<Typography
							sx={{
								height: 25,
								width: 25,
								backgroundColor: '#f29234',
								borderRadius: '50%',
								display: 'inline-block',
								padding: '12px',
								position: 'absolute',
								marginLeft: '-29px',
							}}
						></Typography>{' '}
						Cost of good Sold (100.00%)
					</Box> */}
					{Object.keys(top_selling_itemsObject).length === 0 && (
						<Typography variant='h6' sx={{ textAlign: 'center' }}>
							Data is not Available
						</Typography>
					)}
					<PieChart width={400} height={466}>
						<Pie
							dataKey='value'
							data={data}
							outerRadius={90}
							fill='#E59357'
							label={true}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill='#E59357' />
							))}
						</Pie>
						<Legend />
						<Tooltip
							formatter={(value, name, entry) => [
								valueFormatter(value),
								entry.payload.label.split(' ').join('\n'), // Break label into lines
							]}
						/>
					</PieChart>
				</CardContent>
			</Card>
		</Box>
	);
}
