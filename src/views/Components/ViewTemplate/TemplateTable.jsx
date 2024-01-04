import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';

import {
	TableBody,
	TableBodyCell,
	TableHead,
	TableHeadCell,
	TableRow,
} from '../Table/Table';
import { formatDate } from '../../../core/utils/helpers';

const TemplateTable = ({ data, itemsColumns }) => {
	const checkIsAmount = key =>
		key?.includes('rate') || key?.includes('amount') || key?.includes('total');
	const checkIsDate = key => key?.includes('date');

	const parseColumnValue = (column, row, index) => {
		if (row) {
			if (column?.value) return column?.value;
			if (column?.key === 'index') return index + 1;
			if (checkIsAmount(column?.key))
				return '$' + parseFloat(row[column?.key])?.toFixed(2);
			if (checkIsDate(column?.key)) return formatDate(row[column?.key]);
			return row[column?.key] ?? '-';
		}
	};

	return (
		<Table sx={{ minWidth: 650 }} aria-label='simple table'>
			<TableHead>
				<TableRow sx={{ backgroundColor: '#f0f0f0' }}>
					{itemsColumns.map((column, index) => (
						<TableHeadCell key={index} sx={{ padding: '4px 16px' }}>
							<Typography variant='templateBody2'>{column?.label}</Typography>
						</TableHeadCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{data?.length > 0 ? (
					<>
						{data.map((row, index) => (
							<TableRow key={index}>
								{itemsColumns.map(column => (
									<TableBodyCell key={column?.key}>
										{parseColumnValue(column, row, index)}
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

export default TemplateTable;
