import React, { useEffect, useState } from 'react';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import { Menu as DropMenu } from '@mui/base/Menu';
import {
  Add,
  Cached,
  Delete,
  MoreHoriz,
  SaveAlt,
  UploadFile
} from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MUIButton from '../../../Components/Button/MUIButton';
import printer from '../../../../../public/assets/Printer.png';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  IconButton,
  Grid,
  Typography,
  Button,
  Divider,
  Stack,
  ButtonGroup
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import { Dropdown } from '@mui/base/Dropdown';
import {
  HeaderMenuButton,
  StyledListbox,
  headerIconButton
} from '../../Customer/CustomerStylesConst';
import DataTableContainer from '../../../Components/Containers/DataTableContainer';
import DataTable from '../../../Components/DataTable/DataTable';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  bulkDeleteSaleOrder,
  exportSaleOrder,
  getAllSaleOrders,
  importSaleOrder
} from '../../../../core/api/salesorders';
import Name from '../../../Components/InputLabel/Name';
import {
  StatusColor,
  extractNumberFromHash,
  formatDate,
  generateEncryptedID,
  snakeCaseToPrettyText
} from '../../../../core/utils/helpers';
import DetailViewContainer from '../../../Components/Containers/DetailViewContainer';
import pdf from '../../../../../public/assets/pdf.png';
import FormField from '../../../Components/InputField/FormField';
import StatusLabel from '../../../Components/InputLabel/StatusLabel';
//import ViewSalesOrder from '../ViewSalesOrder/ViewSalesOrder';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';

import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import TitleDropMenu from '../../../Components/TitleDropMenu/TitltDropMenu.';
import { useNavigate } from 'react-router-dom';
import { ref } from 'yup';
import ImportFileModal from '../../../Components/ImportFileModal/ImportFileModal';
import ExportFileModal from '../../../Components/ExportFileModal/ExportFileModal';
import TableGrid from '../../../Components/Containers/TableGrid';
import { useTheme } from '@mui/material/styles';
const ViewSalesOrder = lazy(() => import('../ViewSalesOrder/ViewSalesOrder'));

const SalesOrderList = () => {
  const theme = useTheme();

  const navigate = useNavigate();
  const intialColumns = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      Cell: ({ renderedCellValue, row }) => <>{formatDate(renderedCellValue)}</>
    },
    {
      accessorKey: 'sale_order_number',
      header: 'Sales Order#',
      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    },
    {
      accessorKey: 'customer',
      header: 'Customer Name',
      Cell: ({ cell }) => {
        const customerName = cell.getValue();
        return (
          <Typography variant='body2' component='span'>
            {customerName?.first_name || ''} {customerName?.last_name || ''}
          </Typography>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ renderedCellValue, row }) => (
        <Typography
          variant='body2'
          sx={{ color: StatusColor(row.original.status, theme) }}>
          {snakeCaseToPrettyText(row.original.status)}
        </Typography>
      )
    },
    {
      accessorKey: 'invoice',
      header: 'Invoice',
      Cell: () => <>----</>
    },
    {
      accessorKey: 'payment',
      header: 'Payment',
      Cell: () => <>----</>
    },
    {
      accessorKey: 'total',
      header: 'Amount',
      Cell: ({ renderedCellValue }) => (
        <Typography variant='body2'>${renderedCellValue}</Typography>
      )
    }
    // {
    //   accessorKey: "shipment_date",
    //   header: "Shipping Date",
    //   Cell: ({ renderedCellValue, row }) => (
    //     <FormField value={renderedCellValue} />
    //   ),
    // },
    // {
    //   accessorKey: "expected_deleivery_date",
    //   header: "Delivery Date",
    // },
    // {
    //   accessorKey: "order_status",
    //   header: "Order Status",
    //   Cell: ({ renderedCellValue, row }) => (
    //     <StatusLabel>{renderedCellValue}</StatusLabel>
    //   ),
    // },
  ];
  const [viewOrders, setViewOrders] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [columns, setColumns] = useState(intialColumns);
  const [openImport, setOpenImport] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [showMenuItem, setShowMenu] = useState(null);
  const [id, setId] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const hash = window.location.hash;
  const openMore = Boolean(anchorE2);

  const handleMoreClick = event => {
    setAnchorE2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorE2(null);
  };
  // const handleMoreClose = () => {
  // 	setAnchorE2(null);
  // };

  const handleRowClick = row => {
    location.hash = '#/' + generateEncryptedID(row?.id);
  };
  const showingMenu = event => {
    setShowMenu(event.currentTarget);
  };
  const hidingMenu = () => {
    setShowMenu(null);
  };

  const headerIconButton = {
    backgroundColor: '#EEEEEE',
    border: '1px solid #d1d1d1',
    borderRadius: '8px',
    textTransform: 'none',
    padding: '1px'
  };
  const collapsedColumns = [
    {
      accessorKey: 'customer',
      header: 'Company Name',
      Cell: ({ row }) => {
        const wholedata = row?.original;
        const saleorder = row?.original?.customer;
        const formatedDate = formatDate(saleorder?.created_at);

        return (
          <Box>
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Grid item x={6}>
                <Typography variant='subtitle2'>
                  {wholedata?.customer?.first_name +
                    ' ' +
                    wholedata?.customer?.last_name}
                </Typography>
                <Typography
                  component='span'
                  sx={{ fontSize: '12px', color: theme.palette.primary.main }}>
                  {wholedata?.sale_order_number} |
                </Typography>
                <Typography component='span' sx={{ fontSize: '12px' }}>
                  &nbsp;{formatDate(wholedata?.created_at)}
                </Typography>{' '}
                <Typography
                  sx={{ fontSize: '12px', color: '#00000099' }}
                  variant='subtitle1'>
                  {/* {wholedata?.reference_number} */}
                </Typography>
              </Grid>
              <Grid item x={6} sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: '12px' }} variant='subtitle1'>
                  ${wholedata?.total || 0}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ color: StatusColor(wholedata?.status, theme) }}>
                  {snakeCaseToPrettyText(wholedata?.status)}
                </Typography>
                {/* <IconButton sx={{ paddingRight: "0" }}>
                  {" "}
                  <Mail sx={{ fontSize: "15px" }} />{" "}
                </IconButton> */}
              </Grid>
            </Grid>
          </Box>
        );
      }
    }
  ];
  useEffect(() => {
    const id = extractNumberFromHash(hash);
    setId(id);
    if (id) {
      setColumns(collapsedColumns);
      setViewOrders(true);
    } else {
      setColumns(intialColumns);
      setViewOrders(false);
    }
  }, [hash]);

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteSaleOrder({ ids: selectedRows });
      setRefresh(prev => prev + 1);
    } catch (err) {}
  };
  const isRowSelectable = row => {
    return row?.original?.status === 'draft';
  };

  const tableIconButton = {
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
        <TableGrid sm={viewOrders ? 3.2 : 12}>
          <HeaderPaper sx={{ padding: '10px 20px' }}>
            {selectedRows.length > 0 && (
              <Grid item container>
                <Grid item sm={12}>
                  <Grid item container>
                    <Grid
                      item
                      sm={10}
                      sx={{ display: 'flex', alignItems: 'center' }}>
                      <Stack
                        direction='row'
                        display='felx'
                        alignItems='center'
                        spacing={2}>
                        {/* <ButtonGroup>
													<IconButton
														sx={{
															backgroundColor: '#EEEEEE',
															...headerIconButton,
														}}>
														<img src={printer} alt='printer' />
													</IconButton>
													<IconButton
														sx={{
															...headerIconButton,
															backgroundColor: '#EEEEEE',
														}}>
														<img src={pdf} alt='pdf' />
													</IconButton>
												</ButtonGroup> */}
                        <Button
                          sx={tableIconButton}
                          onClick={() => {
                            setOpenConfirmDialog(true);
                            setDialogProps({
                              onConfirm: () => handleBulkDelete()
                            });
                          }}>
                          <Delete /> Delete
                        </Button>
                        {/* <Button
													size='medium'
													sx={{
														...headerIconButton,
														color: 'black',
														padding: '6px 16px',
													}}>
													Bulk Update
												</Button>
												<IconButton
													onClick={showingMenu}
													sx={{
														// ...headerIconButton,
														color: 'black',
														padding: '6px 16px',
													}}>
													<MoreHorizIcon />
												</IconButton>
												<Menu
													anchorEl={showMenuItem}
													open={Boolean(showMenuItem)}
													onClose={hidingMenu}>
													<MenuItem
														sx={{ padding: '2px 4px', borderRadius: '4px' }}>
														<MUIButton
															onClick={() => {
																setOpenConfirmDialog(true);
																setDialogProps({
																	onConfirm: () => handleBulkDelete(),
																});
															}}
															size='medium'
															fullWidth>
															Delete
														</MUIButton>
													</MenuItem>
												</Menu>  */}
                      </Stack>
                    </Grid>
                    <Grid
                      item
                      sm={2}
                      sx={{
                        display: 'flex',
                        justifyContent: 'end',
                        alignItems: 'center'
                      }}>
                      <IconButton onClick={() => setRefresh(prev => prev + 1)}>
                        <CloseIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {selectedRows.length === 0 && (
              <Grid item container>
                <>
                  <Grid item sm={6} display='flex' alignItems='center'>
                    <Stack
                      direction='row'
                      display='flex'
                      alignItems='center'
                      spacing={0}>
                      <Typography variant='h6' component='span'>
                        All Sales Orders
                      </Typography>
                      {/* <TitleDropMenu
                        title={"All Sales Orders"}
                        fontSize={viewOrders && 17}
                      /> */}
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    sm={6}
                    display='flex'
                    justifyContent='end'
                    alignItems='center'>
                    <MUIButton
                      size='medium'
                      onClick={() => navigate('/sales-orders/new')}
                      variant='contained'>
                      <Add fontSize='small' />
                      New
                    </MUIButton>{' '}
                    {/* {!viewOrders && (
                      <IconButton>
                        <Dropdown>
                          <HeaderMenuButton>
                            <SettingsIcon />
                          </HeaderMenuButton>
                        </Dropdown>
                      </IconButton>
                    )} */}
                    <IconButton
                      onClick={event => handleMoreClick(event)}
                      sx={{
                        ...headerIconButton,
                        padding: '5px 3px',
                        marginLeft: '10px'
                      }}>
                      <MoreHoriz />
                    </IconButton>
                    <Menu
                      anchorEl={anchorE2}
                      open={Boolean(anchorE2)}
                      onClose={() => handleClose()}>
                      <MenuItem onClick={() => setOpenImport(true)}>
                        <SaveAlt sx={{ color: '#0000008F' }} /> &ensp;Import
                        Sales Orders
                      </MenuItem>
                      <MenuItem onClick={() => setOpenExport(true)}>
                        <UploadFile sx={{ color: '#0000008F' }} /> &ensp;Export
                        Sales Orders
                      </MenuItem>
                      <Divider />
                      <MenuItem>
                        <Cached sx={{ color: '#0000008F' }} />
                        &ensp; Refresh List
                      </MenuItem>
                    </Menu>
                    {/* {!viewOrders && (
                      <Button startIcon={<InfoOutlinedIcon />}>
                        Page Tips
                      </Button>
                    )} */}
                  </Grid>
                </>
              </Grid>
            )}
          </HeaderPaper>

          <DataTableContainer>
            <DataTable
              api={getAllSaleOrders}
              columns={columns}
              setSelectedRows={setSelectedRows}
              onRowClick={handleRowClick}
              collapsed={viewOrders}
              refresh={refresh}
              // enableRowSelection={isRowSelectable}
              enableRowSelection={false}
              manualFilter
            />
          </DataTableContainer>
        </TableGrid>
        {viewOrders && (
          <Grid item sm={8.7} sx={{ marginLeft: '10px' }}>
            <DetailViewContainer>
              <ViewSalesOrder id={id} setRefresh={setRefresh} />
            </DetailViewContainer>
          </Grid>
        )}
      </Grid>
      <ConfirmDialog
        title='Are you sure you want to delete'
        isOpen={openConfirmDialog}
        onClose={() => {
          setOpenConfirmDialog(false);
        }}
        {...dialogProps}
      />
      <ImportFileModal
        isOpen={openImport}
        onClose={() => setOpenImport(false)}
        // ImportTypeEnum={ImportTypeEnum}
        importApi={importSaleOrder}
        setRefresh={setRefresh}
      />
      <ExportFileModal
        isOpen={openExport}
        onClose={() => setOpenExport(false)}
        exportApi={exportSaleOrder}
      />
    </>
  );
};

export default SalesOrderList;
