import {
	Box,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AttachmentFileUpload from './AttachmentFileUpload';
import { FILE_TYPES } from '../../../core/utils/constants';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FileError from '../FileError/FileError';
import { filterFiles } from '../../../core/utils/helpers';
import MUIButton from '../Button/MUIButton';
import notyf from '../NotificationMessage/notyfInstance';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import fileService from '../../../core/services/fileService';

const AttachmentCard = ({
	showMenuItem,
	hidingMenu,
	deleteApi,
	files,
	submitFilesToApi,
	allowedFiles = [
		FILE_TYPES.pdf.contentType,
		FILE_TYPES.csv.contentType,
		FILE_TYPES.xls.contentType,
		FILE_TYPES.xlsx.contentType,
	],
	maxSize = 5,
	setFiles,
}) => {
	const [attachLoading, setAttachLoading] = useState(false);

	const [errors, setErrors] = useState([]);
	const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);
	const initialLoadingStates = files?.map(() => false);
	const [dltLoadingStates, setDltLoadingStates] =
		useState(initialLoadingStates);

	const handleFileInputChange = async newFiles => {
		if (newFiles.length > 0) {
			try {
				setAttachLoading(true);
				const resp = await submitFilesToApi(newFiles);
				const addedFiels = resp?.data;
				setFiles([...files, ...addedFiels]);

				notyf.success('Files Added Successfully');
			} catch (error) {
				notyf.error('Something went wrong');
			} finally {
				setAttachLoading(false);
			}
		}
	};

	const deletingFile = async (id, index) => {
		try {
			setIsDeleteDisabled(true);
			setDltLoadingStates(prevLoadingStates => {
				const newLoadingStates = [...prevLoadingStates];
				newLoadingStates[index] = true;
				return newLoadingStates;
			});
			const resp = await deleteApi(id);
			if (resp) {
				const updatedFiles = files.filter(f => f.id !== id);
				notyf.success('Files Deleted');
				setFiles(updatedFiles);
			}
		} catch (error) {
			notyf.error('Something went wrong');
		} finally {
			setIsDeleteDisabled(false);
			setDltLoadingStates(prevLoadingStates => {
				const newLoadingStates = [...prevLoadingStates];
				newLoadingStates[index] = false;
				return newLoadingStates;
			});
		}
	};

	const downloadFile = file => {
		if (file.id) {
			window.open(file?.file_path);
		} else {
			window.open(URL.createObjectURL(file));
		}
	};

	const dragOver = e => {
		e.preventDefault();
	};

	const fileDrop = e => {
		e.preventDefault();
		fileService.handleFileDrag(e, allowedFiles, (validFiles, errors) => {
			handleFileInputChange(validFiles);
			setErrors(errors);
		}, maxSize);
		
	};
	const btnStyle = {
		fontSize: '11px',
		textTransform: 'capitalize',
	};
	return (
		<>
			<Menu
				anchorEl={showMenuItem}
				open={Boolean(showMenuItem)}
				onClose={hidingMenu}
				PaperProps={{
					elevation: 0,
					sx: {
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						// maxHeight: 250,
						overflowY: 'scroll',

						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							// left: 15, // arrow positionm
							right: 50,
							width: 15,
							height: 15,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<Box sx={{ width: '400px', maxWidth: '400px' }} paddingY='1rem'>
					{files?.map((file, index) => (
						<>
							<MenuItem
								key={file?.id}
								sx={{
									width: '100%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
								my={2}
							>
								<Box width='10%'>
									<DescriptionOutlinedIcon color='primary' />
								</Box>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										width: '65%',
										marginLeft: 2,
									}}
								>
									<Typography
										style={{
											wordBreak: 'break-word',
											maxWidth: '100%',
											wordWrap: 'break-word',
											whiteSpace: 'pre-line',
										}}
									>
										<Typography fontSize='13px'>{file?.file_name}</Typography>
									</Typography>

									<Stack direction='row' columnGap={5}>
										<MUIButton
											sx={{ ...btnStyle }}
											variant='text'
											onClick={() => downloadFile(file)}
										>
											Download
										</MUIButton>
										<LoadingButton
											sx={{ ...btnStyle }}
											loading={dltLoadingStates[index]} // Use the loading state for the specific index
											variant='text'
											disabled={isDeleteDisabled}
											onClick={() => deletingFile(file?.id, index)}
										>
											Delete
										</LoadingButton>
									</Stack>
								</Box>
							</MenuItem>
							<Divider sx={{ width: '100%' }} />
						</>
					))}

					<Box paddingX={5} mt={3} onDragOver={dragOver} onDrop={fileDrop}>
						<AttachmentFileUpload
							attachLoading={attachLoading}
							onChange={handleFileInputChange}
							allowedFiles={allowedFiles}
							maxSize={maxSize}
							setErrors={setErrors}
						/>{' '}
						{errors.length > 0 && (
							<Box sx={{ position: 'relative' }}>
								<IconButton
									sx={{ position: 'absolute', top: 0, right: 0 }}
									onClick={() => setErrors('')}
								>
									<CloseIcon />
								</IconButton>
								<FileError errors={errors} />
							</Box>
						)}
					</Box>
				</Box>
			</Menu>
		</>
	);
};

export default AttachmentCard;
