import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Box from '@mui/system/Box';

const TemplateOtherDetails = ({ bankDetails, termsAndConditions }) => {
	return (
		<Box
			width='100%'
			my={4}
			sx={{ padding: '0 1.5rem 1.5rem 1.5rem', marginBottom: '1rem' }}
		>
			<Grid container>
				<Grid item sm={12}>
					{bankDetails && (
						<>
							<Grid item container>
								<Grid item sm={4} display='flex' justifyContent='space-between'>
									<Typography variant='templateBody2' fontSize={16} pb={1}>
										Bank Details
									</Typography>
								</Grid>
							</Grid>
							<Grid item container>
								<Grid item sm={2} display='flex' justifyContent='space-between'>
									<Typography
										fontSize={13}
										variant='templateBody2'
										fontWeight={600}
									>
										A/C Title :
									</Typography>
								</Grid>
								<Grid item>
									<Typography variant='templateBody' textAlign={'right'}>
										Minnesota Computers LLC
									</Typography>
								</Grid>
							</Grid>
							<Grid item container>
								<Grid item sm={2} display='flex' justifyContent='space-between'>
									<Typography
										fontSize={13}
										variant='templateBody2'
										fontWeight={600}
									>
										A/C No :
									</Typography>
								</Grid>
								<Grid item>
									<Typography variant='templateBody' textAlign={'right'}>
										2915400432
									</Typography>
								</Grid>
							</Grid>
							<Grid item container>
								<Grid item sm={2} display='flex' justifyContent='space-between'>
									<Typography
										fontSize={13}
										variant='templateBody2'
										fontWeight={600}
									>
										Routing :
									</Typography>
								</Grid>
								<Grid item>
									<Typography variant='templateBody' textAlign={'right'}>
										075900575
									</Typography>
								</Grid>
							</Grid>
							<Grid item container>
								<Grid item sm={2} display='flex' justifyContent='space-between'>
									<Typography
										variant='templateBody2'
										fontSize={13}
										fontWeight={600}
									>
										Swift Code :
									</Typography>
								</Grid>
								<Grid item>
									<Typography variant='templateBody' textAlign={'right'}>
										ABGBUS44
									</Typography>
								</Grid>
							</Grid>
							<Grid item container>
								<Grid item sm={2} display='flex' justifyContent='space-between'>
									<Typography
										variant='templateBody2'
										fontSize={13}
										fontWeight={600}
									>
										Bank :
									</Typography>
								</Grid>
								<Grid item>
									<Typography variant='templateBody' textAlign={'right'}>
										Associated Bank
									</Typography>
								</Grid>
							</Grid>
						</>
					)}
					{termsAndConditions && (
						<>
							<Grid item container>
								<Grid
									item
									sm={4}
									display='flex'
									justifyContent='space-between'
									mt={2}
								>
									<Typography variant='templateBody2' pb={1} fontSize={16}>
										Terms and conditions
									</Typography>
								</Grid>
							</Grid>
							<Grid item container>
								<Grid
									item
									sm={12}
									display='flex'
									justifyContent='space-between'
								>
									<Typography variant='templateBody'>
										{termsAndConditions}
									</Typography>
								</Grid>
							</Grid>
						</>
					)}
				</Grid>
			</Grid>
		</Box>
	);
};

export default TemplateOtherDetails;
