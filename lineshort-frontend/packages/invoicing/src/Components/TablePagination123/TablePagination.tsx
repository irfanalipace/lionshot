import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/TablePagination';

interface PaginationResponse {
  data: {
    current_page: number;
    total: number;
    data: any[]; // Adjust the type based on your actual data structure
  };
}

interface PaginationApiFunction {
  (paginationProperties: {
    page: number;
    per_page: number;
  }): Promise<PaginationResponse>;
}

interface TablePaginationProps {
  paginationApi: PaginationApiFunction;
  setData: (data: any[]) => void; // Adjust the type based on your actual data structure
}

function TablePagination({ paginationApi, setData }: TablePaginationProps) {
  const [paginationProperties, setPaginationProperties] = useState({
    page: 0,
    per_page: 10,
    count: 0, // Add count to initial state
  });

  useEffect(() => {
    handleChangePage(null, paginationProperties.page, paginationProperties.per_page);
  }, [paginationProperties.per_page]);

  const handleChangePage = async (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
    per_page = paginationProperties.per_page
  ) => {
    const response = await paginationApi({
      ...paginationProperties,
      page: newPage + 1,
      per_page,
    });
    setPaginationProperties(prevPaginationProperties => ({
      ...prevPaginationProperties,
      page: response?.data?.current_page - 1,
      count: response?.data?.total, // Update count based on API response
    }));
    setData(response?.data?.data);
  };

  const handleChangeRowsPerPage = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPaginationProperties({
      ...paginationProperties,
      per_page: parseInt(event.target.value, 10),
      page: 0, // Reset page when changing rows per page
    });
  };

  return (
    <Pagination
      component='div'
      count={paginationProperties.count || 1}
      page={paginationProperties.page || 0}
      onPageChange={handleChangePage}
      rowsPerPage={paginationProperties.per_page || 0}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
}

export default TablePagination;
