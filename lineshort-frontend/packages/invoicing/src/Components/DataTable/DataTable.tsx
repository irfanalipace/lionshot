import React, { useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';

interface DataTableProps {
	api: any;
	extraParams?: any;
	columns: any[];
	setSelectedRows: (selectedRows: string[]) => void;
	onRowClick: (row: any) => void;
	collapsed?: boolean;
	refresh?: any;
	origin: string;
}

const rtiDataArray = [
	{
		company_name: 'Cybervision Inc',
		company_address:
			'70 Washington Square South, New York, NY 10012, United States',
		company_phone: '(262) 798-3040',
		sold_to: 'Lexi Renarje 1525 99th LN NE Blaine, MN 23897',
		bol_number: 12234,
		origin: 'rti',
		invoice_date: 'jan 03 2023',
		invoice_number: 22345,
		discount: 100,
		total: 345,
		tax_amount: 10,
		sub_total: 200,
		button_type: 'save_as_draft',
		invoice_items: [
			{
				item_id: null,
				rti_item_id: 1,
				item_name: 'Item1',
				quantity: 1,
				rate: 45,
				total: 345,
				weight: 20,
				tax_id: 4,
			},
		],
	},
	{
		company_name: '99 Inc',
		company_address:
			'70 Washington Square South, New York, NY 10012, United States',
		company_phone: '(262) 798-3040',
		sold_to: 'Lexi Renarje 1525 99th LN NE Blaine, MN 23897',
		bol_number: 122347,
		origin: 'rti',
		invoice_date: 'jan 06 2023',
		invoice_number: 223456,
		discount: 100,
		total: 345,
		tax_amount: 10,
		sub_total: 200,
		button_type: 'save_as_draft',
		invoice_items: [
			{
				item_id: null,
				rti_item_id: 2,
				item_name: 'Item2',
				quantity: 2,
				rate: 85,
				total: 345,
				weight: 20,
				tax_id: 5,
			},
		],
	},
];

const DataTable: React.FC<DataTableProps> = ({
	api, // Function that fetches data from an API.
	extraParams, // Function that fetches data from an API.
	columns, // Array of column configuration objects for the table.
	setSelectedRows, // Callback function to set the selected row IDs.
	onRowClick, // Callback function when a table row is clicked.
	collapsed, //  variable that check if table is collapsed or not
	refresh, // force refetching data
	origin,
}) => {
	interface RowSelectionState {
		[key: string]: boolean;
	}

	//data and fetching state
	const [data, setData] = useState<any>([]);
	const [isError, setIsError] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [rowCount, setRowCount] = useState<number>(0);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

	//table state
	const [columnFilters, setColumnFilters] = useState([]); // You should define the proper type for column filters
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [sorting, setSorting] = useState<any[]>([]); // You should define the proper type for sorting
	const [pagination, setPagination] = useState<{
		pageIndex: number;
		pageSize: number;
	}>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [isMounted, setIsMounted] = useState<boolean>(false);

	const fetchData = async () => {
		setIsLoading(true);
		const params = {
			page: pagination.pageIndex + 1,
			per_page: pagination.pageSize,
			origin: origin,
			...extraParams,
		};

		try {
			const response = await api(params);
			console.log(response.data.data);

			setData(response.data.data);
			setRowCount(response.data.total);

			setIsMounted(true); // to prevent refetching on first mount
		} catch (error) {
			setIsError(true);
			console.error(error);
			return;
		}
		setIsError(false);
		setIsLoading(false);
	};
	useEffect(() => {
		fetchData();
	}, [pagination.pageIndex, pagination.pageSize]);

	useEffect(() => {
		if (isMounted) {
			// prevent refetching on first mount
			fetchData();
			setRowSelection({});
		}
	}, [refresh]);

	useEffect(() => {
		const selectedIds = Object.keys(rowSelection);
		setSelectedRows(selectedIds);
	}, [rowSelection]);

	return (
		<MaterialReactTable
			// enableStickyHeader
			columns={columns}
			data={data}
			enableRowSelection={false}
			onRowSelectionChange={setRowSelection}
			getRowId={(row: any) => row?.id}
			manualPagination
			// enableColumnResizing={!collapsed}
			enableColumnActions={!collapsed}
			enableDensityToggle={!collapsed}
			enableHiding={!collapsed}
			enableFilters={!collapsed}
			enableFullScreenToggle={!collapsed}
			enableColumnOrdering={!collapsed}
			enableTableHead={!collapsed}
			onColumnFiltersChange={setColumnFilters}
			onGlobalFilterChange={setGlobalFilter}
			onPaginationChange={setPagination}
			onSortingChange={setSorting}
			rowCount={rowCount}
			state={{
				columnFilters,
				globalFilter,
				isLoading,
				pagination,
				showAlertBanner: isError,
				showProgressBars: isLoading,
				sorting,
				rowSelection,
			}}
			muiTableBodyRowProps={({ row }) => ({
				onClick: () => onRowClick(row),
				sx: {
					cursor: 'pointer',
					'& .MuiTableCell-root.MuiTableCell-body.MuiTableCell-sizeMedium.css-e3lgss-MuiTableCell-root':
						{
							lineHeight: '2.43',
						},
					'&:hover .show-on-hover': {
						display: 'block',
					},
				},
			})}
			muiToolbarAlertBannerProps={
				isError
					? {
							color: 'error',
							children: 'Error loading data',
					  }
					: undefined
			}
			muiTableBodyProps={
				collapsed
					? {
							sx: {
								'& tr td:first-of-type': { width: '2%' },
								'& .css-nx5x10-MuiTableRow-root ': {
									// '&:hover':{backgroundColor:'red'},
								},
								'& tr td:nth-of-type(2)': {
									paddingLeft: 0,
									paddingTop: '10px',
									paddingBottom: '10px',
								},
							},
					  }
					: undefined
			}
			muiTopToolbarProps={
				collapsed
					? {
							sx: { display: 'none' },
					  }
					: undefined
			}
		/>
	);
};

export default DataTable;
