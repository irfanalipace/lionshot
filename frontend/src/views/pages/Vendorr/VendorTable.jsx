import { useEffect, useState } from 'react';
import {
  getAllVendors,
  bulkDeleteVendor,
  exportVendors,
  importVendors,
  deleteVendor
} from '../../../core/api/vendor';
import { Box, IconButton, Grid, Typography, Button } from '@mui/material';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton } from '@mui/base/MenuButton';
import {
  Add,
  Cached,
  Close,
  Delete,
  Edit,
  KeyboardArrowDown,
  MailOutline,
  MoreHoriz,
  SaveAlt,
  UploadFile
} from '@mui/icons-material';
import DataTable from '../../Components/DataTable/DataTable';
import { useNavigate } from 'react-router-dom';
import {
  decryptId,
  extractNumberFromHash,
  generateEncryptedID
} from '../../../core/utils/helpers';
// import VendorListViewDetails from './VendorListViewDetails';
const VendorListViewDetails = lazy(() => import('./VendorListViewDetails'));
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';
import {
  StyledListbox,
  TriggerButton,
  HeaderMenuButton,
  StyledMenuItem,
  headerIconButton,
  headerMenuBox
} from './VendorStylesConst';
import DataTableContainer from '../../Components/Containers/DataTableContainer';
import DetailViewContainer from '../../Components/Containers/DetailViewContainer';
import ImportFileModal from '../../Components/ImportFileModal/ImportFileModal';
import ExportFileModal from '../../Components/ExportFileModal/ExportFileModal';
import TableGrid from '../../Components/Containers/TableGrid';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';

const VendorTable = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [openImport, setOpenImport] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [viewVendor, setViewVendor] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [id, setId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const handleSendMail = id => {
    navigate(`/send-email/vendor/${generateEncryptedID(id)}`);
  };
  const initialColumns = [
    {
      accessorKey: 'display_name',
      header: 'Name',
      Cell: ({ row }) => (
        <Typography variant='body2' color='primary'>
          {row?.original?.display_name}
        </Typography>
      )
    },
    {
      accessorKey: 'company_name',
      header: 'Company Name'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'work_phone',
      header: 'Work Phone',
      Cell: ({ row }) => (
        <Typography variant='body2'>
          {row.original.work_phone || row.original.phone}
        </Typography>
      )
    },
    {
      accessorKey: 'payable',
      header: 'Payable',
      Cell: ({ row }) => (
        <Typography variant='body2'>${row.original.payable || 0}</Typography>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 20, //medium column
      Cell: ({ cell }) => (
        <Typography
          variant='body2'
          component='span'
          sx={{
            color:
              cell.getValue() === 'active'
                ? 'green'
                : cell.getValue() === 'inactive'
                ? 'red'
                : 'Black',
            borderRadius: '0.25rem',
            textTransform: 'capitalize'
          }}>
          {cell.getValue()?.toLocaleString?.()}
        </Typography>
      )
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

  const collapsedColumns = [
    {
      accessorKey: 'display_name',
      header: 'Company Name',
      Cell: ({ row }) => <VendorCard data={row.original} />
    }
  ];

  const hash = window.location.hash;

  useEffect(() => {
    const id = extractNumberFromHash(hash);
    const decryptedId = decryptId(id);
    setId(decryptedId);
    if (decryptedId) {
      setViewVendor(true);
    } else {
      setViewVendor(false);
    }
  }, [hash]);

  // console.log('refResh: ', refresh);
  const handleEditModal = (e, row) => {
    e.stopPropagation();
    navigate(`/vendor/edit/${generateEncryptedID(row)}`);
  };

  // const handleDeleteModal = params => {
  // 	console.log('id: ' + params.id);
  // };

  const handleRowClick = row => {
    // setHash('#/' + row?.id);
    location.hash = '#/' + generateEncryptedID(row?.id);
  };
  const handleBulkDelete = async () => {
    console.log('selectedRows', selectedRows);
    try {
      await bulkDeleteVendor({ ids: selectedRows });
      setRefresh(prev => prev + 1);
    } catch (err) {
      console.log('err', err);
    }
  };
  const VendorCard = ({ data }) => (
    <>
      <Box sx={{}}>
        <Typography variant='body1bold' color='primary'>
          {data?.display_name}
        </Typography>
        <Typography variant='body2'>${data?.opening_balance || 0}</Typography>
      </Box>
    </>
  );

  const handleDelete = async id => {
    try {
      await deleteVendor(id);
      setRefresh(prev => prev + 1);
    } catch (err) {
      console.log('err', err);
    }
  };

  const Actions = ({ id }) => {
    return (
      <Box
        className='show-on-hover'
        sx={{ display: 'none' }}
        // sx={{ textAlign:'right',marginRight:'80px' }}
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
                handleSendMail(id);
              }}>
              <MailOutline /> Email Vendor
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
  const ImportTypeEnum = [
    {
      key: 'vendors_import',
      label: 'Vendor Complete Detail',
      filePath: '/files/sample_contacts_new'
    },
    {
      key: 'vendors_contacts_persons_import',
      label: 'Vendor' + 's Contact Persons',
      filePath: '/files/sample_contactpersons'
    }
  ];
  const ExportTypeEnum = [
    {
      key: 'vendors_export',
      label: 'Vendors Complete Detail'
    },
    {
      key: 'vendors_contacts_persons_export',
      label: 'Vendor' + 's Contact Persons'
    },
    {
      key: 'vendors_addresses_export',
      label: 'Vendor' + 's Addresses'
    }
  ];

  return (
    <>
      <Grid container>
        <TableGrid sm={viewVendor ? 3.2 : 12}>
          <HeaderPaper>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ display: 'flex', alignItems: 'center', paddingY: '1px' }}>
              <Grid item xs={8}>
                {selectedRows.length > 0 ? (
                  <Box sx={headerMenuBox}>
                    <Button
                      sx={headerIconButton}
                      style={{
                        color: 'black',
                        margin: '0 10px',
                        fontSize: '12px'
                      }}
                      onClick={() => {
                        setOpenConfirmDialog(true);
                        setDialogProps({
                          onConfirm: handleBulkDelete
                        });
                      }}>
                      Delete
                    </Button>
                  </Box>
                ) : (
                  <Dropdown>
                    <MenuButton
                      onClick={e => e.stopPropagation()}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none'
                      }}>
                      <Typography
                        noWrap
                        variant='h6'
                        className='TextCapitalize'>
                        All Vendors
                      </Typography>
                    </MenuButton>
                  </Dropdown>
                )}
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                {selectedRows.length > 0 ? (
                  <IconButton onClick={() => setRefresh(prev => prev + 1)}>
                    <Close />
                  </IconButton>
                ) : (
                  <Box>
                    <Button
                      size='medium'
                      onClick={() => navigate('/vendor/new')}
                      variant='contained'
                      sx={{ minWidth: '0', padding: '5px 7px' }}>
                      <Add fontSize='small' />
                      {!viewVendor && 'New'}
                    </Button>
                    <IconButton
                      component={'span'}
                      sx={{ padding: '0', marginLeft: '10px' }}>
                      <Dropdown>
                        <HeaderMenuButton
                          onClick={e => e.stopPropagation()}
                          sx={{ padding: '7px' }}>
                          <MoreHoriz fontSize='small' />
                        </HeaderMenuButton>
                        <Menu slots={{ listbox: StyledListbox }}>
                          <StyledMenuItem onClick={() => setOpenImport(true)}>
                            <SaveAlt /> Import Vendors
                          </StyledMenuItem>
                          <StyledMenuItem onClick={() => setOpenExport(true)}>
                            <UploadFile /> Export Vendors
                          </StyledMenuItem>
                          <StyledMenuItem
                            onClick={() => setRefresh(prev => prev + 1)}>
                            <Cached /> Refresh List
                          </StyledMenuItem>
                        </Menu>
                      </Dropdown>
                    </IconButton>
                  </Box>
                )}
              </Grid>
            </Grid>
          </HeaderPaper>
          <DataTableContainer>
            <DataTable
              api={getAllVendors}
              columns={viewVendor ? collapsedColumns : initialColumns}
              setSelectedRows={setSelectedRows}
              onRowClick={handleRowClick}
              collapsed={viewVendor}
              refresh={refresh}
              manualFilter
            />
          </DataTableContainer>
        </TableGrid>
        {viewVendor && (
          <Grid item sm={8.8}>
            <DetailViewContainer>
              <VendorListViewDetails id={id} setRefresh={setRefresh} />
            </DetailViewContainer>
          </Grid>
        )}
      </Grid>
      <ConfirmDialog
        title='Are you sure you want to delete'
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        {...dialogProps}
      />
      <ImportFileModal
        isOpen={openImport}
        onClose={() => setOpenImport(false)}
        ImportTypeEnum={ImportTypeEnum}
        importApi={importVendors}
        setRefresh={setRefresh}
      />
      <ExportFileModal
        isOpen={openExport}
        onClose={() => setOpenExport(false)}
        exportApi={exportVendors}
        ExportTypeEnum={ExportTypeEnum}
      />
    </>
  );
};

export default VendorTable;
