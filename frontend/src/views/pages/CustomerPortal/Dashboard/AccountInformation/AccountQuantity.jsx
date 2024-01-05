import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const AccountQuantity = ({ sm, label, value }) => {
	return (
		<>
			<Grid item sm={sm || 2.9}>
				<Box paddingX={3}>
					<Typography variant='h5' fontSize='16px'>
						{label || 'Accepted Paid Amount'}
					</Typography>
					<Typography color='primary' variant='h6' fontSize='28px'>
						{`${(value || 0).toFixed(2)}`}
					</Typography>
				</Box>
			</Grid>
		</>
	);
};

export default AccountQuantity;
