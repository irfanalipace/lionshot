import { Grid, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import { useNavigate } from 'react-router-dom';
import { goBack } from '../../../../core/utils/helpers';

const NewVendorCreditHeader = ({ children, title }) => {
	const navigate = useNavigate();

	return (
		<Grid container>
			<Grid item sm={12}>
				<HeaderPaper>
					<Grid
						container
						rowSpacing={1}
						columnSpacing={{ xs: 1, sm: 2, md: 3 }}
					>
						<Grid item xs={6}>
							<Typography variant='h6' className='TextCapitalize'>
								{title}
							</Typography>
						</Grid>
						<Grid item xs={6} sx={{ textAlign: 'right' }}>
							<IconButton
								onClick={() => goBack(() => navigate('/credit-memo'))}
								aria-label='delete'
							>
								<CloseIcon />
							</IconButton>
						</Grid>
					</Grid>
				</HeaderPaper>
			</Grid>
			{children}
		</Grid>
	);
};

export default NewVendorCreditHeader;
