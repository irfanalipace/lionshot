import { Box, Grid, IconButton, Menu, Typography } from '@mui/material';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import MUIButton from '../../Components/Button/MUIButton';
import DetailViewContainer from '../../Components/Containers/DetailViewContainer';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { SaveAlt, UploadFile } from '@mui/icons-material';
import DataTable from '../../Components/DataTable/DataTable';
import {
  exportVendorCredits,
  getAllVendorCredits
} from '../../../core/api/vendorcredits';
import {
  StatusColor,
  // EstimateStatusColor,
  extractNumberFromHash,
  formatDate,
  generateEncryptedID,
  snakeCaseToPrettyText
} from '../../../core/utils/helpers';
//import ViewVendorCredits from './ViewVendorCredits';
import { useTheme } from '@emotion/react';
import { Dropdown, MenuButton } from '@mui/base';
import {
  HeaderMenuButton,
  StyledListbox,
  StyledMenuItem,
  headerMenuBox
} from './VendorStyles';
import { Close } from '@mui/icons-material';
import { MoreHoriz } from '@mui/icons-material';
import { Cached } from '@mui/icons-material';
import ExportFileModal from '../../Components/ExportFileModal/ExportFileModal';
import DataTableContainer from '../../Components/Containers/DataTableContainer';
import { DownloadOutlined } from '@mui/icons-material';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';
const ViewVendorCredits = lazy(() => import('./ViewVendorCredits'));

const VendorCredits = () => {
  const initialColumns = [
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
      accessorKey: 'vendor_credit_number',
      header: 'Vendor Credit',
      Cell: ({ renderedCellValue }) => {
        return (
          <Typography variant='body2' color={theme.palette.primary.main}>
            {renderedCellValue}
          </Typography>
        );
      }
    },
    {
      header: 'RMA Number',
      accessorKey: 'rmi_number'
    },

    {
      accessorKey: 'vendor.display_name',
      header: 'Vendor Name'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ renderedCellValue }) => {
        return (
          <Typography
            variant='body2'
            sx={{ color: StatusColor(renderedCellValue, theme) }}>
            {snakeCaseToPrettyText(renderedCellValue)}
          </Typography>
        );
      }
    },
    {
      accessorKey: 'bill.bill_number',
      header: 'Bill#'
    },
    {
      accessorKey: 'total',
      header: 'Amount',
      Cell: ({ renderedCellValue }) => {
        return <Typography variant='body2'>${renderedCellValue}</Typography>;
      }
    }
    // {
    //   accessorKey: 'balance',
    //   header: 'Balance',
    //   Cell: ({ renderedCellValue }) => {
    //     return (
    //       <Typography variant='body2' >
    //         ${renderedCellValue}
    //       </Typography>
    //     );
    //   }
    // }
  ];
  const [viewVendorCredits, setViewVendorCredits] = useState(false);
  const [refresh, setRefresh] = useState();
  const [openExport, setOpenExport] = useState(false);

  const [id, setId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const hash = window.location.hash;

  const moreList = [
    {
      name: 'Import Vendor Credits',
      icon: <SaveAlt sx={{ color: window.themeColors.primary }} />,
      onClick: () => console.log('import')
    },
    {
      name: 'Export Vendor Credits',
      icon: <UploadFile sx={{ color: window.themeColors.primary }} />,
      onClick: () => console.log('export')
    }
  ];

  const handleRowClick = row => {
    location.hash = '#/' + generateEncryptedID(row?.id);
  };

  const collapsedColumns = [
    {
      accessorKey: 'customer',
      header: 'Company Name',
      Cell: ({ row }) => {
        const estStatusColor = StatusColor(row?.original?.status, theme);
        return (
          <Box>
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Grid item x={6}>
                <Typography
                  variant='subtitle2'
                  sx={{ color: window.themeColors.primary }}>
                  {row?.original?.vendor?.display_name}
                </Typography>
                <Typography component='span' fontSize={12}>
                  {row?.original?.vendor_credit_number} |{' '}
                  {formatDate(row?.original?.created_at)}
                </Typography>
              </Grid>
              <Grid item x={6} sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: '12px' }} variant='subtitle1'>
                  ${row?.original?.total || 0}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ color: estStatusColor, textTransform: 'uppercase' }}>
                  {row?.original?.status}
                </Typography>
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
      setViewVendorCredits(true);
    } else {
      setViewVendorCredits(false);
    }
  }, [hash]);
  return (
    <>
      <Grid container>
        <Grid item sm={viewVendorCredits ? 3 : 12}>
          <HeaderPaper>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ display: 'flex', alignItems: 'center', paddingY: '1px' }}>
              <Grid item xs={8}>
                {selectedRows.length > 0 ? (
                  <Box sx={headerMenuBox}>
                    {/* <Button
											sx={headerIconButton}
											onClick={() => {
												setOpenConfirmDialog(true);
												setDialogProps({
													onConfirm: handleBulkDelete,
												});
											}}
										>
											<Delete /> {''}Delete
										</Button>
								 */}
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
                        All Vendor Credits
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
                    <MUIButton
                      size='medium'
                      onClick={() => navigate('/vendor-credits/new')}
                      variant='contained'
                      sx={{ minWidth: '0', padding: '5px 7px' }}>
                      <Add fontSize='small' />
                      {!viewVendorCredits && 'New'}
                    </MUIButton>
                    {!viewVendorCredits && (
                      <MUIButton
                        size='medium'
                        onClick={() => setOpenExport(true)}
                        variant='outlined'
                        sx={{
                          minWidth: '0',
                          padding: '5px 7px',
                          marginLeft: '5px'
                        }}>
                        <DownloadOutlined fontSize='small' />
                        Export
                      </MUIButton>
                    )}

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
													<StyledMenuItem onClick={() => setOpenExport(true)}>
														<UploadFile /> Export Vendor Credits
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
              api={getAllVendorCredits}
              columns={viewVendorCredits ? collapsedColumns : initialColumns}
              setSelectedRows={() => {}}
              onRowClick={handleRowClick}
              collapsed={viewVendorCredits}
              refresh={refresh}
              enableRowSelection={false}
              manualFilter
              initialState={{
                columnVisibility: { rmi_number: false }
              }}
            />
          </DataTableContainer>
        </Grid>
        {viewVendorCredits && (
          <Grid item sm={8.9} sx={{ marginLeft: '10px' }}>
            <DetailViewContainer>
              <ViewVendorCredits
                id={id}
                refreshList={() => setRefresh(prev => prev + 1)}
              />
            </DetailViewContainer>
          </Grid>
        )}
        <ExportFileModal
          isOpen={openExport}
          onClose={() => setOpenExport(false)}
          exportApi={exportVendorCredits}
        />
      </Grid>
    </>
  );
};

export default VendorCredits;
