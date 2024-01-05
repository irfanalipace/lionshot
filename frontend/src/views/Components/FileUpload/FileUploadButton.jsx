import  { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import MUIButton from '../Button/MUIButton';
import {  Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FILE_TYPES } from '../../../core/utils/constants';
import FileUploadModal from './FileUploadModal.jsx';
function FileUpload({
	accept,
	onSave,
	maxSize = 5,
	allowedFiles = [
		FILE_TYPES.pdf.contentType,
		FILE_TYPES.csv.contentType,
		FILE_TYPES.xls.contentType,
		FILE_TYPES.xlsx.contentType,
	],
}) {


	const [isDialogOpen, setDialogOpen] = useState(false);

	const handleOpenDialog = () => {
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
	};

	return (
		<Box>
						<MUIButton
				startIcon={<SendIcon />}
				sx={{
					border: '1px solid grey',
					color: 'black',
					textTransform: 'capitalize',
				}}
				onClick={handleOpenDialog}
				variant='outlined'
				component='span'
				fullWidth
			>
				Upload File
			</MUIButton>

			<Typography variant='caption'>
				File Size should be less than {maxSize}MB
			</Typography>
			<FileUploadModal isOpen={isDialogOpen} onClose={handleCloseDialog} accept={accept} onSave={onSave} maxSize={maxSize} allowedFiles={allowedFiles} />
		</Box>
	);
}

export default FileUpload;
