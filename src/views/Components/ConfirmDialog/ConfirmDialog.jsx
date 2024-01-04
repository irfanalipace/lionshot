import React from 'react';
import Modal from '../Modal/Dialog';
import Grid from '@mui/material/Grid';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import MUIButton from '../Button/MUIButton';
function ConfirmDialog({ isOpen, onClose, title, onConfirm, onConfirmParams }) {
	return (
		<Modal open={isOpen} onClose={onClose}>
			<Grid container>
				<Grid item xs={12}>
					<DialogTitle
						id='delete-dialog-title'
						display='flex'
						justifyContent='space-between'
						alignItems='center'
						sx={{ padding: '25px 4px 16px 16px' }}
					>
						{`${title} ?`}
					</DialogTitle>
				</Grid>
				<Grid item xs={12} paddingTop='.5rem'>
					<DialogContent>
						<DialogActions>
							<MUIButton onClick={onClose} variant='outlined'>
								Cancel
							</MUIButton>
							<MUIButton
								onClick={() => {
									if (typeof onConfirm === 'function')
										onConfirm(onConfirmParams);
									onClose();
								}}
								variant='contained'
								autoFocus
							>
								Confirm
							</MUIButton>
						</DialogActions>
					</DialogContent>
				</Grid>
			</Grid>
		</Modal>
	);
}

export default ConfirmDialog;
