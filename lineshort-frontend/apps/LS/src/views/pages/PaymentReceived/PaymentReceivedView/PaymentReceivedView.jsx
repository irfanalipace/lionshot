import { useEffect, useState } from 'react';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import GridRow from '../../../Components/GridRow/GridRow';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import MUIButton from '../../../Components/Button/MUIButton';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { Grid, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { Close, MailOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
// import AttachFileMenu from '../../../Components/AttachFileBox/AttachFileBox';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {
  SinglePaymentReceivedApi,
  deletePaymentReceivedApi,
  downloadPDFPaymentReceiveApi
} from '../../../../core/api/paymentReceived';
// import HistoryDrawer from '../../../Components/HistoryDrawer/HistoryDrawer';
import {
  formatDate,
  generateEncryptedID
} from '../../../../core/utils/helpers';
import { HighlightOff } from '@mui/icons-material';
import ViewTemplates from '../../../Components/ViewTemplate/ViewTemplates';
function PaymentReceivedView({ id, setRefresh }) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [paymentReceivedData, setpaymentReceivedData] = useState();
  const [anchorElMail, setAnchorElMail] = useState(null);
  // const [anchorElPDF, setAnchorElPDF] = useState(null);
  // const [anchorElThreeDot, setAnchorElThreeDot] = useState(null);
  // const [btnGroupData, setbtnGroupData] = useState('Accrual');
  // const [openAttachmentMenu, setopenAttachmentMenu] = useState();
  // const [historyDrawer, setHistoryDrawer] = useState();
  // const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const handleFileListUpdate = newFileList => {
  // 	setFileList(newFileList);
  // };
  const openMailMenu = Boolean(anchorElMail);
  // const openPDFMenu = Boolean(anchorElPDF);
  // const openThreeDotMenu = Boolean(anchorElThreeDot);

  const handleMailMenuClick = event => {
    setAnchorElMail(event.currentTarget);
  };

  // const handlePDFMenuClick = (event) => {
  // 	setAnchorElPDF(event.currentTarget);
  // };
  // const handleThreeDotMenuClick = event => {
  // 	setAnchorElThreeDot(event.currentTarget);
  // };
  const handlePdf = async id => {
    try {
      const resp = await downloadPDFPaymentReceiveApi({ id });
      window.open(resp?.data?.url, '_blank');
    } catch (error) {
      //
    }
  };
  const handleMenuClose = () => {
    setAnchorElMail(null);
    // setAnchorElPDF(null);
    // setAnchorElThreeDot(null);
  };

  // const handleBtnGroup = (event, btnChanged) => {
  // 	setbtnGroupData(btnChanged);
  // };
  //  single customer api
  const getsinglePaymentReceived = async () => {
    try {
      setLoading(true);
      const singleCustomer = await SinglePaymentReceivedApi(id);
      setpaymentReceivedData(singleCustomer);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      navigate('/payment-received');
    }
  };
  const handleDelete = async id => {
    try {
      if (id) {
        const res = await deletePaymentReceivedApi(id);
        if (res) {
          navigate('/payment-received');
          setRefresh(prev => prev + 1);
        }
      }
    } catch (err) {
      console.log('err', err);
    }
  };
  useEffect(() => {
    getsinglePaymentReceived();
  }, [id]);

  const handleSendMail = () => {
    navigate(`/send-email/payment_receive/${generateEncryptedID(id)}`);
  };

  const columns = [
    { id: '', label: 'No.', key: 'index' },
    { id: '', label: 'Invoice Number', key: 'invoice_number' },
    { id: '', label: 'Invoice Date', key: 'invoice_date' },
    { id: '', label: 'Invoice Amount(USD)', key: 'total' },
    { id: '', label: 'Payment Amount(USD)', key: 'paid_amount' }
  ];

  const headerInfo = [
    {
      label: 'Payment Date:',
      value: formatDate(paymentReceivedData?.payment_date)
    },
    {
      label: 'Payment Mode:',
      value: paymentReceivedData?.payment_mode_value
    }
  ];

  if (paymentReceivedData?.reference_number) {
    headerInfo.splice(1, 0, {
      label: 'Reference #:',
      value: paymentReceivedData?.reference_number
    });
  }

  const headings = {
    first: 'Received From',
    second: 'Amount Received'
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <OverlayLoader open={loading} />
      <HeaderPaper>
        <GridRow style={{ marginBottom: '0px' }}>
          <Grid item xs={6}>
            <Typography variant='h6'>PR-{paymentReceivedData?.id}</Typography>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
            <Box>
              {/* <Button variant="body2" sx={{ color: window.themeColors.primary, border: `1px solid ${window.themeColors.primary}` }} onClick={() => setopenAttachmentMenu(true)}>
                <AttachFile sx={{ color: window.themeColors.primary, fontSize: '16px', margin: '-3px 5px 0px 5px' }} />Attachments
              </Button> */}
              {/* {openAttachmentMenu &&
                <AttachFileMenu
                  openAttachmentMenu={openAttachmentMenu}
                  setopenAttachmentMenu={setopenAttachmentMenu}
                  onFileListUpdate={handleFileListUpdate}
                />
              )} */}
              {/* <Button variant="body2" sx={{ color: window.themeColors.primary, border: `1px solid ${window.themeColors.primary}`, marginLeft: '10px' }} onClick={() => setHistoryDrawer(true)}>
                <History sx={{ color: window.themeColors.primary, fontSize: '16px', margin: '-3px 5px 0 5px' }} />Payment History
              </Button>
              <HistoryDrawer
                openDrawer={historyDrawer}
                setHistoryDrawer={setHistoryDrawer}
                DrawerTitle={'Payment Received History'}
                timelineData={timelineData}
              /> */}
              <IconButton onClick={() => navigate('/payment-received')}>
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
							navigate(`/payment-received/edit/${paymentReceivedData?.id}`)
						}
						startIcon={<EditIcon />}
					>
						Edit
					</MUIButton> */}

          {/* <Button
					variant='body2'
					sx={{
						color: window.themeColors.primary,
						borderRight: `1px solid ${window.themeColors.primary}`,
						borderRadius: '0',
					}}
					onClick={handleMailMenuClick}
				>
					<MailOutline
						sx={{
							color: window.themeColors.primary,
							fontSize: '16px',
							margin: '-3px 5px 0px 5px',
						}}
					/>
					Mails
					<KeyboardArrowDown
						sx={{
							color: window.themeColors.primary,
							fontSize: '16px',
							margin: '-3px 5px 0px 5px',
						}}
					/>
				</Button>
				<Menu
					anchorEl={anchorElMail}
					open={openMailMenu}
					onClose={handleMenuClose}
				>
					<MenuItem
						onClick={() => {
							handleSendMail(id);
						}}
					>
						<MailOutline
							sx={{
								color: '#6C6C6C',
								fontSize: '16px',
								margin: '-3px 5px 0px 5px',
							}}
						/>
						Send Mail
					</MenuItem>
				</Menu> */}

          <MUIButton
            onClick={handleSendMail}
            startIcon={<EmailOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}>
            Send an email
          </MUIButton>

          {/* <Button
					variant='body2'
					sx={{
						color: window.themeColors.primary,
						borderRight: `1px solid ${window.themeColors.primary}`,
						borderRadius: '0',
					}}
					onClick={() => handlePdf(id)}
				>
					<UploadFileOutlined
						sx={{
							color: window.themeColors.primary,
							fontSize: '16px',
							margin: '-3px 5px 0px 5px',
						}}
					/>
					PDF / Print
					 <KeyboardArrowDown sx={{ color: window.themeColors.primary, fontSize: '16px', margin: '-3px 5px 0px 5px' }} /> 
				</Button> */}

          <MUIButton
            startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}
            onClick={() => handlePdf(id)}>
            Pdf/Print
          </MUIButton>

          {/* <Menu anchorEl={anchorElPDF} open={openPDFMenu} onClose={handleMenuClose} sx={{ '& .MuiPaper-root': { minWidth: '150px' } }}>
          <MenuItem onClick={()=>handlePdf(id)}>
            <MailOutline sx={{ color: '#6C6C6C', fontSize: '16px', margin: '-3px 5px 0px 5px' }} />
            PDF
          </MenuItem>
          <MenuItem onClick={() => window.print()}>
            <PrintOutlined sx={{ color: '#6C6C6C', fontSize: '16px', margin: '-3px 5px 0px 5px' }} />
            Print
          </MenuItem>
        </Menu> */}
          {/* 
				<Button
					variant='body2'
					sx={{
						color: window.themeColors.primary,
						borderRight: `1px solid ${window.themeColors.primary}`,
						borderRadius: '0',
					}}
					onClick={handleThreeDotMenuClick}
				>
					<MoreVert sx={{ color: window.themeColors.primary, margin: '-3px 5px 0px 5px' }} />
				</Button> */}

          {/* <MUIButton
						startIcon={<HighlightOff />}
						variant='outlined'
						sx={{ ...BtnStyles }}
						onClick={() => {
							setOpenConfirmDialog(true);
							setDialogProps({
								onConfirm: () => handleDelete(paymentReceivedData?.id),
							});
						}}
					>
						Void
					</MUIButton> */}

          {/* <MUIButton
						variant='outlined'
						sx={{
							fontSize: '12px',
							textTransform: 'capitalize',
							margin: '0 8px',
						}}
						endIcon={<ArrowDropDown />}
						onClick={handleThreeDotMenuClick}
					>
						More
					</MUIButton>

					<Menu
						anchorEl={anchorElThreeDot}
						open={openThreeDotMenu}
						onClose={handleMenuClose}
					>
					
						<MenuItem
							onClick={() => {
								setOpenConfirmDialog(true);
								setDialogProps({
									onConfirm: () => handleDelete(paymentReceivedData?.id),
								});
							}}
						>
							Delete
						</MenuItem>
					</Menu> */}
        </Box>
      </HeaderPaper>

      <Box sx={{ padding: '20px 0', background: 'white' }}>
        <Box
          sx={{
            margin: '10px 20px',
            boxShadow: ' 0px 0px 6px 0px #CCCCCC',
            padding: '30px',
            height: ' 250mm'
          }}>
          <ViewTemplates
            title='Account Receivable'
            itemsColumns={columns}
            showCalculations={false}
            headerInfo={headerInfo}
            data={[paymentReceivedData?.invoice]}
            apiData={paymentReceivedData}
            headings={headings}
            addressData={{
              default_billing_address: {
                ...paymentReceivedData?.customer?.default_billing_address
              }
            }}
            paymentInfo={paymentReceivedData?.payment_made || 0}
          />
        </Box>

        {/* <Typography component='p' variant="subtitle1"
          sx={{margin: '80px 0 0 50px', fontSize: '18px', paddingBottom: '20px', 
          width: '128px',borderBottom: '3px solid #2196F3'}}>
          Display Journal
        </Typography>
        <Divider />
        <Box sx={{ marginLeft: '30px', }}>
          <GridRow>
            <Grid item xs={6}><Typography component='span' variant="body2Grey">Amount is displayed in your base currency USD</Typography>
              <Typography component='span' variant="body1" sx={{ backgroundColor: '#2E7D32', color: 'white', marginLeft: '5px', padding: '1px 5px' }}>USD</Typography></Grid>
            <Grid item xs={6} sx={{ textAlign: 'right', marginTop: '5px', paddingRight: '10px' }}>
              <ToggleButtonGroup value={btnGroupData} exclusive onChange={handleBtnGroup}>
                <ToggleButton value="Accrual" sx={{ paddingY: '0', textTransform: 'capitalize', fontSize: '12px' }}>Accrual</ToggleButton>
                <ToggleButton value="Cash" sx={{ paddingY: '0', textTransform: 'capitalize', fontSize: '12px' }}>Cash</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </GridRow>
        </Box>
        <Typography variant="body1" sx={{ margin: '20px 30px' }}>Invoice Payment - INV-1245879-012</Typography>
        <GridRow style={{ margin: '0 0 0 -24px', padding: '0px 60px 0px 30px' }}>
          <Grid item xs={4} sx={{ textAlign: 'left', color: '#00000099' }}><Typography variant="body1bold">Account</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1bold">Debit</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1bold">Credit</Typography></Grid>
        </GridRow>
        <Divider />
        <GridRow style={{ margin: '0 0 0 -24px', padding: '0 60px 0px 30px' }}>
          <Grid item xs={4} sx={{ textAlign: 'left', color: '#00000099' }}><Typography variant="body1">Accounts Receivable</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1">00</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1">50.00 </Typography></Grid>
        </GridRow>
        <GridRow style={{ margin: '0 0 0 -24px', padding: '0 60px 0px 30px' }}>
          <Grid item xs={4} sx={{ textAlign: 'left', color: '#00000099' }}><Typography variant="body1">Undeposited Funds</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1">48.25</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1">0.00 </Typography></Grid>
        </GridRow>
        <GridRow style={{ margin: '0 0 0 -24px', padding: '0 60px 0px 30px' }}>
          <Grid item xs={4} sx={{ textAlign: 'left', color: '#00000099' }}><Typography variant="body1">Bank Fees and Charges</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1">1.75</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1">0.00 </Typography></Grid>
        </GridRow>
        <Divider />
        <GridRow style={{ margin: '0 0 0 -24px', padding: '0 60px 0px 30px' }}>
          <Grid item xs={4} sx={{ textAlign: 'left', color: '#00000099' }}></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1bold">50.00</Typography></Grid>
          <Grid item xs={4} sx={{ textAlign: 'right', color: '#00000099' }}><Typography variant="body1bold">50.00 </Typography></Grid>
        </GridRow> */}
      </Box>
      <ConfirmDialog
        title='Are you sure you want to delete'
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        {...dialogProps}
      />
    </Box>
  );
}

export default PaymentReceivedView;
const BtnStyles = {
  margin: '0 .2rem'
};
