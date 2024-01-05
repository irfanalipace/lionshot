// import React from 'react';
import { Grid, IconButton, Box, Typography } from '@mui/material';
import {
	StatusColor,
	snakeCaseToPrettyText,
	formatDate,
} from 'core/utils/helpers';
import { useTheme } from '@mui/material/styles';
import { Mail } from '@mui/icons-material';

export const DateCell = ({ children }) => (
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

export const InvoiceNumberCell = ({ children }) => (
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

export const AmountCell = ({ children }) => (
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

export const CustomerCard = ({ data }) => {
	const theme = useTheme();
	return (
		<Grid
			container
			sx={{
				justifyContent: 'space-between',
				width: '100%',
			}}
		>
			<Grid item>
				<Typography variant='subtitle2'>{data.customer_name}</Typography>
				<Typography
					component='span'
					sx={{ fontSize: '12px', color: '#2196F3' }}
				>
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
					sx={{ color: StatusColor(data?.status, theme) }}
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
};

export const Ribbon = ({ status }) => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				position: 'absolute',
				height: 85,
				width: '133px',
				overflow: 'hidden',
			}}
		>
			<Typography
				sx={{
					position: 'absolute',
					left: 0,
					bottom: 0,
					color: 'white',
					width: '100%',
					textAlign: 'center',
					transform: 'rotate(-39.5deg)',
					transformOrigin: 'bottom left',
					textTransform: 'capitalize',
					background: StatusColor(status, theme),
				}}
			>
				{snakeCaseToPrettyText(status)}
			</Typography>
		</Box>
	);
};
