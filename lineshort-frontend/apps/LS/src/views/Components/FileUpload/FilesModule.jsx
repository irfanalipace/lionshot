import Box from '@mui/system/Box';
import FileUploadButton from './FileUploadButton';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Typography from '@mui/material/Typography';
import { Delete, Download } from '@mui/icons-material';
import { FILE_TYPES } from '../../../core/utils/constants';
import notyf from '../NotificationMessage/notyfInstance';

const all_file_types = Object.values(FILE_TYPES)?.map(
	value => value.contentType
);

function FilesModule({
	files = [],
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
				notyf.success('File deleted successfully');
			} else {
				const filteredFiles = files.filter(f => f !== file);
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

	const onSave = newFiles => {
		const tempFiles = [...files, ...newFiles];
		setFiles(tempFiles);
	};

	return (
		<Box>
			<FileUploadButton
				onChange={handleFileInputChange}
				allowedFiles={allowedFiles}
				maxSize={maxSize}
				files={files}
				accept={allowedFiles.join(',')}
				setFiles={setFiles}
				deleteApi={deleteApi}
				onDelete={onDelete}
				onSave={onSave}
			/>

			<List sx={{ maxHeight: '300px', overflow: 'auto' }}>
				{files.map((fileObject, index) => (
					<ListItem key={index}>
						<Typography sx={{ maxWidth: '300px' }}>
							{fileObject?.file_name || fileObject?.name}
						</Typography>
						<ListItemSecondaryAction>
							<IconButton
								edge='end'
								aria-label='delete'
								onClick={() => deletingFile(fileObject)}
							>
								<Delete />
							</IconButton>
							<IconButton
								edge='end'
								aria-label='Download'
								onClick={() => downloadFile(fileObject)}
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

export default FilesModule;
