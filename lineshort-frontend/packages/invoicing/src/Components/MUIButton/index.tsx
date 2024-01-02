import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import useResponsiveStyles from '@/hooks/useMedaiQuery';

interface MUIButtonProps {
	variant?: ButtonProps['variant'];
	children: React.ReactNode;
	size?: ButtonProps['size'];
	onClick?: () => void;
	router?: boolean;
	path?: string;
	sx?: React.CSSProperties;
	component?: React.ElementType;
}

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
}: MUIButtonProps) {
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
			sx={{ fontSize: buttonFontSize, ...sx }}
			onClick={onClick}
			{...otherProps}>
			{children}
		</Button>
	);
}
