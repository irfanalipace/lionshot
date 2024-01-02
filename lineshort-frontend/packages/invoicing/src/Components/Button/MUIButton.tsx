import React, { FC } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, ButtonProps, colors } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import useResponsiveStyles from '../../hooks/useMedaiQuery';

interface MUIButtonProps extends ButtonProps {
	variant?: ButtonProps['variant'];
	size?: ButtonProps['size'];
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	router?: boolean;
	path?: string;
	sx?: any;
	to?: string;
}

const MUIButton: FC<MUIButtonProps> = ({
	variant,
	children,
	size,
	onClick,
	router,
	path,
	sx,
	...otherProps
}) => {
	const theme = useTheme();
	const { isMobile, isMedium, isLarger } = useResponsiveStyles();

	let buttonFontSize = '0.9rem'; // Default font size for larger screens
	if (isMobile) {
		buttonFontSize = '0.5rem';
	} else if (isMedium) {
		buttonFontSize = '0.6rem';
	}

	return (
		<Button
			{...otherProps}
			component={router ? RouterLink : 'button'}
			to={path ? path : ''}
			variant={variant ? variant : 'contained'}
			size={size ? size : 'small'}
			sx={{ ...sx, fontSize: buttonFontSize }}
			onClick={onClick}>
			{children}
		</Button>
	);
};

export default MUIButton;
