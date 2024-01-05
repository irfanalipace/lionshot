import { useEffect, useState } from 'react';
import { getAllCompanies } from '../../../../core/api/companies';
import { Grid, Typography } from '@mui/material';
import DataTable from '../../../Components/DataTable/DataTable';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import DataTableContainer from '../../../Components/Containers/DataTableContainer';
import TableGrid from '../../../Components/Containers/TableGrid';
import { Link } from 'react-router-dom';

const CompaniesTable = () => {
  const [, setSelectedRows] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const initialColumns = [
    {
      accessorKey: 'name',
      header: 'Company Name'
    },
    {
      accessorKey: 'phone_number',
      header: 'Phone Number'
    },
    {
      accessorKey: 'code',
      header: 'Company Code',
      Cell: ({ row }) => (
        <Typography variant='body2' color='primary'>
          {row?.original?.code}
        </Typography>
      )
    },
    {
      accessorKey: 'logo',
      header: 'Logo',
      Cell: ({ row }) => (
        <Link
          variant='body2'
          color='primary'
          to={row?.original?.logo || ''}
          target='_blank'>
          {row?.original?.logo && (
            <img src={row?.original?.logo} alt='company logo' width={'20%'} />
          )}
        </Link>
      )
    }
  ];

  const handleRowClick = () => {
    // console.log('row id = ', row?.id);
  };

  return (
    <>
      <Grid container>
        <TableGrid sm={12}>
          <HeaderPaper>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={8}>
                <Typography variant='h6'>Companies</Typography>
              </Grid>
            </Grid>
          </HeaderPaper>
          <DataTableContainer>
            <DataTable
              api={getAllCompanies}
              columns={initialColumns}
              setSelectedRows={setSelectedRows}
              onRowClick={handleRowClick}
              refresh={refresh}
              enableRowSelection={false}
            />
          </DataTableContainer>
        </TableGrid>
      </Grid>
    </>
  );
};

export default CompaniesTable;
