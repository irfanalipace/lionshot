import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import DataTable from '../../../Components/DataTable/DataTable';
import pdf from '../../../../../public/assets/pdf.png';
import printer from '../../../../../public/assets/Printer.png';
import { Menu as DropMenu } from '@mui/base/Menu';

import { ListItemIcon } from '@mui/material';
import {
	bulkDeleteEstimatesApi,
	importEstimate,
	exportEstimate,
} from '../../../../core/api/estimate';
// import { HeaderMenuButton } from 'invoicing/src/InvoiceStyleConst';
import { Box } from '@mui/system';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import SettingsIcon from '@mui/icons-material/Settings';
import { getImageItem } from '../../../../core/api/Itemimage';
import { MoreHoriz } from '@mui/icons-material';

import {
	Grid,
	Menu,
	MenuItem,
	Stack,
	Typography,
	IconButton,
	Divider,
	Button,
} from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CachedIcon from '@mui/icons-material/Cached';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Dropdown } from '@mui/base/Dropdown';

import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';

import HeaderPaper from '../../../Components/Containers/HeaderPaper';

import MUIButton from '../../../Components/Button/MUIButton';

import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import notyf from '../../../Components/NotificationMessage/notyfInstance';

import ImportFileModal from '../../../Components/ImportFileModal/ImportFileModal';
import ExportFileModal from '../../../Components/ExportFileModal/ExportFileModal';
import TableGrid from '../../../Components/Containers/TableGrid';
import DataTableContainer from '../../../Components/Containers/DataTableContainer';

import ImageIcon from '@mui/icons-material/Image';

import SearchBox from '../../../Components/SearchDialogBox/SearchBox';
import TitleDropMenu from '../../../Components/TitleDropMenu/TitltDropMenu.';

const ItemImageTable = () => {
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
			accessorKey: 'item_id',
			header: 'Item_ID',
			Cell: ({ renderedCellValue }) => (
				<>
					{renderedCellValue}
					<ArrowDropDownIcon />
				</>
			),
		},
		{
			accessorKey: 'item_image',
			header: 'Items Image',

			Cell: ({ renderedCellValue }) =>
				renderedCellValue.length > 0 ? (
					<a href={renderedCellValue} target='_blank' rel='noopener noreferrer'>
						<img
							src={renderedCellValue}
							alt='Item Image'
							style={{ width: '50px' }}
						/>
					</a>
				) : (
					<ImageIcon style={{ width: '50px', height: '40px' }} />
				),
		},

		{
			accessorKey: 'actions',
			header: '',
			enableColumnActions: false,
			enableColumnFilter: false,
			enableColumnOrdering: false,
			enableSorting: false,
			size: 700,
			Cell: ({ row }) => <Actions id={row?.original?.id} />,
		},
	];

	// const [columns, setColumns] = useState(intialColumns);
	const [selectedRows, setSelectedRows] = useState([]);

	const [showMenuItem, setShowMenu] = useState(null);
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [dialogProps, setDialogProps] = useState({});
	const [viewPriceQuotes] = useState(false);
	const [openImport, setOpenImport] = useState(false);
	const [openExport, setOpenExport] = useState(false);

	const [anchorE2, setAnchorE2] = useState(null);
	const openMore = Boolean(anchorE2);

	const handleMoreClick = event => {
		setAnchorE2(event.currentTarget);
	};
	const handleMoreClose = () => {
		setAnchorE2(null);
	};

	const navigate = useNavigate();
	const [refresh, setRefresh] = useState(0);
	const showingMenu = event => {
		setShowMenu(event.currentTarget);
	};
	const hidingMenu = () => {
		setShowMenu(null);
	};

	//   menu items

	//   bulk delete / simgle / multiple
	const handleBulkDelete = async () => {
		console.log('selectedRows', selectedRows);
		const selectedRowIds = selectedRows.map(row => Number(row));

		try {
			const resp = await bulkDeleteEstimatesApi({ ids: selectedRowIds });
			notyf.success(resp?.message);
			setRefresh(prev => prev + 1);
		} catch (err) {
			//   console.log("err", err);
			notyf.error('Something went wrong');
		}
	};

	const headerIconButton = {
		backgroundColor: '#EEEEEE',
		border: '1px solid #d1d1d1',
		borderRadius: '4px',
		textTransform: 'none',
		padding: '4px',
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

		const handleEditClick = e => {
			e.stopPropagation();
			openingEditForm(id);
			closeMenu();
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
					//   slots={{ listbox: StyledListbox }}
				>
					<MenuItem
						onClick={handleEditClick}
						sx={{ width: '150px', display: 'flex', alignItems: 'center' }}
					>
						<EditIcon
							sx={{ fontSize: '16px', color: window.themeColors.primary }}
						/>
						<Typography sx={{ margin: '0 5px' }}>Edit </Typography>
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
										>
											<Stack
												direction='row'
												display='felx'
												alignItems='center'
												spacing={2}
											>
												<IconButton
													sx={{
														backgroundColor: '#EEEEEE',
														...headerIconButton,
													}}
												>
													<img src={printer} alt='printer' />
												</IconButton>
												<IconButton
													sx={{
														...headerIconButton,
														backgroundColor: '#EEEEEE',
													}}
												>
													<img src={pdf} alt='pdf' />
												</IconButton>

												<Button
													size='medium'
													sx={{
														...headerIconButton,
														color: 'black',
														padding: '6px 16px',
													}}
												>
													Bulk Update
												</Button>
												<IconButton
													onClick={showingMenu}
													sx={{
														...headerIconButton,
														color: 'black',
														padding: '6px 16px',
													}}
												>
													<MoreHorizIcon />
												</IconButton>
												<Menu
													anchorEl={showMenuItem}
													open={Boolean(showMenuItem)}
													onClose={hidingMenu}
												>
													<MenuItem
														onClick={() => {
															hidingMenu(); // Close the Menu
															setOpenConfirmDialog(true); // Open the confirmation dialog
															setDialogProps({
																onConfirm: handleBulkDelete,
															});
														}}
														sx={{ padding: '2px 4px', borderRadius: '4px' }}
													>
														<MUIButton size='medium' fullWidth>
															Delete
														</MUIButton>
													</MenuItem>
												</Menu>
											</Stack>
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
												<TitleDropMenu title={'Image Item'} />
											</Typography>
										</Stack>
									</Grid>
									<Grid
										item
										sm={6}
										display='flex'
										justifyContent='end'
										alignItems='center'
										// spacing={2}
									>
										<>
											<Button
												size='medium'
												// onClick={() => navigate("/items/new")}
												variant='contained'
											>
												Inventory
											</Button>
											&ensp;
											<Button
												size='medium'
												// onClick={() => setOpenImport(true)}
												variant='contained'
												sx={{ marginRight: '10px' }}
											>
												Ebay
											</Button>
										</>

										<Box
											// bgcolor='red'
											sx={{ margin: ' 0 10px', borderRadius: '4px' }}
										>
											<MUIButton
												size='medium'
												router
												sx={{ padding: '6px 16px' }}
												component={RouterLink}
												to='/items/new'
											>
												<AddIcon fontSize='small' /> New
											</MUIButton>
										</Box>
										<IconButton>
											<Dropdown>
												{/* <HeaderMenuButton> */}
												<SettingsIcon />
												{/* </HeaderMenuButton> */}
											</Dropdown>
										</IconButton>
										<IconButton onClick={event => handleMoreClick(event)}>
											<Dropdown>
												{/* <HeaderMenuButton> */}
												<MoreHoriz />
												{/* </HeaderMenuButton> */}
											</Dropdown>
										</IconButton>
										<DropMenu>
											<Menu
												anchorEl={anchorE2}
												id='other-menu'
												open={openMore}
												onClose={handleMoreClose}
												onClick={handleMoreClose}
												transformOrigin={{
													horizontal: 'center',
													vertical: 'top',
												}}
												anchorOrigin={{
													horizontal: 'left',
													vertical: 'bottom',
												}}
											>
												<MenuItem>Name</MenuItem>
												<MenuItem>Rate</MenuItem>
												<MenuItem>Last Modified Time</MenuItem>
												<MenuItem onClick={() => setOpenImport(true)}>
													<ListItemIcon>
														<SaveAltIcon />
													</ListItemIcon>
													Import Items
												</MenuItem>
												<MenuItem>
													<ListItemIcon>
														<UploadFileIcon />
													</ListItemIcon>
													Export Items
												</MenuItem>
												<Divider />
												<MenuItem>
													<ListItemIcon>
														<UploadFileIcon />
													</ListItemIcon>
													Export Current View
												</MenuItem>
												<Divider />
												<MenuItem>
													<ListItemIcon>
														<SettingsIcon />
													</ListItemIcon>
													Preferences
												</MenuItem>
												<Divider />
												<MenuItem>
													<ListItemIcon>
														<CachedIcon />
													</ListItemIcon>
													Refresh List
												</MenuItem>
											</Menu>
										</DropMenu>
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
							api={getImageItem}
							setSelectedRows={setSelectedRows}
							refresh={refresh}
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
			<ImportFileModal
				isOpen={openImport}
				onClose={() => setOpenImport(false)}
				ImportTypeEnum={ImportTypeEnum}
				importApi={importEstimate}
			/>
			<ExportFileModal
				isOpen={openExport}
				onClose={() => setOpenExport(false)}
				exportApi={exportEstimate}
			/>
		</>
	);
};

export default ItemImageTable;

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
