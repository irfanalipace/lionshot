import { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { useNavigate, useParams } from 'react-router-dom';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
// import HighlightOff from '@mui/icons-material/HighlightOff';
import {
  decryptId,
  //   downloadFile,
  formatDate
} from '../../../../core/utils/helpers';
import {
  ViewRefundRequest,
  downloadRefundRequestApi,
  getAllRefundHistory
} from '../APIs/CustomerPortalAPIs';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import notyf from '../../../Components/NotificationMessage/notyfInstance';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import MUIButton from '../../../Components/Button/MUIButton';
import ContainerPaper from '../../../Components/Containers/ContainerPaper';
import { TableHeadCell } from '../../../Components/Table/Table';
import ViewTemplates from '../../../Components/ViewTemplate/ViewTemplates';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import notyf from '../../../Components/NotificationMessage/notyfInstance';

const RefundRequestView = ({ id, setRefresh }) => {
  const { customerId } = useParams();

  const [expanded, setExpanded] = useState(false);
  // const [value, setValue] = useState('1');
  const [data, setData] = useState();
  const [refundHistory, setRefundHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const decryptedID = decryptId(id);
  const navigate = useNavigate();

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await ViewRefundRequest({
        customer_id: customerId,
        credit_memo_id: id
      });
      setData(resp?.data);
      getRefundHistory();
    } catch (e) {
      navigate(`/customer-portal/${customerId}/refund-request`);
    } finally {
      setLoading(false);
    }
  };

  const getRefundHistory = async () => {
    try {
      const refundHistory = await getAllRefundHistory({
        customer_id: customerId
      });
      setRefundHistory(refundHistory?.data);
    } catch (error) {}
  };

  const downloadPDF = async () => {
    try {
      let response = await downloadRefundRequestApi({
        customer_id: customerId,
        id: id
      });
      window.open(response?.data?.url);
      //   downloadFile(response?.data?.url);
    } catch (error) {
      notyf.error('Something went wrong');
    }

    // window.open(response.data.url);
  };
  const columns = [
    { id: '', label: 'No.', key: 'index' },
    { id: '', label: 'Items Description', key: 'item_name' },
    { id: '', label: 'Qty', key: 'quantity' },
    // { id: '', label: 'UOM', key: 'uom' },
    { id: '', label: 'Rate(USD)', key: 'rate' },
    { id: '', label: 'Amount(USD)', key: 'total' }
  ];
  const info = [
    { label: 'Refund Request No:', value: data?.credit_memo_number },
    {
      label: 'Refund Request Date:',
      value: formatDate(data?.credit_memo_date)
    }
  ];

  // const deleteCreditMemo = async idDelete => {
  //   try {
  //     // console.log('idDelete', idDelete);
  //     const resp = await deleteCreditMemoAPI(idDelete);
  //     if (resp) {
  //       navigate(`/customer-portal/${customerId}/refund-request`);
  //       notyf.success('Status Successfully changed to Void');
  //       setRefresh(prev => prev + 1);
  //     }
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // };

  return (
    <Box sx={{ position: 'relative' }}>
      <HeaderPaper sx={{ marginBottom: 1 }}>
        <Grid item container>
          <Grid sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6'>{data?.credit_memo_number}</Typography>
          </Grid>
          <Grid
            sm={6}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}>
            <IconButton
              onClick={() =>
                navigate(`/customer-portal/${customerId}/refund-request`)
              }>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </HeaderPaper>

      {/* {data?.status === 'opened' && ( */}
      <Paper sx={{ padding: '1.5rem', mb: 1 }}>
        <MUIButton
          startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
          variant='outlined'
          sx={{ ...BtnStyles }}
          onClick={downloadPDF}>
          Pdf/Print
        </MUIButton>
        {/* {data?.status === 'draft' && (
            <MUIButton
              variant='outlined'
              onClick={() => {
                setOpenConfirmDialog(true);
                setDialogProps({
                  onConfirm: () => deleteCreditMemo(data?.id)
                });
              }}
              startIcon={<HighlightOff />}>
              Void
            </MUIButton>
          )} */}
      </Paper>
      {/* )} */}
      <ContainerPaper sx={{ padding: '1.5rem' }}>
        <Accordion
          sx={{ marginTop: '20px' }}
          expanded={expanded}
          onChange={handleAccordionChange}>
          <AccordionSummary
            expandIcon={
              <PlayArrowIcon
                sx={{
                  color: '#0000008F',
                  transform: expanded ? 'rotate(-90deg)' : 'none'
                }}
              />
            }
            aria-controls='panel2a-content'
            id='panel2a-header'>
            <Grid container>
              <Grid container item sm={11}>
                <Grid item>
                  {' '}
                  <ReceiptIcon sx={{ color: '#0000008F' }} />
                </Grid>
                <Grid item sx={{ padding: '0px 7px' }}>
                  {' '}
                  <Typography variant='body1'>Refund History</Typography>
                </Grid>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container justifyContent='center' alignItems='center'>
              <Grid item sm={12}>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableHeadCell sx={{ padding: '6px 16px' }}>
                        <Typography variant='templateBody2'>Date</Typography>
                      </TableHeadCell>
                      <TableHeadCell sx={{ padding: '6px 16px' }}>
                        <Typography variant='templateBody2'>Invoice</Typography>
                      </TableHeadCell>
                      <TableHeadCell sx={{ padding: '6px 16px' }}>
                        <Typography variant='templateBody2'>
                          Amount Refunded
                        </Typography>
                      </TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {refundHistory?.credit_memo?.map(row => (
                      <TableRow key={row?.id}>
                        <TableHeadCell>
                          <Typography fontSize={13}>
                            {formatDate(row?.created_at)}
                          </Typography>
                        </TableHeadCell>
                        <TableHeadCell>
                          <Typography fontSize={13}>
                            {row?.credit_memo_number}
                          </Typography>
                        </TableHeadCell>
                        <TableHeadCell>
                          <Typography fontSize={13}>${row?.total}</Typography>
                        </TableHeadCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Grid container alignItems='flex-end'>
          <Grid item sm={10}></Grid>
          <Grid item mt={3}>
            {/* <Button startIcon={<DraftsIcon />}>Viewed</Button> */}
          </Grid>
        </Grid>
        <ViewTemplates
          title='Refund Request'
          apiData={data}
          data={data?.credit_memo_items}
          itemsColumns={columns}
          headerInfo={info}
          addressData={{
            default_billing_address: data?.customer?.default_billing_address
          }}
          showDiscountAndTax={false}
          termsAndConditions={data?.terms_and_condition}
          headings={{ first: 'Customer Address' }}
        />
        <ConfirmDialog
          title='Are you sure you want to Void'
          isOpen={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
          {...dialogProps}
        />
      </ContainerPaper>
      <OverlayLoader open={loading} />
    </Box>
  );
};

export default RefundRequestView;

const BtnStyles = {
  margin: '0 .2rem'
};
