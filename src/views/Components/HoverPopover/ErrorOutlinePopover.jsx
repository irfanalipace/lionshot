import React from 'react';
import { Tooltip, tooltipClasses } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled } from '@mui/material/styles';

const CustomWidthTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))({
	[`& .${tooltipClasses.tooltip}`]: {
		maxWidth: 200,
		backgroundColor: '#000',
		padding: '10px !important',
	},
});

const HoverPopover = ({ text, icon, color = 'grey', fontSize = '15px' }) => {
	return (
		<CustomWidthTooltip title={text} arrow placement='right'>
			{icon ? (
				React.cloneElement(icon, {
					sx: { color, fontSize, margin: '0px 0 -1px 5px' },
				})
			) : (
				<ErrorOutlineIcon sx={{ color, fontSize, margin: '0px 0 -1px 5px' }} />
			)}
		</CustomWidthTooltip>
	);
};

export default HoverPopover;
