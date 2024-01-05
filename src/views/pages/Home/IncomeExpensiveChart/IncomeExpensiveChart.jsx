import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from 'recharts';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';
import DateRangeModal from '../../../Components/DateRangeModal/DateRangeModal';
const chartSetting = {
	width: 500,
	height: 300,
};

const valueFormatter = value => {
	if (value >= 1000) {
		const formattedValue = value / 1000; // Keep one decimal place
		return `${formattedValue}k`;
	} else {
		return `${value}`;
	}
};

export default function IncomeExpensiveChart({
	title,
	onSave,
	incoming_and_outgoingObject,
}) {
	// const [selectedButton, setSelectedButton] = useState('Accrual');
	const [openDateRangeModal, setOpenDateRangeModal] = useState();

	// const handleAccrualClick = () => {
	// 	setSelectedButton('Accrual');
	// };

	// const handleCashClick = () => {
	// 	setSelectedButton('Cash');
	// };

	const filteredData = incoming_and_outgoingObject?.monthly_data?.map(
		entry => ({
			...entry,
			// Expense: selectedButton === 'Accrual' ? entry.Expense : 7,
			// Income: selectedButton === 'Accrual' ? entry.Income : 13,
		})
	);

	return (
		<Box>
			<Card variant='outlined' sx={{ width: '520px', marginTop: '44px' }}>
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
							<HoverPopover text='Income and Expense'>
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
					</Typography>
					<Divider></Divider>
					{/* Accrual cash buttons */}
					{/* <Box
						sx={{ textAlign: 'end', marginTop: '10px', marginBottom: '12px' }}
					>
						<Button
							sx={{
								background:
									selectedButton === 'Accrual' ? '#C6C6C6' : '#dddddd54',
								color: 'black',
								padding: '3px',
								borderRadius: '2px',
								height: '22px',
								fontSize: '10px',
								minWidth: '42px',
							}}
							onClick={handleAccrualClick}
						>
							Accrual
						</Button>
						<Button
							sx={{
								background: selectedButton === 'Cash' ? '#C6C6C6' : '#dddddd54',
								color: 'black',
								padding: '3px',
								borderRadius: '2px',
								height: '22px',
								fontSize: '10px',
								minWidth: '42px',
							}}
							onClick={handleCashClick}
						>
							Cash
						</Button>
					</Box> */}
					<BarChart
						style={{ marginTop: '45px' }}
						width={chartSetting.width}
						height={chartSetting.height}
						data={filteredData}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey={entry => [entry.month]} />
						<YAxis tickFormatter={valueFormatter} />
						<Tooltip formatter={value => valueFormatter(value)} />
						<Legend />
						<Bar dataKey='outgoing' name='Expense' fill='#E59357' />
						<Bar dataKey='incoming' name='Income' fill='#A9D47D' barSize={10} />
						{/* <Bar dataKey="newYork" name="New York" fill="#E59357" /> */}
					</BarChart>
					<Divider sx={{ marginBottom: '12px', marginTop: '12px' }}></Divider>
					<Box
						sx={{
							display: 'flex',
							marginLeft: '40px',
							justifyContent: 'space-between',
						}}
					>
						<Typography>
							<Typography
								sx={{ display: 'flex', marginTop: '10px', marginBottom: '4px' }}
							>
								<Typography
									sx={{
										background: 'rgb(169, 212, 125);',
										width: '22px',
										height: '7px',
										marginBottom: '-8px',
									}}
								></Typography>
								<Typography
									sx={{
										fontWeight: 'bold',
										marginTop: '-8px',
										marginLeft: '6px',
										fontSize: '12px',
									}}
								>
									Income
								</Typography>
							</Typography>
							<Typography sx={{ display: 'flex' }}>
								<Typography
									sx={{
										background: 'rgb(229, 147, 87);',
										width: '22px',
										height: '7px',
										marginBottom: '-8px',
									}}
								></Typography>
								<Typography
									sx={{
										fontWeight: 'bold',
										marginTop: '-8px',
										marginLeft: '6px',
										fontSize: '12px',
									}}
								>
									Expense
								</Typography>
							</Typography>
						</Typography>
						<Typography>
							<Typography sx={{ color: '#A9D47D', fontSize: '14px' }}>
								Total Income
							</Typography>
							<Typography sx={{ fontWeight: 'bold' }}>
								${incoming_and_outgoingObject?.total_incoming}
							</Typography>
						</Typography>

						<Typography>
							<Typography sx={{ color: 'red', fontSize: '14px' }}>
								{' '}
								Total Expansive
							</Typography>
							<Typography sx={{ fontWeight: 'bold' }}>
								${incoming_and_outgoingObject?.total_outgoing}
							</Typography>
						</Typography>
					</Box>
					<Typography
						sx={{ marginLeft: '40px', marginTop: '23px', fontSize: '10px' }}
						color='textSecondary'
					>
						* Income and Tax Expense values display are excluesive of taxes
					</Typography>
				</CardContent>
			</Card>
		</Box>
	);
}
