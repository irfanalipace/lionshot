import { Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import PriceQuoteForm from '../PriceQuoteForm';
import { useNavigate } from 'react-router-dom';

// common comp
import HeaderPaper from '../../../../Components/Containers/HeaderPaper';

// icons
import CloseIcon from '@mui/icons-material/Close';
import { goBack } from '../../../../../core/utils/helpers';

const NewPriceQuote = () => {
	const navigate = useNavigate();
	return (
		<Grid container>
			<Grid item sm={12}>
				<HeaderPaper
					sx={{
						paddingLeft: '2rem',
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Typography variant='h6'>New Price Quote</Typography>
					<IconButton onClick={() => goBack(() => navigate('/price-quote'))}>
						<CloseIcon />
					</IconButton>
				</HeaderPaper>
			</Grid>
			<PriceQuoteForm />
		</Grid>
	);
};

export default NewPriceQuote;
