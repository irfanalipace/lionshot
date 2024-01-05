import { Box, Grid, Paper, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import ImageUpload from '../../../../Components/ImageUpload/ImageUpload';
import CloseIcon from '@mui/icons-material/Close';
import notyf from '../../../../Components/NotificationMessage/notyfInstance';
import { deleteItemFile } from '../../../../../core/api/items';

function ItemImagesForm({ formik, setFiles, files }) {
	const [errors, setErrors] = useState([]);
	const handleFileInputChange = newFiles => {
		if (newFiles.length > 0) {
			newFiles = [...files, ...newFiles];
			formik.setFieldValue('item_images.item_files', newFiles);
		}
	};
	// deleted uploaded files from ui / formik key
	const deletingFile = async file => {
		{
			if (file?.id) {
				try {
					await deleteItemFile(file.id);
					const fileteredFiles = formik.values.item_files.filter(
						f => f?.id !== file?.id
					);
					formik.setFieldValue('item_images.item_files', fileteredFiles);
					notyf.success('File deleted successfully');
				} catch (error) {
					console.log('error: ', error);
				}
			} else {
				const fileteredFiles = formik.values.item_files.filter(f => f !== file);
				formik.setFieldValue('item_images.item_files', fileteredFiles);
			}
		}
	};

	return (
		<Box>
			<Grid container my={1}>
				<Grid item container>
					{files?.map(item => (
						<Paper elevation={6} sx={{ margin: '1rem' }}>
							<Grid
								Item
								position='relative'
								display='flex'
								flexWrap='wrap'
								style={{ width: '179px', height: '219px' }}
							>
								<IconButton
									sx={{
										position: 'absolute',
										top: -1,
										right: -4,
										// background: "#e8e9ed",
									}}
									onClick={() => deletingFile(item)}
								>
									<CloseIcon />
								</IconButton>
								<img
									src={item?.id ? item?.image : URL.createObjectURL(item)}
									style={{
										width: '100%',
										height: '100%',
										maxHeight: '80%',
										maxWidth: '100%',
										objectFit: 'contain',
										padding: '0 10px',
										marginTop:'20%'
									}}
								/>
							</Grid>
						</Paper>
					))}
					<Grid item sx={{ margin: '1rem' }}>
						<ImageUpload
							formik={formik}
							errors={errors}
							setErrors={setErrors}
							onChange={handleFileInputChange}
							files={files}
						/>
					</Grid>

					{errors?.length > 0 &&
						errors?.map((error, index) => (
							<Grid mt={1} item sm={12} display='flex' justifyContent='start'>
								<Typography
									key={'error-' + index}
									color={'error'}
									sx={{ fontSize: '14px' }}
								>
									{error}
								</Typography>
							</Grid>
						))}
				</Grid>
			</Grid>
			<>
			<Typography  sx={{ fontSize: '14px' }}>
						Only WEBP, JPG, JPEG and PNG files are allowed
					</Typography>
				{formik.errors?.item_files && (
					<Typography color={'error'} sx={{ fontSize: '14px' }}>
						{formik.errors?.item_files}
					</Typography>
				)}
			</>
		</Box>
	);
}

export default ItemImagesForm;
