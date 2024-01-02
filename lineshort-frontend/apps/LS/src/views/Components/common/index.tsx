import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
	StatusColor,
	snakeCaseToPrettyText,
} from '../../../core/utils/helpers';
import useTheme from '@mui/material/styles/useTheme';

import { Theme } from '@mui/material/styles';

export const Ribbon = ({ status }: { status: string }) => {
	const theme: Theme = useTheme();

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
