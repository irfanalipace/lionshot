import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import FormControlLabel from '@mui/material/FormControlLabel';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import './ImportFileModal.css';
import { styled } from '@mui/system';
import * as Yup from 'yup';
import notyf from '../NotificationMessage/notyfInstance';
import { FILE_TYPES } from '../../../core/utils/constants';
import { createFileMessage } from '../../../core/utils/helpers';
const ImportFileBody = ({
	isOpen,
	onClose,
	importApi,
	ImportTypeEnum,
	callBack,
	sampleCSV,
	sampleXLS,
	setRefresh,
}) => {
	const [file, setFile] = useState({});
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isFileChosen, setIsFileChosen] = useState(false);

	const allowedFileTypes = [
		FILE_TYPES.xls.contentType,
		FILE_TYPES.xlsx.contentType,
		FILE_TYPES.csv.contentType,
	];

	const allowedFilesLabels = [
		FILE_TYPES.csv.label,
		FILE_TYPES.xls.label,
		FILE_TYPES.xlsx.label,
	];

	const errors = {
		size: 'File Size must be less than 5MB',
		fileType: createFileMessage(allowedFilesLabels),
	};

	const handleFileUpload = event => {
		const file = event.target.files?.[0];
		const type = file?.type || '';

		if (allowedFileTypes.includes(type)) {
			setError('');
			setFile(file);
			console.log(file);
			setIsFileChosen(true);
			// Set the selected file in formik values
			formik.setValues(prevState => ({
				...prevState,
				selectedFile: file,
			}));
		} else {
			setError(errors.fileType);
			setFile(null);
			setIsFileChosen(false);
			// Reset the selected file in formik values
			formik.setValues(prevState => ({
				...prevState,
				selectedFile: null,
			}));
		}
	};

	const formik = useFormik({
		initialValues: {
			import_type: ImportTypeEnum?.length ? ImportTypeEnum[0].key : '',
			selectedFile: '',
		},
		validationSchema: Yup.object().shape({
			selectedFile: Yup.mixed().required('Please choose a file to upload'),
		}),
		onSubmit: () => {
			console.log('Formik values:', formik.values);
			downloadCustomers();
		},
	});

	const handleClearFile = () => {
		setFile({});
		setIsFileChosen(false);
		const fileInput = document.getElementById('fileInput'); // Add an id to your input element
		if (fileInput) {
			fileInput.value = ''; // Clear the file input value
		}
	};

	const downloadCustomers = async () => {
		try {
			if (file) {
				console.log('downloadFile running');
				setIsLoading(true);
				let filename = file?.name;
				const resp = await importApi({
					file,
					import_type: formik.values.import_type,
				});
				if (resp) {
					notyf.success('File Imported Successfully');
				}
				// Replace with your notification logic
				if (typeof callBack === 'function') callBack();
				onClose(false);
				setRefresh(prev => prev + 1);
			}
		} catch (e) {
			console.log(e);
		}
		setIsLoading(false);
	};

	const UploadButton = styled(Button)(({ theme }) => ({
		backgroundColor: '#F3F3F3',
		boxShadow: 'none',
		textAlign: 'left',
		color: 'black',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: '#F3F3F3',
			boxShadow: 'none',
		},
	}));
	useEffect(() => {
		if (!isFileChosen) {
			formik.setFieldValue('selectedFile', '');
		}
	}, [isFileChosen]);

	return (
		<Box bgcolor='#f3f3f3' padding='10px 10px'>
			<Card
				sx={{
					p: 1,
					boxShadow: 0,
					borderRadius: '10px',
				}}
			>
				{ImportTypeEnum && ImportTypeEnum.length > 0 ? (
					<>
						{/* <Typography variant='body2Grey' component='p' sx={{ mb: 2 }}>
              Download a sample CSV file or Sample xls file and compare it to
              your import file to ensure you have the file perfect for the
              import.
            </Typography>
            {ImportTypeEnum.map((item, index) => (
              <Box key={index}>
                <Button
                  className=' button-customer-detai'
                  color='primary'
                  variant='outlined'
                  component='a'
                  href={item?.filePath + '.csv'}
                  target='_blank'
                  download
                  startIcon={<SaveAltIcon />}
                  sx={{ mb: 1 }}
                >
                  CSV For {item?.label}
                </Button>
                <Button
                  className=' button-contact-detai'
                  color='primary'
                  variant='outlined'
                  component='a'
                  href={item?.filePath + '.xls'}
                  target='_blank'
                  download
                  startIcon={<SaveAltIcon />}
                  sx={{ ml: 2, mb: 1 }}
                >
                  XLS For {item?.label}
                </Button>
              </Box>
            ))} */}

						<Typography variant='subtitle2Grey' component='p' sx={{ my: 2 }}>
							Import Module
						</Typography>
						{ImportTypeEnum.map(importType => (
							<Box key={importType.key}>
								<FormControlLabel
									control={
										<Checkbox
											id={`importAs${importType.key}`}
											name='importType'
											className='import-checkbox'
											type='radio'
											value={importType.key}
											onChange={() =>
												formik.setValues(prevState => ({
													...prevState,
													import_type: importType.key,
												}))
											}
											checked={formik.values?.import_type === importType.key}
											onBlur={formik.handleBlur}
										/>
									}
									label={importType.label}
								/>
							</Box>
						))}
					</>
				) : (
					<Box className='estimate-import'>
						{/* <Typography variant='body2Grey' component='p'>
              Download a sample CSV file or Sample xls file and compare it to
              your import file to ensure you have the file perfect for the
              import.
            </Typography>
            <Button
              style={{ marginRight: '10px' }}
              color='primary'
              variant='outlined'
              component='a'
              href={sampleCSV}
              target='_blank'
              download
              startIcon={<SaveAltIcon />}
            >
              Download Sample CSV
            </Button>
            <Button
              color='primary'
              variant='outlined'
              component='a'
              href={sampleXLS}
              target='_blank'
              className='ms-3'
              download
              startIcon={<SaveAltIcon />}
            >
              Download Sample XLS
            </Button> */}
					</Box>
				)}
				<Box
					bgcolor='#F3F3F3'
					borderRadius='5px'
					padding='5px 0px'
					marginTop='10px'
				>
					{isFileChosen ? (
						<Box>
							<Typography sx={{ pl: '10px' }} component='span'>
								Uploaded File: {file?.name}
							</Typography>
							<IconButton onClick={handleClearFile}>
								<CloseIcon color='primary' sx={{ fontSize: '18px' }} />
							</IconButton>
						</Box>
					) : (
						<UploadButton variant='contained' component='label'>
							Upload File: No File Choosen
							<Input
								id='fileInput' // Add an id to the input element
								type='file'
								sx={{ display: 'none' }}
								inputProps={{
									accept:
										'.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
								}}
								onChange={handleFileUpload}
							/>
						</UploadButton>
					)}
				</Box>
				{formik.touched.selectedFile && formik.errors.selectedFile && (
					<Typography variant='caption' component='p' color='error'>
						{formik.errors.selectedFile}
					</Typography>
				)}
			</Card>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					padding: '10px 25px 10px 0',
				}}
			>
				<Button
					sx={{ border: `1px solid ${window.themeColors.primary}` }}
					color='primary'
					disabled={!!error || isLoading}
					onClick={formik.handleSubmit}
					startIcon={<SendIcon />}
				>
					Import
				</Button>
			</Box>
		</Box>
	);
};

export default ImportFileBody;
