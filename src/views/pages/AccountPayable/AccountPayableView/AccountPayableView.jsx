import { useEffect, useState } from 'react';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import GridRow from '../../../Components/GridRow/GridRow';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
// import EditIcon from '@mui/icons-material/Edit';
import MUIButton from '../../../Components/Button/MUIButton';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
// import { Delete } from '@mui/icons-material';
import {
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { Close, MailOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import Logo from '../../../../../src/assets/images/logos/computer.png';
// import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {
  SinglePayableApi,
  deletePayableApi,
  // deletePayableApi,
  downloadPDFPayableApi
} from '../../../../core/api/payables';
import {
  formatDate,
  generateEncryptedID
} from '../../../../core/utils/helpers';
import { HighlightOffRounded } from '@mui/icons-material';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import { organizationDetails } from '../../../../core/utils/constants';
import ViewTemplates from '../../../Components/ViewTemplate/ViewTemplates';
function AccountPayableView({ id, refreshList }) {
  // const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  // const [dialogProps, setDialogProps] = useState({});
  const [payableData, setPayableData] = useState();
  const [loading, setLoading] = useState(true);
  const [dialogProps, setDialogProps] = useState({});
  const [bills, setBills] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const navigate = useNavigate();

  const handlePdf = async id => {
    try {
      const resp = await downloadPDFPayableApi({ id });
      window.open(resp?.data?.url, '_blank');
    } catch (error) {
      console.log('error', error);
    }
  };

  //  single customer api
  const getSinglePaymentReceived = async () => {
    try {
      setLoading(true);
      const resp = await SinglePayableApi(id);
      setPayableData(resp);
      setBills(
        resp?.account_payable_paid_bills?.map(bill => {
          return {
            bill_number: bill?.bill?.bill_number,
            bill_date: bill?.bill?.bill_date,
            bill_amount: bill?.bill?.total,
            payment_amount: bill?.amount
          };
        })
      );
    } catch (e) {
      navigate('/account-payable');
    }
    setLoading(false);
  };

  const handleVoid = async id => {
    try {
      if (id) {
        const res = await deletePayableApi(id);
        if (res) {
          navigate('/account-payable');
          refreshList();
          notyf.success('Status Successfully changed to Void');
        }
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  useEffect(() => {
    getSinglePaymentReceived();
  }, [id]);

  const handleSendMail = () => {
    navigate(`/send-email/account_payable/${generateEncryptedID(id)}`);
  };

  const columns = [
    { id: '', label: 'No.', key: 'index' },
    { id: '', label: 'Bill Number', key: 'bill_number' },
    { id: '', label: 'Bill Date', key: 'bill_date' },
    { id: '', label: 'Bill Amount(USD)', key: 'bill_amount' },
    { id: '', label: 'Payment Amount(USD)', key: 'payment_amount' }
  ];

  const headerInfo = [
    {
      label: 'Payment #:',
      value: payableData?.payment_number
    },
    {
      label: 'Payment Date:',
      value: formatDate(payableData?.payment_date)
    },
    {
      label: 'Payment Mode:',
      value: payableData?.mode_of_payment_value
    }
  ];

  if (payableData?.reference_number) {
    headerInfo.splice(2, 0, {
      label: 'Reference #:',
      value: payableData?.reference_number
    });
  }

  const headings = {
    first: 'Paid To',
    second: 'Paid Amount'
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <OverlayLoader open={loading} />
      <HeaderPaper>
        <GridRow style={{ marginBottom: '0px' }}>
          <Grid item xs={6}>
            <Typography variant='h6'>PR-{payableData?.id}</Typography>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
            <Box>
              <IconButton onClick={() => navigate('/account-payable')}>
                <Close />
              </IconButton>
            </Box>
          </Grid>
        </GridRow>
      </HeaderPaper>

      <HeaderPaper>
        <Box sx={{ marginTop: '-10px', padding: '10px' }}>
          {/* <MUIButton
						variant='outlined'
						onClick={() =>
							navigate(
								`/account-payable/edit/${generateEncryptedID(payableData?.id)}`
							)
						}
						startIcon={<EditIcon />}
					>
						Edit
					</MUIButton> */}

          <MUIButton
            onClick={handleSendMail}
            startIcon={<EmailOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}>
            Send an email
          </MUIButton>
          <MUIButton
            startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}
            onClick={() => handlePdf(id)}>
            Pdf/Print
          </MUIButton>

          {/* <MUIButton
						startIcon={<HighlightOffRounded />}
						variant='outlined'
						sx={{ ...BtnStyles }}
						onClick={() => {
							setOpenConfirmDialog(true);
							setDialogProps({
								onConfirm: () => handleVoid(payableData?.id),
							});
						}}
					>
						Void
					</MUIButton> */}
        </Box>
      </HeaderPaper>

      <Box sx={{ padding: '20px 0', background: 'white' }}>
        <ViewTemplates
          title='Payment Made'
          itemsColumns={columns}
          headerInfo={headerInfo}
          data={bills}
          apiData={payableData}
          headings={headings}
          showCalculations={false}
          addressData={{
            default_billing_address:
              payableData?.vendor?.default_billing_address
          }}
          paymentInfo={payableData?.payment_paid || 0}
        />
        {/* <Box sx={{ marginLeft: '30px' }}>
          <GridRow>
            <Grid item xs={6}>
              <Typography component='span' variant='body2Grey'>
                Amount is displayed in your base currency USD
              </Typography>
              <Typography
                component='span'
                variant='body1'
                sx={{
                  backgroundColor: window.themeColors.primary,
                  color: 'white',
                  marginLeft: '5px',
                  padding: '1px 5px'
                }}>
                USD
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                textAlign: 'right',
                marginTop: '5px',
                paddingRight: '10px'
              }}>
              <ToggleButtonGroup value={btnGroupData} exclusive onChange={handleBtnGroup}>
                <ToggleButton value="Accrual" sx={{ paddingY: '0', textTransform: 'capitalize', fontSize: '12px' }}>Accrual</ToggleButton>
                <ToggleButton value="Cash" sx={{ paddingY: '0', textTransform: 'capitalize', fontSize: '12px' }}>Cash</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </GridRow>
        </Box>
        <Typography variant='body1' sx={{ margin: '20px 30px' }}>
          Bill Payment - INV-1245879-012
        </Typography>
        <GridRow
          style={{ margin: '0 0 0 -24px', padding: '0px 60px 0px 30px' }}>
          <Grid item xs={4} sx={{ textAlign: 'left', color: '#00000099' }}>
            <Typography variant='body1bold'>Account</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}>
            <Typography variant='body1bold'>Debit</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}>
            <Typography variant='body1bold'>Credit</Typography>
          </Grid>
        </GridRow>
        <Divider />
        <GridRow style={{ margin: '0 0 0 -24px', padding: '0 60px 0px 30px' }}>
          <Grid item xs={4} sx={{ textAlign: 'left', color: '#00000099' }}>
            <Typography variant='body1'>Accounts Receivable</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}>
            <Typography variant='body1'>00</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}>
            <Typography variant='body1'>50.00 </Typography>
          </Grid>
        </GridRow>
        <GridRow style={{ margin: '0 0 0 -24px', padding: '0 60px 0px 30px' }}>
          <Grid item xs={4} sx={{ textAlign: 'left', color: '#00000099' }}>
            <Typography variant='body1'>Undeposited Funds</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}>
            <Typography variant='body1'>48.25</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}>
            <Typography variant='body1'>0.00 </Typography>
          </Grid>
        </GridRow>
        <GridRow style={{ margin: '0 0 0 -24px', padding: '0 60px 0px 30px' }}>
          <Grid item xs={4} sx={{ textAlign: 'left', color: '#00000099' }}>
            <Typography variant='body1'>Bank Fees and Charges</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}>
            <Typography variant='body1'>1.75</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}>
            <Typography variant='body1'>0.00 </Typography>
          </Grid>
        </GridRow>
        <Divider />
        <GridRow style={{ margin: '0 0 0 -24px', padding: '0 60px 0px 30px' }}>
          <Grid
            item
            xs={4}
            sx={{ textAlign: 'left', color: '#00000099' }}></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}>
            <Typography variant='body1bold'>50.00</Typography>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}>
            <Typography variant='body1bold'>50.00 </Typography>
          </Grid>
        </GridRow> */}
      </Box>
      <ConfirmDialog
        title='Are you sure you want to update status to void'
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        {...dialogProps}
      />
    </Box>
  );
}

export default AccountPayableView;
const BtnStyles = {
  margin: '0 .2rem'
};
