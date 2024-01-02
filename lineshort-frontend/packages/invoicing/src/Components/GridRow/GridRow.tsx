import { Grid } from '@mui/material';
import React from 'react';
import { ReactNode, CSSProperties } from 'react';

interface GridRowProps {
	children: ReactNode;
	style?: CSSProperties;
}

function GridRow({ children, style }: GridRowProps) {
	return (
		<Grid
			container
			rowSpacing={1}
			columnSpacing={{ xs: 1, sm: 2, md: 3 }}
			sx={{ mb: '15px', display: 'flex' }}
			style={style}>
			{children}
		</Grid>
	);
}

export default GridRow;
