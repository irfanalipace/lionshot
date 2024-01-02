import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAllCustomers } from '../../../core/api/customer';
import { Box, IconButton, Tooltip, Grid } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import DataTable from '../../Components/DataTable/DataTable';
import { useNavigate } from 'react-router-dom';
import useHash from '../../../core/hooks/useHash';
import { extractNumberFromHash } from '../../../core/utils/helpers.js';
import TestListViewDetails from './TestListViewDetails';

const Test = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewCustomer, setViewCustomer] = useState(false);
  const [id, setId] = useState(null);

  const intialColumns = [
    {
      accessorKey: 'company_name',
      header: 'Company Name',
      Cell: ({ renderedCellValue, row }) => <Status>{renderedCellValue}</Status>
    },
    //column definitions...
    {
      accessorKey: 'display_name',
      header: 'Display Name'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'opening_balance',
      header: 'Opening Balance'
    },
    {
      accessorKey: 'work_phone',
      header: 'Work Phone'
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      Cell: ({ renderedCellValue, row }) => <Actions id={row?.original?.id} />
    }
    //end
  ];

  const collapsedColumns = [
    {
      accessorKey: 'company_name',
      header: 'Company Name',
      Cell: ({ renderedCellValue, row }) => <Status>{renderedCellValue}</Status>
    }
  ];
  const [columns, setColumns] = useState(intialColumns);
  // const hash = useHash();
  const [hash, setHash] = useHash();

  useEffect(() => {
    const id = extractNumberFromHash(hash);
    setId(id);
    if (id) {
      setColumns(collapsedColumns);
      setViewCustomer(true);
    } else {
      setColumns(intialColumns);
      setViewCustomer(false);
    }
  }, [hash]);

  const handleEditModal = (e, row) => {
    e.stopPropagation();
    // console.log('row: ' + row);
  };

  const handleDeleteModal = (e, row) => {
    // console.log('row: ' + row);
    e.stopPropagation();
  };

  const handleRowClick = row => {
    // console.log('row: ', row);
    setHash('#/' + row?.id);
  };

  const Status = ({ children }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        color: 'white',
        backgroundColor: 'red',
        padding: '5px'
      }}
    >
      <span>{children}</span>
    </Box>
  );

  const extraParams = {
    name: 'test'
  };
  const Actions = ({ id }) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement='left' title='Edit'>
          <IconButton onClick={e => handleEditModal(e, id)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement='right' title='Delete'>
          <IconButton color='error' onClick={e => handleDeleteModal(e, id)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };
  return (
    <Grid container>
      <Grid item sm={viewCustomer ? 4 : 12}>
        <DataTable
          api={getAllCustomers}
          columns={columns}
          setSelectedRows={setSelectedRows}
          onRowClick={handleRowClick}
          extraParams={extraParams}
          collapsed={viewCustomer}
        />
      </Grid>
      {viewCustomer && (
        <Grid item sm={8}>
          <TestListViewDetails id={id} />
        </Grid>
      )}
    </Grid>
  );
};

export default Test;
