import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import styled from '@mui/material/styles/styled';

import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { Mail } from '@mui/icons-material';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

// common
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import MUIButton from '../../Components/Button/MUIButton';
import DataTable from '../../Components/DataTable/DataTable';
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base/MenuButton';
import { Menu as DropDown } from '@mui/base/Menu';

import {
  bulkDeletePurchaseOrdersApi,
  exportPurchaseOrdersApi,
  getAllPurchaseordersApi,
  singleDeletePurchaseOrdersApi
} from '../../../core/api/purchase';

import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';
import {
  StatusColor,
  extractNumberFromHash,
  formatDate,
  generateEncryptedID,
  snakeCaseToPrettyText
} from '../../../core/utils/helpers';
import ImportFileModal from '../../Components/ImportFileModal/ImportFileModal';
import ExportFileModal from '../../Components/ExportFileModal/ExportFileModal';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';
import DetailViewContainer from '../../Components/Containers/DetailViewContainer';
import notyf from '../../Components/NotificationMessage/notyfInstance';
import TableGrid from '../../Components/Containers/TableGrid';
import { Add } from '@mui/icons-material';
import { Close } from '@mui/icons-material';
import {
  StyledMenuItem,
  TriggerButton,
  headerMenuBox
} from './purchaseOrderStyles';
import { Delete, MailOutline } from '@mui/icons-material';
import DataTableContainer from '../../Components/Containers/DataTableContainer';
import { DownloadOutlined } from '@mui/icons-material';
const ViewPurchase = lazy(() => import('./ViewPurchase'));

// apis
const purchaseMenu = [
  {
    name: 'All Purchase Order',
    id: 'all'
  },
  {
    name: 'All',
    id: 'all'
  },
  {
    name: 'Invoiced',
    id: 'invoiced'
  },
  {
    name: 'Reimbursed',
    id: 'reimbursed'
  },
  {
    name: 'Billable',
    id: 'Billable'
  },

  {
    name: 'Non-Billable',
    id: 'customer_view'
  },
  {
    name: 'With Receipts',
    id: 'Receipts1'
  },

  {
    name: 'Without Receipts',
    id: 'invoiced'
  }
];

const PurchaseOrders = () => {
  const theme = useTheme();

  const intialColumns = [
    {
      accessorKey: 'purchase_order_date',
      header: 'Date',
      Cell: ({ cell }) => {
        const data = cell.getValue();
        const formatedDate = formatDate(data);
        return (
          <Box component='span' sx={{}}>
            {formatedDate}
          </Box>
        );
      }
    },
    {
      accessorKey: 'purchase_order_number',
      header: 'Purchase Order',
      Cell: ({ renderedCellValue, row }) => (
        <Typography variant='body2' color='primary'>
          {renderedCellValue}
        </Typography>
      )
    },
    // {
    // 	accessorKey: 'reference',
    // 	header: 'Reference',
    // },

    {
      accessorKey: 'vendor',
      header: 'Vendor Name',
      Cell: ({ cell }) => {
        const name = cell.getValue()?.full_name;
        return (
          <Typography variant='body2' component='span' sx={{}}>
            {name}
          </Typography>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ cell }) => {
        const status = cell.getValue();
        const estStatusColor = StatusColor(status, theme);

        return (
          <Typography
            variant='body2'
            component='span'
            sx={{
              color: estStatusColor,
              borderRadius: '0.25rem',
              textTransform: 'capitalize'
            }}>
            {snakeCaseToPrettyText(status)}
          </Typography>
        );
      }
    },
    {
      accessorKey: 'bill_status',
      header: 'Billed Status',
      Cell: ({ cell, row }) => {
        const billedStatus = cell.getValue();
        const estStatusColor = StatusColor(billedStatus, theme);

        return (
          <Typography
            variant='body2'
            component='span'
            sx={{
              color: estStatusColor,
              borderRadius: '0.25rem',
              textTransform: 'capitalize'
            }}>
            {snakeCaseToPrettyText(billedStatus)}
          </Typography>
        );
      }
    },
    // {
    //   accessorKey: "payment_status",
    //   header: "Payment Status",
    //   Cell: ({ cell }) => {
    //     const status = cell.getValue();
    //     const estStatusColor = StatusColor(status, theme);
    {
      accessorKey: 'total',
      header: 'Amount',
      Cell: ({ cell }) => {
        const amount = cell.getValue();

        return <Typography variant='body2'>${amount}</Typography>;
      }
    },

    {
      accessorKey: 'expected_delivery_date',
      header: (
        <span style={{ whiteSpace: 'nowrap' }}>Expected Delivery Date</span>
      ),
      Cell: ({ cell }) => {
        const formatedDate = formatDate(cell.getValue());
        return (
          <Typography
            variant='body2'
            component='span'
            sx={{ whiteSpace: 'nowrap' }}>
            {formatedDate}
          </Typography>
        );
      }
    },

    {
      accessorKey: 'actions',
      header: 'Actions',
      enableColumnActions: false,
      enableColumnFilter: false,
      enableColumnOrdering: false,
      enableSorting: false,
      Cell: ({ row }) => (
        <Actions id={row?.original?.id} status={row?.original?.status} />
      )
    }
  ];

  const collapsedColumns = [
    {
      accessorKey: 'vendor',
      header: '',
      Cell: ({ row }) => {
        const wholedata = row?.original;
        // const customer = wholedata?.customer;
        const estStatusColor = StatusColor(wholedata.status, theme);

        return (
          <Box>
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Grid item x={6}>
                <Typography variant='subtitle2'>
                  {wholedata?.vendor?.full_name || '--'}
                </Typography>
                {/* <Typography
                  component='span'
                  sx={{ fontSize: "12px", color: window.themeColors.primary }}>
                  {wholedata?.purchase_order_number}
                </Typography> */}
                <Grid container>
                  <Typography
                    component='span'
                    color={theme.palette.primary.main}
                    sx={{ fontSize: '12px' }}>
                    {wholedata?.purchase_order_number} |
                  </Typography>
                  <Typography component='span' sx={{ fontSize: '12px' }}>
                    &nbsp;{formatDate(wholedata?.created_at)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item x={6} sx={{ textAlign: 'right' }}>
                <Typography variant='body2'>
                  ${wholedata?.total || 0}
                </Typography>
                <Typography variant='caption' sx={{ color: estStatusColor }}>
                  {snakeCaseToPrettyText(wholedata?.status) || '--'}
                </Typography>
                <IconButton sx={{ paddingRight: '0' }}>
                  {' '}
                  <Mail sx={{ fontSize: '15px' }} />{' '}
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        );
      }
    }
  ];
  const [selectedRows, setSelectedRows] = useState([]);
  const [purchaseDropdown, setPurchaseDropDown] =
    useState('All Purchase Order');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterMenu, setFilterMenu] = useState(null);

  const [columns, setColumns] = useState(intialColumns);
  const [viewPurchase, setPurchaseVw] = useState(false);
  const [id, setId] = useState(null);
  const hash = window.location.hash;

  const [refresh, setRefresh] = useState(0);
  const [openImport, setOpenImport] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const navigate = useNavigate();

  //   view purchase
  useEffect(() => {
    const id = extractNumberFromHash(hash);
    setId(id);
    if (id) {
      setColumns(collapsedColumns);
      setPurchaseVw(true);
    } else {
      setColumns(intialColumns);
      setPurchaseVw(false);
    }
  }, [hash]);

  const hidingMenu = () => {
    setFilterMenu(null);
  };

  const handleRowClick = row => {
    location.hash = '#/' + generateEncryptedID(row.id);
  };
  //   view menu
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuAnchorE2, setMenuAnchorE2] = useState(null);
  const [bulkActionOpen, setbulkActionOpen] = useState(null);

  const handleClick = event => {
    setMenuAnchorEl(event.currentTarget);
    setMenuAnchorE2(event.currentTarget);
  };
  const openBulk = event => {
    setbulkActionOpen(event.currentTarget);
  };
  const clickPurchase = event => {
    setMenuAnchorE2(event.currentTarget);
  };

  //   purchase filter
  const openPurchaseFilter = e => {
    if (selectedRows.length === 0) {
      setMenuAnchorEl(e.currentTarget);
    }
  };

  // bulk delete
  const handleBulkDelete = async () => {
    try {
      await bulkDeletePurchaseOrdersApi({ ids: selectedRows });
      notyf.success('Purchase Orders deleted Successfully');
      setRefresh(prev => prev + 1);
    } catch (error) {}
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await singleDeletePurchaseOrdersApi(id);
      setRefresh(prev => prev + 1);
      notyf.success('Purchase orders deleted successfully');
    } catch (error) {
      notyf.error('Something went wrong');
    }
  };

  //   styles

  const headerIconButton = {
    backgroundColor: '#EEEEEE',
    border: '1px solid #d1d1d1',
    borderRadius: '8px',
    textTransform: 'none',
    padding: '6px 16px'
  };

  const StyledListbox = styled('ul')(
    ({ theme }) => `
    font-family: roboto;
    font-size:18px,
    min-width: 100px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: white;
    box-shadow: 0px 4px 30px #d0d7de;
    z-index:1
    `
  );
  const handleSendEstimateMain = (e, id) => {
    e.stopPropagation();
    //navigate(`/send-email/price-quote/${id}`);
    navigate(`/send-email/price-quote/${generateEncryptedID(id)}`);

    //		closeMenu();
  };
  const isRowSelectable = row => {
    return row?.original?.status === 'draft';
  };
  const Actions = ({ id, status }) => {
    return (
      <>
        {status === 'draft' ? (
          <Box className='show-on-hover' sx={{ display: 'none' }}>
            <Dropdown>
              <TriggerButton onClick={e => e.stopPropagation()}>
                <KeyboardArrowDown />
              </TriggerButton>
              <DropDown slots={{ listbox: StyledListbox }}>
                <StyledMenuItem
                  onClick={e => {
                    setOpenConfirmDialog(true); // Open the confirmation dialog
                    setDialogProps({
                      onConfirm: handleDelete(e, id)
                    });
                  }}>
                  <DeleteIcon /> Void
                </StyledMenuItem>
                <StyledMenuItem onClick={e => handleSendEstimateMain(e, id)}>
                  <MailOutline /> Send An Email
                </StyledMenuItem>
              </DropDown>
            </Dropdown>
          </Box>
        ) : null}
      </>
    );
  };
  return (
    <>
      <Grid container>
        <TableGrid item sm={viewPurchase ? 3.5 : 12}>
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
                      <Delete /> {''}Void
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
                        All Purchase Orders
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
                    <MUIButton
                      onClick={() => navigate('/purchase-orders/new')}
                      variant='contained'
                      sx={{ minWidth: '0', padding: '5px 7px' }}>
                      <Add fontSize='small' />
                      {!viewPurchase && 'New'}
                    </MUIButton>
                    <MUIButton
                      onClick={() => setOpenExport(true)}
                      variant='outlined'
                      sx={{
                        minWidth: '0',
                        padding: '5px 7px',
                        marginLeft: '5px'
                      }}>
                      <DownloadOutlined />
                      {viewPurchase ? '' : 'Export'}
                    </MUIButton>
                    {/* <IconButton
											component={'span'}
											sx={{ padding: '0', marginLeft: '10px' }}
										>
											<Dropdown>
												<HeaderMenuButton
													onClick={e => e.stopPropagation()}
													sx={{ padding: '7px' }}
												>
													<MoreHoriz fontSize='small' />
												</HeaderMenuButton>
												<Menu slots={{ listbox: StyledListbox }}>
													<StyledMenuItem onClick={() => setOpenImport(true)}>
														<SaveAlt /> Import Purchase Orders
													</StyledMenuItem>
													<StyledMenuItem onClick={() => setOpenExport(true)}>
														<UploadFile /> Export Purchase Orders
													</StyledMenuItem>
													<StyledMenuItem
														onClick={() => setRefresh(prev => prev + 1)}
													>
														<Cached /> Refresh List
													</StyledMenuItem>
												</Menu>
											</Dropdown>
										</IconButton> */}
                  </Box>
                )}
              </Grid>
            </Grid>
          </HeaderPaper>
          <DataTableContainer>
            <DataTable
              columns={columns}
              api={getAllPurchaseordersApi}
              setSelectedRows={setSelectedRows}
              onRowClick={handleRowClick}
              refresh={refresh}
              enableRowSelection={isRowSelectable}
              collapsed={viewPurchase}
            />
          </DataTableContainer>
        </TableGrid>
        {viewPurchase && (
          <Grid sm={8.5}>
            <DetailViewContainer>
              <ViewPurchase
                id={id}
                refreshList={() => setRefresh(prev => prev + 1)}
                setPurchaseVw={setPurchaseVw}
              />
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
        // ImportTypeEnum={ImportTypeEnum}
        // importApi={importEstimate}
        setRefresh={setRefresh}
      />
      <ExportFileModal
        isOpen={openExport}
        onClose={() => setOpenExport(false)}
        exportApi={exportPurchaseOrdersApi}
      />
    </>
  );
};

export default PurchaseOrders;
