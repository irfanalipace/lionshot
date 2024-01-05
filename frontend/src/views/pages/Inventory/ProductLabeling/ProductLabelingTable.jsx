import { useState } from 'react';
import { Grid, Tab, Tabs, Typography } from '@mui/material';
import DataTable from '../../../Components/DataTable/DataTable';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import TableGrid from '../../../Components/Containers/TableGrid';
import { formatDateAndTime } from '../../../../core/utils/helpers';
import Print from '@mui/icons-material/Print';
import ItemLabelModal from './ItemLabelModal';
import {
	bulkLabelsPrintAPI,
	getAllProductLabelsAPI,
	printLabelAPI,
} from '../../../../core/api/productLabeling';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import DataTableContainer from '../../../Components/Containers/DataTableContainer';
import { LoadingButton } from '@mui/lab';

const ProductLabelingTable = () => {
	const [selectedRows, setSelectedRows] = useState([]);
	const [refresh, setRefresh] = useState(0);
	const [rowData, setRowData] = useState();
	const [tabValue, setTabValue] = useState(0);
	const [dataKey, setDataKey] = useState('all_item_labels');
	const [openItemModal, setOpenItemModal] = useState();
	const [buttonLoading, setButtonLoading] = useState();
	const [allLabelBtnLoading, setAllLabelBtnLoading] = useState();
	const initialColumns = [
		{
			accessorKey: 'title',
			header: 'Item Name',
			Cell: ({ row }) => (
				<>
					<Typography variant='body2' component={'span'}>
						{row?.original?.title}
					</Typography>
					{row?.original?.label === 'new' && (
						<Typography
							variant='caption'
							component={'span'}
							sx={{
								backgroundColor: '#E65100',
								color: 'white',
								padding: '2px 5px',
								borderRadius: '12px',
								fontSize: '10px',
								marginLeft: '5px',
							}}
						>
							New
						</Typography>
					)}
				</>
			),
		},
		{
			accessorKey: 'mpn',
			header: 'Item #',
		},
		{
			accessorKey: 'quantity',
			header: 'No. of Labels',
		},
		{
			accessorKey: 'sku',
			header: 'Stock Location',
		},
		{
			accessorKey: 'product_label.status',
			header: 'Status',
			Cell: ({ row }) => (
				<Typography variant='body2' className='TextCapitalize'>
					{row?.original?.product_label?.status}
				</Typography>
			),
		},
		{
			accessorKey: 'created_at',
			header: 'Time Stamp',
			Cell: ({ row }) => (
				<Typography variant='body2'>
					{formatDateAndTime(row?.original?.created_at)}
				</Typography>
			),
		},
	];
	// Conditionally add the action column based on dataKey
	const columns =
		dataKey === 'new_item_labels'
			? [
					...initialColumns,
					{
						accessorKey: 'actions',
						header: 'Actions',
						enableColumnActions: false,
						enableColumnFilter: false,
						enableColumnOrdering: false,
						enableSorting: false,
						size: 70,
						Cell: ({ row }) => <Actions singleRowData={row?.original} />,
					},
			  ]
			: [...initialColumns];

	const handleRowClick = row => {
		setOpenItemModal(true);
		setRowData(row?.original);
	};

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
		if (newValue === 1) setDataKey('new_item_labels');
		else if (newValue === 0) setDataKey('all_item_labels');
	};

	const printAllLabels = async () => {
		const selectedRowIds = selectedRows.map(row => Number(row));
		try {
			setAllLabelBtnLoading(true);
			const res = await bulkLabelsPrintAPI({ item_ids: selectedRowIds });
			if (res) {
				window.open(res?.data?.url, '_blank');
				notyf.success('All Labels Downloaded Successfully');
				setRefresh(prev => prev + 1);
			}
		} catch (error) {
			error?.data?.message
				? notyf.error(error?.data?.message)
				: notyf.error('Something went Wrong');
		} finally {
			setAllLabelBtnLoading(false);
		}
	};
	const singlePrintLabelAPI = async singleRowData => {
		try {
			setButtonLoading(true);
			const params = {
				item_id: singleRowData?.id,
				number_of_labels:
					singleRowData?.quantity == 0 ? 1 : singleRowData?.quantity,
			};
			console.log('all data', params);
			const res = await printLabelAPI(params);
			if (res) {
				window.open(res?.data?.url, '_blank');
				notyf.success('Label Print Successfully');
				setRefresh(prev => prev + 1);
			} else console.log('res', res);
		} catch (error) {
			error?.data?.message
				? notyf.error(error?.data?.message)
				: notyf.error('Something went Wrong');
		} finally {
			setButtonLoading(false);
		}
	};
	const Actions = ({ singleRowData }) => {
		return (
			<LoadingButton
				className='show-on-hover'
				sx={{ display: 'none', padding: '0', minWidth: '44px' }}
				onClick={e => {
					e.stopPropagation();
					singlePrintLabelAPI(singleRowData);
				}}
				loading={buttonLoading}
			>
				<Print />
			</LoadingButton>
		);
	};
	return (
		<>
			<Grid container>
				<TableGrid sm={12}>
					<HeaderPaper sx={{ marginBottom: '-5px' }}>
						<Grid
							container
							rowSpacing={1}
							columnSpacing={{ xs: 1, sm: 2, md: 3 }}
							sx={{ display: 'flex', alignItems: 'center' }}
						>
							<Grid item xs={8}>
								<Typography variant='h6'>Product Labeling</Typography>
							</Grid>
						</Grid>
					</HeaderPaper>

					{selectedRows?.length > 0 ? (
						<LoadingButton
							variant='contained'
							sx={{
								// paddingBottom: '10px',
								marginBottom: '-70px',
								marginLeft: '10px',
								position: 'relative',
								zIndex: '2',
							}}
							onClick={printAllLabels}
							loading={allLabelBtnLoading}
						>
							<Print fontSize='small' sx={{ marginRight: '5px' }} />
							ALl Labels
						</LoadingButton>
					) : (
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							sx={{
								// paddingBottom: '10px',
								marginBottom: '-75px',
								position: 'relative',
								zIndex: '2',
								display: 'inline-block',
								padding: '20px',
							}}
						>
							<Tab label='All Item Labels' />
							<Tab label='New Item Labels' />
						</Tabs>
					)}
					<DataTableContainer>
						<DataTable
							api={getAllProductLabelsAPI}
							columns={columns}
							setSelectedRows={setSelectedRows}
							onRowClick={handleRowClick}
							refresh={refresh}
							positionToolbarAlertBanner={'bottom'}
							activeDataKey={dataKey}
							dataKeys={['all_item_labels', 'new_item_labels']}
							manualFilter
							enableRowSelection={true}
						/>
					</DataTableContainer>
				</TableGrid>
			</Grid>

			{openItemModal && (
				<ItemLabelModal
					rowData={rowData}
					openItemModal={openItemModal}
					setOpenItemModal={setOpenItemModal}
					setRefresh={setRefresh}
				/>
			)}
		</>
	);
};

export default ProductLabelingTable;
