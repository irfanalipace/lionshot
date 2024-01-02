import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const DataTableSkeleton = () => {
	const items = Array.from({ length: 10 }, (_, index) => index + 1);

	return (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>
							<Skeleton />
						</TableCell>
						<TableCell>
							<Skeleton />
						</TableCell>
						<TableCell>
							<Skeleton />
						</TableCell>
						<TableCell>
							<Skeleton />
						</TableCell>
						<TableCell>
							<Skeleton />
						</TableCell>
						<TableCell>
							<Skeleton />
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{items.map(item => (
						<TableRow key={item}>
							<TableCell>
								<Skeleton />
							</TableCell>
							<TableCell>
								<Skeleton />
							</TableCell>
							<TableCell>
								<Skeleton />
							</TableCell>
							<TableCell>
								<Skeleton />
							</TableCell>
							<TableCell>
								<Skeleton />
							</TableCell>
							<TableCell>
								<Skeleton />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default DataTableSkeleton;
