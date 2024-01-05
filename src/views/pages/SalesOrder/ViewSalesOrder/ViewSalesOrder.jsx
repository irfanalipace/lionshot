import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Typography
} from '@mui/material';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import MUIButton from '../../../Components/Button/MUIButton';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

import {
  addSalesOrderFielApi,
  convertingToInvoiceApi,
  deleteSaleOrder,
  deleteSalesOrderFielApi,
  getPdfUrlApi,
  viewSalesOrder
} from '../../../../core/api/salesorders';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
// import ActivityTimeLine from '../../../Components/ActivityTimeLine/ActivityTimeLine';
import { decryptId, formatDate } from '../../../../core/utils/helpers';
import { Stack } from '@mui/system';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import ViewTemplates from '../../../Components/ViewTemplate/ViewTemplates';
import AttachmentCard from '../../../Components/FileUpload/AttachmentCard';
import { HighlightOff } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
const TABS = {
  VIEW: 'VIEW',
  HISTORY: 'HISTORY'
};

const tabUnderlineStyles = {
  borderBottom: '2px solid #66B2FF',
  fontWeight: 550,
  cursor: 'pointer',
  borderRadius: '3px',
  color: '#66B2FF'
};

const ViewSalesOrder = ({ id, setRefresh }) => {
  const [activeTab, setActiveTab] = useState(TABS.VIEW);
  const [saleorder, setSaleOrder] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [showMenuItem, setShowMenu] = useState(null);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const idDecrypted = decryptId(id);
  const navigate = useNavigate();

  useEffect(() => {
    getSaleOrder();
  }, [id]);

  const getSaleOrder = async () => {
    try {
      setLoading(true);

      const saleorder = await viewSalesOrder(idDecrypted);
      setSaleOrder(saleorder);
      setFiles(saleorder?.sale_order_file);
    } catch (e) {
      navigate('/sales-orders');
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const showingMenu = event => {
    setShowMenu(event.currentTarget);
  };
  const hidingMenu = () => {
    setShowMenu(null);
  };

  const submitFilesToApi = newFiles => {
    return addSalesOrderFielApi({
      attachments: newFiles,
      sale_order_id: decryptId(id)
    });
  };

  ////sales

  const deleteFile = async id => {
    return deleteSalesOrderFielApi(id);
  };
  const deleteSalesOrder = async idDelete => {
    console.log('idDelete', idDelete);
    try {
      const resp = await deleteSaleOrder(idDelete);
      if (resp) {
        await setRefresh(prev => prev + 1);
        navigate('/sales-orders');
        notyf.success('Status Successfully changed to Void');
        //setRefresh(prev => prev + 1);
        ///	console.log(prev => prev + 1, 'refresh-page');
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  // invoice conversion
  const convertingToInvoice = async () => {
    try {
      setIsLoading(true);
      const resp = await convertingToInvoiceApi({ id: idDecrypted });
      notyf.success(resp?.message);
      navigate('/invoices');
      // setRefresh(prev => prev + 1);
    } catch (error) {}
    setIsLoading(false);
  };

  const downloadPdf = async () => {
    // alert()
    try {
      const resp = await getPdfUrlApi({ id: idDecrypted });
      console.log('uuuuu', resp);
      window.open(resp?.data, '_blank');
    } catch (error) {}
  };

  const columns = [
    { id: '', label: 'No.', key: 'index' },
    { id: '', label: 'Items Description', key: 'item_name' },
    { id: '', label: 'Qty', key: 'quantity' },
    { id: '', label: 'Rate(USD)', key: 'rate' },
    { id: '', label: 'Amount(USD)', key: 'total' }
  ];
  const info = [
    { label: 'Sales Order:', value: saleorder?.sale_order_number },
    {
      label: 'Sales Order Date:',
      value: formatDate(saleorder?.sale_order_date)
    },
    {
      label: 'Terms:',
      value: saleorder?.terms?.term_name
    },
    {
      label: 'Payment Mode:',
      value: saleorder?.mode_of_payment_value
        ? saleorder?.mode_of_payment_value === 'cc'
          ? 'Credit Card'
          : saleorder?.mode_of_payment_value
        : ''
    },
    { label: 'Delivery Terms:', value: 'Fedex' }
  ];

  if (saleorder?.reference_number) {
    info.splice(2, 0, {
      label: 'P.O Reference No:',
      value: saleorder?.reference_number
    });
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <HeaderPaper>
        <Grid item container>
          <Grid item sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6'>
              {saleorder?.customer?.first_name}&nbsp;
              {saleorder?.customer?.last_name}
            </Typography>
          </Grid>
          <Grid
            item
            sm={6}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}>
            {saleorder?.status === 'draft' && (
              <MUIButton
                onClick={showingMenu}
                variant='outlined'
                sx={{
                  fontSize: '12px',
                  textTransform: 'capitalize',
                  margin: '0 8px'
                }}
                startIcon={<AttachmentOutlinedIcon />}>
                Attachments
              </MUIButton>
            )}
            <AttachmentCard
              deleteApi={deleteFile}
              submitFilesToApi={submitFilesToApi}
              setFiles={setFiles}
              files={files}
              showMenuItem={showMenuItem}
              hidingMenu={hidingMenu}
            />

            <IconButton onClick={() => navigate('/sales-orders')}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </HeaderPaper>

      <Grid item sm={12}>
        <Paper sx={{ padding: '1.5rem' }}>
          {saleorder?.status === 'draft' && (
            <MUIButton
              variant='outlined'
              onClick={() => navigate(`/sales-orders/edit/${id}`)}
              startIcon={<Edit />}>
              Edit
            </MUIButton>
          )}

          <MUIButton
            onClick={() => {
              navigate(`/send-email/sale_order/${id}`);
            }}
            startIcon={<EmailOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}>
            Send an email
          </MUIButton>
          <MUIButton
            startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}
            onClick={downloadPdf}>
            Pdf/Print
          </MUIButton>
          {saleorder?.status === 'draft' && (
            <MUIButton
              variant='outlined'
              onClick={() => {
                setOpenConfirmDialog(true);
                setDialogProps({
                  onConfirm: () => deleteSalesOrder(saleorder.id)
                });
              }}
              startIcon={<HighlightOff />}>
              Void
            </MUIButton>
          )}
        </Paper>
      </Grid>

      <Paper sx={{ padding: '1.5rem', margin: '1rem 0' }}>
        <Grid item container my={4}>
          <Grid item xs={12} display='flex'>
            <Typography
              onClick={() => setActiveTab(TABS.VIEW)}
              sx={
                activeTab === TABS.VIEW
                  ? { ...tabUnderlineStyles, padding: '0 .5rem' }
                  : { cursor: 'pointer', padding: '0 .5rem' }
              }>
              {TABS.VIEW}
            </Typography>
            {/* <Typography
							onClick={() => setActiveTab(TABS.HISTORY)}
							sx={
								activeTab === TABS.HISTORY
									? { ...tabUnderlineStyles, padding: '0 .5rem' }
									: { cursor: 'pointer', padding: '0 .5rem' }
							}
						>
							{TABS.HISTORY}
						</Typography> */}
          </Grid>
        </Grid>
        {TABS.VIEW === activeTab && (
          <>
            {saleorder?.status !== 'accepted' && (
              <Paper sx={{ padding: '1rem', marginBottom: '10px' }}>
                <Grid item container>
                  <Grid item sm={9}>
                    <Stack
                      direction='row'
                      display='flex'
                      alignItems='center'
                      spacing={2}>
                      {/* <NoteOutlinedIcon /> */}
                      {/* <img src={vector} alt='invoice' /> */}
                      <Box>
                        <Typography>Convert to Invoice</Typography>
                        <Typography variant='caption'>
                          Create a Invoice for this Sales order to confirm the
                          sell and bill your customer
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    sm={3}
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center'
                    }}>
                    {isLoading ? (
                      <CircularProgress />
                    ) : (
                      <MUIButton
                        sx={{ textTransform: 'capitalize' }}
                        onClick={convertingToInvoice}>
                        Convert to Invoice
                      </MUIButton>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            )}
            <Box>
              <ViewTemplates
                title='Sales Order'
                apiData={saleorder}
                data={saleorder?.sale_order_items}
                itemsColumns={columns}
                headerInfo={info}
                bankDetails
                termsAndConditions={saleorder?.terms_and_condition}
                addressData={saleorder?.customer}
                headings={{ first: 'Bill to', second: 'Ship to' }}
              />
            </Box>
          </>
        )}

        {/* {TABS.HISTORY === activeTab && (
					<Box ml={8}>
						<Paper>
							<ActivityTimeLine activityData={activityData} />
						</Paper>
					</Box>
				)} */}
      </Paper>
      <OverlayLoader open={loading} />

      <ConfirmDialog
        title='Are you sure you want to Void'
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        {...dialogProps}
      />
    </Box>
  );
};

export default ViewSalesOrder;
const BtnStyles = {
  margin: '0 .2rem'
};
