import { Grid, Box, IconButton, Stack, Typography } from '@mui/material';
import {
	StatusColor,
	formatDate,
	snakeCaseToPrettyText,
} from '../../../core/utils/helpers';
import { Mail } from '@mui/icons-material';
import { useTheme } from '@mui/system';
import { AmountCell } from '../../Components/common';

const BillNumber = ({ children }) => {
	const theme = useTheme();

	return (
		<Stack direction='row'>
			<span style={{ color: theme.palette.primary.main }}>{children}</span>
		</Stack>
	);
};

export const initialColumns = [
	{
		accessorKey: 'bill_date',
		header: 'Date ',
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
		accessorKey: 'bill_number',
		header: 'Bill#',
		Cell: ({ renderedCellValue }) => (
			<BillNumber>{renderedCellValue}</BillNumber>
		),
	},

	{
		accessorKey: 'vendor.display_name',
		header: 'Vendor Name',
	},

	{
		accessorKey: 'status',
		header: 'Status',
		Cell: ({ cell }) => {
			const theme = useTheme();
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
		accessorKey: 'due_date',
		header: 'Due Date ',
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
		accessorKey: 'total',
		header: 'Amount',
		Cell: ({ renderedCellValue }) => (
			<AmountCell>{renderedCellValue}</AmountCell>
		),
	},
];

export const collapsedColumns = [
	{
		accessorKey: 'vendor_name', // Access customer data
		header: 'Vendor Name',
		Cell: ({ row }) => {
			const theme = useTheme();
			const data = row?.original;
			return (
				<Grid
					container
					sx={{
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					<Grid item>
						<Typography variant='subtitle2'>
							{data.vendor?.full_name || '--'}
						</Typography>
						<Typography
							component='span'
							sx={{ fontSize: '12px', color: window.themeColors.primary }}
						>
							{data?.bill_number || '--'}
						</Typography>
						<Typography component='span' sx={{ fontSize: '12px' }}>
							{' | '}
							{data?.bill_date || '--'}
						</Typography>
					</Grid>
					<Grid item sx={{ textAlign: 'right' }}>
						<Typography variant='body2'>${data.total || 0}</Typography>
						<Typography
							variant='caption'
							sx={{ color: StatusColor(data.status, theme) }}
						>
							{snakeCaseToPrettyText(data.status) || '--'}
						</Typography>
						<IconButton sx={{ paddingRight: '0' }}>
							<Mail sx={{ fontSize: '15px' }} />{' '}
						</IconButton>
					</Grid>
				</Grid>
			);
		},
	},
];
