import React, { useEffect, useState } from 'react';
import vector from '../../../../src/assets/images/Vector.png';

import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Paper
} from '@mui/material';
// mui components  && icon
import { Grid, Stack, Typography } from '@mui/material';
// components
// common components
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
// styles
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { useNavigate } from 'react-router-dom';
import MUIButton from '../../Components/Button/MUIButton';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import notyf from '../../Components/NotificationMessage/notyfInstance';
import AttachmentCard from '../../Components/FileUpload/AttachmentCard';
import ViewTemplates from '../../Components/ViewTemplate/ViewTemplates';
import TableAccordian from '../../Components/TableAccordian/TableAccordian';

import {
  addPurchaseOrdersFileApi,
  convertToBillPurcahseOrderApi,
  deletePurchaseOrdersFielsApi,
  purchaseOrdersPdfUrl,
  purchaseOrdersSingleApi,
  singleDeletePurchaseOrdersApi
} from '../../../core/api/purchase';
import {
  decryptId,
  formatDate,
  snakeCaseToPrettyText
} from '../../../core/utils/helpers';
import { useTheme } from '@mui/material/styles';
import OverlayLoader from '../../Components/OverlayLoader/OverlayLoader';
import { HighlightOffRounded } from '@mui/icons-material';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';

const ViewPurchase = ({ id, refreshList }) => {
  const navigate = useNavigate();
  const purchaseID = decryptId(id);
  const [purchaseOrderData, setPurchaseOrdersData] = useState();
  const [showMenuItem, setShowMenu] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [files, setFiles] = useState([]);
  const [bills, setBills] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [vWLoader, setVwLoader] = useState(false);
  const [contacts, setContacts] = useState([]);

  const showingMenu = event => {
    setShowMenu(event.currentTarget);
  };
  const hidingMenu = () => {
    setShowMenu(null);
  };

  useEffect(() => {
    fetchingSinglePurchase();
  }, [purchaseID]);

  const submitFilesToApi = newFiles => {
    return addPurchaseOrdersFileApi({
      attachments: newFiles,
      purchase_order_id: purchaseID
    });
  };

  const deleteFile = id => {
    return deletePurchaseOrdersFielsApi(id);
  };

  const fetchingSinglePurchase = async () => {
    try {
      setVwLoader(true);
      const resp = await purchaseOrdersSingleApi(purchaseID);
      setPurchaseOrdersData(resp);
      setBills(resp?.bill);
      setContacts(resp?.vendor?.vendor_contacts);
    } catch (error) {
      navigate('/purchase-orders');
    } finally {
      setVwLoader(false);
    }
  };

  // main page open
  const handlePurchaseMail = id => {
    // navigate(`/send-email/purchase_order/${id}/`);
    navigate(`/send-email/purchase_order/${id}/`, {
      state: {
        contacts
      }
    });
  };

  const handlePdf = async () => {
    try {
      const resp = await purchaseOrdersPdfUrl({
        id: purchaseID
      });
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
    {
      label: 'Purchase Order:',
      value: purchaseOrderData?.purchase_order_number
    },
    {
      label: 'Purchase Order Date:',
      value:
        purchaseOrderData?.purchase_order_date &&
        formatDate(purchaseOrderData?.purchase_order_date)
    },
    {
      label: 'Terms:',
      value: purchaseOrderData?.term?.term_name
    },
    {
      label: 'Payment Mode:',
      value: snakeCaseToPrettyText(purchaseOrderData?.mode_of_payment_value)
    },
    {
      label: 'Delivery Term:',
      value: 'Fedex'
    }
  ];

  if (purchaseOrderData?.invoice_ref_number) {
    info.splice(2, 0, {
      label: 'Invoice Ref#:',
      value: purchaseOrderData?.invoice_ref_number
    });
  }

  const headings = {
    first: 'Vendor Address',
    second: 'Deliver To'
  };

  //   bill to
  const tbCols = [
    { id: '', label: 'No.', key: 'index' },

    { id: '', label: 'Bill', key: 'bill_number' },
    { id: '', label: 'Date', key: 'bill_date' },
    { id: '', label: 'Due Date', key: 'due_date' },
    { id: '', label: 'Status', key: 'status' },
    { id: '', label: 'Amount', key: 'total' },
    {
      id: '',
      label: 'Balance Due',
      key: 'due_amount',
      value: `$${purchaseOrderData?.bill?.due_amount}`
    }
  ];

  const convertToBill = async () => {
    try {
      setBtnLoading(true);
      await convertToBillPurcahseOrderApi(purchaseID);
      notyf.success('Purchase Order converted to bill Successfully');
      navigate('/bills');
      if (typeof refreshList === 'function') refreshList();
    } catch (error) {
    } finally {
      setBtnLoading(false);
    }
  };

  const handleVoid = async () => {
    try {
      if (purchaseID) {
        const res = await singleDeletePurchaseOrdersApi(purchaseID);
        navigate('/purchase-orders');
        refreshList();
        notyf.success('Status Successfully changed to Void');
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <Box sx={{ padding: '0 1rem', position: 'relative' }}>
      <OverlayLoader open={vWLoader} />
      <HeaderPaper>
        <Grid item container>
          {/* view header left  */}
          <Grid sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6'>
              {purchaseOrderData?.purchase_order_number}
            </Typography>
          </Grid>
          {/* view header right  */}
          <Grid
            sm={6}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}>
            {purchaseOrderData?.status === 'draft' && (
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
              hidingMenu={hidingMenu}
              showMenuItem={showMenuItem}
              submitFilesToApi={submitFilesToApi}
              files={files}
              setFiles={setFiles}
            />
            <IconButton
              onClick={() => {
                navigate('/purchase-orders');
              }}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </HeaderPaper>
      <Grid item sm={12}>
        <Paper sx={{ padding: '1rem' }}>
          {purchaseOrderData?.status === 'draft' && (
            <MUIButton
              startIcon={<EditIcon fontSize='small' />}
              variant='outlined'
              sx={{ ...BtnStyles }}
              router
              to={`/purchase-orders/edit/${id}`}>
              Edit
            </MUIButton>
          )}

          <MUIButton
            startIcon={<EmailOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}
            onClick={() => handlePurchaseMail(id)}>
            Send an Email
          </MUIButton>
          {/* <Menu
            anchorEl={emailMenuAnchor}
            open={Boolean(emailMenuAnchor)}
            onClose={closeEmailMenu}>
            <MenuItem
              onClick={() => {
                closeEmailMenu();
                handlePurchaseMail(id);
              }}>
              <MUIButton>Send Mail</MUIButton>
            </MenuItem>
          </Menu> */}
          <MUIButton
            startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}
            onClick={handlePdf}>
            Pdf/Print
          </MUIButton>
          {purchaseOrderData?.status === 'draft' && (
            <MUIButton
              startIcon={<HighlightOffRounded />}
              variant='outlined'
              sx={{ ...BtnStyles }}
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
      </Grid>

      <Paper sx={{ marginTop: '1rem' }}>
        <Box sx={{ padding: '0 1rem' }}>
          <Grid item container>
            <Grid item sm={12} my={3}>
              <TableAccordian title='Bills' data={bills} columns={tbCols} />
            </Grid>
          </Grid>
        </Box>

        {/* {(purchaseOrderData?.status === "issued"  &&  purchaseOrderData?.status !== "closed"  &&  typeof purchaseOrderData?.status !== 'undefined') ? (
        <Box sx={{padding:'0 1rem'}}>
            <Paper sx={{ padding: '1rem'  , margin:'1rem 0'}}>
     <Grid item container>
       <Grid item sm={9}>
         <Stack
           direction='row'
           display='flex'
           alignItems='center'
           spacing={2}
         >
           <img src={vector} alt='Create Bill' />
           <Box>
             <Typography>Convert to Bill</Typography>
             <Typography variant='caption'>
              Create Bill of Purchase Orders
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
           alignItems: 'center',
         }}
       >
         {btnLoading ? (
           <CircularProgress />
         ) : (
           <>
             <MUIButton
               sx={{ textTransform: 'capitalize' }}
               onClick={() => convertToBill()}
             >
               Convert to Bill 
             </MUIButton>
           </>
         )}
       </Grid>
     </Grid>
   </Paper>
        </Box>
   
       ) : null
  
} */}
        <Box mb={3} paddingX={2} paddingY={1}>
          <ViewTemplates
            title='Purchase Order'
            itemsColumns={columns}
            headerInfo={info}
            data={purchaseOrderData?.purchase_order_items}
            apiData={purchaseOrderData}
            headings={headings}
            addressData={{
              default_billing_address:
                purchaseOrderData?.vendor?.default_billing_address,
              default_shipping_address: purchaseOrderData?.customer_address
            }}
            showShippingCharges={false}
            termsAndConditions={purchaseOrderData?.terms_and_condition}
            organizationAddress={
              purchaseOrderData?.deliver_type === 'organization'
            }
          />
        </Box>
      </Paper>
      <ConfirmDialog
        title='Are you sure you want to update the status to void'
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        {...dialogProps}
      />
    </Box>
  );
};

export default ViewPurchase;

const BtnStyles = {
  margin: '0 .2rem'
};
