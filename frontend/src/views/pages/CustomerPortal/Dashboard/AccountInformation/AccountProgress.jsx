import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

const AccountProgress = ({ label, value }) => {
	return (
		<Box width='45%'>
			<Stack direction='row' display='flex' justifyContent='space-between'>
				<Typography variant='templateBody'>{label || 'Paid Amount'}</Typography>
				<Typography variant='body2'>${value || 0}</Typography>
			</Stack>
			<LinearProgress variant='buffer' value={value || 0} sx={{ height: 10 }} />
		</Box>
	);
};

export default AccountProgress;
