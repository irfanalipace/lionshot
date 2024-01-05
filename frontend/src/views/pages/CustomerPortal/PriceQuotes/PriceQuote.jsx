import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../Components/DataTable/DataTable';
import Box from '@mui/material/Box';
import {
	StatusColor,
	formatDate,
	generateEncryptedID,
	snakeCaseToPrettyText,
} from '../../../../core/utils/helpers';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import { getCustomerPriceQuote } from '../APIs/CustomerPortalAPIs';
import useTheme from '@mui/material/styles/useTheme';
import { useParams } from 'react-router-dom';
import TableGrid from '../../../Components/Containers/TableGrid';

const PriceQuote = () => {
	const theme = useTheme();
	const { customerId } = useParams();
	const customerRef = useRef({
		customer_id: customerId,
	});
	//    estimate number value
	const EstimateNumber = ({ children }) => {
		return (
			<Stack direction='row'>
				<span style={{ color: theme.palette.primary.main }}>{children}</span>
			</Stack>
		);
	};

	const intialColumns = [
		{
			accessorKey: 'estimate_date',
			header: 'Date',
			Cell: ({ cell }) => {
				const data = cell.getValue();
				const formatedDate = formatDate(data);
				return (
					<Box component='span' sx={{}}>
						{formatedDate}
					</Box>
				);
			},
		},
		{
			accessorKey: 'estimate_number',
			header: 'Price Quote Number',
			Cell: ({ renderedCellValue, row }) => (
				<EstimateNumber>{renderedCellValue}</EstimateNumber>
			),
		},

		{
			accessorKey: 'status',
			header: 'Price Quote Status',
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
			accessorKey: 'total',
			header: 'Total',
			Cell: ({ renderedCellValue, cell }) => (
				<Typography>${renderedCellValue}</Typography>
			),
		},

		{
			accessorKey: 'updated_at',
			header: 'Last Updated',
			Cell: ({ cell }) => {
				const data = cell.getValue();
				const formatedDate = formatDate(data);
				return (
					<Box component='span' sx={{}}>
						{formatedDate}
					</Box>
				);
			},
		},
		{
			accessorKey: 'expiry_date',
			header: 'Due Date',
			Cell: ({ cell }) => {
				const data = cell.getValue();
				const formatedDate = formatDate(data);
				return (
					<Box component='span' sx={{}}>
						{formatedDate}
					</Box>
				);
			},
		},
	];
	const navigate = useNavigate();
	const [selectedRows, setSelectedRows] = useState([]);
	const [refresh, setRefresh] = useState(0);
	const handleRowClick = row => {
		var id = row.id;
		const decId = generateEncryptedID(id);

		var url = `/customer-portal/${customerId}/price-quote/${decId}`;
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
								<Typography variant='h6'>Price Quotes</Typography>
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
                  placeholder='Search Price Quotes'
                /> */}
							</Grid>
						</Grid>
					</HeaderPaper>
					<Grid item sm={12}>
						<DataTable
							columns={intialColumns}
							extraParams={customerRef.current}
							api={getCustomerPriceQuote}
							setSelectedRows={setSelectedRows}
							refresh={refresh}
							onRowClick={handleRowClick}
							// collapsed={viewPriceQuotes}
							isSelectable={false}
							showApiError={false}
							manualFilter
						/>
					</Grid>
				</TableGrid>
			</Grid>
		</>
	);
};

export default PriceQuote;
