import React from 'react';
// import Modal from '@mui/material/Modal';

import Dialog from '../Modal/Dialog';
// import './ExportFileModal.css';
import ExportFileBody from './ExportFileBody';

const ExportFileModal = ({
	isOpen, // A boolean indicating whether the export modal is open.
	onClose, // A function to control the open/close state of the modal.
	exportApi, // The API function to call when exporting a file.
	ExportTypeEnum = [], // An array of possible export types, e.g., [ 'CSV', 'PDF' ].
	exportColumns = false, // A boolean indicating whether to export columns or not
}) => {
	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			className='export-modal'
			title='Export File'
			size='sm'
		>
			{isOpen ? (
				<ExportFileBody
					onClose={onClose}
					exportApi={exportApi}
					ExportTypeEnum={ExportTypeEnum}
					exportColumns={exportColumns}
				/>
			) : (
				<></>
			)}
		</Dialog>
	);
};

export default ExportFileModal;
