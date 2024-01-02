import React from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled } from '@mui/material/styles';

const HoverPopover: React.FC<any> = React.memo(({ text }) => {
	const CustomWidthTooltip = styled(({ className, ...props }: any) => (
		<Tooltip
			children={undefined}
			title={''}
			{...props}
			classes={{ popper: className }}
		/>
	))({
		[`& .${tooltipClasses.tooltip}`]: {
			maxWidth: 200,
			backgroundColor: '#000',
			padding: '10px !important',
		},
	});

	return (
		<>
			<CustomWidthTooltip title={text} arrow placement='right'>
				<ErrorOutlineIcon
					sx={{
						color: '#000000',
						opacity: '56%',
						fontSize: '20px',
						margin: '0px 0 -1px 5px',
					}}
				/>
			</CustomWidthTooltip>
		</>
	);
});

export default HoverPopover;
