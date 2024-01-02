import React from 'react';
import Modal from '@/Components/Modal/Dialog';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';

function ConfirmDialog({ isOpen, onClose, title, onConfirm, onConfirmParams }) {
	return (
		<Modal open={isOpen} onClose={onClose} title={''}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					padding: '40px 0',
				}}>
				<Typography sx={{ color: 'red' }}>{title}</Typography>
				<Box>
					<Button
						onClick={() => {
							if (typeof onConfirm === 'function') onConfirm(onConfirmParams);
							onClose();
						}}>
						Yes
					</Button>
					<Button onClick={onClose}>No</Button>
				</Box>
			</Box>
		</Modal>
	);
}

export default ConfirmDialog;
