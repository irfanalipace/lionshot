import { useEffect, useState } from 'react';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';
import {
  getAllCustomers,
  bulkDeleteCustomer,
  exportCustomers,
  importCustomers,
  deleteCustomer
} from '../../../core/api/customer';
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
// import CustomerListViewDetails from './CustomerListViewDetails';
const CustomerListViewDetails = lazy(() => import('./CustomerListViewDetails'));
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';
// import './Customer.css';
import {
  StyledListbox,
  TriggerButton,
  HeaderMenuButton,
  StyledMenuItem,
  headerMenuBox
} from './CustomerStylesConst';
import DataTableContainer from '../../Components/Containers/DataTableContainer';
import DetailViewContainer from '../../Components/Containers/DetailViewContainer';
import ImportFileModal from '../../Components/ImportFileModal/ImportFileModal';
import ExportFileModal from '../../Components/ExportFileModal/ExportFileModal';
import TableGrid from '../../Components/Containers/TableGrid';
const CustomerTable = () => {
  // console.log('reRender', reRender);
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [openImport, setOpenImport] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [viewCustomer, setViewCustomer] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [id, setId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const handleSendMail = id => {
    navigate(`/send-email/customer/${generateEncryptedID(id)}`);
  };

  const initialColumns = [
    {
      accessorKey: 'display_name',
      header: 'Display Name',
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
      accessorKey: 'phone',
      header: 'Phone',
      Cell: ({ row }) => (
        <Typography variant='body2'>
          {row.original.phone || row.original.work_phone}
        </Typography>
      )
    },
    {
      accessorKey: 'receivable',
      header: 'Receivable'
    },
    {
      accessorKey: 'unused_credits',
      header: 'Unused Credits'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 20, //medium column
      Cell: ({ cell }) => (
        <Box
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
        </Box>
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
      Cell: ({ row }) => <CustomerCard data={row.original} />
    }
  ];
  const hash = window.location.hash;

  useEffect(() => {
    const id = extractNumberFromHash(hash);
    const decryptedId = decryptId(id);
    setId(decryptedId);
    if (decryptedId) {
      setViewCustomer(true);
    } else {
      setViewCustomer(false);
    }
  }, [hash]);

  // console.log('refResh: ', refresh);
  const handleEditModal = (e, row) => {
    e.stopPropagation();
    navigate(`/customer/edit/${generateEncryptedID(row)}`);
  };

  // const handleDeleteModal = params => {
  // 	console.log('id: ' + params.id);
  // };

  const handleRowClick = row => {
    // setHash('#/' + row?.id);
    location.hash = '#/' + generateEncryptedID(row?.id);
  };
  const handleBulkDelete = async () => {
    try {
      await bulkDeleteCustomer({ ids: selectedRows });
      setRefresh(prev => prev + 1);
    } catch (err) {
      console.log('err', err);
    }
  };
  const CustomerCard = ({ data }) => (
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
      await deleteCustomer(id);
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
              <MailOutline /> Email Customer
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
      key: 'customers_import',
      label: 'Customer Complete Detail',
      filePath: '/files/sample_contacts_new'
    },
    {
      key: 'customers_contacts_persons_import',
      label: 'Customer' + 's Contact Persons',
      filePath: '/files/sample_contactpersons'
    }
  ];
  const ExportTypeEnum = [
    {
      key: 'customers_export',
      label: 'Customers Complete Detail'
    },
    {
      key: 'customers_contacts_persons_export',
      label: 'Customer' + 's Contact Persons'
    },
    {
      key: 'customers_addresses_export',
      label: 'Customer' + 's Addresses'
    }
  ];

  const headerIconButton = {
    backgroundColor: 'WHITE',
    border: '1px solid #1976d2',
    fontSize: '12px',
    borderRadius: '3px',
    textTransform: 'none',
    padding: '4px'
  };

  return (
    <>
      <Grid container>
        <TableGrid sm={viewCustomer ? 3.2 : 12}>
          <HeaderPaper>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ display: 'flex', alignItems: 'center', paddingY: '1px' }}>
              <Grid item xs={8}>
                {selectedRows.length > 0 ? (
                  <Box sx={headerMenuBox}>
                    {/* <IconButton sx={headerIconButton}>
											<Mail sx={{ fontSize: '18px' }} />
										</IconButton>
										<IconButton sx={headerIconButton}>
											<Print sx={{ fontSize: '18px' }} />
										</IconButton> */}
                    <Button
                      sx={headerIconButton}
                      onClick={() => {
                        setOpenConfirmDialog(true);
                        setDialogProps({
                          onConfirm: handleBulkDelete
                        });
                      }}>
                      <Delete /> {''}Delete
                    </Button>
                    {/* <Button
											sx={headerIconButton}
											style={{
												color: 'black',
												margin: '0 10px',
												fontSize: '12px'
											}}
											>
											Bulk Update
										</Button> */}
                    {/* <Dropdown>
											<HeaderMenuButton onClick={e => e.stopPropagation()}>
												<MoreHoriz sx={{ fontSize: '18px' }} />
											</HeaderMenuButton>
											<Menu slots={{ listbox: StyledListbox }}>
												<StyledMenuItem> Enable Portal</StyledMenuItem>
												<StyledMenuItem> Merge</StyledMenuItem>
												<StyledMenuItem> Accociate Templates</StyledMenuItem>
												<StyledMenuItem> Mark as Inactive</StyledMenuItem>
											</Menu>
										</Dropdown> */}
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
                        Active Customers
                        {/* <ArrowDropDown sx={{ margin: '0 -5px -5px 0' }} /> */}
                      </Typography>
                    </MenuButton>
                    {/* <Menu slots={{ listbox: StyledListbox }}>
											<StyledMenuItem> Active Customers</StyledMenuItem>
											<StyledMenuItem> CRM Customers</StyledMenuItem>
											<StyledMenuItem> Duplicate Customers</StyledMenuItem>
											<StyledMenuItem> Inactive Customers</StyledMenuItem>
											<StyledMenuItem> Customer Portal Enabled</StyledMenuItem>
											<StyledMenuItem> Customer Portal Disabled</StyledMenuItem>
											<StyledMenuItem> Overdue Customers</StyledMenuItem>
											<StyledMenuItem> Unpaid Customers</StyledMenuItem>
											<StyledMenuItem>
												Associate with Payment Options
											</StyledMenuItem>
											<StyledMenuItem
												sx={{ color: window.themeColors.primary }}
												onClick={e => {
													e.stopPropagation();
													navigate('/customer/new');
												}}
											>
												<Add />
												New Customer View
											</StyledMenuItem>
										</Menu> */}
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
                      onClick={() => navigate('/customer/new')}
                      variant='contained'
                      sx={{ minWidth: '0', padding: '5px 7px' }}>
                      <Add fontSize='small' />
                      {!viewCustomer && 'New'}
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
                            <SaveAlt /> Import Customers
                          </StyledMenuItem>
                          <StyledMenuItem onClick={() => setOpenExport(true)}>
                            <UploadFile /> Export Customers
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
              api={getAllCustomers}
              columns={viewCustomer ? collapsedColumns : initialColumns}
              setSelectedRows={setSelectedRows}
              onRowClick={handleRowClick}
              collapsed={viewCustomer}
              refresh={refresh}
              manualFilter
            />
          </DataTableContainer>
        </TableGrid>
        {viewCustomer && (
          <Grid item sm={8.8}>
            <DetailViewContainer>
              <CustomerListViewDetails id={id} setRefresh={setRefresh} />
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
        importApi={importCustomers}
        setRefresh={setRefresh}
      />
      <ExportFileModal
        isOpen={openExport}
        onClose={() => setOpenExport(false)}
        exportApi={exportCustomers}
        ExportTypeEnum={ExportTypeEnum}
      />
    </>
  );
};

export default CustomerTable;
