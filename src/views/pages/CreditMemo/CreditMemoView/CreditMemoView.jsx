import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import MUIButton from '../../../Components/Button/MUIButton';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useEffect, useState } from 'react';
import { TableHeadCell } from '../../../Components/Table/Table';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabList from '@mui/lab/TabList';
import TabContext from '@mui/lab/TabContext';
// import ViewHistory from './ViewHistory';
import GridRow from '../../../Components/GridRow/GridRow';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import { useNavigate } from 'react-router-dom';
import {
  CreditMemoApproved,
  CreditMemoRejected,
  ViewCreditMemo,
  deleteCreditMemoAPI,
  downloadCreditMemoApi,
  getRefundHistory
} from '../../../../core/api/creditmemo';
import ViewTemplates from '../../../Components/ViewTemplate/ViewTemplates';
import { decryptId, formatDate } from '../../../../core/utils/helpers';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ContainerPaper from '../../../Components/Containers/ContainerPaper';
import { LoadingButton } from '@mui/lab';
import { HighlightOff } from '@mui/icons-material';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import notyf from '../../../Components/NotificationMessage/notyfInstance';

const CreditMemoView = ({ id, setRefresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState('1');
  const [editForm, seteditForm] = useState(false);
  const [data, setData] = useState({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refundId, setRefundId] = useState(null);
  const [refundHistory, setRefundHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const decryptedID = decryptId(id);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await ViewCreditMemo(decryptedID);
      setData(resp?.data);
      const refundHistory = await getRefundHistory({
        invoice_id: resp?.data?.invoice_id
      });
      setRefundHistory(refundHistory?.data);
    } catch (e) {
      navigate('/credit-memo');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    let response = await downloadCreditMemoApi({ id: decryptedID });
    window.open(response.data);
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
    { label: 'Credit Memo No:', value: data?.credit_memo_number },
    {
      label: 'Credit Memo Date:',
      value: formatDate(data?.credit_memo_date)
    }
  ];

  const deleteCreditMemo = async idDelete => {
    try {
      // console.log('idDelete', idDelete);
      const resp = await deleteCreditMemoAPI(idDelete);
      if (resp) {
        navigate('/credit-memo');
        notyf.success('Status Successfully changed to Void');
        setRefresh(prev => prev + 1);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <Box sx={{ position: 'relative' }}>
      <HeaderPaper sx={{ marginBottom: 1 }}>
        <Grid item container>
          <Grid sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6'>
              {!editForm
                ? data?.credit_memo_number
                : `Refund(${data?.credit_memo_number})`}
            </Typography>
          </Grid>
          <Grid
            sm={6}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}>
            <IconButton onClick={() => navigate(`/credit-memo`)}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </HeaderPaper>

      {!editForm && (
        <Paper sx={{ padding: '1.5rem', mb: 1 }}>
          {data?.status === 'draft' && (
            <MUIButton
              variant='outlined'
              onClick={() => navigate(`/credit-memo/edit/${id}`)}
              startIcon={<EditIcon />}>
              Edit
            </MUIButton>
          )}
          <MUIButton
            onClick={() => navigate(`/send-email/credit_memo/${id}`)}
            startIcon={<EmailOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}>
            Send an email
          </MUIButton>
          <MUIButton
            startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}
            onClick={downloadPDF}>
            Pdf/Print
          </MUIButton>
          {data?.status === 'draft' && (
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
          )}
        </Paper>
      )}
      <ContainerPaper sx={{ padding: '1.5rem' }}>
        {data?.status === 'opened' && (
          <GridRow>
            <Grid
              item
              container
              mb={2}
              display='flex'
              justifyContent='flex-end'>
              <LoadingButton
                sx={{ marginRight: 1 }}
                onClick={() => {
                  CreditMemoApproved({ id: decryptedID });
                  setRefresh(prev => prev + 1);
                }}
                variant='contained'>
                ACCEPT
              </LoadingButton>
              <LoadingButton
                sx={{ marginLeft: 1 }}
                variant='contained'
                onClick={() => {
                  CreditMemoRejected({ id: decryptedID });
                  setRefresh(prev => prev + 1);
                }}>
                REJECT
              </LoadingButton>
            </Grid>
          </GridRow>
        )}

        {editForm ? (
          <>
            <IconButton
              sx={{ margin: '-17px 0px 10px -15px' }}
              onClick={() => seteditForm(false)}>
              <KeyboardBackspaceIcon />
            </IconButton>
            <GridRow>
              <Grid item xs={3}>
                <InputLabel sx={{ color: '#00000099' }}>
                  Refunded on:
                </InputLabel>
              </Grid>
              <Grid item xs={4}>
                <Typography variant='body2'>
                  {formatDate(refundHistory[refundId]?.created_at)}
                </Typography>
              </Grid>
            </GridRow>
            <GridRow>
              <Grid item xs={3}>
                <InputLabel sx={{ color: '#00000099' }}>
                  Payment Mode:
                </InputLabel>
              </Grid>
              <Grid item xs={4}>
                <Typography variant='body2'>Square</Typography>
              </Grid>
            </GridRow>
            <GridRow>
              <Grid item xs={3}>
                <InputLabel sx={{ color: '#00000099' }}>
                  Amount Refunded:
                </InputLabel>
              </Grid>
              <Grid item xs={4}>
                <Typography variant='body2'>
                  ${refundHistory[refundId]?.total}
                </Typography>
              </Grid>
            </GridRow>
          </>
        ) : (
          <TabContext value={value}>
            <TabList onChange={handleChange} aria-label='basic tabs example'>
              <Tab label='View' value='1' />
              {/* <Tab label='History' value='2' /> */}
            </TabList>
            <Divider />
            <TabPanel value='1'>
              <>
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
                          <Typography variant='body1'>
                            Refund History
                          </Typography>
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
                                <Typography variant='templateBody2'>
                                  Date
                                </Typography>
                              </TableHeadCell>
                              <TableHeadCell sx={{ padding: '6px 16px' }}>
                                <Typography variant='templateBody2'>
                                  Invoice
                                </Typography>
                              </TableHeadCell>
                              <TableHeadCell sx={{ padding: '6px 16px' }}>
                                <Typography variant='templateBody2'>
                                  Amount Refunded
                                </Typography>
                              </TableHeadCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {refundHistory.map(row => (
                              <TableRow key={row.id}>
                                <TableHeadCell>
                                  <Typography fontSize={13}>
                                    {formatDate(row?.created_at)}
                                  </Typography>
                                </TableHeadCell>
                                <TableHeadCell>
                                  <Typography fontSize={13}>
                                    {row?.invoice?.invoice_number}
                                  </Typography>
                                </TableHeadCell>
                                <TableHeadCell>
                                  <Typography fontSize={13}>
                                    ${row?.total}
                                  </Typography>
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
                  title='Credit Memo'
                  apiData={data}
                  data={data?.credit_memo_items}
                  itemsColumns={columns}
                  headerInfo={info}
                  addressData={{
                    default_billing_address:
                      data?.customer?.default_billing_address
                  }}
                  headings={{ first: 'Customer Address' }}
                  showDiscountAndTax={false}
                  termsAndConditions={data?.terms_and_condition}
                />
              </>
            </TabPanel>
            {/* <TabPanel value='2'>
							<ViewHistory />
						</TabPanel> */}
          </TabContext>
        )}
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

export default CreditMemoView;

const BtnStyles = {
  margin: '0 .2rem'
};
