import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../Components/DataTable/DataTable';

import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

// import { HeaderMenuButton } from 'invoicing/src/InvoiceStyleConst';
import { Box } from '@mui/system';

import {
	getBrandItem,
	deleteItem,
	bulkDeleteItem,
} from '../../../core/api/brand';
import { Delete } from '@mui/icons-material';

import {
	Grid,
	Menu,
	MenuItem,
	Stack,
	Typography,
	IconButton,
} from '@mui/material';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import CloseIcon from '@mui/icons-material/Close';

import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import MUIButton from 'invoicing/src/Components/MUIButton';

import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';
import notyf from '../../Components/NotificationMessage/notyfInstance';
import ExportFileModal from '../../Components/ExportFileModal/ExportFileModal';
import TableGrid from '../../Components/Containers/TableGrid';
import DataTableContainer from '../../Components/Containers/DataTableContainer';

import SearchBox from '../../Components/SearchDialogBox/SearchBox';
import TitleDropMenu from '../../Components/TitleDropMenu/TitltDropMenu.';

const BrandTable = () => {
	//    estimate number value
	// const ItemNumber = ({ children }) => {
	// 	return (
	// 		<Stack direction='row'>
	// 			<span style={{ color: '#1E88E5' }}>{children}</span>
	// 		</Stack>
	// 	);
	// };

	const [isExportDialogOpen, setExportDialogOpen] = useState(false);

	// const handleExportClick = () => {
	// 	setExportDialogOpen(true);
	// };

	const handleExportDialogClose = () => {
		setExportDialogOpen(false);
	};

	const intialColumns = [
		{
			accessorKey: 'id',
			header: 'ID',
		},
		{
			accessorKey: 'name',
			header: 'Name',
			size: 1000,
		},
		// {
		// 	accessorKey: 'actions',
		// 	header: '',
		// 	enableColumnActions: false,
		// 	enableColumnFilter: false,
		// 	enableColumnOrdering: false,
		// 	enableSorting: false,

		// 	Cell: ({ row }) => <Actions id={row?.original?.id} />,
		// },
	];

	// const [columns, setColumns] = useState(intialColumns);
	const [selectedRows, setSelectedRows] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const [anchorE2, setAnchorE2] = useState(null);
	const [showMenuItem, setShowMenu] = useState(null);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [dialogProps, setDialogProps] = useState({});
	const [viewPriceQuotes] = useState(false);

	const navigate = useNavigate();
	const [refresh, setRefresh] = useState(0);
	const showingMenu = event => {
		setShowMenu(event.currentTarget);
	};
	const hidingMenu = () => {
		setShowMenu(null);
	};

	const open = Boolean(anchorEl);
	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	// tansaction menu
	const tansactionOpen = Boolean(anchorE2);
	const handleTransactions = event => {
		setAnchorE2(event.currentTarget);
	};
	const closeTransactions = () => {
		setAnchorE2(null);
	};
	//   menu items

	// bulk delete / simgle / multiple
	const handleBulkDelete = async () => {
		console.log('selectedRows', selectedRows);
		const selectedRowIds = selectedRows.map(row => Number(row));

		try {
			const resp = await bulkDeleteItem({ ids: selectedRowIds });
			notyf.success(resp?.message);
			setRefresh(prev => prev + 1);
		} catch (err) {
			//   console.log("err", err);
			notyf.error('Something went wrong');
		}
	};

	// actions aicon , only edit for now
	const Actions = ({ id }) => {
		const [menuAnchorEl, setMenuAnchorEl] = useState(null);

		const openMenu = event => {
			event.stopPropagation();
			setMenuAnchorEl(event.currentTarget);
		};

		const closeMenu = () => {
			setMenuAnchorEl(null);
		};

		///delete the Brand
		const handleDelete = async itemId => {
			try {
				await deleteItem(itemId);
				notyf.success('Brand deleted');
				setRefresh(prev => prev + 1);
			} catch (error) {
				console.log('');
			}
		};

		return (
			<Box className='show-on-hover' sx={{ display: 'none' }}>
				{/* <TriggerButton onClick={openMenu} >
          <KeyboardArrowDown/>
        </TriggerButton> */}
				<IconButton
					onClick={openMenu}
					sx={{
						backgroundColor: window.themeColors.primary,
						borderRadius: '18px',
						padding: '2px',
						color: '#fff',
						transition: 'background-color 0.3s',
						'&:hover': {
							background: 'rgb(33,150,243 , 0.8)',
							color: '#fff',
						},
					}}
				>
					<KeyboardArrowDown />
				</IconButton>
				<Menu
					anchorEl={menuAnchorEl}
					open={Boolean(menuAnchorEl)}
					onClose={closeMenu}
				>
					{/* <MenuItem
						onClick={handleEditClick}
						sx={{ width: '150px', display: 'flex', alignItems: 'center' }}
					>
						<EditIcon sx={{ fontSize: '16px', color: window.themeColors.primary }} />
						<Typography sx={{ margin: '0 5px' }}>Edit </Typography>
					</MenuItem> */}
					<MenuItem
						variant='outlined'
						onClick={() => {
							closeMenu();
							setOpenConfirmDialog(true);
							setDialogProps({
								onConfirm: () => handleDelete(id), // Pass the item's ID
							});
						}}
						sx={{ width: '150px', display: 'flex', alignItems: 'center' }}
					>
						<Delete
							sx={{ fontSize: '16px', color: window.themeColors.primary }}
						/>
						<Typography sx={{ margin: '0 5px' }}>Delete </Typography>
					</MenuItem>
				</Menu>
			</Box>
		);
	};

	const openingEditForm = id => {
		// alert('Edit clicked for ID: ' + id);
		navigate(`/bills/edit/${id}`);
	};

	return (
		<>
			<Grid container>
				<TableGrid sm={viewPriceQuotes ? 3.5 : 12}>
					<HeaderPaper>
						{selectedRows.length > 0 && (
							<Grid item container>
								{/* pgae header / when checkbox selected  */}
								<Grid item sm={12}>
									<Grid item container>
										<Grid
											item
											sm={10}
											sx={{ display: 'flex', alignItems: 'center' }}
										></Grid>
										<Grid
											item
											sm={2}
											sx={{
												display: 'flex',
												justifyContent: 'end',
												alignItems: 'center',
											}}
										>
											<IconButton onClick={() => setRefresh(prev => prev + 1)}>
												<CloseIcon />
											</IconButton>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						)}
						{/* pgae header / when checkbox not selected  */}
						{selectedRows.length === 0 && (
							<Grid item container>
								<>
									<Grid item sm={6} display='flex' alignItems='center'>
										<Stack
											direction='row'
											display='flex'
											alignItems='center'
											spacing={0}
										>
											<Typography variant='h6' component='span'>
												Brands
											</Typography>
										</Stack>
									</Grid>
								</>
							</Grid>
						)}
					</HeaderPaper>

					<SearchBox
						open={isExportDialogOpen}
						onClose={handleExportDialogClose}
					/>

					<DataTableContainer>
						<DataTable
							columns={intialColumns}
							api={getBrandItem}
							setSelectedRows={setSelectedRows}
							refresh={refresh}
							onRowClick={() => {}}
							enableRowSelection={false}
						/>
					</DataTableContainer>
				</TableGrid>
			</Grid>

			{/* delete confirmation box  */}
			<ConfirmDialog
				title='Are you sure you want to delete'
				isOpen={openConfirmDialog}
				onClose={() => setOpenConfirmDialog(false)}
				{...dialogProps}
			/>
		</>
	);
};

export default BrandTable;

const ImportTypeEnum = [
	{
		key: 'customers_import',
		label: 'Customer Complete Detail',
		filePath: '/files/sample_contacts_new',
	},
	{
		key: 'customers_contacts_persons_import',
		label: 'Customer' + 's Contact Persons',
		filePath: '/files/sample_contactpersons',
	},
];
