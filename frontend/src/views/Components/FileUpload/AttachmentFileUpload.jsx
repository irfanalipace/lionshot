import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Typography } from '@mui/material';
import { FILE_TYPES } from '../../../core/utils/constants';
import fileService from '../../../core/services/fileService';
import { LoadingButton } from '@mui/lab';
const all_file_types = Object.values(FILE_TYPES)?.map(
	value => value.contentType
);
// [
// 	FILE_TYPES.pdf.contentType,
// 	FILE_TYPES.csv.contentType,
// 	FILE_TYPES.xls.contentType,
// 	FILE_TYPES.xlsx.contentType,
// ]
const AttachmentFileUpload = ({
	onChange,
	setErrors,
	attachLoading,
	allowedFiles = all_file_types,
	maxSize = 5,
}) => {
	const handleChange = e => {
		fileService.handleFileInputChange(
			e,
			allowedFiles,
			(validFiles, errors) => {
				onChange(validFiles);
				setErrors(errors);
			},
			maxSize
		);
	};

	return (
		<>
			<Typography textAlign='center' display='block' variant='caption'>
				File Size should be less than 5MB <br />
				Allowed Files types:pdf,xls,csv,xlsx
			</Typography>

			<label htmlFor='file-input'>
				<LoadingButton
					loading={attachLoading}
					startIcon={<FileUploadOutlinedIcon />}
					sx={{
						background: '#EEEEEE',
						color: window.themeColors.primary,
						fontSize: '14px',
						margin: '10px 0',
						padding: '25px 30px',
						textTransform: 'capitalize',
						display: 'flex',
						flexDirection: 'column',
						'&:hover': {
							background: '#EEEEEE',
						},
					}}
					variant='contained'
					component='span'
				>
					Upload File or Drag and Drop
				</LoadingButton>
				<input
					id='file-input'
					type='file'
					multiple
					accept='.pdf , .xls , .csv , .xlsx '
					style={{ display: 'none' }}
					onChange={handleChange}
				/>
			</label>
		</>
	);
};

export default AttachmentFileUpload;
