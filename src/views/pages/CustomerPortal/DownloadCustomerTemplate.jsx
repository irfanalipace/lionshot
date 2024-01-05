import React from 'react';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
const DownloadCustomerTemplate = React.memo(({ id, downloadingPdf }) => {
	return (
		<IconButton
			onClick={() => downloadingPdf()}
			sx={{ position: 'absolute', top: 10, right: 10 }}
		>
			<DownloadIcon color='primary' />
		</IconButton>
	);
});

export default DownloadCustomerTemplate;
