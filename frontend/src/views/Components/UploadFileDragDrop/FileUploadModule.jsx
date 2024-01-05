import React from 'react';

import { Box } from '@mui/system';
// import FileUpload from './FileUpload';
import {
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	Typography,
} from '@mui/material';
import { Delete, Download } from '@mui/icons-material';
import { FILE_TYPES } from '../../../core/utils/constants';
import FileUploadDrop from './FileUploadDrop';
const all_file_types = Object.values(FILE_TYPES)?.map(value=>value.contentType);
// [
// 	FILE_TYPES.pdf.contentType,
// 	FILE_TYPES.csv.contentType,
// 	FILE_TYPES.xls.contentType,
// 	FILE_TYPES.xlsx.contentType,
// ]
function FileUploadModule({
	files,
	setFiles,
	deleteApi,
	onDelete,
	allowedFiles = all_file_types,
	maxSize = 5,
}) {
	const handleFileInputChange = newFiles => {
		if (newFiles.length > 0) {
			newFiles = [...files, ...newFiles];
			setFiles(newFiles);
		}
	};

	const deletingFile = async file => {
		if (typeof onDelete === 'function') {
			onDelete(file);
		} else if (typeof deleteApi === 'function') {
			if (file?.id) {
				await deleteApi(file?.id);
				const filteredFiles = files.filter(f => f.id !== file?.id);
				setFiles(filteredFiles);
			}
		}
	};

	const downloadFile = file => {
		if (file.id) {
			window.open(file?.file_path);
		} else {
			window.open(URL.createObjectURL(file));
		}
	};

	return (
		<Box>
			<FileUploadDrop
				onChange={handleFileInputChange}
				allowedFiles={allowedFiles}
				maxSize={maxSize}
			/>
			<List>
				{files?.map((file, index) => (
					<ListItem key={index}>
						<Typography>{file?.file_name || file?.name}</Typography>
						<ListItemSecondaryAction>
							<IconButton
								edge='end'
								aria-label='delete'
								onClick={() => deletingFile(file)}
							>
								<Delete />
							</IconButton>
							<IconButton
								edge='end'
								aria-label='Download'
								onClick={() => downloadFile(file)}
							>
								<Download />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
			</List>
		</Box>
	);
}

export default FileUploadModule;
