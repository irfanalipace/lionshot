import Modal from '../Modal/Dialog';
import TermsBody from './TermsBody';

function TermsModal({ isOpen, onClose, terms, onSave }) {
	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			size={'sm'}
			title='Configure Payment Terms'
		>
			<TermsBody onClose={onClose} terms={terms} onSave={onSave} />
		</Modal>
	);
}

export default TermsModal;
