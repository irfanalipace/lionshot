import React, { useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import MUIButton from '../Button/MUIButton';
import { Close, Delete, FileUploadOutlined } from '@mui/icons-material';
function AttachFileMenu({
	openAttachmentMenu,
	setopenAttachmentMenu,
	onFileListUpdate,
}) {
	const [attachmentFiles, setAttachmentFiles] = useState([]);

	// handling attachments files
	const MAX_FILE_COUNT = 10; // Maximum allowed files
	const MAX_FILE_SIZE_MB = 5; // Maximum file size in MB
	const handleFileInputChange = event => {
		const files = event.target.files;
		const newFiles = Array.from(files);

		// Check if the total number of files is within the limit
		if (newFiles.length + attachmentFiles.length > MAX_FILE_COUNT) {
			alert(`You can upload a maximum of ${MAX_FILE_COUNT} files.`);
			return;
		}

		// Check the size of each file
		for (const file of newFiles) {
			const fileSizeMB = file.size / (1024 * 1024); // Convert to MB
			if (fileSizeMB > MAX_FILE_SIZE_MB) {
				alert(`File size should not exceed ${MAX_FILE_SIZE_MB} MB.`);
				return;
			}
		}
		console.log('All Checks passed', newFiles);
		setAttachmentFiles(prevFiles => [...prevFiles, ...newFiles]);
		onFileListUpdate(prevFiles => [...prevFiles, ...newFiles]);
		//   submitFilesToApi(newFiles);
	};
	const deletingFile = file => {
		setAttachmentFiles(prevFiles => prevFiles.filter(f => f !== file));
		onFileListUpdate(prevFiles => prevFiles.filter(f => f !== file));
	};

	return (
		<>
			<Box
				sx={
					openAttachmentMenu === false
						? { display: 'none' }
						: {
								display: 'block',
								position: 'absolute',
								background: 'white',
								boxShadow: 3,
								maxWidth: '365px',
						  }
				}
			>
				<Box sx={{ textAlign: 'right', padding: '5px' }}>
					<Close
						onClick={() => setopenAttachmentMenu(false)}
						sx={{ cursor: 'pointer' }}
					/>
				</Box>
				<Box p={2}>
					<Typography textAlign='center' variant='body2Grey'>
						You Can upload upto 10 files , 5mb each
					</Typography>

					<label htmlFor='file-input'>
						<MUIButton
							startIcon={<FileUploadOutlined />}
							sx={{
								background: '#EEEEEE',
								color: theme.palette.primary,
								margin: '10px 0',
								padding: '25px 30px',
								display: 'flex',
								flexDirection: 'column',
								'&:hover': {
									background: '#EEEEEE',
								},
							}}
							variant='contained'
							component='span'
						>
							Upload File
						</MUIButton>
						<input
							id='file-input'
							type='file'
							multiple
							style={{ display: 'none' }}
							onChange={handleFileInputChange}
						/>
					</label>
				</Box>
				{attachmentFiles?.map((file, index) => (
					<Box
						key={index}
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							paddingX: '20px',
						}}
					>
						<Typography>{file.file_name || file.name}</Typography>
						<IconButton
							edge='end'
							aria-label='delete'
							onClick={() => deletingFile(file)}
						>
							<Delete />
						</IconButton>
					</Box>
				))}
			</Box>
		</>
	);
}

export default AttachFileMenu;
