import { lazy, useEffect, useRef, useState } from 'react';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import Add from '@mui/icons-material/Add';
import MUIButton from '../../../Components/Button/MUIButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import useTheme from '@mui/material/styles/useTheme';
import DataTableContainer from '../../../Components/Containers/DataTableContainer';
import DataTable from '../../../Components/DataTable/DataTable';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import TableGrid from 'components/Containers/TableGrid';
import Name from '../../../Components/InputLabel/Name';
import {
  StatusColor,
  extractNumberFromHash,
  formatDate,
  generateEncryptedID
} from '../../../../core/utils/helpers';
const RefundRequestView = lazy(() => import('./RefundRequestView'));
import DetailViewContainer from '../../../Components/Containers/DetailViewContainer';
import { useNavigate, useParams } from 'react-router-dom';
import ImportFileModal from '../../../Components/ImportFileModal/ImportFileModal';
import ExportFileModal from '../../../Components/ExportFileModal/ExportFileModal';
import { getAllRefundRequestsListApi } from '../APIs/CustomerPortalAPIs';

const RefundRequests = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const theme = useTheme();
  const customerRef = useRef({
    customer_id: customerId
  });

  const intialColumns = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      Cell: ({ renderedCellValue }) => <>{formatDate(renderedCellValue)}</>
    },
    {
      accessorKey: 'credit_memo_number',
      header: 'Credit Memos',
      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    },
    // {
    // 	header: 'Customer Name',
    // 	Cell: ({ renderedCellValue, row }) => (
    // 		<>{row?.original?.customer?.display_name}</>
    // 	),
    // },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ renderedCellValue }) => {
        const estStatusColor = StatusColor(renderedCellValue, theme);
        return (
          <Typography
            variant='caption'
            sx={{ color: estStatusColor }}
            textTransform={'uppercase'}>
            {renderedCellValue}
          </Typography>
        );
      }
    },
    {
      accessorKey: 'invoice',
      header: 'Invoice',
      Cell: ({ renderedCellValue }) => <>{renderedCellValue.invoice_number}</>
    },
    {
      accessorKey: 'tax_amount',
      header: 'Amount to Return',
      Cell: ({ renderedCellValue }) => <>${renderedCellValue}</>
    },
    {
      accessorKey: 'total',
      header: 'Balance',
      Cell: ({ renderedCellValue }) => <>${renderedCellValue}</>
    }
  ];
  const [viewOrders, setViewOrders] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [columns, setColumns] = useState(intialColumns);
  const [openImport, setOpenImport] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [id, setId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const hash = window.location.hash;

  const handleRowClick = row => {
    location.hash = '#/' + generateEncryptedID(row?.id);
  };

  const collapsedColumns = [
    {
      accessorKey: ' ',
      header: ' ',
      Cell: ({ row }) => {
        const estStatusColor = StatusColor(row?.original?.status, theme);
        return (
          <Box>
            <Grid container justifyContent={'space-between'}>
              <Typography variant='subtitle2'>
                {row?.original?.customer?.display_name}
              </Typography>
              <Typography
                variant='caption'
                sx={{ color: estStatusColor, textTransform: 'uppercase' }}>
                {row?.original?.status}
              </Typography>
            </Grid>
            <Grid container justifyContent={'space-between'}>
              <Box>
                <Typography
                  component='span'
                  sx={{ fontSize: '12px', color: window.themeColors.primary }}>
                  {row?.original?.credit_memo_number}{' '}
                </Typography>
                <Typography component='span' sx={{ fontSize: '12px' }}>
                  | {formatDate(row?.original?.created_at)}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '12px' }} variant='subtitle1'>
                ${row?.original?.total || 0}
              </Typography>
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

  return (
    <>
      <Grid container>
        <TableGrid sm={viewOrders ? 3.2 : 12}>
          <HeaderPaper sx={{ padding: '10px 20px' }}>
            <Grid item container>
              <>
                <Grid sm={6} display='flex' alignItems='center'>
                  <Stack
                    direction='row'
                    display='flex'
                    alignItems='center'
                    spacing={0}>
                    <Typography
                      variant='h6'
                      component='span'
                      fontSize={viewOrders && 15}>
                      All Refund Requests
                    </Typography>
                  </Stack>
                </Grid>
                <Grid
                  sm={6}
                  display='flex'
                  justifyContent='end'
                  alignItems='center'
                  spacing={2}>
                  <MUIButton
                    size='medium'
                    onClick={() =>
                      navigate(
                        `/customer-portal/${customerId}/refund-request/new`
                      )
                    }
                    variant='contained'>
                    <Add fontSize='small' />
                    New
                  </MUIButton>
                  {/* <CreditMoreOpt
										refreshList={() => setRefresh(prev => prev + 1)}
										setOpenImport={() => setOpenImport(true)}
										setOpenExport={() => setOpenExport(true)}
										title={"Refund Requests"}
									/> */}
                </Grid>
              </>
            </Grid>
          </HeaderPaper>

          <DataTableContainer>
            <DataTable
              api={getAllRefundRequestsListApi}
              extraParams={customerRef.current}
              columns={columns}
              setSelectedRows={setSelectedRows}
              onRowClick={handleRowClick}
              collapsed={viewOrders}
              refresh={refresh}
              manualFilter
            />
          </DataTableContainer>
        </TableGrid>
        {viewOrders && (
          <Grid item sm={8.7} sx={{ marginLeft: '10px' }}>
            <DetailViewContainer>
              <RefundRequestView id={id} />
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
        // importApi={importSaleOrder}
      />
      <ExportFileModal
        isOpen={openExport}
        onClose={() => setOpenExport(false)}
        // exportApi={exportSaleOrder}
      />
    </>
  );
};

export default RefundRequests;
