import React, { useEffect, useState } from 'react';
import CustomDrawer from '../../Components/Drawer/Drawer';
import { ViewEstimateMain } from './ViewEstimateStyle';
import { Grid } from '@mui/material';

import EstimateHeader from '../EstimateViewHeader/EstimateViewHeader';
import EstimateMainBtn from '../EstimateViewMainBtn/EstimateMainBtn';
import SendEstimate from '../SendMailIEstimate/SendEstimate';
import DetailEstimate from '../DetailEsttimate/DetailEstimate';

interface ViewEstimateProps {
	open: boolean;
	onClose: () => void;
	handleDrawer: () => void;
	drawerState: boolean;
}

const ViewInvoice: React.FC<ViewEstimateProps> = ({
	open,
	onClose,
	handleDrawer,
	drawerState,
}) => {
	const [estimateSubComponent, setEstimateSubComponent] = useState(true);
	const [estimateEmailOpen, setEstimateEmailOpen] = useState(false);

	useEffect(() => {
		setEstimateSubComponent(true);
		setEstimateEmailOpen(false);
	}, [drawerState]);

	const handleEstimateSubComp = () => {
		setEstimateSubComponent(true);
		setEstimateEmailOpen(false);
	};

	const handleSendMail = () => {
		setEstimateEmailOpen(true);
		setEstimateSubComponent(false);
	};

	return (
		<CustomDrawer open={open} onClose={onClose}>
			<ViewEstimateMain>
				<Grid container spacing={2} display='flex' alignItems='center'>
					<EstimateHeader onClose={handleDrawer} title='Estimation' />
					<EstimateMainBtn
						estimateSubComponent={estimateSubComponent}
						handleEstimateSubComp={handleEstimateSubComp}
						handleSendMail={handleSendMail}
						estimateEmailOpen={estimateEmailOpen}
					/>
				</Grid>
				{estimateSubComponent && drawerState ? (
					<DetailEstimate />
				) : (
					<SendEstimate />
				)}
			</ViewEstimateMain>
		</CustomDrawer>
	);
};

export default ViewInvoice;
