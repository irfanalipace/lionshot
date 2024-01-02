import {
	Button,
	CircularProgress,
	Grid,
	IconButton,
	Stack,
	Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import GetAppIcon from '@mui/icons-material/GetApp';
import SendIcon from '@mui/icons-material/Send';
// import DateRangeIcon from '@mui/icons-material/DateRange';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { downloadInvoiceApi } from '@/apis/invoice';
import { LoadingButton } from '@mui/lab';
import notyf from '../NotificationMessage/notyfInstance';

export default function RTIInvoiceHeader({
	invoiceNumber = '000-000-00',
	onChangeEdit,
	isEdit,
	handleSave,
	draftLoading,
	sendLoading,
	id,
}: any) {
	const navigate = useNavigate();

	const [pdfLoading, setPdfLoading] = useState(false);

	const handlePdf = async () => {
		console.log(id);
		setPdfLoading(true);
		try {
			const resp: any = await downloadInvoiceApi({ id });
			console.log('resp', resp);
			// downloadFile(resp.data.url)
			window.open(resp?.data?.url, '_blank');
		} catch (error) {
			notyf.error('Failed to export.');
			console.error(error);
		} finally {
			setPdfLoading(false);
		}
	};

	return (
		<Grid item container>
			<Grid sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
				<Typography variant='h6'>{invoiceNumber}</Typography>
			</Grid>
			<Grid
				sm={10}
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
				}}
			>
				<Stack direction='row' spacing={2}>
					{
						// !isEdit && (
						<Button
							sx={{ height: '35px' }}
							variant='outlined'
							disabled={isEdit}
							startIcon={<EditIcon />}
							onClick={() => onChangeEdit(true)}
						>
							Edit
						</Button>
						// )
						// : (
						// 	<Button
						// 		sx={{ height: '35px' }}
						// 		variant='contained'
						// 		onClick={() => onChangeEdit(false)}
						// 		startIcon={<DateRangeIcon />}
						// 	>
						// 		save
						// 	</Button>
						// )
					}
					<LoadingButton
						onClick={handlePdf}
						variant='outlined'
						startIcon={<GetAppIcon />}
						loading={pdfLoading}
						loadingPosition='start'
					>
						export
					</LoadingButton>
					<Button
						variant='outlined'
						onClick={() => handleSave('save_as_draft')}
						disabled={draftLoading}
						startIcon={
							draftLoading ? <CircularProgress size={15} /> : <SendIcon />
						}
					>
						Save as draft
					</Button>
					<Button
						disabled={sendLoading}
						variant='contained'
						onClick={() => handleSave('save_and_send')}
						startIcon={
							sendLoading ? <CircularProgress size={15} /> : <SendIcon />
						}
					>
						Save and send
					</Button>
				</Stack>

				<IconButton sx={{ ml: 2 }} onClick={() => navigate('/invoices')}>
					<CloseIcon />
				</IconButton>
			</Grid>
		</Grid>
	);
}
