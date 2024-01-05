import { Grid, Typography, Button, IconButton } from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
// import { shortenFileName } from 'core/utils/helper';
import { goBack } from '../../../../core/utils/helpers';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import {
	addInvoiceFileApi,
	downloadInvoiceApi,
} from '../../../../core/api/Invoice';
import AttachmentCard from '../../../Components/FileUpload/AttachmentCard';

export default function Header({
	fetchingSingleInvoice,
	id,
	invoice_number,
	invoiceFiles,
	setInvoiceFiles,
}) {
	const [showMenuItem, setShowMenu] = useState(null);
	const [fileUploading, setFileUploding] = useState(false);

	const submitFilesToApi = async newFiles => {
		setFileUploding(true);
		try {
			const resp = await addInvoiceFileApi({
				attachments: newFiles,
				invoice_id: id,
			});
			fetchingSingleInvoice();
			console.log('resp', resp);
			// setEstimatedFiles((prevFiles) => [...prevFiles, ...newFiles]);
		} catch (error) {
			console.error(error);
		} finally {
			setFileUploding(false);
		}
	};

	const showingMenu = event => {
		setShowMenu(event.currentTarget);
	};

	const hidingMenu = () => {
		setShowMenu(null);
	};

	const deleteFile = async id => {
		setFileActionLoading(true);
		try {
			const resp = await deleteInvoiceFielsApi(id);
			notyf.success(resp?.message);
			fetchingSingleInvoice();
		} catch (error) {
			console.log('error', error);
		} finally {
			setFileActionLoading(false);
		}
	};

	const [fileActionLoading, setFileActionLoading] = useState(false);

	const handlePdf = async () => {
		setFileActionLoading(true);
		try {
			const resp = await downloadInvoiceApi({ id });
			window.open(resp?.data?.url, '_blank');
		} catch (error) {
			console.log('error', error);
			notyf.error('Failed to downalod file.');
		} finally {
			setFileActionLoading(false);
		}
	};

	return (
		<Grid item container>
			<Grid sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
				<Typography variant='h6'>{invoice_number || ''}</Typography>
			</Grid>
			<Grid
				sm={6}
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
				}}
			>
				<Button
					onClick={showingMenu}
					variant='outlined'
					sx={{
						fontSize: '12px',
						textTransform: 'capitalize',
						margin: '0 8px',
					}}
					startIcon={<AttachmentOutlinedIcon />}
				>
					Attachments
				</Button>
				<AttachmentCard
					// deleteApi={deleteFile}
					// submitFilesToApi={submitFilesToApi}
					setFiles={setInvoiceFiles}
					files={invoiceFiles}
					showMenuItem={showMenuItem}
					hidingMenu={hidingMenu}
				/>

				<IconButton sx={{ ml: 2 }} onClick={goBack}>
					<CloseIcon />
				</IconButton>
			</Grid>
		</Grid>
	);
}
