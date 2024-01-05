import Modal from '../Modal/Dialog';
import UploadFileModalBody from './UploadFileModalBody';
import { FILE_TYPES } from '../../../core/utils/constants';

const FileUploadModal = ({
	isOpen,
	onClose,
	accept,
	onSave,
	maxSize,
	allowedFiles = [
		FILE_TYPES.pdf.contentType,
		FILE_TYPES.csv.contentType,
		FILE_TYPES.xls.contentType,
		FILE_TYPES.xlsx.contentType,
	],
}) => {

	return (
			<Modal open={isOpen} onClose={onClose} size={'sm'} title='Attach File'>
				<UploadFileModalBody
					onClose={onClose}
					onSave={onSave}
					accept={accept}
					allowedFiles={allowedFiles}
					maxSize={maxSize}
				/>
			</Modal>
	);
};

export default FileUploadModal;
