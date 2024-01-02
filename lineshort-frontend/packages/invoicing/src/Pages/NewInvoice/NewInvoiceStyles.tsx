import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import useResponsiveStyles from '@/hooks/useMedaiQuery';
import React from 'react';

export const NewEstimateMainLayout = styled('div')(({ theme }) => ({
	// margin:'5rem 2rem 1rem 2rem',
}));
export const NewEstimateFormLayout = styled(Paper)(({ theme }) => ({
	width: '100%',
	// margin: '.5rem 0',
	padding: '1.5rem 2rem 10rem 2rem',
	// background:'red'
}));

interface LayoutProps {
	padding?: string;
	theme?: any; // You can provide a specific type for the theme if needed
}

export const Layout = styled(Paper)<LayoutProps>(({ theme, padding }) => ({
	padding: padding && '2rem',
}));

export const EstimateFormTitle = styled(Typography)(({ theme }) => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	margin: '1rem 0 .4rem 0',
}));
