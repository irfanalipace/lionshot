import { menuItemClasses } from '@mui/base/MenuItem';
// import MenuItem from '@mui/material';
import { styled } from '@mui/system';
import { MenuButton } from '@mui/base/MenuButton';
import { MenuItem, Paper, Typography } from '@mui/material';

import useResponsiveStyles from './hooks/useMedaiQuery';
import React, { ReactNode } from 'react';
export const StyledListbox = styled('ul')(
	({ theme }) => `
    font-family: roboto;
    font-size:18px,
    min-width: 100px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: white;
    box-shadow: 0px 4px 30px #d0d7de;
    z-index:1
    `
);

export const StyledMenuItem = styled(MenuItem)(
	({ theme }) => `
    padding: 13px;
    border-radius: 8px;
    cursor: pointer;
    .MuiSvgIcon-root {
      color: #2196F3;
      margin-bottom:-5px;
      font-size: 20px;
      margin-right: 8px;
    }
    &:hover:not(.${menuItemClasses.disabled}) {
      background-color: #F6FBFF;
    }
    `
);
export const TriggerButton = styled(MenuButton)(
	({ theme }) => `
    // padding: 2px;
    background: #2196F3;
    color: #fff;
    border-radius:18px;
    border:none;
    transition-duration: 120ms;
    .MuiSvgIcon-root {
      margin-bottom: -3px;
    }
    &:hover {
      border-color: rgb(242, 242, 242);
    }
    `
);
export const HeaderMenuButton = styled(MenuButton)(
	({ theme }) => `
    padding: 7px 10px;
    border-radius:8px;
    border:none;
    transition-duration: 120ms;
    &:hover {
      border-color: rgb(242, 242, 242);
    }
    `
);
export const headerIconButton = {
	backgroundColor: '#EEEEEE',
	border: '1px solid #d1d1d1',
	borderRadius: '4px 0px 0px 0px',
	textTransform: 'none',
	fontSize: '14px',
};
export const headerMenuBox = {
	display: 'flex',
	alignItems: 'center',
};

export const MainTitleStyled = styled(Paper)(({ theme }) => ({
	width: '100%',
	padding: '20px 40px',
	display: 'flex',
	justifyContent: 'flex-end',
	border: '8px',
}));

export const NewEstimateFormTitle = styled(Typography)(({ theme }) => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
}));

export const FieldTitle = styled(Typography)<{ fontWeight?: number }>(
	({ theme, fontWeight }) => ({
		fontSize: useResponsiveStyles().upMedium ? '16px' : '.6rem',
		margin: '1rem 0 .4rem 0',
		fontFamily: 'Roboto',
		fontWeight: fontWeight || 400,
	})
);

export const AddRowTitle = styled(Typography)(({ theme }) => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	margin: '1rem 0',
}));

export const FormMainTitle = styled(Typography)<{ margin?: boolean }>(
	({ theme, margin }) => ({
		fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
		fontWeight: 600,
		margin: margin ? '.4rem 0' : undefined, // Use conditional rendering for margin
	})
);
