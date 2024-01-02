import React, { FC } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import OutboxIcon from '@mui/icons-material/Outbox';
import { Button, Grid, Stack, Divider } from '@mui/material';
import MUIButton from '../../Components/Button/MUIButton';

interface EstimateMainBtnProps {
	handleEstimateSubComp: () => void;
	estimateEmailOpen: boolean;
	handleSendMail: () => void;
	estimateSubComponent: boolean;
}

const EstimateMainBtn: FC<EstimateMainBtnProps> = ({
	handleEstimateSubComp,
	estimateEmailOpen,
	handleSendMail,
	estimateSubComponent,
}) => {
	return (
		<>
			<Grid item xs={12}>
				<Stack direction='row' spacing={2}>
					<MUIButton
						onClick={handleEstimateSubComp}
						variant={!estimateSubComponent ? 'outlined' : undefined}
						startIcon={<RemoveRedEyeIcon />}
					>
						View Price Quote Details
					</MUIButton>
					<MUIButton
						onClick={handleSendMail}
						variant={!estimateEmailOpen ? 'outlined' : undefined}
						startIcon={<OutboxIcon />}
					>
						Send an Email
					</MUIButton>
				</Stack>
			</Grid>
			<Grid item xs={12}>
				<Divider />
			</Grid>
		</>
	);
};

export default EstimateMainBtn;
