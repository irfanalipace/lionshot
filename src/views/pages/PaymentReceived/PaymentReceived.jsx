import { useEffect, useState } from 'react';
import {
  exportPaymentReceived,
  getAllPaymentReceived
} from '../../../core/api/paymentReceived';
import { Box, IconButton, Grid, Typography, Button } from '@mui/material';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton } from '@mui/base/MenuButton';
import { Add, Close, MoreHoriz, UploadFile } from '@mui/icons-material';
import DataTable from '../../Components/DataTable/DataTable';
import { useNavigate } from 'react-router-dom';

import {
  decryptId,
  extractNumberFromHash,
  formatDate,
  generateEncryptedID
} from '../../../core/utils/helpers';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import DataTableContainer from '../../Components/Containers/DataTableContainer';
import DetailViewContainer from '../../Components/Containers/DetailViewContainer';
import {
  StyledListbox,
  HeaderMenuButton,
  StyledMenuItem
} from '../Customer/CustomerStylesConst';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';
// import PaymentReceivedView from './PaymentReceivedView/PaymentReceivedView';

const PaymentReceivedView = lazy(() =>
  import('./PaymentReceivedView/PaymentReceivedView')
);
import { Stack } from '@mui/system';
import TableGrid from '../../Components/Containers/TableGrid';
import ExportFileModal from '../../Components/ExportFileModal/ExportFileModal';
const PaymentReceivedTable = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewPayment, setViewPayment] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [id, setId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps] = useState({});
  const [openExport, setOpenExport] = useState(false);
  const intialColumns = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      Cell: ({ cell }) => {
        const date = cell.getValue();
        const formatedDate = formatDate(date);
        return (
          <Typography variant='body2' component='span'>
            {formatedDate}
          </Typography>
        );
      }
    },
    {
      accessorKey: 'id',
      header: 'Payment #'
    },
    // {
    //   accessorKey: 'Type',
    //   header: 'payment_method'
    // },
    {
      accessorKey: 'reference_number',
      header: 'Reference Number',
      Cell: ({ cell }) => (
        <Typography variant='body2' className='TextCapitalize'>
          {cell.getValue() || '--'}
        </Typography>
      )
    },
    {
      accessorKey: 'customer.display_name',
      header: 'Customer Name'
    },
    {
      accessorKey: 'invoice.invoice_number',
      header: 'Invoice #'
    },
    {
      accessorKey: 'payment_mode_value',
      header: 'Mode',
      Cell: ({ cell }) => (
        <Typography variant='body2'>{cell.getValue()}</Typography>
      )
    },
    {
      accessorKey: 'payment_made',
      header: 'Amount',
      Cell: ({ cell }) => (
        <Typography variant='body2'>${cell.getValue()}</Typography>
      )
    }
    // {
    //   accessorKey: 'invoice.status',
    //   header: 'Status',
    //   Cell: ({ row }) =>
    //     <Typography variant="body2" className='TextCapitalize'>{row?.original?.status}</Typography>
    // },
  ];

  const collapsedColumns = [
    {
      accessorKey: 'display_name',
      header: 'Company Name',
      Cell: ({ row }) => {
        const wholedata = row?.original;
        const formatedDate = formatDate(row?.original?.created_at);
        return (
          <Box>
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Grid item x={6}>
                <Typography variant='subtitle2'>
                  {row?.original?.customer?.display_name}
                </Typography>
                <Typography
                  component='span'
                  variant='body2Grey'
                  sx={{ fontSize: '12px' }}>
                  {wholedata?.invoice?.invoice_number} |{' '}
                </Typography>
                <Typography
                  component='span'
                  variant='body2Grey'
                  sx={{ fontSize: '12px' }}>
                  {formatedDate}
                </Typography>
                {/* <Typography component='p' variant="body2Grey" sx={{ fontSize: '12px', wordWrap: 'break-word', width: '200px' }}>| {wholedata?.reference_number}</Typography> */}
              </Grid>
              <Grid item x={6} sx={{ textAlign: 'right' }}>
                <Typography variant='body2'>
                  ${wholedata?.payment_made || 0}
                </Typography>
                <Typography component='p' variant='caption'>
                  {wholedata?.payment_method}
                </Typography>
                <Typography variant='caption' className='TextCapitalize'>
                  {wholedata?.payment_mode === 'bank_transfer'
                    ? 'Bank Transfer'
                    : wholedata?.payment_mode || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      }
    }
  ];
  const [columns, setColumns] = useState(intialColumns);
  const hash = window.location.hash;

  useEffect(() => {
    const id = extractNumberFromHash(hash);
    const decryptedId = decryptId(id);
    setId(decryptedId);
    if (decryptedId) {
      // const id = extractNumberFromHash(hash);
      // setId(id);
      // if (id) {
      setColumns(collapsedColumns);
      setViewPayment(true);
    } else {
      setColumns(intialColumns);
      setViewPayment(false);
    }
  }, [hash]);

  // const handleEditModal = (e, row) => {
  //   e.stopPropagation();
  //   navigate(`/customer/edit/${row}`);
  // };

  // const handleDeleteModal = params => {
  //   console.log('id: ' + params.id);
  // };

  const handleRowClick = row => {
    location.hash = '#/' + generateEncryptedID(row?.id);
  };
  // const handleBulkDelete = async () => {
  //   console.log('selectedRows', selectedRows);
  //   try {
  //     await bulkDeleteCustomer({ ids: selectedRows });
  //     setRefresh(prev => prev + 1);
  //   } catch (err) {
  //     console.log('err', err);
  //   }
  // };

  return (
    <>
      <Grid container>
        <TableGrid sm={viewPayment ? 3.1 : 12}>
          <HeaderPaper>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ display: 'flex', alignItems: 'center', paddingY: '3px' }}>
              {/* <Grid item xs={6}> */}
              {selectedRows.length > 0 ? (
                <Grid item xs={9}>
                  {/* <Box sx={headerMenuBox}>
                      <IconButton sx={headerIconButton}>
                        <PictureAsPdf sx={{fontSize:'20px'}}/>
                      </IconButton>
                      <IconButton sx={headerIconButton}>
                        <Print sx={{fontSize:'20px'}}/>
                      </IconButton>
                      <IconButton sx={headerIconButton}>
                        <Mail sx={{fontSize:'20px'}}/>
                      </IconButton>
                      <Dropdown>
                        <HeaderMenuButton sx={headerIconButton} style={{ color: 'black', margin: '0 10px' }} onClick={e => e.stopPropagation()}>
                        Bulk Actions<KeyboardArrowDown  sx={{ color: 'black', fontSize: '16px',margin:'0 0px -3px 5px' }}/>
                        </HeaderMenuButton>
                        <Menu slots={{ listbox: StyledListbox }}>
                          <StyledMenuItem> Bulk Update</StyledMenuItem>
                          <StyledMenuItem
                            onClick={() => {
                              setOpenConfirmDialog(true);
                              setDialogProps({
                                onConfirm: handleBulkDelete
                              });
                            }}
                          >
                            Delete
                          </StyledMenuItem>
                        </Menu>
                      </Dropdown>
                    </Box> */}
                </Grid>
              ) : (
                <Grid item xs={6}>
                  <Dropdown>
                    <MenuButton
                      onClick={e => e.stopPropagation()}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none'
                      }}>
                      <Stack direction={'row'}>
                        <Typography
                          noWrap
                          fontSize={'18px'}
                          variant='h6'
                          className='TextCapitalize'
                          sx={{ cursor: 'pointer' }}>
                          Account Receivables
                        </Typography>
                        {/* <ArrowDropDown /> */}
                      </Stack>
                    </MenuButton>
                    {/* <Menu slots={{ listbox: StyledListbox }}>
											<StyledMenuItem> All Payments</StyledMenuItem>
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
                </Grid>
              )}
              {selectedRows.length > 0 ? (
                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                  <IconButton onClick={() => setRefresh(prev => prev + 1)}>
                    <Close />
                  </IconButton>
                </Grid>
              ) : (
                <Grid
                  item
                  xs={viewPayment ? 6 : 6}
                  sx={{ textAlign: viewPayment ? 'right' : 'right' }}>
                  <Button
                    size='medium'
                    onClick={() => navigate('/payment-received/new')}
                    variant='contained'
                    sx={{ minWidth: '0', padding: '5px 10px' }}>
                    <Add fontSize='small' />
                    {!viewPayment && 'New'}
                  </Button>
                  {/* <Button
										sx={{
											backgroundColor: '#E0E0E0',
											marginLeft: '10px',
											minWidth: '30px',
										}}
										onClick={() => setRefresh(prev => prev + 1)}
									>
										<Cached sx={{ color: 'black' }} fontSize='small' />
									</Button> */}
                  <IconButton
                    component={'span'}
                    sx={{ padding: '0', marginLeft: '10px' }}>
                    <Dropdown>
                      <HeaderMenuButton onClick={e => e.stopPropagation()}>
                        <MoreHoriz fontSize='small' />
                      </HeaderMenuButton>
                      <Menu slots={{ listbox: StyledListbox }}>
                        {/* <StyledMenuItem><SaveAlt /> Import Customers</StyledMenuItem> */}
                        <StyledMenuItem onClick={() => setOpenExport(true)}>
                          <UploadFile /> Export Payments
                        </StyledMenuItem>
                        {/* <StyledMenuItem><Settings /> Preferences</StyledMenuItem> */}
                      </Menu>
                    </Dropdown>
                  </IconButton>
                  {/* {!viewPayment && (
										<IconButton
											sx={{
												marginLeft: '10px',
												borderRadius: '5px',
												backgroundColor: '#ED6C02',
												color: 'white',
												'&:hover': { backgroundColor: '#FC8F31' },
											}}
										>
											<QuestionMark />
										</IconButton>
									)} */}
                </Grid>
              )}
              {/* </Grid> */}
            </Grid>
          </HeaderPaper>
          <DataTableContainer>
            <DataTable
              api={getAllPaymentReceived}
              columns={columns}
              setSelectedRows={setSelectedRows}
              onRowClick={handleRowClick}
              collapsed={viewPayment}
              refresh={refresh}
              enableRowSelection={false}
              manualFilter
            />
          </DataTableContainer>
        </TableGrid>
        {viewPayment && (
          <Grid item sm={8.8} sx={{ marginLeft: '10px' }}>
            <DetailViewContainer>
              <PaymentReceivedView id={id} setRefresh={setRefresh} />
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
      <ExportFileModal
        isOpen={openExport}
        onClose={() => setOpenExport(false)}
        exportApi={exportPaymentReceived}
      />
    </>
  );
};

export default PaymentReceivedTable;
