import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import {
  StatusColor,
  formatDate,
  snakeCaseToPrettyText
} from '../../../../core/utils/helpers';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import CloseIcon from '@mui/icons-material/Close';
import {
  getInvoiceDashboardDetailsApi,
  downloadInvoiceDashboradApi
} from '../../../../core/api/CustomerPortal/customerportal';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import ViewTemplates from '../../../Components/ViewTemplate/ViewTemplates';
import TableAccordian from '../../../Components/TableAccordian/TableAccordian';

import { useTheme } from '@emotion/react';

const ViewInvoice = () => {
  const navigate = useNavigate();
  const { customerId, id } = useParams();

  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setIsLoading] = useState(true);
  console.log('invoiceData', invoiceData);
  const navigating = () => {
    navigate(`/customer-portal/${customerId}/invoices`);
  };
  useEffect(() => {
    fetchingSingleInvoice();
  }, []);

  const fetchingSingleInvoice = async () => {
    try {
      const resp = await getInvoiceDashboardDetailsApi({
        customer_id: customerId,
        invoice_id: id
      });
      setInvoiceData(resp?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      navigating();
    }
  };

  const columns = [
    { id: '', label: 'No.', key: 'index' },
    { id: '', label: 'Items Name', key: 'item_name' },
    { id: '', label: 'Qty', key: 'quantity' },
    // { id: '', label: 'UOM', key: 'uom' },
    { id: '', label: 'Rate(USD)', key: 'rate' },
    { id: '', label: 'Amount(USD)', key: 'total' }
  ];

  const invoiceCalculationsInfo = [
    {
      label: 'Paid Amount',
      key: 'paid_amount'
    },
    {
      label: 'Due Amount',
      key: 'due_amount'
    }
  ];

  const info = [
    {
      label: 'Invoice Ref:',
      value:
        invoiceData?.invoice_number !== null ? invoiceData?.invoice_number : '-'
    },
    {
      label: 'Invoice Date:',
      value:
        invoiceData?.invoice_date !== null
          ? formatDate(invoiceData?.invoice_date)
          : '-'
    },

    {
      label: 'Terms:',
      value: invoiceData?.term_name || invoiceData?.term?.term_name || '-'
    },
    {
      label: 'Payment Mode:',
      value: invoiceData?.mode_of_payment_value || '-'
    },
    {
      label: 'Delivery Terms:',
      value: 'Fedex'
    }
  ];
  if (invoiceData?.po_reference) {
    info.splice(2, 0, {
      label: 'P.O. Reference:',
      value: invoiceData?.po_reference || ''
    });
  }
  const theme = useTheme();
  const tbPaymentReceiveCols = [
    { id: '', label: 'No.', key: 'index' },
    { id: '', label: 'Date', key: 'payment_date' },
    { id: '', label: 'Payment Number', key: 'payment_number' },
    { id: '', label: 'Reference Number', key: 'reference_number' },
    //	{ id: '', label: 'Status', key: 'status' },
    { id: '', label: 'Payment Mode', key: 'payment_mode' },
    { id: '', label: 'Payment Made', key: 'payment_made' },
    { id: '', label: 'Amount Received', key: 'amount_received' }
  ];

  const tbPriceQuoteCols = [
    { id: '', label: 'No.', key: 'index' },
    { id: '', label: 'Date', key: 'estimate_date' },
    { id: '', label: 'Price Quote', key: 'estimate_number' },
    { id: '', label: 'Status', key: 'status' },
    //	{ id: '', label: 'Due Date', key: 'expiry_date' },
    { id: '', label: 'Amount', key: 'total' }
    //	{ id: '', label: 'Balance Due', key: 'rate' },
  ];

  const tbSaleOrderCols = [
    { id: '', label: 'No.', key: 'index' },
    {
      id: '',
      label: 'Date',
      key: 'sale_order_date'
    },
    { id: '', label: 'Sale Order', key: 'sale_order_number' },
    { id: '', label: 'Status', key: 'status' },
    //	{ id: '', label: 'Due Date', key: 'sale_order_date' },
    { id: '', label: 'Amount', key: 'total' }
    //	{ id: '', label: 'Balance Due', key: 'total' },
  ];

  const tbData = [
    {
      sale_order_number: invoiceData?.sale_order?.sale_order_number,
      status: (
        <Typography
          variant='body2'
          sx={{
            color: StatusColor(invoiceData?.sale_order?.status, theme)
          }}>
          {snakeCaseToPrettyText(invoiceData?.sale_order?.status)}
        </Typography>
      ),
      total: `$${invoiceData?.sale_order?.total}`,
      sale_order_date: formatDate(invoiceData?.sale_order?.sale_order_date)
    }
  ];

  const downloadingPdf = async () => {
    // const decId = decryptId(id);

    try {
      const resp = await downloadInvoiceDashboradApi({
        id,
        customer_id: customerId
      });
      window.open(resp?.data?.url, '_blank');
    } catch (error) {}
  };
  return (
    <>
      <OverlayLoader open={loading} />
      <Box sx={{ padding: '0 1rem' }}>
        <HeaderPaper
          sx={{
            paddingLeft: '2rem',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
          <Typography variant='h6'>Invoice</Typography>
          <IconButton onClick={() => navigating()}>
            <CloseIcon />
          </IconButton>
        </HeaderPaper>
        <Paper
          sx={{
            padding: '3rem 5rem',
            margin: ''
          }}>
          {/* <Grid item xs={12} mb={3} display='flex' justifyContent='flex-end'>
						<PayNow />
					</Grid> */}
          {invoiceData?.sale_order?.estimate && (
            <Grid item container display='flex' justifyContent='center' mb={2}>
              <Grid item sm={9}>
                <TableAccordian
                  title='Price Quote'
                  data={invoiceData?.sale_order?.estimate}
                  columns={tbPriceQuoteCols}></TableAccordian>
              </Grid>
            </Grid>
          )}

          {invoiceData?.sale_order && (
            <Grid item container display='flex' justifyContent='center' mb={2}>
              <Grid item sm={9}>
                <TableAccordian
                  title='Sales Order'
                  data={invoiceData?.sale_order}
                  columns={tbSaleOrderCols}></TableAccordian>
              </Grid>
            </Grid>
          )}
          {invoiceData?.payment_receiveds.length !== 0 && (
            <Grid item container display='flex' justifyContent='center' mb={2}>
              <Grid item sm={9}>
                {/* {console.log("invoiceData?.payment_receiveds",invoiceData?.payment_receiveds)} */}
                <TableAccordian
                  title='Payment Received'
                  data={invoiceData?.payment_receiveds}
                  columns={tbPaymentReceiveCols}></TableAccordian>
              </Grid>
            </Grid>
          )}

          <Grid item container display='flex' justifyContent='center' mb={2}>
            <Grid item sm={9}>
              {invoiceData?.id && (
                <ViewTemplates
                  title='INVOICE'
                  apiData={invoiceData}
                  data={invoiceData?.invoice_items}
                  itemsColumns={columns}
                  headerInfo={info}
                  bankDetails
                  addressData={invoiceData?.customer}
                  download
                  termsAndConditions={invoiceData?.terms_and_condition}
                  downloadingPdf={downloadingPdf}
                  headings={{ first: 'Bill to', second: 'Ship to' }}
                  extraCalculationsInfo={invoiceCalculationsInfo}
                />
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default ViewInvoice;
