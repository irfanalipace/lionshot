import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import {
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	Typography,
} from '@mui/material';
import { Delete, Download } from '@mui/icons-material';

import { Button } from '@mui/material';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import { useTheme } from '@emotion/react';
import fileService from '../../../core/services/fileService';
import MUIButton from '../Button/MUIButton';
const FilesDragAndDrop = {
	width: '90%',
	height: 'auto',
	display: 'flex',
	alignItems: 'center',
	margin: 'auto',
	justifyContent: 'center',
	flexDirection: 'column',
	fontSize: '24px',
	color: '#555555',
	border: '2px dashed',
	borderRadius: '12px',
};
const FileList = {
	width: '90%',
	height: 'auto',
	display: 'flex',
	alignItems: 'center',
	margin: 'auto',
	justifyContent: 'center',
	flexDirection: 'column',
	fontSize: '24px',
	color: '#555555',
};

const UploadFileModalBody = ({
	onClose,
	accept,
	onSave,
	allowedFiles,
	maxSize,
}) => {
	const theme = useTheme();
	const [temporaryFiles, setTemporaryFiles] = useState([]);
	const [dragging, setDragging] = useState(false);
	const [errors, setErrors] = useState([]);

	const deletingFile = (e, file) => {
		e.stopPropagation();
		const filteredFiles = temporaryFiles.filter(f => f !== file);
		setTemporaryFiles(filteredFiles);
	};

	const downloadFile = (e, file) => {
		e.stopPropagation();
		if (file.id) {
			window.open(file?.file_path);
		} else {
			window.open(URL.createObjectURL(file));
		}
	};

	const handleSave = () => {
		onSave(temporaryFiles);
	};

	const dragOver = e => {
		e.preventDefault();
		setDragging(true);
	};

	function callBack(validFiles, errors) {
		setTemporaryFiles(prev => [...prev, ...validFiles]);
		setErrors(errors);
	}
	const fileDrop = e => {
		e.preventDefault();
		setDragging(false);
		fileService.handleFileDrag(e, allowedFiles, callBack, maxSize);
	};

	const onFileUpload = e => {
		fileService.handleFileInputChange(e, allowedFiles, callBack, maxSize);
	};

	useEffect(() => {
		const handleListener = event => {
			fileService.handlePaste(event, allowedFiles, callBack, maxSize);
		};
		document.addEventListener('paste', handleListener);

		return () => {
			document.removeEventListener('paste', handleListener);
		};
	}, []);

	return (
		<Box>
			<label htmlFor='file-input' onDragOver={dragOver} onDrop={fileDrop}>
				<input
					id='file-input'
					type='file'
					multiple
					style={{ display: 'none' }}
					onChange={onFileUpload}
					accept={accept}
				/>
				<Box
					style={FilesDragAndDrop}
					sx={{
						borderColor: dragging ? 'blue !important' : '#c3c3c3 !important',
					}}
				>
					<Box sx={{ paddingTop: '60px', paddingBottom: '40px' }}>
						<Typography
							sx={{
								color: theme.palette.primary.main,
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<HighlightAltIcon sx={{ fontSize: '3.5rem' }} />
						</Typography>

						<Typography
							variant='body2'
							sx={{ color: theme.palette.primary.main }}
						>
							Drag & drop your file here
						</Typography>
						<Typography variant='caption'>
							Ctrl+v to paste / Click to attach
						</Typography>
					</Box>
				</Box>
			</label>
			<Box style={FileList}>
				<List>
					{temporaryFiles?.map((file, index) => (
						<ListItem key={index}>
							<Typography sx={{ width: '492px' }}>
								{file?.file_name || file?.name}
							</Typography>

							<Box>
								<ListItemSecondaryAction>
									<IconButton
										edge='end'
										aria-label='delete'
										onClick={e => deletingFile(e, file)}
									>
										<Delete />
									</IconButton>
									<IconButton
										edge='end'
										aria-label='Download'
										onClick={e => downloadFile(e, file)}
									>
										<Download />
									</IconButton>
								</ListItemSecondaryAction>
							</Box>
						</ListItem>
					))}
				</List>
			</Box>
			{errors?.length > 0 &&
				errors?.map((error, index) => (
					<Typography
						key={'error-' + index}
						color={'error'}
						sx={{ fontSize: '14px', padding: '0px 30px 5px' }}
					>
						{error}
					</Typography>
				))}
			<Grid container justifyContent={'end'} paddingX={4} paddingY={2}>
				<MUIButton
					variant={'outlined'}
					onClick={() => {
						onClose();
					}}
				>
					Cancel
				</MUIButton>
				<MUIButton
					sx={{ marginLeft: 1 }}
					onClick={() => {
						onClose(), handleSave();
					}}
				>
					Save
				</MUIButton>
			</Grid>
		</Box>
	);
};

export default UploadFileModalBody;
