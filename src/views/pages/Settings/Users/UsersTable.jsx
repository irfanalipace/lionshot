import { useEffect, useState } from 'react';
import { getAllUsers } from '../../../../core/api/users';
import { Box, Button, Grid, Typography } from '@mui/material';
import DataTable from '../../../Components/DataTable/DataTable';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import DataTableContainer from '../../../Components/Containers/DataTableContainer';
import TableGrid from '../../../Components/Containers/TableGrid';
import { formatDate } from '../../../../core/utils/helpers';
import Modal from '../../../Components/Modal/Dialog';
import FormField from '../../../Components/InputField/FormField';
import { UpdateUser } from '../../../../core/api/users';
import notyf from '../../../Components/NotificationMessage/notyfInstance';

const UsersTable = () => {
  const [, setSelectedRows] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [openVerifyModal, setOpenVerifyModal] = useState();
  const [selectedValue, setSelectedValue] = useState('yes');
  const [rowId, setRowId] = useState();
  const handleSelectChange = event => {
    setSelectedValue(event.target.value);
  };
  const initialColumns = [
    {
      accessorKey: 'first_name',
      header: 'First Name'
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name'
    },
    {
      accessorKey: 'company.name',
      header: 'Company Name'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'email_verified_at',
      header: 'Date',
      Cell: ({ row }) => (
        <Typography variant='body2'>
          {formatDate(row?.original?.email_verified_at)}
        </Typography>
      )
    }
  ];

  const handleRowClick = row => {
    setOpenVerifyModal(true);
    setRowId(row?.id);
  };
  const handleSaveClick = async () => {
    const res = await UpdateUser(rowId);
    if (res) {
      setOpenVerifyModal(false);
      notyf.success('User Verified Successfully');
      setRefresh(prev => prev + 1);
    }
  };
  const VerifyOptions = [
    {
      value: 'yes',
      text: 'Yes'
    }
  ];
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
                <Typography variant='h6'>Users</Typography>
              </Grid>
            </Grid>
          </HeaderPaper>
          <DataTableContainer>
            <DataTable
              api={getAllUsers}
              columns={initialColumns}
              setSelectedRows={setSelectedRows}
              onRowClick={handleRowClick}
              refresh={refresh}
              enableRowSelection={false}
            />
          </DataTableContainer>
        </TableGrid>
      </Grid>
      {openVerifyModal && (
        <Modal
          title={'Confirmation'}
          open={openVerifyModal}
          onClose={() => setOpenVerifyModal(false)}
          sx={{
            position: 'absolute',
            right: 20,
            top: 18
          }}>
          <Box padding={3}>
            <Typography variant='body2'>
              Do you want to verify this user?
            </Typography>
            <FormField
              id='verify'
              // sx={{ width: "42%"}}
              fullWidth
              // label={'Salutation'}
              type={'select'}
              required
              value={selectedValue || ''}
              onChange={handleSelectChange}
              options={VerifyOptions}
            />
            <Button
              variant='contained'
              sx={{ paddingX: '30px', marginTop: '20px' }}
              onClick={() => handleSaveClick()}>
              Save
            </Button>
            <Button
              variant='outlined'
              sx={{ marginLeft: '10px', marginTop: '20px' }}
              onClick={() => setOpenVerifyModal(false)}>
              Cancel
            </Button>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default UsersTable;
