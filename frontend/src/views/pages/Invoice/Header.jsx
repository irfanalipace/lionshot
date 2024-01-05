import { useState } from 'react';
import {
	Box,
	Typography,
	Divider,
	IconButton,
	Button,
	Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add, MoreHoriz, SaveAlt, UploadFile } from '@mui/icons-material';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import ExportFileModal from 'components/ExportFileModal/ExportFileModal';
import ImportFileModal from 'components/ImportFileModal/ImportFileModal';
import { Close } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';

import {
	StyledListbox,
	HeaderMenuButton,
	StyledMenuItem,
} from './InvoiceStyleConst';
import {
	getAllInvoicesExportApi,
	importInvoiceApi,
} from '../../../core/api/Invoice';

export default function Header({ setRefresh, selected = false, onDelete }) {
	const [openImport, setOpenImport] = useState(false);
	const [openExport, setOpenExport] = useState(false);

	const navigate = useNavigate();

	const handleNewInvoice = () => {
		navigate('/invoices/new');
	};
	return (
		<>
			<Box
				display={'flex'}
				width={'100%'}
				height={'40px'}
				justifyContent={'space-between'}
			>
				{selected ? (
					<IconButton onClick={onDelete}>
						<DeleteIcon />
					</IconButton>
				) : (
					<Typography variant='h6'>All Invoice</Typography>
				)}

				{selected ? (
					<IconButton onClick={() => setRefresh(prev => prev + 1)}>
						<Close />
					</IconButton>
				) : (
					<Stack direction={'row'}>
						<Button
							size='small'
							onClick={handleNewInvoice}
							variant='contained'
							startIcon={<Add />}
						>
							New
						</Button>
						<IconButton
							component={'span'}
							sx={{ padding: '0', marginLeft: '10px' }}
						>
							<Dropdown>
								<Box onClick={e => e.stopPropagation()}>
									<HeaderMenuButton>
										<MoreHoriz />
									</HeaderMenuButton>
								</Box>
								<Menu style={{ zIndex: 9 }} slots={{ listbox: StyledListbox }}>
									<Divider />
									<StyledMenuItem onClick={() => setOpenImport(true)}>
										<SaveAlt /> Import Invoices
									</StyledMenuItem>
									<StyledMenuItem onClick={() => setOpenExport(true)}>
										<UploadFile /> Export Invoices
									</StyledMenuItem>
								</Menu>
							</Dropdown>
						</IconButton>
					</Stack>
				)}
			</Box>
			<ImportFileModal
				isOpen={openImport}
				setIsOpen={function () {
					throw new Error('Function not implemented.');
				}}
				importApi={importInvoiceApi}
				ImportTypeEnum={[]}
				onClose={() => setOpenImport(false)}
				// ImportTypeEnum={ImportTypeEnum}
				close={() => setOpenImport(false)}
			/>
			<ExportFileModal
				isOpen={openExport}
				onClose={() => setOpenExport(false)}
				exportApi={getAllInvoicesExportApi}
			/>
		</>
	);
}
