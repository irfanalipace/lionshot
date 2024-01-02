import {
	AmountCell,
	CustomerCard,
	DateCell,
	InvoiceNumberCell,
} from '../../Components/common';
import {
	StatusColor,
	snakeCaseToPrettyText,
} from '../../../core/utils/helpers';
import { Box } from '@mui/system';

import { theme } from '../../../core/theme/theme';
import { Typography } from '@mui/material';

export const minnesotaCollapsedColumns = [
	{
		accessorKey: 'customer_name',
		header: 'Company Name',
		Cell: ({ row }) => <CustomerCard data={row.original} />,
	},
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
		accessorKey: 'detail',
		header: 'Order Number',
		Cell: ({ renderedCellValue }) => {
			let jsonObject;
			try {
				jsonObject = JSON.parse(renderedCellValue);
			} catch (error) {
				console.log(error);
			}
			return <Typography>{jsonObject?.order_number}</Typography>;
		},
	},
	{
		accessorKey: 'customer_name',
		header: 'Customer Name',
	},
	{
		accessorKey: 'status',
		header: 'Invoice Status',
		Cell: ({ cell }) => {
			const status = cell.getValue();
			const estStatusColor = StatusColor(status, theme);

			return (
				<Box
					component='span'
					sx={{
						// color: estStatusColor,
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
