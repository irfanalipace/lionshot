import React, { useState } from 'react';
import { useFormik } from 'formik';

import DownloadIcon from '@mui/icons-material/Download';
import {
	FormControlLabel,
	Box,
	Checkbox,
	Typography,
	Card,
	Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { downloadFile } from '@/utils/helper';
import { getAllInvoicesExportApi } from '@/apis/invoice';

interface ExportFileBodyProps {
	exportApi: (values: any) => Promise<any>; // Adjust the type of values as needed
	ExportTypeEnum: any[]; // Adjust the type of ExportTypeEnum as needed
}

const ExportFileBody: React.FC<ExportFileBodyProps> = ({
	exportApi,
	ExportTypeEnum,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			// export_type: ExportTypeEnum?.length ? ExportTypeEnum[0].key : "",
			file_extension: 'csv',
			export_type: '',
		},

		onSubmit: () => {
			console.log('Formik values:', formik.values);
			exportFile();
		},
	});

	const onSubmit = () => {
		console.log('Formik values:', formik.values);
		exportFile();
	};

	const exportFile = async () => {
		try {
			setIsLoading(true);
			let response: any = await getAllInvoicesExportApi({});
			let { file_url } = response?.data;
			window.open(file_url);

			// if (process.env.NODE_ENV !== 'development') {
			// 	fileUrl = fileUrl.replace(/https(?=:\/\/)/g, 'http');
			// }
			// fileUrl = fileUrl.replace(/http(?=:\/\/)/g, 'https');
			// Remove the call to downloadFile
			// downloadFile(fileUrl);
			// downloadFile(response.file_url);
			// showNotification('File Downloaded Successfully', '');
		} catch (e) {
			console.log(e);
		}

		setIsLoading(false);
	};

	const FileTypeEnum = {
		CSV: {
			key: 'csv',
			label: 'CSV (Comma Separated File)',
		},
		XLS: {
			key: 'xls',
			label: 'XLS (Microsoft Excel 1997-2004 Compatible)',
		},
		XLSX: {
			key: 'xlsx',
			label: 'XLSX (Microsoft Excel)',
		},
	};

	return (
		<Box bgcolor='#f3f3f3' padding='10px 10px'>
			{/* <Card
				sx={{
					p: 1,
					boxShadow: 0,
					borderRadius: '10px',
				}}> */}
			<Typography variant='subtitle2Grey'>Export Module</Typography>
			{/* {!!ExportTypeEnum.length && (
					<Box>
						<Typography variant='subtitle2Grey'>Export Module</Typography>
						{ExportTypeEnum.map((exportType) =>
							exportType.key ? (
								<FormControlLabel
									sx={{ display: 'block', ml: '0px' }}
									key={exportType.key}
									control={
										<Checkbox
											name='exportType'
											value={exportType.key}
											onChange={() =>
												formik.setValues((prevState) => ({
													...prevState,
													export_type: exportType.key,
												}))
											}
											checked={formik.values.export_type === exportType.key}
										/>
									}
									label={exportType.label}
								/>
							) : (
								<React.Fragment key={exportType.key}></React.Fragment>
							)
						)}
					</Box>
				)} */}

			{/* <Typography variant='subtitle2Grey'>Export File Type</Typography> */}
			{/* {Object.values(FileTypeEnum).map((fileType) => (
					<FormControlLabel
						sx={{ display: 'block', ml: '0px' }}
						key={fileType.key}
						control={
							<Checkbox
								name='exportAs'
								value={fileType.key}
								onChange={() => {
									formik.setValues((prevState) => ({
										...prevState,
										file_extension: fileType.key,
									}));
								}}
								checked={formik.values.file_extension === fileType.key}
							/>
						}
						label={fileType.label}
					/>
				))} */}
			{/* </Card> */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					padding: '20px 0px 5px 0',
				}}>
				<Button
					sx={{ border: '1px solid #2196F3' }}
					color='primary'
					disabled={isLoading}
					onClick={onSubmit}>
					<DownloadIcon /> Download
				</Button>
			</Box>
		</Box>
	);
};

export default ExportFileBody;
