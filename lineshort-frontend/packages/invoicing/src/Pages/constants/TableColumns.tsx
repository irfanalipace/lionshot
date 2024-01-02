import {
	AmountCell,
	CustomerCard,
	DateCell,
	InvoiceNumberCell,
	RTICustomerCard,
} from '@/Components/DataTable';
import { EstimateStatusColor, snakeCaseToPrettyText } from '@/utils/helper';
import { Box } from '@mui/system';

export const rtiCollapsedColumns = [
	{
		accessorKey: 'customer.display_name',
		header: 'Company Name',
		Cell: ({ row }: any) => <RTICustomerCard data={row.original} />,
	},
];

export const minnesotaCollapsedColumns = [
	{
		accessorKey: 'customer.display_name',
		header: 'Company Name',
		Cell: ({ row }: any) => <CustomerCard data={row.original} />,
	},
];

export const rtiColumns = [
	{
		accessorKey: 'invoice_date',
		header: 'Date',
		Cell: ({ renderedCellValue }) => <DateCell>{renderedCellValue}</DateCell>,
	},
	{
		accessorKey: 'invoice_number',
		header: 'Invoices',
		Cell: ({ renderedCellValue }) => (
			<InvoiceNumberCell>{renderedCellValue}</InvoiceNumberCell>
		),
	},
	{
		accessorKey: 'bol_number',
		header: 'Bol No',
	},

	{
		accessorKey: 'company_name',
		header: 'Company Name',
	},
	{
		accessorKey: 'company_address',
		header: 'Company Address',
	},
	{
		accessorKey: 'status',
		header: 'Invoice Status',
		Cell: ({ cell }) => {
			const status = cell.getValue();
			const estStatusColor = EstimateStatusColor(status);

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
		accessorKey: 'invoice_items',
		header: 'Invoices Amount',
		Cell: ({ renderedCellValue }) => {
			return <AmountCell>{renderedCellValue?.[0]?.rate}</AmountCell>;
		},
	},

	{
		accessorKey: 'company_phone',
		header: 'Phone',
	},

	{
		accessorKey: 'sold_to',
		header: 'Sold To',
	},

	{
		accessorKey: 'sub_total',
		header: 'Sub Total',
		Cell: ({ renderedCellValue }) => (
			<AmountCell>{renderedCellValue}</AmountCell>
		),
	},

	{
		accessorKey: 'discount',
		header: 'Discount',
		Cell: ({ renderedCellValue, row }) => (
			<AmountCell>{renderedCellValue}</AmountCell>
		),
	},

	{
		accessorKey: 'total',
		header: 'Total',
		Cell: ({ renderedCellValue }) => (
			<AmountCell>{renderedCellValue}</AmountCell>
		),
	},

	//end
];

export const minnesotaColumns = [
	{
		accessorKey: 'invoice_date',
		header: 'Date',
		Cell: ({ renderedCellValue }) => <DateCell>{renderedCellValue}</DateCell>,
	},
	{
		accessorKey: 'invoice_number',
		header: 'Invoices',
		Cell: ({ renderedCellValue }) => (
			<InvoiceNumberCell>{renderedCellValue}</InvoiceNumberCell>
		),
	},
	//column definitions...
	{
		accessorKey: 'order_number',
		header: 'Order Number',
	},
	{
		accessorKey: 'customer.display_name',
		header: 'Customer Name',
	},
	{
		accessorKey: 'status',
		header: 'Invoice Status',
		Cell: ({ cell }) => {
			const status = cell.getValue();
			const estStatusColor = EstimateStatusColor(status);

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
		accessorKey: 'due_date',
		header: 'Due Date',
		Cell: ({ renderedCellValue }) => <DateCell>{renderedCellValue}</DateCell>,
	},
	{
		accessorKey: 'total',
		header: 'Invoices Amount',
		Cell: ({ renderedCellValue }) => (
			<AmountCell>{renderedCellValue}</AmountCell>
		),
	},

	{
		accessorKey: 'adjustment',
		header: 'Adjustment',
		Cell: ({ renderedCellValue }) => (
			<AmountCell>{renderedCellValue}</AmountCell>
		),
	},

	{
		accessorKey: 'customer.email',
		header: 'Email',
	},

	{
		accessorKey: 'customer.phone',
		header: 'Phone',
	},

	{
		accessorKey: 'sales_person.name',
		header: 'Sales Person',
	},
	{
		accessorKey: 'shipping_charges',
		header: 'Shiping Charges',
		Cell: ({ renderedCellValue }) => (
			<AmountCell>{renderedCellValue}</AmountCell>
		),
	},
	{
		accessorKey: 'sub_total',
		header: 'Sub Total',
		Cell: ({ renderedCellValue }) => (
			<AmountCell>{renderedCellValue}</AmountCell>
		),
	},
];
