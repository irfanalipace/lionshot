import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import useHash from '../../../../../core/hooks/useHash';
import DataTable from '../../../../Components/DataTable/DataTable';
import HeaderPaper from '../../../../Components/Containers/HeaderPaper';
import {
  extractNumberFromHash,
  snakeCaseToPrettyText
} from '../../../../../core/utils/helpers';
import MuiAlert from '@mui/material/Alert';
import {
  bulkdeletePriceListApi,
  getAllItemPriceList
} from '../../../../../core/api/items';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';

import DetailViewContainer from '../../../../Components/Containers/DetailViewContainer';

import ConfirmDialog from '../../../../Components/ConfirmDialog/ConfirmDialog';
import {
  ArrowDropDown,
  Cached,
  Close,
  Edit,
  KeyboardArrowDown,
  Mail,
  MailOutline,
  MoreHoriz,
  Print,
  QuestionMark,
  SaveAlt,
  Settings,
  UploadFile
} from '@mui/icons-material';

import {
  HeaderMenuButton,
  StyledMenuItem,
  StyledListbox,
  TriggerButton,
  headerIconButton,
  headerMenuBox
} from '../../../Customer/CustomerStylesConst';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {
  IconButton,
  Grid,
  Button,
  Divider,
  ListItemIcon,
  Stack,
  ButtonGroup,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';

import {
  // ... other imports ...
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions

  // ... other imports ...
} from '@mui/material';

import CachedIcon from '@mui/icons-material/Cached';
import { Delete } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MUIButton from '../../../../Components/Button/MUIButton';
import Add from '@mui/icons-material/Add';
import { Menu as DropMenu } from '@mui/base/Menu';
import ViewHeadline from '@mui/icons-material/ViewHeadline';
import { Dropdown } from '@mui/base/Dropdown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MenuButton } from '@mui/base/MenuButton';
import { menuItemClasses } from '@mui/base/MenuItem';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import { deletePriceItem } from '../../../../../core/api/items';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import ModelBody from '../ExportModule/ModelBody';
import TitleDropMenu from '../../../../Components/TitleDropMenu/TitltDropMenu.';
import CustomerListViewDetails from '../../../Customer/CustomerListViewDetails';
import notyf from '../../../../Components/NotificationMessage/notyfInstance';
import PriceListDropdown from '../../../../Components/PriceListDropdown/PriceListDropdown';
import DataTableContainer from '../../../../Components/Containers/DataTableContainer';

function PriceListTable() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [priceList, setpriceList] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [id, setId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});

  const [anchorE2, setAnchorE2] = useState(null);
  const openMore = Boolean(anchorE2);

  const handleMoreClick = event => {
    setAnchorE2(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorE2(null);
  };

  const [isExportDialogOpen, setExportDialogOpen] = useState(false);

  const handleExportClick = () => {
    setExportDialogOpen(true);
  };

  const handleExportDialogClose = () => {
    setExportDialogOpen(false);
  };

  const handleEdit = id => {
    // Handle edit action for the row at the specified index
    navigate(`price-lists/edit/${id}`);
  };

  const handleDelete = async itemId => {
    try {
      await deletePriceItem(itemId);
      notyf.success('Price List deleted');
      setRefresh(prev => prev + 1);
    } catch (error) {}
  };

  const intialColumns = [
    {
      accessorKey: 'description, name',
      header: 'NAME AND DESCRIPTION',
      Cell: ({ row }) => (
        <>
          <Typography color='primary'>
            {' '}
            {snakeCaseToPrettyText(row.original.name)}
          </Typography>{' '}
          <Typography variant='body2'>
            {snakeCaseToPrettyText(row.original.description)}
          </Typography>
        </>
      )
    },

    {
      accessorKey: 'currency.code',
      header: 'CURRENCY'
    },
    {
      accessorKey: 'percentage,percentage_type',
      header: 'DETAILS',
      Cell: ({ row }) => (
        <Typography variant='body2' color='primary' sx={{ color: 'black' }}>
          {`${row.original.percentage}%`}{' '}
          {snakeCaseToPrettyText(row.original.percentage_type)}
        </Typography>
      )
    },
    // {
    //     accessorKey: 'round_off',
    //     header: 'ROUNDING'
    // },

    {
      accessorKey: ' ',
      header: 'ACTIONS',
      enableColumnActions: false,
      enableColumnFilter: false,
      enableColumnOrdering: false,
      enableSorting: false,
      size: 100,
      Cell: ({ row }) => (
        <Box>
          <IconButton
            onClick={e => handleEditModal(e, row?.original.id)}
            variant='outlined'>
            <Edit fontSize='small' color='primary' />
          </IconButton>
          <IconButton>
            <Typography
              sx={{
                borderRight: '1px solid red',
                padding: '13px',
                marginLeft: '-22px'
              }}></Typography>
          </IconButton>
          {/* <Button variant="outlined" onClick={() => handleView(row.original.id)} sx={{ height: '34px', fontSize: "12px", padding: '5px', border: 'none', '&:hover': { background: 'rgb(242, 242, 242)', border: 'none' } }}>Mark as Activate</Button> */}
          <IconButton
            variant='outlined'
            onClick={e => {
              e.stopPropagation();
              setOpenConfirmDialog(true);
              setDialogProps({
                onConfirm: () => handleDelete(row.original.id)
              });
            }}>
            <Delete sx={{ color: 'red' }} fontSize='small' />
          </IconButton>
        </Box>
      )
    }
  ];

  const [columns, setColumns] = useState(intialColumns);
  const [hash, setHash] = useHash();

  useEffect(() => {
    const id = extractNumberFromHash(hash);
    setId(id);
    if (id) {
      setColumns();
      setpriceList(true);
    } else {
      setColumns(intialColumns);
      setpriceList(false);
    }
  }, [hash]);

  const handleEditModal = id => {
    // if (e === null && typeof e === "undefined") {
    //   e.stopPropagation();
    // }
    navigate(`/price-lists/edit/${id}`);
  };

  const handleDeleteModal = params => {
    console.log('id: ' + params.id);
  };

  const handleRowClick = row => {
    handleEditModal(row.id);
  };

  const handleBulkDelete = async () => {
    const selectedRowIds = selectedRows.map(row => Number(row));
    try {
      await bulkdeletePriceListApi({ ids: selectedRowIds });
      setRefresh(prev => prev + 1);
      notyf.success('Select Prices Deleted');
    } catch (err) {
      console.log('err', err);
    }
  };

  // const CustomerCard = () => (
  //   <>
  //     <Box sx={{}}>
  //       <Typography variant='body1bold' color='primary'>
  //         {/* {data?.description} */}
  //       </Typography>
  //       <Typography variant='body2'>Descriptions </Typography>
  //     </Box>
  //   </>
  // );

  const extraParams = {
    name: 'test'
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false); // State variable for Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const [activeStatus, setActiveStatus] = useState(false); // State variable for "active" status

  // ... (previous code)

  const handleView = () => {
    // Update the "active" status
    setActiveStatus(true);

    // Display the Snackbar message
    setSnackbarOpen(true);
    setSnackbarMessage('Item marked as Active');
  };
  const [showMenuItem, setShowMenu] = useState(null);

  const showingMenu = event => {
    setShowMenu(event.currentTarget);
  };
  const hidingMenu = () => {
    setShowMenu(null);
  };
  // const Actions = ({ id }) => {
  //   return (
  //     <Box
  //       className='show-on-hover'
  //       sx={{ display: "none" }}
  //       // sx={{ textAlign:'right',marginRight:'80px' }}
  //     >
  //       <Dropdown>
  //         <TriggerButton onClick={(e) => e.stopPropagation()}>
  //           <KeyboardArrowDown />
  //         </TriggerButton>
  //         <Menu slots={{ listbox: StyledListbox }}>
  //           <StyledMenuItem onClick={(e) => handleEditModal(e, row?.id)}>
  //             <Edit /> Edit
  //           </StyledMenuItem>
  //           <StyledMenuItem
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               setOpenConfirmDialog(true);
  //               setDialogProps({
  //                 onConfirm: () => handleDeleteModal({id}),
  //               });
  //             }}>
  //             <MailOutline />
  //           </StyledMenuItem>
  //         </Menu>
  //       </Dropdown>
  //     </Box>
  //   );
  // };

  return (
    <>
      <Grid container>
        <Grid
          item
          sm={priceList ? 3.2 : 12}
          // sx={{ height: 'calc(100vh - 85px)', overflow: 'hidden' }}
        >
          <HeaderPaper>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={7}>
                {selectedRows.length > 0 ? (
                  <Box sx={headerMenuBox}>
                    {/* <IconButton sx={headerIconButton}>
											<Mail />
										</IconButton>
										<IconButton sx={headerIconButton}>
											<Print />
										</IconButton> */}
                    <Button
                      sx={headerIconButton}
                      style={{
                        color: 'black',
                        margin: '0 10px',
                        fontSize: '12px'
                      }}
                      onClick={() => {
                        hidingMenu(); // Close the Menu
                        setOpenConfirmDialog(true); // Open the confirmation dialog
                        setDialogProps({
                          onConfirm: handleBulkDelete
                        });
                      }}>
                      Delete
                    </Button>
                    {/* <Button
											sx={headerIconButton}
											style={{ color: 'black', margin: '0 10px' }}>
											Bulk Update
										</Button> */}
                    {/* <IconButton
											onClick={showingMenu}
											sx={{
												...headerIconButton,
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
												onClick={() => {
													hidingMenu(); // Close the Menu
													setOpenConfirmDialog(true); // Open the confirmation dialog
													setDialogProps({
														onConfirm: handleBulkDelete,
													});
												}}
												sx={{ padding: '2px 4px', borderRadius: '4px' }}>
												<MUIButton size='medium' fullWidth>
													Delete
												</MUIButton>
											</MenuItem>
										</Menu> */}
                  </Box>
                ) : (
                  <PriceListDropdown title={'All Price Lists'} />
                )}
              </Grid>
              <Grid item xs={5} sx={{ textAlign: 'right' }}>
                {selectedRows.length > 0 ? (
                  <IconButton onClick={() => setRefresh(prev => prev + 1)}>
                    <Close />
                  </IconButton>
                ) : (
                  <Box>
                    <MUIButton
                      size='medium'
                      onClick={() => navigate('/price-lists/new')}
                      variant='contained'>
                      <Add fontSize='small' sx={{ marginRight: '12px' }} /> NEW
                      PRICE LIST
                    </MUIButton>
                    <Button
                      onClick={event => handleMoreClick(event)}
                      sx={{
                        '&:hover': { background: 'white' },
                        border: '1px solid #1565c0',
                        minWidth: '0px',
                        padding: '3px',
                        marginLeft: '8px'
                      }}>
                      <ViewHeadlineIcon />
                    </Button>
                    <DropMenu>
                      <Menu
                        anchorEl={anchorE2}
                        id='other-menu'
                        open={openMore}
                        onClose={handleMoreClose}
                        onClick={handleMoreClose}
                        transformOrigin={{
                          horizontal: 'center',
                          vertical: 'top'
                        }}
                        anchorOrigin={{
                          horizontal: 'left',
                          vertical: 'bottom'
                        }}>
                        <MenuItem
                          onClick={() => navigate('/import-sales-price/new')}>
                          <ListItemIcon>
                            <SaveAltIcon />
                          </ListItemIcon>
                          Import Sales Price List
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            navigate('/import-purchase-price/new')
                          }>
                          <ListItemIcon>
                            <SaveAltIcon />
                          </ListItemIcon>
                          Import Purchase Price List
                        </MenuItem>
                        <Divider />
                        <MenuItem>
                          <ListItemIcon>
                            <UploadFileIcon />
                          </ListItemIcon>
                          Export Sales Price List
                        </MenuItem>

                        <MenuItem onClick={handleExportClick}>
                          <ListItemIcon>
                            <UploadFileIcon />
                          </ListItemIcon>
                          Export Purchase Price List
                        </MenuItem>
                        <Divider />
                        <MenuItem>
                          <ListItemIcon>
                            <SettingsIcon />
                          </ListItemIcon>
                          Disable Price List
                        </MenuItem>
                      </Menu>
                    </DropMenu>
                    <ModelBody
                      open={isExportDialogOpen}
                      onClose={handleExportDialogClose}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </HeaderPaper>
          <DataTableContainer>
            <DataTable
              api={getAllItemPriceList}
              columns={columns}
              setSelectedRows={setSelectedRows}
              onRowClick={handleRowClick}
              extraParams={extraParams}
              // collapsed={priceList}
              refresh={refresh}
            />
          </DataTableContainer>
        </Grid>
        {priceList && (
          <Grid item sm={8.7} sx={{ marginLeft: '10px' }}>
            <DetailViewContainer>
              {/* <CustomerListViewDetails id={id} setRefresh={setRefresh} /> */}
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
    </>
  );
}
export default PriceListTable;
