import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
// import { styled } from '@mui/material/styles';
// import StepConnector, {
// 	stepConnectorClasses,
// } from '@mui/material/StepConnector';
import StepLabel from '@mui/material/StepLabel';
import { Tab, Tabs, Typography } from '@mui/material';

export default function ItemsFormStepper({ activeStep, steps, isStepFailed }) {
	// const handleReset = () => {
	// 	setActiveStep(0);
	// };

	// const handleChange = (event, newValue) => {
	// 	if (parseInt(newValue) === parseInt(activeStep) + 1) setActiveTab(newValue);
	// };
	// const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
	// 	[`&.${stepConnectorClasses.alternativeLabel}`]: {
	// 		top: 22,
	// 		color: 'green',
	// 	},
	// 	[`&.${stepConnectorClasses.active}`]: {
	// 		[`& .${stepConnectorClasses.line}`]: {
	// 			backgroundImage:
	// 				'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
	// 		},
	// 	},
	// 	[`&.${stepConnectorClasses.completed}`]: {
	// 		[`& .${stepConnectorClasses.line}`]: {
	// 			backgroundImage:
	// 				'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
	// 		},
	// 	},
	// 	[`& .${stepConnectorClasses.line}`]: {
	// 		height: 3,
	// 		border: 0,
	// 		backgroundColor:
	// 			theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
	// 		borderRadius: 1,
	// 	},
	// }));

	return (
		<Box>
			<Stepper activeStep={activeStep}>
				{Object.entries(steps).map(([key, value]) => {
					const labelProps = {};
					if (activeStep.toString() === key && isStepFailed) {
						labelProps.optional = (
							<Typography variant='caption' color='error'>
								Required fields in this tab
							</Typography>
						);

						// labelProps.error = true;
					}
					return (
						<Step key={key}>
							<StepLabel {...labelProps}>{value.label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			{/* <Tabs value={activeStep.toString()} onChange={handleChange}>
				{Object.entries(steps).map(([key, value]) => (
					<Tab key={'tab-' + key} label={value.label} value={key} />
				))}
			</Tabs> */}
		</Box>
	);
}
