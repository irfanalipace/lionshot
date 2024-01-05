import React from 'react';
import { styled } from '@mui/material/styles';

import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableRow from '@mui/material/TableRow';
import MuiTableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';

function Table({ children, ...props }) {
	return <MuiTable {...props}>{children}</MuiTable>;
}

function TableBody({ children, ...props }) {
	return <MuiTableBody {...props}>{children}</MuiTableBody>;
}

function TableHeadCell({ children, ...props }) {
	return (
		<MuiTableCell {...props}>
			<Typography variant='subtitle2'>{children}</Typography>
		</MuiTableCell>
	);
}
function TableBodyCell({ children, ...props }) {
	return (
		<MuiTableCell {...props}>
			<Typography variant={'body2'}>{children}</Typography>
		</MuiTableCell>
	);
}

function TableHead({ children, ...props }) {
	return <MuiTableHead {...props}>{children}</MuiTableHead>;
}

function TableContainer({ children, ...props }) {
	return <MuiTableContainer {...props}>{children}</MuiTableContainer>;
}

function TableRow({ children, ...props }) {
	const StyledTableRow = styled(MuiTableRow)(({ theme }) => ({
		'&:hover': {
			backgroundColor: theme.palette.action.hover,
		},
	}));
	return <StyledTableRow {...props}>{children}</StyledTableRow>;
}

export {
	Table,
	TableBody,
	TableHead,
	TableContainer,
	TableRow,
	TableHeadCell,
	TableBodyCell,
};
