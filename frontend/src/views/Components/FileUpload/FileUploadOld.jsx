import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import MUIButton from '../Button/MUIButton';
import { Input, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FILE_TYPES } from '../../../core/utils/constants';
import fileService from '../../../core/services/fileService';
function FileUpload({
	onChange,
	allowedFiles = [
		FILE_TYPES.pdf.contentType,
		FILE_TYPES.csv.contentType,
		FILE_TYPES.xls.contentType,
		FILE_TYPES.xlsx.contentType,
	],
	maxSize = 5,
}) {
	const [errors, setErrors] = useState([]);

	const handleChange = e => {
		fileService.handleFileInputChange(e, allowedFiles, (validFiles, errors) => {
			onChange(validFiles);
			setErrors(errors);
		});
	};

	return (
		<Box>
			<label htmlFor='file-input'>
				<MUIButton
					startIcon={<SendIcon />}
					sx={{
						border: '1px solid grey',
						color: 'black',
						textTransform: 'capitalize',
					}}
					variant='outlined'
					component='span'
					fullWidth
				>
					Upload File
				</MUIButton>
				<input
					id='file-input'
					type='file'
					multiple
					style={{ display: 'none' }}
					onChange={handleChange}
					accept={allowedFiles.join(',')}
				/>
				<Typography variant='caption'>
					File Size should be less than {maxSize}MB
				</Typography>
			</label>
			{errors?.length > 0 &&
				errors?.map((error, index) => (
					<Typography
						key={'error-' + index}
						color={'error'}
						sx={{ fontSize: '14px' }}
					>
						{error}
					</Typography>
				))}
		</Box>
	);
}

export default FileUpload;
