import {
	Avatar,
	Box,
	Divider,
	Grid,
	Paper,
	Skeleton,
	Typography,
} from '@mui/material';
import { orange } from '@mui/material/colors';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import { useEffect, useState } from 'react';
import { getInvoiceSummaryApi } from 'core/api/Invoice';

export default function PaymentSummary() {
	const [summaryLoding, setSummaryLoading] = useState(true);
	const [summaryData, setSummaryData] = useState([]);

	const getInvoicSummaryeData = async () => {
		setSummaryLoading(true);
		try {
			const resp = await getInvoiceSummaryApi({});
			setSummaryData(resp.data);
		} catch (error) {
			console.error(error);
		} finally {
			setSummaryLoading(false);
		}
	};

	useEffect(() => {
		getInvoicSummaryeData();
	}, []);

	return (
		<Paper
			sx={{
				height: '155px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'start',
				justifyContent: 'center',
				paddingX: '1.5rem',
				margin: '0.5em 0',
			}}
		>
			<Box sx={{ mb: 3 }}>
				<Typography color='text.secondary' variant='body1bold'>
					Payment Summary
				</Typography>
			</Box>
			<Grid
				container
				spacing={2}
				direction='row'
				justifyContent='center'
				alignItems='center'
			>
				<Grid item xs={3}>
					<Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
						<Box sx={{ display: 'flex' }}>
							<Avatar
								sx={{
									bgcolor: orange[300],
									height: '50px',
									width: '50px',
								}}
							>
								<SouthWestIcon sx={{ color: '#000000' }} fontSize='small' />
							</Avatar>
							<Box sx={{ ml: 2 }}>
								<Typography color='text.secondary' variant='body1'>
									Total Outstanding Receivables
								</Typography>
								{summaryLoding ? (
									<LoadingState />
								) : (
									<Typography variant='h6'>
										$
										{parseFloat(
											summaryData?.total_outstanding_receivables || 0
										).toFixed(2)}
									</Typography>
								)}
							</Box>
						</Box>
					</Box>
				</Grid>

				<Grid item xs>
					<Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
						<Divider orientation='vertical' sx={{ height: '60px' }} />

						<Box>
							<Typography color='text.secondary' variant='body1'>
								Due Today
							</Typography>
							{summaryLoding ? (
								<LoadingState />
							) : (
								<Typography variant='body1bold' color={orange[500]}>
									${parseFloat(summaryData?.due_today || 0).toFixed(2)}
								</Typography>
							)}
						</Box>
						<Divider orientation='vertical' flexItem sx={{ height: '60px' }} />
					</Box>
				</Grid>

				<Grid item xs>
					<Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
						<Box>
							<Typography color='text.secondary' variant='body1'>
								Due Within 30 Days
							</Typography>
							{summaryLoding ? (
								<LoadingState />
							) : (
								<Typography color='text.secondary' variant='body1bold'>
									$
									{parseFloat(summaryData?.due_with_in_30_days || 0).toFixed(2)}
								</Typography>
							)}
						</Box>

						<Divider orientation='vertical' flexItem sx={{ height: '60px' }} />
					</Box>
				</Grid>

				<Grid item xs>
					<Box sx={{ display: 'flex', justifyContent: 'space-end' }}>
						<Box>
							<Typography color='text.secondary' variant='body1'>
								Overdue Invoice
							</Typography>
							{summaryLoding ? (
								<LoadingState />
							) : (
								<Typography color='text.secondary' variant='body1bold'>
									${parseFloat(summaryData?.over_due_invoice || 0).toFixed(2)}
								</Typography>
							)}
						</Box>
						<span style={{ height: '60px', display: 'hidden' }}></span>
					</Box>
				</Grid>
			</Grid>
		</Paper>
	);
}

const LoadingState = () => (
	<Box sx={{ height: 32, display: 'flex', alignItems: 'center' }}>
		<Skeleton width={'100%'} variant='rounded' height={12} />
	</Box>
);
