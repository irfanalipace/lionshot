import React from 'react';
import Typography from '@mui/material/Typography';

const InputLabel = ({
	variant,
	sx,
	children,
	required = false,
	...otherProps
}) => {
	const labelStyle = {};
	return (
		<Typography
			variant={variant ? variant : 'body2'}
			my='.3rem'
			sx={{ ...sx, ...labelStyle }}
			{...otherProps}
		>
			{children}
			{required && <span style={{ color: 'red' }}>*</span>}
		</Typography>
	);
};

export default InputLabel;
