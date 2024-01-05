import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import {
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Box,
	Stack,
	Typography,
	styled,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MUIButton from '../../../Components/Button/MUIButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Cached, SaveAlt, UploadFile } from '@mui/icons-material';
import ImportFileModal from '../../../Components/ImportFileModal/ImportFileModal';
import ExportFileModal from '../../../Components/ExportFileModal/ExportFileModal';
import { exportBills } from '../../../../core/api/bills';

const headerIconButton = {
	backgroundColor: '#EEEEEE',
	border: '1px solid #d1d1d1',
	borderRadius: '8px',
	textTransform: 'none',
	padding: '1px',
};

const StyledListbox = styled('ul')(
	() => `
	font-family: roboto;
	font-size:18px,
	min-width: 100px;
	border-radius: 12px;
	overflow: auto;
	outline: 0px;
	background: white;
	box-shadow: 0px 4px 30px #d0d7de;
	z-index:1
	`
);

export default function BillsHeader({ setRefresh }) {
	const [anchorE2, setAnchorE2] = useState(null);
	const [openImport, setOpenImport] = useState(false);
	const [openExport, setOpenExport] = useState(false);

	const handleMoreClick = event => {
		setAnchorE2(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorE2(null);
	};

	return (
		<Grid item container height={30}>
			<Grid item sm={6} display='flex' alignItems='center'>
				<Stack direction='row' display='flex' alignItems='center' spacing={0}>
					<Typography variant='h6' component='span'>
						Bills
					</Typography>
				</Stack>
			</Grid>
			<Grid item sm={6} display='flex' justifyContent='end' alignItems='center'>
				{/* <Box sx={{ margin: ' 0 10px', borderRadius: '4px' }}>
					<MUIButton
						size='medium'
						router
						sx={{ padding: '6px 16px' }}
						component={RouterLink}
						to='/bills/new'
					>
						<AddIcon fontSize='small' />{' '}
						<Typography variant='body2Bold'>New</Typography>
					</MUIButton>
				</Box> */}
				<Box>
					<IconButton
						onClick={event => handleMoreClick(event)}
						sx={{ ...headerIconButton, padding: '5px 3px' }}
					>
						<MoreHorizIcon />
					</IconButton>

					<Menu
						slots={{ listbox: StyledListbox }}
						anchorEl={anchorE2}
						open={Boolean(anchorE2)}
						onClose={() => handleClose()}
					>
						{/* <MenuItem onClick={() => setOpenImport(true)}>
							<SaveAlt color='primary' /> &ensp;Import Bills
						</MenuItem> */}
						<MenuItem onClick={() => setOpenExport(true)}>
							<UploadFile color='primary' /> &ensp;Export Bills
						</MenuItem>
					</Menu>
				</Box>
			</Grid>
			<ImportFileModal
				isOpen={openImport}
				onClose={() => setOpenImport(false)}
				// ImportTypeEnum={ImportTypeEnum}
				// importApi={importEstimate}
				setRefresh={setRefresh}
			/>
			<ExportFileModal
				isOpen={openExport}
				onClose={() => setOpenExport(false)}
				exportApi={exportBills}
			/>
		</Grid>
	);
}
