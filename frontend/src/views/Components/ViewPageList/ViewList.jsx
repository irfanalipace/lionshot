import React, { useEffect, useState } from 'react';
import TablePagination from '../TablePagination/TablePagination';
import { Box } from '@mui/system';
import useSelectAll from '../../../core/hooks/useSelectAll';
import { Checkbox, CircularProgress, Typography } from '@mui/material';

function ViewList({ api, onSelect, rowJSX }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { selectedRows, handleSelectAll, handleRowSelect, isRowSelected } =
    useSelectAll(data);

  useEffect(() => {
    onSelect(selectedRows);
  }, [selectedRows]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Checkbox
          color='primary'
          checked={selectedRows.length === data.length}
          indeterminate={
            selectedRows.length > 0 && selectedRows.length < data.length
          }
          onChange={handleSelectAll}
        />
        <Typography>Select All</Typography>
      </Box>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {data?.map((d, rowIndex) => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
              key={rowIndex}
            >
              <Checkbox
                color='primary'
                checked={isRowSelected(d.id)}
                onChange={() => handleRowSelect(d.id)}
              />
              {rowJSX(d)}
            </Box>
          ))}
        </>
      )}
      <TablePagination
        paginationApi={api}
        setData={setData}
        setLoading={setIsLoading}
      />
    </Box>
  );
}

export default ViewList;
