import React from 'react';
// mui
import { Box, Button, Container, Grid, Paper } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// styles
import { useTheme } from '@mui/material/styles';
import { colors, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';

// react
import MUIButton from '@/Components/Button/MUIButton';
export const MainTitleStyled = styled(Paper)(({ theme }) => ({
	width: '100%',
	padding: '20px 40px',
	display: 'flex',
	justifyContent: 'flex-end',
	border: '8px',
	// background:'white',
	// boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.5)', // Simulated elevation
}));

// this title same for new and edit estimate
const EstimateTitle = () => {
	//  dyanamic fontSizess for btns  for different screen sizes
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));

	let buttonFontSize = '0.7rem'; // Default font size for larger screens
	if (isSmallScreen) {
		buttonFontSize = '0.5rem';
	} else if (isMediumScreen) {
		buttonFontSize = '0.6rem';
	}
	return (
		<Grid item xs={12}>
			<MainTitleStyled>
				<MUIButton
					//    onClick={handleEstimateSubComp}

					endIcon={<RemoveRedEyeIcon />}
					router
					path='/estimate'>
					View All Invoices
				</MUIButton>
			</MainTitleStyled>
		</Grid>
	);
};

export default EstimateTitle;
