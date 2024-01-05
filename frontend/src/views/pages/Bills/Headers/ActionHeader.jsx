import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import { bulkDeleteEstimatesApi } from '../../../../core/api/estimate';
import { bulkDeleteBill } from '../../../../core/api/bills';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';

export default function ActionHeader({ selectedRows, setRefresh }) {
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [loading, setLoading] = useState(false);

	//   bulk delete / simgle / multiple
	const handleBulkDelete = async () => {
		setLoading(true);
		const selectedRowIds = selectedRows.map(row => Number(row));
		try {
			const resp = await bulkDeleteBill({ ids: selectedRowIds });
			notyf.success(resp?.message);
			setRefresh(prev => prev + 1);
		} catch (err) {
			console.error(err);
			notyf.error('Something went wrong');
		} finally {
			setLoading(false);
		}
	};
	return (
		<Grid item container height={30}>
			<OverlayLoader open={loading} />
			<Grid item sm={10} sx={{ display: 'flex', alignItems: 'center' }}>
				<Button
					variant='outlined'
					size='small'
					onClick={() => setOpenConfirmDialog(true)}
				>
					<DeleteIcon />
				</Button>
			</Grid>
			<Grid
				item
				sm={2}
				sx={{
					display: 'flex',
					justifyContent: 'end',
					alignItems: 'center',
				}}
			>
				<IconButton onClick={setRefresh}>
					<CloseIcon />
				</IconButton>
			</Grid>

			<ConfirmDialog
				title='Are you sure you want to delete'
				isOpen={openConfirmDialog}
				onClose={() => setOpenConfirmDialog(false)}
				onConfirm={handleBulkDelete}
				// {...dialogProps}
			/>
		</Grid>
	);
}
