import {
	EstimateStatusColor,
	formatDate,
	snakeCaseToPrettyText,
} from '@/utils/helper';
import { Mail } from '@mui/icons-material';
import { Box, Grid, IconButton, Typography } from '@mui/material';

export const DateCell = ({ children }: any) => (
	<Box
		sx={{
			display: 'flex',
			alignItems: 'center',
			gap: '1rem',
		}}
	>
		<Typography variant='body2'>
			{children ? `${formatDate(children)}` : '--'}
		</Typography>
	</Box>
);

export const InvoiceNumberCell = ({ children }: any) => (
	<Box
		sx={{
			display: 'flex',
			alignItems: 'center',
			gap: '1rem',
			color: '#2196F3',
			padding: '5px',
		}}
	>
		<span>{children}</span>
	</Box>
);

export const AmountCell = ({ children }: any) => (
	<Box
		sx={{
			display: 'flex',
			alignItems: 'center',
			gap: '1rem',
			padding: '5px',
		}}
	>
		<Typography variant='body2'>{children ? `$${children}` : '--'}</Typography>
	</Box>
);

export const CustomerCard = ({ data }: any) => (
	<Grid
		container
		sx={{
			justifyContent: 'space-between',
			width: '100%',
		}}
	>
		<Grid item>
			<Typography variant='subtitle2'>{data.customer?.display_name}</Typography>
			<Typography component='span' sx={{ fontSize: '12px', color: '#2196F3' }}>
				{data.invoice_number}
			</Typography>
			<Typography component='span' sx={{ fontSize: '12px' }}>
				{' | '}
				{data.invoice_date}
			</Typography>
		</Grid>
		<Grid item sx={{ textAlign: 'right' }}>
			<Typography variant='body2'>${data?.total || 0}</Typography>
			<Typography
				variant='caption'
				sx={{ color: EstimateStatusColor(data?.status) }}
			>
				{console.log(data.status)}
				{snakeCaseToPrettyText(data?.status) || '--'}
			</Typography>
			<IconButton sx={{ paddingRight: '0' }}>
				<Mail sx={{ fontSize: '15px' }} />{' '}
			</IconButton>
		</Grid>
	</Grid>
);
