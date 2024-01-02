import { useEffect, useState } from 'react';
import { Box, Divider, Grid, IconButton } from '@mui/material';
import { Paper, Typography, Button } from '@mui/material';
import BulkImport from '@/Components/ImportFileModal/ImportFileModal';
import { useNavigate } from 'react-router-dom';
import ViewInvoiceMain from '@/Components/ViewInvoice/ViewInvoiceMain';
import DeletePopUp from '@/Components/DeletePopUp/DeletePopUp';
import notyf from '@/Components/NotificationMessage/notyfInstance';
import {
	bulkDeleteInvoicesApi,
	deleteInvoiceApi,
	deleteInvoicesApi,
	getAllInvoicesListApi,
} from './apis/invoice';
import CustomDialog from './Components/Modal/Dialog';
import './Invoicing.css';
import DataTable from './Components/DataTable/DataTable';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton } from '@mui/base/MenuButton';
import {
	Add,
	MoreHoriz,
	SaveAlt,
	UploadFile,
	Close,
} from '@mui/icons-material';
import {
	StyledListbox,
	HeaderMenuButton,
	StyledMenuItem,
	headerMenuBox,
} from './InvoiceStyleConst';
import useHash from './hooks/useHash';
import { extractNumberFromHash } from '@/utils/helper';
// This component is importing from outside package
// import ViewInvoice from "../../Estimate/ViewInvoice/ViewInvoice";
import ViewInvoice from '@/Pages/ViewInvoice/ViewInvoice';
import ConfirmDialog from '@/Components/ConfirmDialog/ConfirmDialog';
import ExportFileModal from '@/Components/ExportFileModal/ExportFileModal';
import ImportFileModal from '@/Components/ImportFileModal/ImportFileModal';
import { styled } from '@mui/system';
import MUIButton from '@/Components/MUIButton';
import {
	minnesotaCollapsedColumns,
	minnesotaColumns,
	rtiCollapsedColumns,
	rtiColumns,
} from '@/Pages/constants/TableColumns';
import PaymentSummary from './Components/ViewInvoice/PaymentSummary';

interface InvoiceProps {
	origin: string;
}

const CustomMenuButton = styled(MenuButton)(
	() => `
  font-family: "Roboto"
  transition: all 150ms ease;
  cursor: pointer;
  background-color: "white";
  border: none;
  `
);
function Invoicing({ origin }: InvoiceProps) {
	const TABLE_COLUMN = {
		rti: rtiColumns,
		minnesota: minnesotaColumns,
	};

	const TABLE_COLLAPSED_COLUMN = {
		rti: rtiCollapsedColumns,
		minnesota: minnesotaCollapsedColumns,
	};

	const [deleteType, setDeleteType] = useState<string>('');
	const [deleteIds, setDeleteIds] = useState<number[]>([]);
	const [dltOpen, setDltOpen] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [drawerState, setDrawerState] = useState<boolean>(false);

	const [refresh, setRefresh] = useState(0);
	const [hash, setHash] = useHash();
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [id, setId] = useState<number | null>(null);
	const [dialogProps, setDialogProps] = useState({});

	const [viewCustomer, setViewCustomer] = useState(false);
	const [openImport, setOpenImport] = useState(false);
	const [openExport, setOpenExport] = useState(false);

	useEffect(() => {
		const id = extractNumberFromHash(hash);
		setId(id);
		if (id) {
			setViewCustomer(true);
		} else {
			setViewCustomer(false);
		}
	}, [hash]);

	const navigate = useNavigate();

	const handleNewInvoice = () => {
		navigate('/invoices/new');
	};

	//  view invoce func
	const handleDrawer = () => {
		setDrawerState(!drawerState);
	};

	// You might need to define these functions and states as well
	const handleImportApi = async (): Promise<void> => {
		// Your importApi logic here
	};

	const handleImportTypeEnum = [
		{ key: 'key1', label: 'Label 1', filePath: 'path1' },
		// Add more entries as needed
	];

	const handleDeleteModalClose = () => {
		setDltOpen(false);
		setDeleteIds([]);
		setDeleteType('');
	};
	// single delete list
	const deletingSingleInvoice = async (deleteIds: number) => {
		try {
			const resp = await deleteInvoiceApi(deleteIds);
			notyf.success('Invoice delete successful! 🎉');
			// setInvoiceListData(
			//   InvoiceListData.filter(list => list.id !== deleteIds)
			// );
		} catch (error) {
			// Handle the error if needed
			console.log('error', error);
			//  notyf.error(error?.data?.message);
		} finally {
			setDltOpen(false);
		}
	};
	//  delete Invoices / Bulk
	const deletingInvoiceBulk = async (ids: number[]) => {
		try {
			const resp = await deleteInvoicesApi(ids);
			notyf.success('Invoice delete successful! 🎉');
			//  setCheckedState(true);
			// setInvoiceListData(
			//   InvoiceListData.filter(list => list.id !== deleteIds[0])
			// );
		} catch (error) {
			console.log('error', error);
			//   notyf.error(error?.data?.message);
		} finally {
			setDltOpen(false);
		}
	};

	// handle delete confirmation ( single delete / bulk delete )
	const deleteConfirmation = () => {
		if (deleteType === 'single' && !Array.isArray(deleteIds)) {
			deletingSingleInvoice(deleteIds);
		}
		if (deleteType === 'bulk' && Array.isArray(deleteIds)) {
			deletingInvoiceBulk(deleteIds);
		}
	};

	const handleRowClick = (row: { id: string }): void => {
		setHash('#/' + row?.id);
	};

	//   bulk delete / simgle / multiple
	const handleBulkDelete = async () => {
		console.log('selectedRows', selectedRows);
		const selectedRowIds = selectedRows.map((row: any) => Number(row));

		try {
			const resp: any = await bulkDeleteInvoicesApi({ ids: selectedRowIds });
			notyf.success(resp?.message);
			setRefresh(prev => prev + 1);
		} catch (err) {
			//   console.log("err", err);
			notyf.error('Something went wrong');
		}
	};

	const [selectedRows, setSelectedRows] = useState<any>([]);

	return (
		<>
			<Box>
				{/* import / export btns  */}

				<Grid container>
					<Grid item sm={viewCustomer ? 3.5 : 12}>
						<Paper
							sx={{
								height: '78px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								paddingX: '1.5rem',
							}}
						>
							<Box sx={{ mr: 'auto' }}>
								{selectedRows.length > 0 ? (
									<Box sx={headerMenuBox}>
										<MUIButton
											onClick={() => {
												setOpenConfirmDialog(true);
												setDialogProps({
													onConfirm: handleBulkDelete,
												});
											}}
										>
											Delete
										</MUIButton>
									</Box>
								) : (
									<Dropdown>
										<CustomMenuButton
											sx={{ backgroundColor: 'white' }}
											// onClick={(e: { stopPropagation: () => any }) =>
											// 	e.stopPropagation()
											// }
										>
											<Typography
												noWrap
												variant='h6'
												className='TextCapitalize'
											>
												All Invoices
											</Typography>
										</CustomMenuButton>
									</Dropdown>
								)}
							</Box>
							{selectedRows?.length ? (
								<IconButton onClick={() => setRefresh(prev => prev + 1)}>
									<Close />
								</IconButton>
							) : (
								['minnesota'].includes(origin) && (
									<div className='btn-container'>
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
												<Box
													onClick={(e: { stopPropagation: () => any }) =>
														e.stopPropagation()
													}
												>
													<HeaderMenuButton>
														<MoreHoriz />
													</HeaderMenuButton>
												</Box>
												<Menu
													style={{ zIndex: 9 }}
													slots={{ listbox: StyledListbox }}
												>
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
									</div>
								)
							)}
						</Paper>

						{!viewCustomer && ['minnesota'].includes(origin) && (
							<PaymentSummary />
						)}
						<Paper
							sx={{
								margin: '0.5em 0',
								// maxHeight: 'calc(100vh - 300px)',
								// overflow: 'hidden',
							}}
						>
							{/* <TableContainer> */}
							<DataTable
								origin={origin}
								columns={
									viewCustomer
										? TABLE_COLLAPSED_COLUMN[origin]
										: TABLE_COLUMN[origin]
								}
								api={getAllInvoicesListApi}
								setSelectedRows={setSelectedRows}
								onRowClick={handleRowClick}
								refresh={refresh}
								extraParams={''}
								collapsed={viewCustomer}
							/>
							{/* </TableContainer> */}
						</Paper>
					</Grid>
					{viewCustomer && (
						<Grid container sm={8.5} item>
							<ViewInvoice
								id={id}
								origin={origin}
								setRefresh={setRefresh}
								// setViewPriceQuotes={setViewCustomer}
							/>
						</Grid>
					)}
				</Grid>
				{/* import / export modals  */}
				<BulkImport
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					importApi={handleImportApi}
					ImportTypeEnum={handleImportTypeEnum}
					close={undefined}
				/>
				{/* <BulkExport isOpen={isOpen1} setIsOpen={setIsOpen1} /> */}

				<ViewInvoiceMain
					handleDrawer={handleDrawer}
					open={drawerState}
					onClose={handleDrawer}
					drawerState={drawerState}
				/>
			</Box>
			{/* delete / bulk delete (modal)  */}
			<CustomDialog open={dltOpen} onClose={handleDeleteModalClose} title={''}>
				<DeletePopUp
					type='Invoice(s)'
					deleteType={deleteType}
					handleClose={handleDeleteModalClose}
					deleteClick={deleteConfirmation}
				/>
			</CustomDialog>
			<ConfirmDialog
				onConfirm={undefined}
				onConfirmParams={undefined}
				title='Are you sure you want to delete'
				isOpen={openConfirmDialog}
				onClose={() => setOpenConfirmDialog(false)}
				{...dialogProps}
			/>
			<ImportFileModal
				isOpen={openImport}
				setIsOpen={function (isOpen: boolean): void {
					throw new Error('Function not implemented.');
				}}
				importApi={function (data: any): Promise<void> {
					throw new Error('Function not implemented.');
				}}
				ImportTypeEnum={[]} // onClose={() => setOpenImport(false)}
				// ImportTypeEnum={ImportTypeEnum}
				// importApi={importSaleOrder}
				close={() => setOpenImport(false)}
			/>
			<ExportFileModal
				isOpen={openExport}
				onClose={() => setOpenExport(false)}
				exportApi={undefined} // exportApi={exportSaleOrder}
			/>
		</>
	);
}

export default Invoicing;
