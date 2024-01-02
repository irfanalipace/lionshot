import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MUIStyledCommonProps } from '@mui/system';
import React from 'react';

export const ViewEstimateMain: React.FC = styled(Box)({
	padding: '1rem 3rem',
});

export const ViewEstimateTableConatiner: React.FC = styled(
	Box
)<MUIStyledCommonProps>({
	padding: '3rem 6rem',
	border: '.5px solid grey',
});

export const ViewEstimateFooter: React.FC = styled(Box)({});
