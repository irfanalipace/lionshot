import { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import DataTable from '../../../Components/DataTable/DataTable';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import DataTableContainer from '../../../Components/Containers/DataTableContainer';
import TableGrid from '../../../Components/Containers/TableGrid';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import {
  StyledListbox,
  StyledMenuItem,
  TriggerButton
} from '../../Customer/CustomerStylesConst';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import { Delete } from '@mui/icons-material';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import { Add } from '@mui/icons-material';
import DepartmentForm from './DepartmentForm';
import {
  deleteDepartment,
  getDepartmentsApi
} from '../../../../core/api/department';
import Modal from '../../../Components/Modal/Dialog';

const DepartmentsTable = () => {
  const [, setSelectedRows] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [openVerifyModal, setOpenVerifyModal] = useState();
  const [rowId, setRowId] = useState();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [DialogTitle, setDialogTitle] = useState();

  const initialColumns = [
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'name',
      header: 'Department Name'
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      enableColumnActions: false,
      enableColumnFilter: false,
      enableColumnOrdering: false,
      enableSorting: false,
      size: 70,
      Cell: ({ row }) => <Actions id={row?.original?.id} />
    }
  ];

  const handleRowClick = () => {
    // e.stopPropagation();
  };
  const handleEditModal = (e, row) => {
    setDialogTitle('Edit');
    setOpenVerifyModal(true);
    setRowId(row);
  };
  // Delete API
  const handleDelete = async id => {
    try {
      await deleteDepartment(id);
      setRefresh(prev => prev + 1);
    } catch (err) {
      console.log('err', err);
    }
  };
  const Actions = ({ id }) => {
    return (
      <Box
      // className='show-on-hover'
      // sx={{ display: 'none' }}
      >
        <Dropdown>
          <TriggerButton onClick={e => e.stopPropagation()}>
            <KeyboardArrowDown />
          </TriggerButton>
          <Menu slots={{ listbox: StyledListbox }}>
            <StyledMenuItem onClick={e => handleEditModal(e, id)}>
              <Edit /> Edit
            </StyledMenuItem>

            <StyledMenuItem
              onClick={e => {
                e.stopPropagation();
                setOpenConfirmDialog(true);
                setDialogProps({
                  onConfirm: () => handleDelete(id)
                });
              }}>
              <Delete /> Delete
            </StyledMenuItem>
          </Menu>
        </Dropdown>
      </Box>
    );
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
                <Typography variant='h6'>Departments</Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Button
                  size='medium'
                  onClick={() => {
                    setDialogTitle('New');
                    setOpenVerifyModal(true);
                  }}
                  variant='contained'
                  sx={{ minWidth: '0', padding: '5px 7px' }}>
                  <Add fontSize='small' />
                  New
                </Button>
              </Grid>
            </Grid>
          </HeaderPaper>
          <DataTableContainer>
            <DataTable
              api={getDepartmentsApi}
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
          title={DialogTitle + 'Department'}
          open={openVerifyModal}
          onClose={() => setOpenVerifyModal(false)}
          sx={{
            position: 'absolute',
            right: 20,
            top: 18
          }}>
          <DepartmentForm
            setOpenVerifyModal={setOpenVerifyModal}
            rowId={rowId}
            setRefresh={setRefresh}
            DialogTitle={DialogTitle}
          />
        </Modal>
      )}
      <ConfirmDialog
        title='Are you sure you want to delete'
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        {...dialogProps}
      />
    </>
  );
};

export default DepartmentsTable;
