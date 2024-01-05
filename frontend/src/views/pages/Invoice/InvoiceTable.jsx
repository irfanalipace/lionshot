import { useEffect, useState } from 'react';
import { Box, Grid, IconButton } from '@mui/material';
import DataTableContainer from 'components/Containers/DataTableContainer';
import Header from './Header';
import BulkImport from 'components/ImportFileModal/ImportFileModal';
import DeletePopUp from 'components/DeletePopUp/DeletePopUp';
import notyf from 'components/NotificationMessage/notyfInstance';
import {
	bulkDeleteInvoicesApi,
	deleteInvoiceApi,
	deleteInvoicesApi,
	getAllInvoicesListApi,
} from '../../../core/api/Invoice';
import CustomDialog from 'components/Modal/Dialog';
import './Invoicing.css';
import DataTable from 'components/DataTable/DataTable';
import { extractNumberFromHash } from 'core/utils/helpers';
// import ViewInvoice from './view/viewInvoice';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';
import { minnesotaCollapsedColumns, minnesotaColumns } from './column';
import PaymentSummary from './PaymentSummary';
import TableGrid from '../../Components/Containers/TableGrid';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import DetailViewContainer from '../../Components/Containers/DetailViewContainer';
import OverlayLoader from '../../Components/OverlayLoader/OverlayLoader';
import { useLocation } from 'react-router-dom';
const ViewInvoice = lazy(() => import('./view/viewInvoice'));

function InvoicingTable() {
	const [deleteType, setDeleteType] = useState('');
	const [deleteIds, setDeleteIds] = useState([]);
	const [dltOpen, setDltOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [refresh, setRefresh] = useState(0);
	const loc = useLocation();
	const hash = loc.hash;
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [id, setId] = useState(null);
	const [dialogProps, setDialogProps] = useState({});
	const [viewCustomer, setViewCustomer] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const id = extractNumberFromHash(hash);
		setId(id);
		if (id) {
			setViewCustomer(true);
		} else {
			setViewCustomer(false);
		}
	}, [hash]);

	// You might need to define these functions and states as well
	const handleImportApi = async () => {
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
	const deletingSingleInvoice = async deleteIds => {
		try {
			await deleteInvoiceApi(deleteIds);
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
	const deletingInvoiceBulk = async ids => {
		try {
			await deleteInvoicesApi(ids);
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

	const handleRowClick = row => {
		location.hash = '#/' + row?.id;
	};

	//   bulk delete / simgle / multiple
	const handleBulkDelete = async () => {
		const selectedRowIds = selectedRows.map(row => Number(row));

		try {
			setLoading(true);
			const resp = await bulkDeleteInvoicesApi({ ids: selectedRowIds });
			notyf.success(resp?.message);
			setRefresh(prev => prev + 1);
		} catch (err) {
			notyf.error('Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	const [selectedRows, setSelectedRows] = useState([]);
	const isRowSelectable = row => {
		return row?.original?.status === 'draft';
	};

	return (
		<>
			<Box>
				<Grid container>
					<TableGrid scrollable sm={viewCustomer ? 3.5 : 12}>
						<HeaderPaper>
							<Header
								selected={selectedRows?.length}
								onDelete={handleBulkDelete}
								setRefresh={setRefresh}
							/>
						</HeaderPaper>

						{!viewCustomer && <PaymentSummary />}

						<DataTableContainer>
							<DataTable
								columns={
									viewCustomer ? minnesotaCollapsedColumns : minnesotaColumns
								}
								api={getAllInvoicesListApi}
								setSelectedRows={setSelectedRows}
								onRowClick={handleRowClick}
								refresh={refresh}
								extraParams={''}
								collapsed={viewCustomer}
								enableRowSelection={isRowSelectable}
							/>
						</DataTableContainer>
					</TableGrid>
					{viewCustomer && (
						<Grid container sm={8.5} item>
							<DetailViewContainer>
								<ViewInvoice id={id} origin={origin} setRefresh={setRefresh} />
							</DetailViewContainer>
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

				{/* <ViewInvoiceMain
					handleDrawer={handleDrawer}
					open={drawerState}
					onClose={handleDrawer}
					drawerState={drawerState}
				/> */}
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
			<OverlayLoader open={loading} />
		</>
	);
}

export default InvoicingTable;
