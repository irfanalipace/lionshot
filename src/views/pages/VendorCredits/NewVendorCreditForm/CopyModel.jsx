import React, { useState } from 'react';
import { Box, Dialog, Grid, Typography } from '@mui/material';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

const CopyModel = ({ open, onClose, handlePaste, pastedImage }) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			onPaste={e => handlePaste(e)}
		>
			<Box p={2}>
				<Typography variant='h6' sx={{ color: '#8c8a8a' }}>
					Attach File
				</Typography>
				<br />
				<Box
					sx={{
						border: '1px dashed #000',
						borderRadius: '8px',
						minHeight: '20em',
					}}
				>
					{pastedImage && (
						<Grid item>
							<img
								src={pastedImage}
								alt='Pasted Image'
								style={{
									maxWidth: '100%',
									maxHeight: '100%',
									objectFit: 'contain',
								}}
							/>
						</Grid>
					)}
					{!pastedImage && (
						<Grid
							container
							direction='column'
							justifyContent='center'
							alignItems='center'
							style={{ minHeight: '17em' }}
						>
							<Grid item>
								<Typography textAlign='center'>
									<DriveFolderUploadIcon
										sx={{
											fontSize: '5.5em',
											color: window.themeColors.primary,
										}}
									/>
								</Typography>
								<Typography
									variant='h5'
									fontSize={20}
									sx={{ color: window.themeColors.primary }}
								>
									Drag & Drop your file here
								</Typography>
								<Typography variant='body1' textAlign='center' fontSize={10}>
									Ctrl + v to paste / Click to attach
								</Typography>
							</Grid>
						</Grid>
					)}
				</Box>
			</Box>
		</Dialog>
	);
};

export default CopyModel;
