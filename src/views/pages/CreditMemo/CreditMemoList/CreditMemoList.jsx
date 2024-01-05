import { useEffect, useState } from 'react';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import { Add } from '@mui/icons-material';
import MUIButton from '../../../Components/Button/MUIButton';
import { Box, Grid, Typography, Stack } from '@mui/material';
import DataTableContainer from '../../../Components/Containers/DataTableContainer';
import DataTable from '../../../Components/DataTable/DataTable';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import Name from '../../../Components/InputLabel/Name';
import {
  StatusColor,
  extractNumberFromHash,
  formatDate,
  generateEncryptedID,
  snakeCaseToPrettyText
} from '../../../../core/utils/helpers';
import DetailViewContainer from '../../../Components/Containers/DetailViewContainer';
import { useNavigate } from 'react-router-dom';
import ImportFileModal from '../../../Components/ImportFileModal/ImportFileModal';
import ExportFileModal from '../../../Components/ExportFileModal/ExportFileModal';
import {
  exportCreditMemo,
  getAllCreditMemo,
  importCreditMemo
} from '../../../../core/api/creditmemo';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';
//import CreditMemoView from '';
import CreditMoreOpt from '../CreditMoreOpt';
import { useTheme } from '@emotion/react';
const CreditMemoView = lazy(() => import('../CreditMemoView/CreditMemoView'));

const CreditMemoList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const initialColumns = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      Cell: ({ renderedCellValue }) => <>{formatDate(renderedCellValue)}</>
    },
    {
      accessorKey: 'credit_memo_number',
      header: 'Credit Notes',
      Cell: ({ renderedCellValue, row }) => <Name>{renderedCellValue}</Name>
    },
    // {
    // 	accessorKey: 'reference_number',
    // 	header: 'Reference#',
    // },
    {
      header: 'Customer Name',
      Cell: ({ renderedCellValue, row }) => (
        <>{row?.original?.customer?.display_name}</>
      )
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
      accessorKey: 'invoice',
      header: 'Invoice',
      Cell: ({ renderedCellValue }) => <>{renderedCellValue.invoice_number}</>
    },
    {
      accessorKey: 'tax_amount',
      header: 'Amount',
      Cell: ({ renderedCellValue }) => <>${renderedCellValue}</>
    },
    {
      accessorKey: 'total',
      header: 'Balance',
      Cell: ({ renderedCellValue }) => <>${renderedCellValue}</>
    }
  ];
  const [viewCredit, setViewCredit] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [refresh, setRefresh] = useState(0);
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
      accessorKey: 'customer',
      header: 'Company Name',
      Cell: ({ row }) => {
        const estStatusColor = StatusColor(row?.original?.status, theme);
        return (
          <Box>
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Grid item x={6}>
                <Typography variant='subtitle2'>
                  {row?.original?.customer?.display_name}
                </Typography>
                <Typography
                  component='span'
                  sx={{ fontSize: '12px', color: window.themeColors.primary }}>
                  {row?.original?.credit_memo_number} |{' '}
                </Typography>
                <Typography component='span' sx={{ fontSize: '12px' }}>
                  {formatDate(row?.original?.created_at)}
                </Typography>
              </Grid>
              <Grid item x={6} sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: '12px' }} variant='subtitle1'>
                  ${row?.original?.total || 0}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{ color: estStatusColor }}
                  textTransform={'uppercase'}>
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
      setViewCredit(true);
    } else {
      setViewCredit(false);
    }
  }, [hash]);

  return (
    <>
      <Grid container>
        <Grid item sm={viewCredit ? 3 : 12}>
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
                      fontSize={viewCredit && 15}>
                      All Credit Memos
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
                    onClick={() => navigate('/credit-memo/new')}
                    variant='contained'>
                    <Add fontSize='small' />
                    New
                  </MUIButton>{' '}
                  <CreditMoreOpt
                    refreshList={() => setRefresh(prev => prev + 1)}
                    setOpenImport={() => setOpenImport(true)}
                    setOpenExport={() => setOpenExport(true)}
                    title={'Credit Memos'}
                  />
                </Grid>
              </>
            </Grid>
          </HeaderPaper>

          <DataTableContainer>
            <DataTable
              api={getAllCreditMemo}
              columns={viewCredit ? collapsedColumns : initialColumns}
              setSelectedRows={setSelectedRows}
              onRowClick={handleRowClick}
              collapsed={viewCredit}
              refresh={refresh}
              enableRowSelection={false}
              manualFilter
            />
          </DataTableContainer>
        </Grid>
        {viewCredit && (
          <Grid item sm={8.9} sx={{ marginLeft: '10px' }}>
            <DetailViewContainer>
              <CreditMemoView id={id} setRefresh={setRefresh} />
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
        importApi={importCreditMemo}
        setRefresh={setRefresh}
      />
      <ExportFileModal
        isOpen={openExport}
        onClose={() => setOpenExport(false)}
        exportApi={exportCreditMemo}
      />
    </>
  );
};

export default CreditMemoList;
