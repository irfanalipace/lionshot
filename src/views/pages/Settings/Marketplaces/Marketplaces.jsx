import React, { useEffect, useState } from 'react';
import CachedIcon from '@mui/icons-material/Cached';

import {
  Box,
  IconButton,
  Grid,
  Button,
  Divider,
  ListItemIcon,
  Stack,
  ButtonGroup,
  Typography,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  KeyboardArrowDown,
  MailOutline,
  MoreHoriz,
  QuestionMark
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
//   import HeaderPaper from '../../../../Components/Containers/HeaderPaper';
import useHash from '../../../../core/hooks/useHash';
import {
  extractNumberFromHash,
  generateEncryptedID
} from '../../../../core/utils/helpers';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import DataTableContainer from '../../../Components/Containers/DataTableContainer';
import DataTable from '../../../Components/DataTable/DataTable';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import MUIButton from '../../../Components/Button/MUIButton';
import { styled } from '@mui/material/styles';
import { formatDate } from '../../../../core/utils/helpers';
const CustomMUIButton = styled(MUIButton)(({ theme, viewItem }) => ({
  fontSize: viewItem ? '0.75rem' : '1rem',
  width: viewItem ? '55%' : '70%',
  height: viewItem ? '30px' : '35px',
  padding: '8px 16px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}));

import {
  BulkUpdateStatusMarketplace,
  getAllMarketplacesApi,
  bulkDeleteMarketplace,
  deleteMarketplace
} from '../../../../core/api/marketplaces';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
const Marketplaces = () => {
  const [id, setId] = useState(null);
  const [viewItem, setViewItem] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);

  const navigate = useNavigate();

  const [hash, setHash] = useHash();

  const intialColumns = [
    {
      accessorKey: 'name',
      header: 'Name'
      //      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    },
    // {
    // 	accessorKey: 'status',
    // 	header: 'Status ',
    // 	Cell: ({ row }) => (
    // 		<span>{row.original.status === 1 ? 'Active' : 'Inactive'}</span>
    // 	),
    // },
    {
      accessorKey: 'total_item',
      header: 'Total Items'
    },
    {
      accessorKey: 'url',
      header: 'Url'
    },
    {
      accessorKey: 'last_sync',
      header: 'Last Sync',
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
      accessorKey: 'sync',
      header: 'Sync',
      Cell: () => (
        <Box>
          <Button
            onClick={e => {
              e.stopPropagation();
            }}>
            <CachedIcon />
          </Button>
        </Box>
      )
    },
    {
      accessorKey: ' ',
      header: 'ACTIONS',
      enableColumnActions: false,
      enableColumnFilter: false,
      enableColumnOrdering: false,
      enableSorting: false,
      size: 200,
      Cell: ({ row }) => (
        <Box>
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
          <IconButton
            onClick={e => handleEditModal(e, row?.original.id)}
            variant='outlined'>
            <Edit fontSize='small' color='primary' />
          </IconButton>
        </Box>
      )
    }
  ];
  const handleDelete = async Id => {
    try {
      console.log('idd', Id);
      await deleteMarketplace(Id);
      setRefresh(prev => prev + 1);
      notyf.success('Marketplace List deleted');
    } catch (error) {
      console.log('error', error);
    }
  };
  const handleEditModal = (e, id) => {
    e.stopPropagation(); // Stop the event from propagating
    navigate(`/marketplaces/edit/${generateEncryptedID(id)}`);
  };
  const [columns, setColumns] = useState(intialColumns);

  const collapsedColumns = [
    {
      accessorKey: 'name',
      header: 'Name'
      //      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    }
  ];

  useEffect(() => {
    const id = extractNumberFromHash(hash);
    setId(id);
    if (id) {
      setColumns(collapsedColumns);
      setViewItem(true);
    } else {
      setColumns(intialColumns);
      setViewItem(false);
    }
  }, [hash]);

  const goBack = () => {
    navigate('/marketplaces');
  };

  const handleRowClick = row => {
    setHash('#/' + row?.id);
  };

  // bulk menu oprn close
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // tansaction menu
  const tansactionOpen = Boolean(anchorE2);
  const handleTransactions = event => {
    setAnchorE2(event.currentTarget);
  };
  const closeTransactions = () => {
    setAnchorE2(null);
  };

  const changingStatus = async status => {
    try {
      await BulkUpdateStatusMarketplace({ ids: selectedRows, action: status });
      notyf.success('Status Updated Successfully');
      setRefresh(prev => prev + 1);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteMarketplace({ ids: selectedRows });
      setRefresh(prev => prev + 1);
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <>
      <Grid container>
        <Grid item sm={viewItem ? 3 : 12}>
          <HeaderPaper sx={{ padding: '10px 20px' }}>
            {selectedRows.length > 0 && (
              <Grid item container>
                <Grid item sm={12}>
                  <Grid item container>
                    <Grid item sm={6} display='flex' alignItems='center'></Grid>
                    <Grid
                      item
                      sm={6}
                      sx={{
                        display: 'flex',
                        justifyContent: 'end',
                        alignItems: 'center'
                      }}>
                      <IconButton
                        //    onClick={goBack}
                        onClick={() =>
                          viewItem
                            ? navigate(`/marketplaces`)
                            : setRefresh(prev => prev + 1)
                        }>
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
                        Marketplaces
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    sm={6}
                    sx={{
                      display: 'flex',
                      justifyContent: 'end',
                      alignItems: 'center'
                    }}>
                    {viewItem ? (
                      <IconButton onClick={goBack}>
                        <CloseIcon />
                      </IconButton>
                    ) : (
                      <MUIButton
                        size='medium'
                        onClick={() => navigate('/marketplaces/new')}
                        variant='contained'>
                        <Add fontSize='small' />
                        New
                      </MUIButton>
                    )}
                  </Grid>
                </>
              </Grid>
            )}
          </HeaderPaper>
          <DataTableContainer>
            <DataTable
              api={getAllMarketplacesApi}
              columns={columns}
              setSelectedRows={setSelectedRows}
              onRowClick={() => {
                '';
              }}
              collapsed={viewItem}
              refresh={refresh}
            />
          </DataTableContainer>
        </Grid>
      </Grid>
      <ConfirmDialog
        title='Are you sure you want to delete'
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        {...dialogProps}
      />
    </>
  );
};

const headerIconButton = {
  backgroundColor: '#EEEEEE',
  border: '1px solid #d1d1d1',
  borderRadius: '4px',
  textTransform: 'none'
};

export default Marketplaces;
