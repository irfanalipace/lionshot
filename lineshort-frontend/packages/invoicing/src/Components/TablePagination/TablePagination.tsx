import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Pagination from '@mui/material/TablePagination';

interface TablePaginationProps {
	paginationApi: any;
	setData: Dispatch<SetStateAction<any[]>>;
}

interface PaginationParams {
	page: number;
	per_page: number;
}

interface PaginationResponse {
	data: {
		current_page: number;
		total: number;
		data: any[];
	};
}

function TablePagination({ paginationApi, setData }: TablePaginationProps) {
	const [paginationProperties, setPaginationProperties] = useState<any>({
		page: 0,
		per_page: 10,
	});

	const [count, setCount] = useState<number>(0);

	useEffect(() => {
		handleChangePage(
			null,
			paginationProperties.page,
			paginationProperties.per_page
		);
	}, [paginationProperties.per_page]);

	const handleChangePage = async (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number,
		per_page = paginationProperties.per_page
	) => {
		let response = await paginationApi({
			...paginationProperties,
			page: newPage + 1,
			per_page,
		});
		setPaginationProperties({
			...paginationProperties,
			page: response.data.current_page - 1,
		});
		setCount(response.data.total); // Set the count from the response
		setData(response.data.data);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setPaginationProperties({
			...paginationProperties,
			per_page: parseInt(event.target.value, 10),
		});
	};

	return (
		<Pagination
			component='div'
			count={count}
			page={paginationProperties.page}
			onPageChange={handleChangePage}
			rowsPerPage={paginationProperties.per_page}
			onRowsPerPageChange={handleChangeRowsPerPage}
		/>
	);
}

export default TablePagination;
