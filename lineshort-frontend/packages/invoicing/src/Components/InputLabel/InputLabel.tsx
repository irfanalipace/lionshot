import React, { ReactNode } from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';

interface InputLabelProps {
	variant?: TypographyProps['variant'];
	sx?: React.CSSProperties | any;
	children: ReactNode;
	required?: boolean;
	color?: string;
}

const InputLabel: React.FC<InputLabelProps> = ({
	variant,
	sx,
	children,
	required,
	...otherProps
}: InputLabelProps) => {
	const labelStyle: React.CSSProperties = {};
	return (
		<Typography
			variant={variant || 'body1'}
			my='.3rem'
			sx={{ ...sx, ...labelStyle }}
			{...otherProps}>
			{children}
			{required && <span style={{ color: 'red' }}>*</span>}
		</Typography>
	);
};

export default InputLabel;
