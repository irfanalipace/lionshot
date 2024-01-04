import React from 'react';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

import useResponsiveStyles from '../../../core/hooks/useMedaiQuery';

export default function MUIButton({
	variant,
	children,
	size,
	onClick,
	router,
	path,
	sx,
	component,
	...otherProps
}) {
	// console.log('otherProps', otherProps);
	const { isMobile, isMedium } = useResponsiveStyles();

	let buttonFontSize = '14px'; // Default font size for larger screens
	if (isMobile) {
		buttonFontSize = '0.5rem';
	} else if (isMedium) {
		buttonFontSize = '14px';
	}
	return (
		<Button
			component={router ? RouterLink : component ? component : 'button'}
			to={path ? path : ''}
			variant={variant ? variant : 'contained'}
			size={size ? size : 'small'}
			sx={{ fontSize: buttonFontSize, fontFamily: 'Roboto', ...sx }}
			onClick={onClick}
			{...otherProps}
		>
			{children}
		</Button>
	);
}
