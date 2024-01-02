import React from 'react';
import Paper from '@mui/material/Paper';
function ContainerPaper({ children, sx }) {
	return (
		<Paper sx={sx ? sx : { p: '1.3rem 0 0 1.3rem', my: '10px' }}>
			{children}
		</Paper>
	);
}

export default ContainerPaper;
