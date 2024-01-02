import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import DataTable from '../../../Components/DataTable/DataTable';
import { Menu as DropMenu } from '@mui/base/Menu';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';

import {
  bulkDeleteEstimatesApi,
  getAllEstimatesListApi,
  importEstimate,
  exportEstimate
} from '../../../../core/api/estimate';
import { Box } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import {
  StatusColor,
  extractNumberFromHash,
  formatDate,
  generateEncryptedID,
  snakeCaseToPrettyText
} from '../../../../core/utils/helpers';

import {
  Grid,
  Menu,
  MenuItem,
  Stack,
  Typography,
  IconButton,
  Divider,
  Button,
  styled,
  menuItemClasses
} from '@mui/material';

import {
  StyledListbox,
  TriggerButton,
  HeaderMenuButton,
  StyledMenuItem,
  headerMenuBox
} from '../../Customer/CustomerStylesConst';
import { Delete, Edit, MailOutline } from '@mui/icons-material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base/MenuButton';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import MUIButton from '../../../Components/Button/MUIButton';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { Cached, Mail, SaveAlt, UploadFile } from '@mui/icons-material';
import ImportFileModal from '../../../Components/ImportFileModal/ImportFileModal';
import ExportFileModal from '../../../Components/ExportFileModal/ExportFileModal';
import TableGrid from '../../../Components/Containers/TableGrid';
import DataTableContainer from '../../../Components/Containers/DataTableContainer';
// const DetailViewContainer = lazy(
//   import('../../../Components/Containers/DetailViewContainer')
// );
import ComponentLoader from '../../../Components/Loaders/ComponentLoader';

import DetailViewContainer from '../../../Components/Containers/DetailViewContainer';

const ViewPriceQuote = lazy(() => import('../ViewPriceQuote/ViewPriceQuote'));

const estimatesStatus = [
  {
    name: 'All Price Quotes',
    id: 'all'
  },
  {
    name: 'Draft',
    id: 'draft'
  },
  {
    name: 'Pending Approval',
    id: 'pending_approval'
  },
  {
    name: 'Approved',
    id: 'approved'
  },
  {
    name: 'Sent',
    id: 'sent'
  },

  {
    name: 'Customer View',
    id: 'customer_view'
  },
  {
    name: 'Accepted',
    id: 'accepted'
  },

  {
    name: 'Invoiced',
    id: 'invoiced'
  },

  {
    name: 'Declined',
    id: 'declined'
  },
  {
    name: 'Expired',
    id: 'exppired'
  }
];

const PriceQuoteTable = () => {
  const theme = useTheme();

  //    estimate number value
  const EstimateNumber = ({ children }) => {
    return (
      <Typography variant='body2' style={{ color: theme.palette.primary.main }}>
        {children}
      </Typography>
    );
  };

  const intialColumns = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      Cell: ({ cell }) => {
        const data = cell.getValue();
        const formatedDate = formatDate(data);
        return (
          <Typography variant='body2' component='span' sx={{}}>
            {formatedDate}
          </Typography>
        );
      }
    },
    {
      accessorKey: 'estimate_number',
      header: 'Price Quote Number',
      Cell: ({ renderedCellValue }) => (
        <EstimateNumber>{renderedCellValue}</EstimateNumber>
      )
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
      header: 'Price Quote Status',
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
      accessorKey: 'total',
      header: 'Total',
      Cell: ({ renderedCellValue }) => (
        <Typography variant='body2'>${renderedCellValue}</Typography>
      )
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

  const isRowSelectable = row => {
    return row?.original?.status === 'draft';
  };

  const collapsedColumns = [
    {
      accessorKey: 'customer', // Access customer data
      header: 'Company Name',
      Cell: ({ row }) => {
        const wholedata = row?.original;
        const customer = wholedata?.customer;
        const estStatusColor = StatusColor(wholedata.status, theme);

        return (
          <Box>
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Grid item x={6}>
                <Typography variant='subtitle2'>
                  {customer?.first_name} {customer?.last_name}
                </Typography>
                <Typography
                  component='span'
                  sx={{ fontSize: '12px', color: window.themeColors.primary }}>
                  {wholedata?.estimate_number}
                </Typography>
                <Typography component='span' sx={{ fontSize: '12px' }}>
                  {' '}
                  | {formatDate(customer?.created_at)}
                </Typography>
              </Grid>
              <Grid item x={6} sx={{ textAlign: 'right' }}>
                <Typography variant='caption' sx={{ color: estStatusColor }}>
                  {snakeCaseToPrettyText(wholedata?.status) || '--'}
                </Typography>
                <Typography variant='body2'>
                  ${wholedata?.total || 0}
                </Typography>

                {/* <IconButton sx={{ paddingRight: '0' }}>
									{' '}
									<Mail sx={{ fontSize: '15px' }} />{' '}
								</IconButton> */}
              </Grid>
            </Grid>
          </Box>
        );
      }
    }
  ];

  const [columns, setColumns] = useState(intialColumns);
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [priceQouteStatus, setPriceQouteStatus] = useState('All Price Quotes');
  const [showMenuItem, setShowMenu] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [viewPriceQuotes, setViewPriceQuotes] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [id, setId] = useState(null);
  const hash = window.location.hash;
  const [anchorE2, setAnchorE2] = useState(null);

  const handleMoreClick = event => {
    setAnchorE2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorE2(null);
  };

  //   console.log('hash' , hash)

  const navigate = useNavigate();
  //   console.log("openConfirmDialog", openConfirmDialog);

  const [refresh, setRefresh] = useState(0);

  const showingMenu = event => {
    setShowMenu(event.currentTarget);
  };
  const hidingMenu = () => {
    setShowMenu(null);
  };

  //   menu items
  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const selectingStatus = (e, id) => {
    const filteredSttaus = estimatesStatus.find(item => item.id === id);
    setPriceQouteStatus(filteredSttaus.name);
  };

  //   bulk delete / simgle / multiple
  const handleBulkDelete = async () => {
    console.log('selectedRows', selectedRows);
    const selectedRowIds = selectedRows.map(row => Number(row));

    try {
      const resp = await bulkDeleteEstimatesApi({ ids: selectedRowIds });
      notyf.success(resp?.message);
      setRefresh(prev => prev + 1);
    } catch (err) {
      //   console.log("err", err);
      notyf.error('Something went wrong');
    }
  };

  useEffect(() => {
    const id = extractNumberFromHash(hash);
    setId(id);
    if (id) {
      setColumns(collapsedColumns);
      setViewPriceQuotes(true);
    } else {
      setColumns(intialColumns);
      setViewPriceQuotes(false);
    }
  }, [hash]);

  const handleRowClick = row => {
    location.hash = '#/' + generateEncryptedID(row?.id);
  };
  // const handleSendEstimateMain = id => {
  // 	navigate(`/send-email/price-quote/${id}`);
  // };

  //   styles
  const headerIconButton = {
    backgroundColor: '#EEEEEE',
    border: '1px solid #d1d1d1',
    borderRadius: '8px',
    textTransform: 'none',
    padding: '1px'
  };

  // const TriggerButton = styled(MenuButton)(
  // 	({ theme }) => `
  //   // padding: 2px;
  //   background: ${window.themeColors.primary};
  //   color: #fff;
  //   border-radius:18px;
  //   border:none;
  //   transition-duration: 120ms;
  //   .MuiSvgIcon-root {
  //   margin-bottom: -3px;
  //   }
  //   &:hover {
  //   border-color: rgb(242, 242, 242);
  //   }
  //   `
  // );
  // const StyledMenuItem = styled(MenuItem)(
  // 	({ theme }) => `
  //   padding: 13px;
  //   border-radius: 8px;
  //   cursor: pointer;
  //   &:hover:not(.${menuItemClasses.disabled}) {
  //   background-color: #F6FBFF;
  //   }
  //   `
  // );
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
  const handleEditModal = (e, id) => {
    e.stopPropagation();
    navigate(`/price-quote/edit/${generateEncryptedID(id)}`);

    //		closeMenu();
  };
  const handleSendEstimateMain = (e, id) => {
    e.stopPropagation();
    //navigate(`/send-email/price-quote/${id}`);
    navigate(`/send-email/price-quote/${generateEncryptedID(id)}`);

    //		closeMenu();
  };
  // actions aicon , only edit for now
  const Actions = ({ id, status }) => {
    // const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    // const openMenu = event => {
    // 	event.stopPropagation();
    // 	setMenuAnchorEl(event.currentTarget);
    // };

    // const closeMenu = () => {
    // 	setMenuAnchorEl(null);
    // };

    // const handleEditClick = e => {
    // 	e.stopPropagation();
    // 	openingEditForm(id);
    // 	closeMenu();
    // };

    return (
      status === 'draft' && (
        <Box className='show-on-hover' sx={{ display: 'none' }}>
          {/* <TriggerButton onClick={openMenu} >
          <KeyboardArrowDown/>
        </TriggerButton> */}

          {/* <Dropdown>
						<TriggerButton onClick={e => e.stopPropagation()}>
							<KeyboardArrowDown />
						</TriggerButton>
						<DropMenu slots={{ listbox: StyledListbox }}>
							<StyledMenuItem onClick={e => handleEditModal(e, id)}>
								<Edit /> Edit
							</StyledMenuItem>
						</DropMenu>
					</Dropdown> */}

          <Dropdown>
            <TriggerButton onClick={e => e.stopPropagation()}>
              <KeyboardArrowDown />
            </TriggerButton>
            <DropMenu slots={{ listbox: StyledListbox }}>
              <StyledMenuItem onClick={e => handleEditModal(e, id)}>
                <Edit /> Edit
              </StyledMenuItem>

              <StyledMenuItem onClick={e => handleSendEstimateMain(e, id)}>
                <MailOutline />
                {''} Send An Email
              </StyledMenuItem>
            </DropMenu>
          </Dropdown>

          {/* <IconButton
						onClick={openMenu}
						sx={{
							backgroundColor: window.themeColors.primary,
							borderRadius: '18px',
							padding: '2px',
							color: '#fff',
							transition: 'background-color 0.3s',
							'&:hover': {
								background: 'rgb(33,150,243 , 0.8)',
								color: '#fff',
							},
						}}
					>
						<KeyboardArrowDown />
					</IconButton>
					<Menu
						anchorEl={menuAnchorEl}
						open={Boolean(menuAnchorEl)}
						onClose={closeMenu}
						//   slots={{ listbox: StyledListbox }}
					>
						<MenuItem
							onClick={handleEditClick}
							sx={{ width: '150px', display: 'flex', alignItems: 'center' }}
						>
							<EditIcon sx={{ fontSize: '16px', color: window.themeColors.primary }} />
							<Typography sx={{ margin: '0 5px' }}>Edit</Typography>
						</MenuItem>
					</Menu> */}
        </Box>
      )
    );
  };

  // ...

  // Edit function / form

  // ...
  const ViewHeaderIconButton = {
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
        <TableGrid sm={viewPriceQuotes ? 3.5 : 12}>
          <HeaderPaper>
            {selectedRows.length > 0 && (
              <Grid item container>
                {/* pgae header / when checkbox selected  */}
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
                              ...headerIconButton
                            }}
                          >
                            <img src={printer} alt='printer' />
                          </IconButton>
                          <IconButton
                            sx={{
                              ...headerIconButton,
                              backgroundColor: '#EEEEEE'
                            }}
                          >
                            <img src={pdf} alt='pdf' />
                          </IconButton>
                        </ButtonGroup> */}
                        <Button
                          size='medium'
                          sx={ViewHeaderIconButton}
                          onClick={() => {
                            hidingMenu(); // Close the Menu
                            setOpenConfirmDialog(true); // Open the confirmation dialog
                            setDialogProps({
                              onConfirm: handleBulkDelete
                            });
                          }}>
                          <Delete /> Delete
                        </Button>
                        {/* <Button
                          size='medium'
                          sx={{
                            ...headerIconButton,
                            color: 'black',
                            padding: '6px 16px'
                          }}
                        >
                          Bulk Update
                        </Button> */}
                        {/*   <IconButton
                          onClick={showingMenu}
                          sx={{
                            ...headerIconButton,
                            color: 'black',
                            padding: '6px 16px'
                          }}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                       <Menu
                          anchorEl={showMenuItem}
                          open={Boolean(showMenuItem)}
                          onClose={hidingMenu}
                        >
                          <MenuItem
                            onClick={() => {
                              hidingMenu(); // Close the Menu
                              setOpenConfirmDialog(true); // Open the confirmation dialog
                              setDialogProps({
                                onConfirm: handleBulkDelete
                              });
                            }}
                            sx={{ padding: '2px 4px', borderRadius: '4px' }}
                          >
                            <MUIButton size='medium' fullWidth>
                              Delete
                            </MUIButton>
                          </MenuItem>
                        </Menu> */}
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
            {/* pgae header / when checkbox not selected  */}
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
                        {priceQouteStatus}
                      </Typography>
                      {/* <IconButton
                        id="dropdown-anchor"
                        aria-controls="dropdown-menu"
                        aria-haspopup="true"
                        //   bgcolor="blue"
                        mt={2}
                        ml={2}
                        onClick={handleMenuOpen}> */}
                      {/* <ArrowDropDownIcon onClick={handleMenuOpen} /> */}
                      {/* </IconButton> */}
                    </Stack>
                    {/* <Menu
                      id="dropdown-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}>
                      <List sx={{ width: 300, height: 300, overflow: "auto" }}>
                        {estimatesStatus.map((status) => (
                          <MenuItem
                            key={status.name}
                            onClick={(e) => {
                              selectingStatus(e, status.id);
                              handleMenuClose();
                            }}>
                            {status.name}
                          </MenuItem>
                        ))}
                      </List>

                      <Divider />
                      <MenuItem>
                        <MUIButton
                          
                          variant="text"
                          startIcon={<AddCircleIcon />}>
                          New Custom View
                        </MUIButton>
                      </MenuItem>
                    </Menu> */}
                  </Grid>
                  <Grid
                    item
                    sm={6}
                    display='flex'
                    justifyContent='end'
                    alignItems='center'>
                    <Box
                      // bgcolor='red'
                      sx={{ margin: ' 0 10px', borderRadius: '4px' }}>
                      <MUIButton
                        size='medium'
                        router
                        sx={{ padding: '6px 16px' }}
                        component={RouterLink}
                        to='/price-quote/new'>
                        <AddIcon fontSize='small' /> New
                      </MUIButton>
                    </Box>
                    {/* <IconButton
                      sx={{ ...headerIconButton, padding: '7px' }}
                      onClick={showingMenu}
                    >
                      <MoreHorizIcon />
                    </IconButton>
                    <Menu
                      anchorEl={showMenuItem}
                      open={Boolean(showMenuItem)}
                      onClose={hidingMenu}
                    >
                      <List sx={{ width: 300, height: 400, overflow: 'auto' }}>
                        {otherDropDown.map(item => (
                          <Box my={1}>
                            <MenuItem
                              key={item.id}
                              onClick={e => {
                                item.event(e);
                                hidingMenu();
                                setRefresh(prev => prev + 1);
                              }}
                            >
                              {item.name}
                            </MenuItem>
                          </Box>
                        ))}
                      </List>
                    </Menu> */}
                    <IconButton
                      onClick={event => handleMoreClick(event)}
                      sx={{ ...headerIconButton, padding: '5px 3px' }}>
                      <MoreHorizIcon />
                    </IconButton>

                    <Menu
                      slots={{ listbox: StyledListbox }}
                      anchorEl={anchorE2}
                      open={Boolean(anchorE2)}
                      onClose={() => handleClose()}>
                      <MenuItem onClick={() => setOpenImport(true)}>
                        <SaveAlt color='primary' /> &ensp;Import Price Quote
                      </MenuItem>
                      <MenuItem onClick={() => setOpenExport(true)}>
                        <UploadFile color='primary' /> &ensp;Export Price Quote
                      </MenuItem>
                      <MenuItem onClick={() => setRefresh()}>
                        <Cached color='primary' />
                        &ensp; Refresh List
                      </MenuItem>
                    </Menu>
                    {/* {!viewPriceQuotes && (
											<IconButton
												size='medium'
												router
												sx={{
													marginLeft: '10px',
													borderRadius: '5px',
													backgroundColor: '#ED6C02',
													color: 'white',
													'&:hover': { backgroundColor: '#FC8F31' },
												}}
											>
												<QuestionMarkIcon />
											</IconButton>
										)} */}
                  </Grid>
                </>
              </Grid>
            )}
          </HeaderPaper>
          <DataTableContainer>
            <DataTable
              columns={viewPriceQuotes ? collapsedColumns : intialColumns}
              api={getAllEstimatesListApi}
              setSelectedRows={setSelectedRows}
              refresh={refresh}
              onRowClick={handleRowClick}
              collapsed={viewPriceQuotes}
              manualFilter
              // enableRowSelection={isRowSelectable}
              enableRowSelection={false}
            />
          </DataTableContainer>
        </TableGrid>
        {viewPriceQuotes && (
          <Grid item sm={8.5}>
            <DetailViewContainer>
              <ViewPriceQuote
                id={id}
                setRefresh={setRefresh}
                setViewPriceQuotes={setViewPriceQuotes}
              />
            </DetailViewContainer>
          </Grid>
        )}
      </Grid>

      {/* delete confirmation box  */}
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
        importApi={importEstimate}
        setRefresh={setRefresh}
      />
      <ExportFileModal
        isOpen={openExport}
        onClose={() => setOpenExport(false)}
        exportApi={exportEstimate}
      />
    </>
  );
};

export default PriceQuoteTable;
