import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/TablePagination';

function TablePagination({ paginationApi, setData  , setLoading}) {
  const [paginationProperties, setPaginationProperties] = useState({
    page: 0,
    per_page: 10
  });

  useEffect(() => {
    handleChangePage(
      null,
      paginationProperties?.page,
      paginationProperties?.per_page
    );
  }, [paginationProperties?.per_page]);

  const handleChangePage = async (
    event,
    newPage,
    per_page = paginationProperties?.per_page
  ) => {
    setLoading(true)  // list loader 
    let response = await paginationApi({
      ...paginationProperties,
      page: newPage + 1,
      per_page
    });
    setPaginationProperties({
      ...paginationProperties,
      page: response?.data?.current_page - 1,
      count: response?.data?.total
    });
    setLoading(false)
    setData(response?.data?.data);
  };

  const handleChangeRowsPerPage = async event => {
    setPaginationProperties({
      ...paginationProperties,
      per_page: parseInt(event.target.value, 10)
    });
  };

  return (
    <Pagination
      component='div'
      count={paginationProperties?.count || 1}
      page={paginationProperties?.page || 0}
      onPageChange={handleChangePage}
      rowsPerPage={paginationProperties?.per_page || 0}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
}

export default TablePagination;
