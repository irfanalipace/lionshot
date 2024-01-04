import { useEffect, useState } from 'react';
import { Grid, Box, Button, Paper } from '@mui/material';
import Action from './Action';
import DataTable from 'components/DataTable/DataTable';
import Modal from 'components/Modal/Dialog';
// import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import {
	// decryptId,
	// extractNumberFromHash,
	generateEncryptedID,
} from 'core/utils/helpers';
import HeaderPaper from 'components/Containers/HeaderPaper';
import DataTableContainer from 'components/Containers/DataTableContainer';
import TableGrid from 'components/Containers/TableGrid';
import { StockOutInitialColumns, collapsedColumns } from './columns';
import StockHeader from './Headers/StockHeader';
import ActionHeader from './Headers/ActionHeader';
import { getAllStocksApi } from 'core/api/stockOut';
import StockMainInfo from './StockMainInfo';
import { useNavigate } from 'react-router-dom';
import DateRangeHeader from '../../../Components/DateRangeHeader/DateRangeHeader';

const StockOutTable = () => {
	const [selectedRows, setSelectedRows] = useState([]);
	const [viewStock, setViewStockItems] = useState(false);
	const [refresh, setRefresh] = useState(0);
	const [initialColumns, setInitialColumns] = useState([]);
	// const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();

	const [id, setId] = useState(null);
	// const hash = window.location.hash;

	function handleAction(e, row) {
		e.stopPropagation();
		// console.log(row);
		navigate(generateEncryptedID(row?.id));
		// setIsOpen(true);
	}

	// useEffect(() => {
	//   const copyColumns = [...StockOutInitialColumns];
	//   copyColumns[copyColumns.length - 1].Cell = ({ row }) => (
	//     <Action onClick={e => handleAction(e, row)} />
	//   );
	//   setInitialColumns(copyColumns);
	// }, []);

	// useEffect(() => {
	//   const id = extractNumberFromHash(hash);
	//   const decryptedId = decryptId(id);
	//   setId(decryptedId);
	//   if (decryptedId) {
	//     setViewStockItems(true);
	//   } else {
	//     setViewStockItems(false);
	//   }
	// }, [hash]);

	const handleRowClick = row => {
		if (row.original.status === 'in_warehouse')
			navigate(generateEncryptedID(row?.id));
	};
	const [searchPram, setSearchPram] = useState('');

	return (
		<Grid container>
			<TableGrid sm={12}>
				<HeaderPaper>
					{/* {selectedRows.length > 0 ? (
            <ActionHeader selectedRows={selectedRows} setRefresh={setRefresh} />
          ) : ( */}
					<StockHeader viewStock={viewStock} />
					{/* )} */}
				</HeaderPaper>
				<Paper sx={{ paddingTop: '20px' }}>
					<DateRangeHeader setSearchPram={setSearchPram} />
					{/* <Grid
							container
							spacing={2}
							style={{ padding: '1rem' }}
							// justifyContent='space-between'
						>
							<Grid item xs={12} display='flex' alignItems='center'>
								<Typography variant='body1' fontWeight={500}>
									Date Range
								</Typography>
							</Grid>

							<Grid item xs={0.5} display='flex' alignItems='center'>
								<InputLabel>From</InputLabel>
							</Grid>
							<Grid item xs={2}>
								<FormField
									type='date'
									name='vendor_credit_date_from'
									size='small'
									value={formValues.dateFrom}
									onChange={e =>
										handleFormFieldChange('dateFrom', e.target.value)
									}
									inputProps={{
										max: formValues.dateTo,
									}}
									fullWidth
								/>
							</Grid>
							<Grid item xs={0.2} display='flex' alignItems='center'>
								<InputLabel>To</InputLabel>
							</Grid>
							<Grid item xs={2} mr={25}>
								<FormField
									type='date'
									name='vendor_credit_date_to'
									size='small'
									inputProps={{
										min: formValues.dateFrom,
									}}
									value={formValues.dateTo}
									onChange={e =>
										handleFormFieldChange('dateTo', e.target.value)
									}
									fullWidth
								/>
							</Grid>
						</Grid> */}
				</Paper>

				<DataTableContainer takenHeight='200'>
					<DataTable
						takenHeight='380'
						api={getAllStocksApi}
						columns={StockOutInitialColumns}
						setSelectedRows={setSelectedRows}
						onRowClick={handleRowClick}
						refresh={refresh}
						manualFilter
						extraParams={searchPram}
					/>
				</DataTableContainer>
			</TableGrid>
			{/* <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        size={'lg'}
        title='Print Work Order'>
        <Box position={'relative'}>
          <StockMainInfo sx={{ pt: 1, px: 2 }} />
          <DataTable
            api={getAllStocksApi}
            columns={collapsedColumns}
            setSelectedRows={setSelectedRows}
            onRowClick={handleRowClick}
            collapsed={false}
            refresh={refresh}
            enableRowSelection={false}
            enableColumnActions={false}
            enableColumnOrdering={false}
            enablePagination={false}
            enableTopToolbar={false}
            enableRowNumbers={true}
          />
          <Button
            variant='contained'
            startIcon={<LocalPrintshopOutlinedIcon />}
            sx={{
              position: 'absolute',
              bottom: '10px',
              right: '70px',
              zIndex: '1'
            }}>
            Print
          </Button>
        </Box>
      </Modal> */}
		</Grid>
	);
};

export default StockOutTable;
