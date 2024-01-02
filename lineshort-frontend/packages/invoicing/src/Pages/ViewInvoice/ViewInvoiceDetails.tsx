import { Grid, Paper, Stack, Typography } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import MUIButton from '@/Components/Button/MUIButton';

const ViewEstimateDetail = () => {
	return (
		<Paper sx={{ padding: '1.5rem 1rem', borderRadius: '10px', border: 0 }}>
			<Grid item container marginY='.9rem'>
				<Grid item xs={6}>
					<Stack direction='row' spacing={1}>
						<LockOpenIcon fontSize='small' color='primary' />
						<Typography
							variant='subtitle2'
							sx={{
								fontSize: { xs: '.7rem', md: '.9rem' },
								fontWeight: 550,
							}}>
							Show Estimate Detail
						</Typography>
					</Stack>
				</Grid>
				<Grid
					item
					xs={6}
					display='flex'
					justifyContent='flex-end'
					alignItems='center'>
					<MUIButton startIcon={<NewspaperIcon />}>Download PDF</MUIButton>
				</Grid>
			</Grid>
		</Paper>
	);
};

export default ViewEstimateDetail;
