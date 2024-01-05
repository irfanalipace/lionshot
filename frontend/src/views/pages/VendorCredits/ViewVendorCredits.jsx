import { Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import OverlayLoader from '../../Components/OverlayLoader/OverlayLoader';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import CloseIcon from '@mui/icons-material/Close';
import ContainerPaper from '../../Components/Containers/ContainerPaper';
import MUIButton from '../../Components/Button/MUIButton';
import EditIcon from '@mui/icons-material/Edit';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { useEffect, useState } from 'react';
import ViewTemplates from '../../Components/ViewTemplate/ViewTemplates';
import {
  ViewVendorCredit,
  deleteVendorCredit,
  downloadVendorCreditApi
} from '../../../core/api/vendorcredits';
import { useNavigate } from 'react-router-dom';
import { decryptId, formatDate } from '../../../core/utils/helpers';
import { HighlightOffRounded } from '@mui/icons-material';
import notyf from '../../Components/NotificationMessage/notyfInstance';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';

const ViewVendorCredits = ({ id, refreshList }) => {
  const decryptedId = decryptId(id);
  const [emailMenuAnchor, setEmailMenuAnchor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});

  const [data, setData] = useState();
  const openEmailMenu = event => {
    setEmailMenuAnchor(event.currentTarget);
  };
  const closeEmailMenu = () => {
    setEmailMenuAnchor(null);
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
    { label: 'Credit #:', value: data?.vendor_credit_number },
    {
      label: 'Credit Date:',
      value: formatDate(new Date())
    }
  ];
  const headings = { first: 'Vendor Address' };

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await ViewVendorCredit(decryptedId);
      setData(resp?.data);
      // const refundHistory = await getRefundHistory({
      // 	invoice_id: resp?.data?.invoice_id,
      // });
      // setRefundHistory(refundHistory?.data);
    } catch (e) {
      navigate('/vendor-credits');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleVoid = async () => {
    try {
      await deleteVendorCredit(decryptedId);
      notyf.success('Status Successfully changed to Void');
      navigate('/vendor-credits');
      if (typeof refreshList === 'function') refreshList();
    } catch (err) {
      //   console.log("err", err);
      notyf.error('Something went wrong');
    }
  };

  const downloadPDF = async () => {
    setLoading(true);
    let response = await downloadVendorCreditApi({ id: decryptedId });
    window.open(response.data);
    setLoading(false);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <HeaderPaper sx={{ marginBottom: 1 }}>
        <Grid item container>
          <Grid sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6'>{data?.vendor_credit_number}</Typography>
          </Grid>
          <Grid
            sm={6}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}>
            <IconButton onClick={() => navigate('/vendor-credits')}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </HeaderPaper>
      <Paper sx={{ padding: '1rem', mb: 1 }}>
        {data?.status === 'draft' && (
          <MUIButton
            variant='outlined'
            onClick={() => navigate(`/vendor-credits/edit/${id}`)}
            startIcon={<EditIcon />}
            sx={{ margin: '0 .2rem' }}>
            Edit
          </MUIButton>
        )}

        <MUIButton
          variant='outlined'
          onClick={() => navigate(`/send-email/vendor_credit/${id}`)}
          startIcon={<EditIcon />}
          sx={{ margin: '0 .2rem' }}>
          Send an Email
        </MUIButton>
        <MUIButton
          startIcon={<PictureAsPdfOutlinedIcon />}
          variant='outlined'
          sx={{ margin: '0 .2rem' }}
          onClick={downloadPDF}>
          Pdf/Print
        </MUIButton>
        {data?.status === 'draft' && (
          <MUIButton
            startIcon={<HighlightOffRounded />}
            variant='outlined'
            sx={{ margin: '0 .2rem' }}
            onClick={() => {
              setOpenConfirmDialog(true); // Open the confirmation dialog
              setDialogProps({
                onConfirm: handleVoid
              });
            }}>
            Void
          </MUIButton>
        )}
      </Paper>

      <ContainerPaper sx={{ padding: '1.5rem' }}>
        <ViewTemplates
          title='Vendor Credit'
          apiData={data}
          data={data?.vendor_credit_items}
          itemsColumns={columns}
          headerInfo={info}
          showShippingCharges={false}
          addressData={{
            default_billing_address: data?.vendor?.default_billing_address
          }}
          headings={headings}
        />

        {/* <Grid mt={5} ml={2}>
					<Typography>Journal</Typography>
					<Divider />
				</Grid>
				<Grid mt={5} ml={2}>
					<Typography>
						Amount is displayed in your base currenct USD &ensp;{' '}
						<Chip label='USD' color='success' sx={{ padding: 0 }} />{' '}
					</Typography>
				</Grid>
				<Grid mt={3} ml={2}>
					<Typography>Vendor Credits</Typography>
				</Grid>
				<Grid mt={3} ml={2}>
					<Table sx={{ minWidth: 650 }} mt={3} aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableHeadCell sx={{ padding: '6px 16px' }}>
									<Typography variant='templateBody2'>Head</Typography>
								</TableHeadCell>
								<TableHeadCell sx={{ padding: '6px 16px' }}>
									<Typography variant='templateBody2'>Debt</Typography>
								</TableHeadCell>
								<TableHeadCell sx={{ padding: '6px 16px' }}>
									<Typography variant='templateBody2'>Credit</Typography>
								</TableHeadCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableHeadCell>
									<Typography fontSize={13}>Acccounts Recievable</Typography>
								</TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>0.00</Typography>
								</TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>130.00</Typography>
								</TableHeadCell>
							</TableRow>
							<TableRow>
								<TableHeadCell>
									<Typography fontSize={13}>Unearned Revenue</Typography>
								</TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>130.00</Typography>
								</TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>0.00</Typography>
								</TableHeadCell>
							</TableRow>
							<TableRow>
								<TableHeadCell>
									<Typography fontSize={13}>Tax Payable</Typography>
								</TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>0.00</Typography>
								</TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>0.00</Typography>
								</TableHeadCell>
							</TableRow>
							<TableRow>
								<TableHeadCell></TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>20.00</Typography>
								</TableHeadCell>
								<TableHeadCell>
									<Typography fontSize={13}>20.00</Typography>
								</TableHeadCell>
							</TableRow>
						</TableBody>
					</Table>
				</Grid> */}
      </ContainerPaper>
      <OverlayLoader open={loading} />
      <ConfirmDialog
        title='Are you sure you want to update status'
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        {...dialogProps}
      />
    </Box>
  );
};

export default ViewVendorCredits;
