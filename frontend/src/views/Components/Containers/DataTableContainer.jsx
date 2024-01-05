import React from 'react';
import Box from '@mui/system/Box';

function DataTableContainer({ children, takenHeight = '168' }) {
	return (
		<Box
			sx={{
				zIndex: '0',
				position: 'relative',
				height: `calc(100vh - ${takenHeight}px)`,
				overflow: 'auto',
				backgroundColor: 'white',
				// '& .MuiDataTableContainer-root': {
				//   height: 'calc(100vh - 300px)',
				//   overflow: 'auto'
				// }
			}}
		>
			{children}
		</Box>
	);
}

export default DataTableContainer;
