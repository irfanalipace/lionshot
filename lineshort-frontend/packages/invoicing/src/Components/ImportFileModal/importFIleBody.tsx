import React, { useState } from 'react';
import { useFormik } from 'formik';
// import { toast } from 'react-toastify';
import {
	FormControlLabel,
	Input,
	Box,
	Radio,
	Typography,
	Dialog,
	CardContent,
	Card,
	Button,
	IconButton,
	DialogTitle,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { styled } from '@mui/system';
import * as Yup from 'yup';
import DownloadIcon from '@mui/icons-material/Download';
import { importInvoiceApi } from '@/apis/invoice';
import notyf from '../NotificationMessage/notyfInstance';

interface ImportFileBodyProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	importApi: (data: any) => Promise<void>;
	ImportTypeEnum: Array<{ key: string; label: string; filePath: string }>;
	callBack: () => void;
	onClose: any;
	sampleCSV: string;
	sampleXLS: string;
}

const UploadButton = styled('label')(({ theme }) => ({
	backgroundColor: '#F3F3F3',
	boxShadow: 'none',
	textAlign: 'left',
	color: 'black',
	textTransform: 'capitalize',
	cursor: 'pointer', // Add cursor style to make it clear it's clickable
	padding: '10px 20px', // Add padding for a larger clickable area
	borderRadius: '5px',
	display: 'inline-block',
	'&:hover': {
		backgroundColor: '#E0E0E0',
	},
}));

const ImportFileBody: React.FC<ImportFileBodyProps> = ({
	isOpen,
	setIsOpen,
	importApi,
	ImportTypeEnum,
	callBack,
	onClose,
	sampleCSV,
	sampleXLS,
}) => {
	const [file, setFile] = useState<File | undefined>(undefined);
	const [error, setError] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isFileChosen, setIsFileChosen] = useState<boolean>(false);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		const type = file?.type || '';
		const allowedFileTypes = [
			'application/vnd.ms-excel',
			'text/csv',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		];
		if (allowedFileTypes.includes(type)) {
			setError('');
			setFile(file);
			setIsFileChosen(true);
		} else {
			setError('Only CSV, XLSX, and XLS files are allowed');
			setFile(undefined);
			setIsFileChosen(false);
		}
	};

	const formik = useFormik({
		initialValues: {
			import_type: ImportTypeEnum?.length ? ImportTypeEnum[0].key : '',
			selectedFile: null,
		},
		validationSchema: Yup.object().shape({
			selectedFile: Yup.mixed().required('Please choose a file to upload'),
		}),
		onSubmit: async () => {
			console.log('Formik values:', formik.values);
			await downloadCustomers();
		},
	});

	const handleClearFile = () => {
		setFile(undefined);
		setIsFileChosen(false);
		const fileInput = document.getElementById('fileInput') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = ''; // Clear the file input value
		}
	};

	const downloadCustomers = async () => {
		try {
			if (file instanceof File) {
				setIsLoading(true);
				await importApi({
					file,
					import_type: formik.values.import_type,
				});
				if (typeof callBack === 'function') callBack();
				setIsOpen(false);
			}
		} catch (e) {
			console.error(e);
		}
		setIsLoading(false);
	};

	return (
		<Box bgcolor='#F3F3F3'>
			<DialogTitle>
				Import File
				{setIsOpen ? (
					<IconButton
						aria-label='close'
						onClick={onClose}
						sx={{
							position: 'absolute',
							right: 20,
						}}>
						<CloseIcon color='primary' />
					</IconButton>
				) : null}
			</DialogTitle>
			<Card
				sx={{
					mx: '25px',
					p: 2,
					boxShadow: 0,
					borderRadius: '10px',
					mb: 2,
				}}>
				{ImportTypeEnum && ImportTypeEnum.length > 0 ? (
					<>
						{/* <Typography variant='body2' component='p' sx={{ mb: 2 }}>
							Download a sample CSV file or Sample xls file and compare it to
							your import file to ensure you have the file perfect for the
							import.
						</Typography> */}
						{/* {ImportTypeEnum.map((item, index) => (
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
									sx={{ mb: 1 }}>
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
									sx={{ ml: 2, mb: 1 }}>
									XLS For {item?.label}
								</Button>
							</Box>
						))} */}

						<Typography variant='body2' component='p' sx={{ my: 2 }}>
							Import Module
						</Typography>
						{ImportTypeEnum.map((importType) => (
							<Box key={importType.key}>
								<FormControlLabel
									control={
										<Radio
											id={`importAs${importType.key}`}
											name='importType'
											className='import-radio' // You can add a specific class name for styling if needed
											value={importType.key}
											onChange={() =>
												formik.setValues((prevState) => ({
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
						{/* <Typography variant='body2' component='p'>
							Download a sample CSV file or Sample xls file and compare it to
							your import file to ensure you have the file perfect for the
							import.
						</Typography> */}
						{/* <Button
							style={{ marginRight: '10px' }}
							color='primary'
							variant='outlined'
							component='a'
							href={sampleCSV}
							target='_blank'
							download
							startIcon={<SaveAltIcon />}>
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
							startIcon={<DownloadIcon />}>
							Download Sample XLS
						</Button> */}
					</Box>
				)}
				<Box
					bgcolor='#F3F3F3'
					borderRadius='5px'
					padding='5px px'
					marginTop='10px'>
					{isFileChosen ? (
						<Box>
							<Typography sx={{ pl: '10px' }} component='span'>
								Choosed File: {file?.name}
							</Typography>
							<IconButton onClick={handleClearFile}>
								<CloseIcon color='primary' sx={{ fontSize: '18px' }} />
							</IconButton>
						</Box>
					) : (
						<UploadButton htmlFor='fileInput'>
							<Typography variant='body1'>
								Choose File: No File Chosen
							</Typography>

							<Input
								id='fileInput'
								type='file'
								sx={{ display: 'none' }}
								inputProps={{
									accept:
										'.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
								}}
								onChange={handleFileUpload}
								error={
									formik.touched.selectedFile && formik.errors.selectedFile
										? true
										: false
								}
							/>
						</UploadButton>
					)}
				</Box>
				{formik.touched.selectedFile && formik.errors.selectedFile && (
					<Typography variant='caption' component='p'>
						{formik.errors.selectedFile.toString()}
					</Typography>
				)}
			</Card>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					padding: '10px 25px 10px 0',
				}}>
				<Button
					sx={{ border: '1px solid #2196F3' }}
					color='primary'
					disabled={!!error || isLoading}
					onClick={async () => {
						try {
							const resp = await importInvoiceApi({ file });
							onClose();
							notyf.success('Import invoice successful ');
						} catch (error) {
							notyf.error('Import invoice Failed ');
							console.error(error);
						}
					}}
					startIcon={<SendIcon />}>
					Import
				</Button>
			</Box>
		</Box>
	);
};

export default ImportFileBody;
