import React, { useState } from 'react';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MUIButton from '../Button/MUIButton';
import { Box, Input, Paper, Typography } from '@mui/material';
import { FILE_TYPES } from '../../../core/utils/constants';
import fileService from '../../../core/services/fileService';
import { filterFiles } from '../../../core/utils/helpers';

function ImageUpload({
	setErrors,
	formik,
	onChange,
	files,
	allowedFiles = [
		FILE_TYPES.png.contentType,
		FILE_TYPES.jpeg.contentType,
		FILE_TYPES.jpg.contentType,
		FILE_TYPES.gif.contentType,
		FILE_TYPES.svg.contentType,
		FILE_TYPES.webp.contentType
	],
	maxSize = 5,
}) {
	const handleChange = e => {
		fileService.handleFileInputChange(e, allowedFiles, (validFiles, errors) => {
			onChange(validFiles);
			setErrors(errors);
		});
	};

	const dragOver = e => {
		e.preventDefault();
	};

	// const dragEnter = (e) => {
	//   e.preventDefault();
	// };

	// const dragLeave = (e) => {
	//   e.preventDefault();
	// };

	const fileDrop = e => {
		e.preventDefault();
		const newFiles = e.dataTransfer.files;
		// const existingFiles = formik.values.images || [];
		const { validFiles, errors } = filterFiles(newFiles, allowedFiles, maxSize);
		setErrors(errors);
		formik.setFieldValue('item_images.item_files', [...files, ...validFiles]);
	};

	return (
		<Paper elevation={4}>
			<div
				onDragOver={dragOver}
				// onDragEnter={dragEnter}
				// onDragLeave={dragLeave}
				onDrop={fileDrop}
			>
				<label htmlFor='file-input'>
					<MUIButton
						disableFocusRipple
						disableElevation
						disableRipple
						style={{ width: '179px', height: '219px' }}
						sx={{
							border: 'none',
							color: 'black',
							textTransform: 'capitalize',
							background: '#f9f9fb',
							display: 'flex',

							flexDirection: 'column',
							'&:hover': {
								background: '#f9f9fb',
								boxShadow: '0px 0px 10px 3px rgba(0, 0, 0, 0.2)',
								border: 'none',
							},
						}}
						variant='outlined'
						component='span'
						fullWidth
					>
						<UploadFileIcon fontSize='large' />
						<Typography sx={{ fontSize: '.8rem' }}>Drag & Drop</Typography>
						<Typography sx={{ fontSize: '.8rem' }}>Or</Typography>
						<Typography
							sx={{
								fontSize: '.8rem',
								border: '1px solid #1976d2',
								padding: '4px',
								borderRadius: '4px',
							}}
							color='primary'
						>
							Upload Image
						</Typography>
					</MUIButton>
					<input
						id='file-input'
						type='file'
						multiple
						style={{ display: 'none' }}
						onChange={handleChange}
						accept='.jpeg, .jpg, .png , .svg , .gif'
					/>
				</label>
			</div>
		</Paper>
	);
}

export default ImageUpload;
