import React, { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell, {
	TableCellProps as MuiTableCellProps,
} from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableRow, {
	TableRowProps as MuiTableRowProps,
} from '@mui/material/TableRow';
import MuiTableHead from '@mui/material/TableHead';
import { Typography } from '@mui/material';

interface TableProps {
	children: ReactNode;
}

interface TableBodyProps {
	children: ReactNode;
}

interface TableCellProps extends MuiTableCellProps {
	children: ReactNode;
}

interface TableHeadCellProps extends MuiTableCellProps {
	children: ReactNode;
}

interface TableBodyCellProps extends MuiTableCellProps {
	children: ReactNode;
}

interface TableHeadProps {
	children: ReactNode;
}

interface TableContainerProps {
	children: ReactNode;
}

interface TableRowProps extends MuiTableRowProps {
	children: ReactNode;
}

function Table({ children, ...props }: TableProps) {
	return <MuiTable {...props}>{children}</MuiTable>;
}

function TableBody({ children, ...props }: TableBodyProps) {
	return <MuiTableBody {...props}>{children}</MuiTableBody>;
}

function TableHeadCell({ children, ...props }: TableHeadCellProps) {
	return (
		<MuiTableCell {...props}>
			<Typography variant='subtitle2'>{children}</Typography>
		</MuiTableCell>
	);
}

function TableBodyCell({ children, ...props }: TableBodyCellProps) {
	return (
		<MuiTableCell {...props}>
			<Typography variant={'body2'}>{children}</Typography>
		</MuiTableCell>
	);
}

function TableHead({ children, ...props }: TableHeadProps) {
	return <MuiTableHead {...props}>{children}</MuiTableHead>;
}

function TableContainer({ children, ...props }: TableContainerProps) {
	return <MuiTableContainer {...props}>{children}</MuiTableContainer>;
}

function TableRow({ children, ...props }: TableRowProps) {
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
