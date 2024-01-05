import { useEffect, useState } from 'react';
import { getAllPayables, exportPayable } from '../../../core/api/payables.js';
import { Box, IconButton, Grid, Typography, Button } from '@mui/material';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton } from '@mui/base/MenuButton';
import { Add, Cached, Close, MoreHoriz, UploadFile } from '@mui/icons-material';
import DataTable from '../../Components/DataTable/DataTable';
import { useNavigate } from 'react-router-dom';

import {
  decryptId,
  extractNumberFromHash,
  formatDate,
  generateEncryptedID
} from '../../../core/utils/helpers';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import {
  StyledListbox,
  HeaderMenuButton,
  StyledMenuItem
} from './PayableStylesConst';
import DataTableContainer from '../../Components/Containers/DataTableContainer';
import DetailViewContainer from '../../Components/Containers/DetailViewContainer';
import ExportFileModal from '../../Components/ExportFileModal/ExportFileModal';
import TableGrid from '../../Components/Containers/TableGrid';
// import AccountPayableView from './AccountPayableView/AccountPayableView';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';

const AccountPayableView = lazy(() =>
  import('./AccountPayableView/AccountPayableView')
);

const AccountPayable = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [openExport, setOpenExport] = useState(false);
  const [viewPayable, setViewPayable] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [id, setId] = useState(null);

  const initialColumns = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      Cell: ({ cell }) => {
        const date = cell.getValue();
        const formatedDate = formatDate(date);
        return <Box component='span'>{formatedDate}</Box>;
      }
    },
    {
      accessorKey: 'payment_number',
      header: 'Payment #'
    },
    {
      accessorKey: 'reference_number',
      header: 'Reference Number'
    },
    {
      accessorKey: 'vendor.display_name',
      header: 'Vendor Name'
    },
    {
      accessorKey: 'mode_of_payment_value',
      header: 'Mode',
      Cell: ({ cell }) => (
        <Typography variant='body2' className='TextCapitalize'>
          {cell.getValue() === 'bank_transfer'
            ? 'Bank Transfer'
            : cell.getValue()}
        </Typography>
      )
    },
    {
      accessorKey: 'payment_paid',
      header: 'Amount',
      Cell: ({ cell }) => (
        <Typography variant='body2'>${cell.getValue()}</Typography>
      )
    }
  ];

  const collapsedColumns = [
    {
      accessorKey: 'display_name',
      header: 'Company Name',
      Cell: ({ row }) => {
        const wholeData = row?.original;
        return (
          <Box>
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Grid item x={6}>
                <Typography variant='subtitle2' color={'primary'}>
                  {wholeData?.vendor?.display_name}
                </Typography>
                <Typography
                  component='span'
                  variant='body2'
                  sx={{ fontSize: '12px' }}>
                  {formatDate(wholeData?.created_at)}
                </Typography>
              </Grid>
              <Grid item x={6} sx={{ textAlign: 'right' }}>
                <Typography variant='body2'>
                  ${wholeData?.payment_paid || 0}
                </Typography>
                <Typography variant='caption' className='TextCapitalize'>
                  {wholeData?.payment_mode_value || 'Status: null'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      }
    }
  ];

  const hash = window.location.hash;
  useEffect(() => {
    const id = extractNumberFromHash(hash);
    const decryptedId = decryptId(id);
    setId(decryptedId);
    if (decryptedId) {
      setViewPayable(true);
    } else {
      setViewPayable(false);
    }
  }, [hash]);

  const handleRowClick = row => {
    location.hash = '#/' + generateEncryptedID(row?.id);
  };

  return (
    <>
      <Grid container>
        <TableGrid sm={viewPayable ? 3.2 : 12}>
          <HeaderPaper>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ display: 'flex', alignItems: 'center', paddingY: '1px' }}>
              <Grid item xs={8}>
                <Dropdown>
                  <MenuButton
                    onClick={e => e.stopPropagation()}
                    style={{ backgroundColor: 'transparent', border: 'none' }}>
                    <Typography noWrap variant='h6' className='TextCapitalize'>
                      All Payables
                      {/* <ArrowDropDown sx={{ margin: '0 -5px -5px 0' }} /> */}
                    </Typography>
                  </MenuButton>
                  {/* <Menu slots={{ listbox: StyledListbox }}>
										<StyledMenuItem> All Payments</StyledMenuItem>
										<StyledMenuItem> Retainer Payments</StyledMenuItem>
										<StyledMenuItem> Invoice Payments</StyledMenuItem>
										<StyledMenuItem> Inactive Payables</StyledMenuItem>
										<StyledMenuItem
											sx={{ color: window.themeColors.primary }}
											onClick={e => {
												e.stopPropagation();
												navigate('/account-payable/new');
											}}
										>
											<Add />
											New Payable View
										</StyledMenuItem>
									</Menu> */}
                </Dropdown>
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
                      onClick={() => navigate('/account-payable/new')}
                      variant='contained'
                      sx={{ minWidth: '0', padding: '5px 7px' }}>
                      <Add fontSize='small' />
                      {!viewPayable && 'New'}
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
                          {/* <StyledMenuItem onClick={() => setOpenImport(true)}>
														<SaveAlt /> Import Payables
													</StyledMenuItem> */}
                          <StyledMenuItem onClick={() => setOpenExport(true)}>
                            <UploadFile /> Export Payables
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
              api={getAllPayables}
              columns={viewPayable ? collapsedColumns : initialColumns}
              setSelectedRows={setSelectedRows}
              onRowClick={handleRowClick}
              collapsed={viewPayable}
              refresh={refresh}
              manualFilter
              enableRowSelection={false}
            />
          </DataTableContainer>
        </TableGrid>
        {viewPayable && (
          <Grid item sm={8.7} sx={{ marginLeft: '10px' }}>
            <DetailViewContainer>
              <AccountPayableView
                id={id}
                refreshList={() => setRefresh(prev => prev + 1)}
              />
            </DetailViewContainer>
          </Grid>
        )}
      </Grid>
      <ExportFileModal
        isOpen={openExport}
        onClose={() => setOpenExport(false)}
        exportApi={exportPayable}
      />
    </>
  );
};

export default AccountPayable;
