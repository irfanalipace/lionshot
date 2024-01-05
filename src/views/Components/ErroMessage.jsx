import { Typography } from '@mui/material';

const ErrorMessage = ({ message, touched }) => {
	return (
		<Typography className='Mui-error' color='error' variant='caption'>
			{message && touched ? message : null}
		</Typography>
	);
};

export default ErrorMessage;
