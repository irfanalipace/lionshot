import { Button, Grid, Paper } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import EditIcon from '@mui/icons-material/Edit';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { downloadInvoiceApi } from '../../../../core/api/Invoice';
import { generateEncryptedID } from '../../../../core/utils/helpers';

const BtnStyles = {
	margin: '0 .2rem',
};

export default function SubHeader({ status, id }) {
	const navigate = useNavigate();
	const [emailMenuAnchor, setEmailMenuAnchor] = useState(null);
	const [pdfLoading, setPdfLoading] = useState(false);

	const openEmailMenu = event => {
		setEmailMenuAnchor(event.currentTarget);
	};

	const closeEmailMenu = () => {
		setEmailMenuAnchor(null);
	};
	const handleSendEstimateMain = id => {
		// navigate(`/estimate/email/${id}`);
		navigate(`/send-email/invoice/${generateEncryptedID(id)}`);
	};

	const handlePdf = async () => {
		setPdfLoading(true);
		try {
			const resp = await downloadInvoiceApi({ id });
			console.log('resp', resp);
			// downloadFile(resp.data.url)
			window.open(resp?.data?.url, '_blank');
		} catch (error) {
			console.error(error);
		} finally {
			setPdfLoading(false);
		}
	};
	return (
		<Grid item sm={12}>
			<Paper sx={{ padding: '1.5rem' }}>
				{status === 'draft' && (
					<Button
						size={'small'}
						startIcon={<EditIcon fontSize='small' />}
						variant='outlined'
						sx={{ ...BtnStyles }}
						onClick={() => navigate(`/invoices/edit/${id}`)}
					>
						Edit
					</Button>
				)}

				<Button
					size={'small'}
					startIcon={<EmailOutlinedIcon fontSize='small' />}
					variant='outlined'
					sx={{ ...BtnStyles }}
					onClick={() => {
						closeEmailMenu();
						handleSendEstimateMain(id);
					}}
				>
					Send an Email
				</Button>

				<LoadingButton
					size={'small'}
					startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
					loading={pdfLoading}
					loadingPosition='start'
					variant='outlined'
					sx={{ ...BtnStyles }}
					onClick={handlePdf}
				>
					Pdf/Print
				</LoadingButton>
			</Paper>
		</Grid>
	);
}
