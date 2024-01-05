import React from 'react';
import { Box } from '@mui/material';
import {
	Input,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	Button,
	DialogActions,
} from '@mui/material';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import { Close } from '@mui/icons-material';
const FilesDragAndDrop = {
	width: '500px',
	height: '300px',
	padding: '50px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
	fontSize: '24px',
	color: '#555555',
	border: '2px #c3c3c3 dashed',
	borderRadius: '12px',
};

const DialogBoxBody = ({ open, onClose, onChange, errors, accept }) => {
	return (
		<Box>
			<Dialog open={open} onClose={onClose}>
				<DialogTitle>
					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Box>
							<Typography variant='h6'>Attach File</Typography>
						</Box>
						<Box>
							<Button
								onClick={onClose}
								sx={{ color: 'black', padding: '0px', minWidth: '23px' }}
							>
								{' '}
								<Close />
							</Button>
						</Box>
					</Box>
				</DialogTitle>
				<DialogContent>
					<label htmlFor='file-input'>
						<input
							id='file-input'
							type='file'
							multiple
							style={{ display: 'none' }}
							onChange={onChange}
							accept={accept}
						/>
						<Box style={FilesDragAndDrop}>
							<Typography sx={{ width: '100px', color: '#1976d2' }}>
								{' '}
								<HighlightAltIcon
									sx={{ marginLeft: '33px', fontSize: '3.5rem' }}
								/>
							</Typography>

							<Typography
								variant='caption'
								sx={{ color: '#1976d2', fontSize: '16px' }}
							>
								Drag & drop your file here
							</Typography>
							<Typography sx={{ fontSize: '10px' }}>
								Ctrl+v to paste / Click to attach
							</Typography>
						</Box>
					</label>
					{/* {errors?.length > 0 &&
						errors?.map((error, index) => (
							<Typography
								key={'error-' + index}
								color='error'
								sx={{ fontSize: '14px' }}
							>
								{error}
							</Typography>
						))} */}
				</DialogContent>
			</Dialog>
		</Box>
	);
};

export default DialogBoxBody;
