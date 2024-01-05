import React from 'react';
import { Box, Grid, Typography, IconButton } from '@mui/material';
import { Mail } from '@mui/icons-material';
import {
	StatusColor,
	formatDate,
	snakeCaseToPrettyText,
} from '../../../core/utils/helpers';

const CollapsedColumns = ({ row }) => {
	const wholedata = row?.original;
	const customer = wholedata?.customer;
	const estStatusColor = StatusColor(wholedata.status);

	return (
		<Box>
			<Grid container sx={{ justifyContent: 'space-between' }}>
				<Grid item xs={6}>
					<Typography variant='subtitle2'>
						{customer?.first_name} {customer?.last_name}
					</Typography>
					<Typography
						component='span'
						sx={{ fontSize: '12px', color: window.themeColors.primary }}
					>
						{wholedata?.estimate_number}
					</Typography>
					<Typography component='span' sx={{ fontSize: '12px' }}>
						{' '}
						| {formatDate(customer?.created_at)}
					</Typography>
				</Grid>
				<Grid item xs={6} sx={{ textAlign: 'right' }}>
					<Typography variant='body2'>${wholedata?.total || 0}</Typography>
					<Typography variant='caption' sx={{ color: estStatusColor }}>
						{snakeCaseToPrettyText(wholedata?.status) || '--'}
					</Typography>
					<IconButton sx={{ paddingRight: '0' }}>
						{' '}
						<Mail sx={{ fontSize: '15px' }} />{' '}
					</IconButton>
				</Grid>
			</Grid>
		</Box>
	);
};

export default CollapsedColumns;
