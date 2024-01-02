import React from 'react';
import { CircularProgress, Backdrop } from '@mui/material';
interface OverlayLoaderProps {
	open: boolean;
}

const OverlayLoader: React.FC<OverlayLoaderProps> = ({ open }) => {
	return (
		<Backdrop
			sx={{
				color: '#1565C0',
				backgroundColor: 'rgba(0,0,0,0.3)',
				zIndex: 99999,
				marginTop: '0em',
			}}
			open={open}
		>
			<CircularProgress size={50} />
		</Backdrop>
	);
};

export default OverlayLoader;
