import React, { useState, useEffect } from 'react';
import {
	Table,
	TableBody,
	TableBodyCell,
	TableContainer,
	TableHead,
	TableRow,
	TableHeadCell,
} from '../../Components/Table/Table';
import {
	Button,
	ButtonGroup,
	Checkbox,
	Typography,
	Paper,
} from '@mui/material';
import useSelectAll from '../../hooks/useSelectAll';
import TablePagination from '../TablePagination/TablePagination';
import { Visibility } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiButton from '../../Components/Button/MUIButton';
import CircularProgress from '@mui/material/CircularProgress';
import { LoadingButton } from '@mui/lab';
import { getAllInvoicesListApi } from '../../apis/invoice';

interface EstimateListProps {
	selectable: boolean;
	data: any[]; // Define the data type here
	setData: React.Dispatch<React.SetStateAction<any[]>>;
	loading: boolean;
	handleRowClick: (id: string, column: string, e: React.MouseEvent) => void;
	handleInvoiceEdit: (e: React.MouseEvent, row: any) => void;
	handleDrawer: (e: React.MouseEvent, row: any) => void;
	onSelectedRowsChange: (
		selectedRows: (number | string)[],
		isRowSelected: (id: number) => boolean
	) => void;
	handleDeleteSingle: (id: number) => void;
	setSelected: React.Dispatch<React.SetStateAction<number[]>>;
	checkedState: boolean;
	setCheckedState: React.Dispatch<React.SetStateAction<boolean>>;
	clickable: boolean;
	onRowClick: (id: number) => void;

	// selectRows: number[];
	// actions: any; // Define the actions type here
}

const EstimateList: React.FC<EstimateListProps> = ({
	selectable,
	data,
	setData,
	loading,
	handleRowClick,
	handleInvoiceEdit,
	handleDrawer,
	onSelectedRowsChange,
	handleDeleteSingle,
	setSelected,
	checkedState,
	setCheckedState,
	clickable,
	onRowClick,

	// selectRows,
	// actions,
}) => {
	const { selectedRows, handleSelectAll, handleRowSelect, isRowSelected } =
		useSelectAll(data.map((row) => row.id));

	const headers = [
		'Date',
		'Estimate Number',
		'Reference# ',
		'Customer Name',
		'Estimate Status',
		'Total',
		'Action',
	];

	useEffect(() => {
		try {
			const fetch = async () => {
				const params = {};
				const resp = await getAllInvoicesListApi(params);
				console.log('resp ', resp);
				//  setCheckedState(true);
				// setEstimateListData(
				//   estimateListData.filter(list => list.id !== deleteIds[0])
				// );
			};
			fetch();
		} catch (error) {
			console.log('error', error);
			//   notyf.error(error?.data?.message);
		}
	}, []);

	useEffect(() => {
		onSelectedRowsChange(selectedRows, isRowSelected);
		// console.log(selectedRows)
	}, [selectedRows]);

	useEffect(() => {
		if (checkedState) {
			setSelected([]);
		}
		setCheckedState(false);
	}, [checkedState]);

	return (
		<Paper>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							{selectable && (
								<TableHeadCell>
									<Checkbox
										color='primary'
										checked={selectedRows.length === data.length}
										indeterminate={
											selectedRows.length > 0 &&
											selectedRows.length < data.length
										}
										onChange={handleSelectAll}
									/>
								</TableHeadCell>
							)}
							{headers?.map((column, index) => (
								<TableHeadCell key={index}>{column}</TableHeadCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data.length > 0 &&
							data?.map((row, rowIndex) => (
								<TableRow
									key={row?.id}
									onClick={() => clickable && onRowClick(Number(row?.id))}>
									{selectable && (
										<TableBodyCell>
											<Checkbox
												color='primary'
												checked={isRowSelected(row?.id)}
												onChange={() => handleRowSelect(row?.id)}
											/>
										</TableBodyCell>
									)}
									<TableBodyCell>
										<Typography></Typography>
										{row?.expiry_date || '--'}
									</TableBodyCell>
									<TableBodyCell>{row?.estimate_number || '--'}</TableBodyCell>
									<TableBodyCell>{row?.reference_number || '--'}</TableBodyCell>
									<TableBodyCell>
										{`${row?.customer?.first_name} ${row?.customer?.last_name} ` ||
											'--'}
									</TableBodyCell>
									<TableBodyCell> {row?.status || '--'}</TableBodyCell>
									<TableBodyCell> {row?.total || '--'}</TableBodyCell>
									<TableBodyCell>
										<ButtonGroup
											size='small'
											variant='outlined'
											aria-label='outlined primary button group'>
											<MuiButton
												size='small'
												variant='outlined'
												onClick={(e) => handleInvoiceEdit(e, row)}>
												<EditIcon fontSize='small' />
											</MuiButton>
											<MuiButton
												variant='outlined'
												size='small'
												onClick={(e) => handleDrawer(e, row)}>
												<Visibility fontSize='small' />
											</MuiButton>
											<MuiButton
												variant='outlined'
												size='small'
												onClick={() => handleDeleteSingle(Number(row.id))}>
												<DeleteIcon fontSize='small' />
											</MuiButton>
										</ButtonGroup>
									</TableBodyCell>
								</TableRow>
							))}
						{data?.length === 0 && !loading && (
							<TableRow>
								<TableBodyCell align='center' colSpan={10}>
									No Estimate Found
								</TableBodyCell>
							</TableRow>
						)}

						{data?.length === 0 && loading && (
							<TableRow>
								<TableBodyCell align='center' colSpan={10}>
									<CircularProgress />
								</TableBodyCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<TablePagination
					setData={setData}
					paginationApi={getAllInvoicesListApi}
				/>
			</TableContainer>
		</Paper>
	);
};

export default EstimateList;
