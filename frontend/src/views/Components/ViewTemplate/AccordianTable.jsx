import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';
import {
	TableBody,
	TableBodyCell,
	TableHead,
	TableHeadCell,
	TableRow,
} from '../Table/Table';
import {
	StatusColor,
	formatDate,
	snakeCaseToPrettyText,
} from '../../../core/utils/helpers';
import useTheme from '@mui/material/styles/useTheme';

const AccordianTable = ({ data, columns }) => {
	const theme = useTheme();

	return (
		<Table sx={{ minWidth: 650 }} aria-label='simple table'>
			<TableHead>
				<TableRow sx={{ backgroundColor: '#f0f0f0' }}>
					{columns?.map((column, index) => (
						<TableHeadCell key={index} sx={{ padding: '6px 16px' }}>
							<Typography variant='templateBody2'>{column?.label}</Typography>
						</TableHeadCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{data && data !== null ? (
					<>
						{[].concat(data).map((row, index) => (
							<TableRow key={index}>
								{columns?.map(column => (
									<TableBodyCell
										key={row[column?.id]}
										style={{ color: StatusColor(row[column?.key], theme) }}
									>
										{column?.value
											? column?.value
											: column?.key === 'index'
											? index + 1
											: column?.key === 'rate' ||
											  column?.key === 'total' ||
											  column?.key === 'payment_made' ||
											  column?.key === 'amount_received'
											? '$' + row[column?.key]
											: column?.key === 'status' ||
											  column?.key === 'payment_mode'
											? snakeCaseToPrettyText(row[column?.key])
											: column?.key === 'payment_date' ||
											  column?.key === 'estimate_date' ||
											  column?.key === 'sale_order_date'
											? formatDate(row[column?.key])
											: row[column?.key] ?? '-'}
									</TableBodyCell>
								))}
							</TableRow>
						))}
					</>
				) : (
					<TableRow>
						<TableBodyCell align='center' colSpan={10}>
							No Data Found
						</TableBodyCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

export default AccordianTable;
