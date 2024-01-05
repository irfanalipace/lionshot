import React, { useEffect, useState } from 'react';
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
  KeyboardArrowDown,
  MailOutline,
  MoreHoriz,
  QuestionMark
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
  getAllCategoriesApi,
  deleteCategoriesApi,
  bulkDeleteCategoriesApi,
  changeStatusCategoriesApi
} from '../../../../core/api/categories';
import { useNavigate } from 'react-router-dom';
//   import HeaderPaper from '../../../../Components/Containers/HeaderPaper';
import useHash from '../../../../core/hooks/useHash';
import { extractNumberFromHash } from '../../../../core/utils/helpers';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import DataTableContainer from '../../../Components/Containers/DataTableContainer';
import DataTable from '../../../Components/DataTable/DataTable';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import MUIButton from '../../../Components/Button/MUIButton';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { Delete } from '@mui/icons-material';
import notyf from 'invoicing/src/Components/NotificationMessage/notyfInstance';

const Categories = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);

  const [id, setId] = useState(null);
  const [viewItem, setViewItem] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});

  const navigate = useNavigate();

  const [hash, setHash] = useHash();

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

  const intialColumns = [
    {
      accessorKey: 'name',
      header: 'Name'
    },

    {
      accessorKey: ' ',
      header: 'ACTIONS',
      enableColumnActions: false,
      enableColumnFilter: false,
      enableColumnOrdering: false,
      enableSorting: false,
      size: 700,
      Cell: ({ row }) => (
        <Box>
          {/* <IconButton
						onClick={e => handleEditModal(e, row?.original.id)}
						variant='outlined'
					>
						<Edit fontSize='small' color='primary' />
					</IconButton> */}
          {/* <IconButton>
						<Typography
							sx={{
								borderRight: '1px solid red',
								padding: '13px',
								marginLeft: '-22px',
							}}
						></Typography>
					</IconButton> */}
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

  const collapsedColumns = [
    {
      accessorKey: 'name',
      header: 'Name'
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
    navigate('/categories');
  };

  const handleRowClick = row => {
    // setHash('#/' + row?.id);
  };
  const handleBulkDelete = async () => {
    try {
      await bulkDeleteCategoriesApi({ ids: selectedRows });
      notyf.success('Selected RowS Deleted');
      setRefresh(prev => prev + 1);
    } catch (err) {
      console.log('err', err);
    }
  };

  // {
  // 	"ids":  [2,4,5],
  // 	"action": "active"      //active or inactive
  // }

  const changingStatus = async status => {
    console.log('slectedrow', selectedRows);
    try {
      await changeStatusCategoriesApi({ ids: selectedRows, action: status });
      notyf.success('Status Updated Successfully');
      setRefresh(prev => prev + 1);
    } catch (error) {}
  };

  // actions
  // const Actions = ({ id }) => {
  // 	const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  // 	const openMenu = event => {
  // 		event.stopPropagation();
  // 		setMenuAnchorEl(event.currentTarget);
  // 	};

  // 	const closeMenu = () => {
  // 		setMenuAnchorEl(null);
  // 	};

  // 	const handleEditClick = e => {
  // 		e.stopPropagation();
  // 		openingEditForm(id);
  // 		closeMenu();
  // 	};

  // 	return (
  // 		<Box className='show-on-hover' sx={{ display: 'none' }}>
  // 			<IconButton
  // 				onClick={openMenu}
  // 				sx={{
  // 					backgroundColor: window.themeColors.primary,
  // 					borderRadius: '18px',
  // 					padding: '2px',
  // 					color: '#fff',
  // 					transition: 'background-color 0.3s',
  // 					'&:hover': {
  // 						background: 'rgb(33,150,243 , 0.8)',
  // 						color: '#fff',
  // 					},
  // 				}}
  // 			>
  // 				<KeyboardArrowDown />
  // 			</IconButton>
  // 			<Menu
  // 				anchorEl={menuAnchorEl}
  // 				open={Boolean(menuAnchorEl)}
  // 				onClose={closeMenu}
  // 			>
  // 				<MenuItem
  // 					onClick={handleEditClick}
  // 					sx={{ width: '150px', display: 'flex', alignItems: 'center' }}
  // 				>
  // 					<EditIcon sx={{ fontSize: '16px', color: window.themeColors.primary }} />
  // 					<Typography sx={{ margin: '0 5px' }}>Edit</Typography>
  // 				</MenuItem>
  // 			</Menu>
  // 		</Box>
  // 	);
  // };
  const openingEditForm = id => {
    navigate(`/categories/edit/${id}`);
  };

  const handleDelete = async catId => {
    try {
      await deleteCategoriesApi(catId);
      notyf.success('List Deleted');
      setRefresh(prev => prev + 1);
    } catch (error) {}
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
                        onClick={() => setRefresh(prev => prev + 1)}>
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
                        Categories
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
                    ) : null}
                  </Grid>
                </>
              </Grid>
            )}
          </HeaderPaper>
          <DataTableContainer>
            <DataTable
              api={getAllCategoriesApi}
              columns={columns}
              setSelectedRows={setSelectedRows}
              onRowClick={handleRowClick}
              collapsed={viewItem}
              refresh={refresh}
              enableRowSelection={false}
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

export default Categories;
