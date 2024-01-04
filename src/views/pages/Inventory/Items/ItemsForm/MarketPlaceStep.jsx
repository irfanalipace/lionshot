import { CircularProgress, FormControlLabel } from '@mui/material';
import { Checkbox } from '@mui/material';
import { Grid } from '@mui/material';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { appsLogoEnums } from '../../../../../core/services/integrationService';
import { useEffect } from 'react';

function MarketPlaceStep({ formik, marketplaces, loading }) {
	const handleCheckboxChange = (event, value) => {
		let updatedItems = [];
		if (event.target.checked) {
			updatedItems = [...formik.values.market_place_ids, value];
		} else {
			updatedItems = formik.values?.market_place_ids?.filter(
				item => item !== value
			);
		}
		formik.setFieldValue('marketplace.market_place_ids', updatedItems);
	};
	console.log('formik in marketplace', formik);
	// useEffect(() => {
	// 	if (formik.values?.market_place_ids?.length === 0) {
	// 		formik.setFieldError(
	// 			'marketplace.market_place_ids',
	// 			'Marketplace is Required'
	// 		); // Setting error manually because validation on change is disabled
	// 	} else {
	// 		const errors = { ...formik.errors };
	// 		delete errors.marketplace;
	// 		delete errors.market_place_ids;
	// 		formik.setErrors(errors); // Setting error manually because validation on change is disabled
	// 	}
	// }, [formik.values?.market_place_ids]);

	return (
		<Box p={3}>
			<Typography variant='h6'>Choose a Marketplace to publish</Typography>
			<Typography variant='body1' mt={2}>
				You can choose one or multiple marketplaces.
			</Typography>
			{loading ? (
				<CircularProgress />
			) : (
				<Box mt={5}>
					<Grid container>
						{marketplaces.map(row => (
							<Grid
								key={row?.id}
								item
								lg={2}
								mr={3}
								sx={{
									borderRadius: '4px',
									boxShadow: '0px -1px 8px 0px rgba(0, 0, 0, 0.12)',
								}}
							>
								<Grid container justifyContent='flex-end'>
									<FormControlLabel
										control={
											<Checkbox
												name='marketplace.market_place_ids'
												onChange={e => handleCheckboxChange(e, row?.id)}
												checked={formik.values?.market_place_ids?.includes(
													row?.id
												)}
											/>
										}
									/>
								</Grid>
								<Grid
									container
									justifyContent='center'
									alignItems='center'
									sx={{ height: '160px' }}
								>
									<img
										src={appsLogoEnums[row?.name]}
										style={{ width: '136px', marginBottom: '30px' }}
									/>
								</Grid>
							</Grid>
						))}
					</Grid>
				</Box>
			)}

			<>
				{formik.errors?.market_place_ids && (
					<Typography color={'error'} mt={1} sx={{ fontSize: '14px' }}>
						{formik.errors?.market_place_ids}
					</Typography>
				)}
			</>
		</Box>
	);
}

export default MarketPlaceStep;
