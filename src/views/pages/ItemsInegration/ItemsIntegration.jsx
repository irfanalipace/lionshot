import React, { useState } from 'react';
import { Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import CardItems from '../../Components/CardForItems/CardItems';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import integrationService, {
	apps,
} from '../../../core/services/integrationService';

const ItemsIntegration = () => {
	const [integrationApps, setIntegrationApps] = useState(apps);
	const [isDisabled, setIsDisabled] = useState(false);

	const addApp = app => {
		setIntegrationApps(prev => {
			return {
				...prev,
				[app]: {
					...prev[app],
					loading: true,
				},
			};
		});
		setIsDisabled(true);
		integrationService.init({
			app,
			callback: () => {
				setIntegrationApps(prev => {
					return {
						...prev,
						[app]: {
							...prev[app],
							loading: false,
						},
					};
				});
				setIsDisabled(false);
			},
		});
	};
	const navigate = useNavigate();
	return (
		<>
			<HeaderPaper sx={{ padding: '10px 20px' }}>
				<Grid item container>
					<>
						<Grid sm={6} display='flex' alignItems='center'>
							<Typography variant='h6'>Integrations</Typography>
						</Grid>
						<Grid
							sm={6}
							display='flex'
							justifyContent='end'
							alignItems='center'
							spacing={2}
						>
							<IconButton onClick={() => navigate('/items')}>
								<CloseIcon />
							</IconButton>
						</Grid>
					</>
				</Grid>
			</HeaderPaper>
			<Paper>
				<Grid container justifyContent='center' minHeight='83vh'>
					{Object.entries(integrationApps)?.map(([key, value]) => (
						<Box ml={2} mr={2} mt={5} key={'app-' + key}>
							<CardItems
								name={value.name}
								img={value.logo}
								disabled={value.disabled || isDisabled}
								loading={value.loading}
								handleClick={() => addApp(key)}
							/>
						</Box>
					))}
				</Grid>
			</Paper>
		</>
	);
};

export default ItemsIntegration;
