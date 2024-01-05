import React, { useRef, useState } from 'react';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DataTable from '../../../Components/DataTable/DataTable';
import Name from '../../../Components/InputLabel/Name';
import {
	StatusColor,
	formatDate,
	generateEncryptedID,
	snakeCaseToPrettyText,
} from '../../../../core/utils/helpers';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomerSalesOrderApi } from '../APIs/CustomerPortalAPIs';
import useTheme from '@mui/material/styles/useTheme';
import TableGrid from '../../../Components/Containers/TableGrid';

const SalesOrder = () => {
	const theme = useTheme();

	const navigate = useNavigate();
	const { customerId } = useParams();

	const customerRef = useRef({
		customer_id: customerId,
	});

	const intialColumns = [
		{
			accessorKey: 'created_at',
			header: 'Date',
			Cell: ({ renderedCellValue, row }) => (
				<>{formatDate(renderedCellValue)}</>
			),
		},
		{
			accessorKey: 'sale_order_number',
			header: 'Sales Order#',
			Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>,
		},

		{
			accessorKey: 'status',
			header: 'Status',
			Cell: ({ cell }) => {
				const status = cell.getValue();
				const estStatusColor = StatusColor(status, theme);

				return (
					<Box
						component='span'
						sx={{
							color: estStatusColor,
							borderRadius: '0.25rem',
							textTransform: 'capitalize',
						}}
					>
						{snakeCaseToPrettyText(status)}
					</Box>
				);
			},
		},
		{
			accessorKey: 'invoice',
			header: 'Invoice',
			Cell: () => <>----</>,
		},
		{
			accessorKey: 'payment',
			header: 'Payment',
			Cell: () => <>----</>,
		},
		{
			accessorKey: 'total',
			header: 'Amount',
			Cell: ({ renderedCellValue, cell }) => (
				<Typography>${renderedCellValue}</Typography>
			),
		},
	];
	const [selectedRows, setSelectedRows] = useState([]);
	const [refresh, setRefresh] = useState(0);

	const handleRowClick = row => {
		var id = row.id;
		const decId = generateEncryptedID(id);
		var url = `/customer-portal/${customerId}/sales-orders/${decId}`;
		navigate(url);
	};

	return (
		<>
			<Grid container>
				<TableGrid sm={12}>
					<HeaderPaper>
						<Grid
							item
							container
							columnGap={2}
							display='flex'
							justifyContent='space-between'
						>
							<Grid item sm={6}>
								<Typography variant='h6'>Sales Orders</Typography>
							</Grid>
							<Grid item sm={4}>
								{/* <FormField
                  InputProps={{
                    // readOnly: false,
                    // value: searchText,
                    endAdornment: (
                      <InputAdornment position='end'>
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  // handleChange={handleSearchInputChange}
                  placeholder='Search Sales Order'
                /> */}
							</Grid>
						</Grid>
					</HeaderPaper>
					<Grid item sm={12}>
						<DataTable
							extraParams={customerRef.current}
							api={getCustomerSalesOrderApi}
							columns={intialColumns}
							setSelectedRows={setSelectedRows}
							onRowClick={handleRowClick}
							// collapsed={viewOrders}
							refresh={refresh}
							isSelectable={false}
							manualFilter
							showApiError={false}
						/>
					</Grid>
				</TableGrid>
			</Grid>
		</>
	);
};

export default SalesOrder;
