import React, { useState } from 'react';
import MUIButton from '../../../Components/Button/MUIButton';
import CloseIcon from '@mui/icons-material/Close';
import {
	acceptPriceQuoteApi,
	declinePriceQuoteApi,
} from '../APIs/CustomerPortalAPIs';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
const PriceQuoteStatus = ({ getSpecificPriceQuote, status }) => {
	console.log('status', status);
	const [errors, setErrors] = useState(null);

	const acceptingPriceQuote = async () => {
		try {
			const resp = await acceptPriceQuoteApi({
				estimate_id: 'encrypt_NA==_code',
				customer_id: 'encrypt_NQ==_code',
			});
			notyf.success('Price Quotes Accepted');
			getSpecificPriceQuote();
		} catch (error) {
			console.log('errors', error?.data?.message.error);
			setErrors(error?.data?.message?.error);
		}
	};

	const decliningPriceQuote = async () => {
		try {
			await declinePriceQuoteApi({
				customer_id: 'encryptt_Mg==_code',
				estimate_id: 'encryptt_MQ==_code',
			});
			notyf.success('Price Quotes declined');
			getSpecificPriceQuote();
		} catch (error) {
			console.log('errors', error?.data?.message.error);
			setErrors(error?.data?.message?.error);
		}
	};

	return (
		<>
			{status !== 'accepted' &&
			status !== 'declined' &&
			status !== undefined ? (
				<Grid
					mt={2}
					item
					xs={9}
					display='flex'
					alignItems='flex-end'
					direction='column'
				>
					<Stack direction='row' columnGap={3}>
						<MUIButton variant='outlined' onClick={decliningPriceQuote}>
							Declined
						</MUIButton>
						<MUIButton onClick={acceptingPriceQuote}>Accept</MUIButton>
					</Stack>
					<Stack direction='row' display='flex' alignItems='center'>
						<Typography color='error'>{errors}</Typography>
						{errors && (
							<IconButton onClick={() => setErrors(null)}>
								<CloseIcon />
							</IconButton>
						)}
					</Stack>
				</Grid>
			) : null}
		</>
	);
};

export default PriceQuoteStatus;
