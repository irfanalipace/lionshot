import { Grid, Typography } from '@mui/material';

export const InvoiceGridItemValue = ({ children }) => {
	return (
		<Grid
			item
			sm={5}
			display={'flex'}
			justifyContent={'start'}
			alignItems={'center'}
			textAlign='left'
			pl={3}
		>
			<Typography
				fontSize={11}
				fontWeight={500}
				variant='templateBody'
				style={{
					textTransform: 'capitalize',
				}}
			>
				{children || '--'}
			</Typography>
		</Grid>
	);
};

export const InvoiceGridItemKey = ({ children }) => {
	return (
		<Grid item sm={7} container direction='row' justifyContent='flex-end'>
			<Typography fontSize={13} variant='templateBody2'>
				{children}
			</Typography>
		</Grid>
	);
};
