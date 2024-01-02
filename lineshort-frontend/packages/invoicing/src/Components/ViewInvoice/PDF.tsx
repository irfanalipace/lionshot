import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import Logo from '../../assets/computer.png';
import {
  InvoiceGridItemKey,
  InvoiceGridItemValue
} from '@/Components/ViewInvoice';
import { TableBodyCell, TableHeadCell } from '../Table/Table';
import {
  EstimateStatusColor,
  formatDate,
  snakeCaseToPrettyText
} from '@/utils/helper';

export default function PDF({ invoiceData }) {
  return (
    <Paper
      sx={{
        border: '.5px solid grey',
        margin: '2rem 0',
        position: 'relative',
        maxWidth: '1100px'
      }}>
      {invoiceData?.id && invoiceData?.status && (
        <Ribbon status={invoiceData.status} />
      )}

      <Box sx={{ padding: '1.4rem' }}>
        <Grid item container p={0} mt={5}>
          <Grid item sm={7}>
            <Grid container item sm={8}>
              <Grid item container>
                <img src={Logo} alt='logo' style={{ padding: 0, margin: 0 }} />
                <Grid item sm={6} mt={-4}>
                  <Typography
                    variant='templateBody'
                    fontSize={10}
                    fontWeight={500}>
                    1275 Corporate Center Drive <br />
                    Eagan MN 55121
                    <br />
                    United States
                  </Typography>
                </Grid>

                <Grid item sm={4} mt={-4}>
                  <Typography
                    fontWeight={500}
                    variant='templateBody'
                    fontSize={10}>
                    www.minnesotacomputers.us <br />
                    sales@minnesotacomputers.us
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            mt={6}
            item
            sm={5}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Grid item container>
              <Grid container>
                <Grid
                  item
                  sm={11}
                  container
                  direction='row'
                  justifyContent='flex-end'>
                  <Typography
                    variant='templateHead'
                    fontSize='2.5rem'
                    letterSpacing={-1.5}>
                    INVOICE
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <InvoiceGridItemKey>Invoice Number:</InvoiceGridItemKey>
                <InvoiceGridItemValue>
                  {invoiceData?.invoice_number}
                </InvoiceGridItemValue>
              </Grid>

              <Grid container>
                <InvoiceGridItemKey>Invoice Date:</InvoiceGridItemKey>
                <InvoiceGridItemValue>
                  {invoiceData?.invoice_date
                    ? formatDate(invoiceData?.invoice_date)
                    : '--'}
                </InvoiceGridItemValue>
              </Grid>
              {invoiceData?.po_reference && (
                <Grid container>
                  <InvoiceGridItemKey>P.O Reference:</InvoiceGridItemKey>
                  <InvoiceGridItemValue>
                    {invoiceData?.po_reference
                      ? invoiceData?.po_reference
                      : '--'}
                  </InvoiceGridItemValue>
                </Grid>
              )}

              <Grid container>
                <InvoiceGridItemKey>Terms</InvoiceGridItemKey>
                <InvoiceGridItemValue>
                  {invoiceData?.term?.term_name}
                </InvoiceGridItemValue>
              </Grid>

              <Grid container>
                <InvoiceGridItemKey>Payment Mode:</InvoiceGridItemKey>
                <InvoiceGridItemValue>
                  {invoiceData?.mode_of_payment_value}
                </InvoiceGridItemValue>
              </Grid>

              <Grid container>
                <InvoiceGridItemKey>Delivery Terms:</InvoiceGridItemKey>
                <InvoiceGridItemValue>Fedex</InvoiceGridItemValue>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container mt={6}>
          <Grid sm={12}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                    <TableHeadCell sx={{ padding: '0px 16px' }}>
                      <Typography variant='templateBody2'>Bill To</Typography>
                    </TableHeadCell>
                    <TableHeadCell sx={{ padding: '6px 16px' }}>
                      <Typography variant='templateBody2'>Ship To</Typography>
                    </TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableBodyCell>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                        <Typography fontWeight={500} variant='templateBody'>
                          {(invoiceData &&
                            invoiceData?.customer?.default_billing_address
                              ?.attention) ||
                            ''}
                        </Typography>
                        <Typography fontWeight={500} variant='templateBody'>
                          {invoiceData &&
                            `${
                              invoiceData?.customer?.default_billing_address
                                ?.address || ''
                            } ${
                              invoiceData?.customer?.default_billing_address
                                ?.city || ''
                            } ${
                              invoiceData?.customer?.default_billing_address
                                ?.state_name || ''
                            }`}
                        </Typography>
                        <Typography
                          fontWeight={500}
                          variant='templateBody'
                          textTransform='capitalize'>
                          {invoiceData &&
                            `${
                              invoiceData?.customer?.default_billing_address
                                ?.zipcode || ''
                            } ${
                              invoiceData?.customer?.default_billing_address
                                ?.country_name || ''
                            } `}
                        </Typography>
                        <Typography fontWeight={500} variant='templateBody'>
                          {(invoiceData &&
                            invoiceData?.customer?.default_billing_address
                              ?.phone) ||
                            ''}
                        </Typography>
                        <Typography fontWeight={500} variant='templateBody'>
                          {(invoiceData && invoiceData.customer?.email) || ''}
                        </Typography>
                      </Box>
                    </TableBodyCell>
                    <TableBodyCell>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                        <Typography fontWeight={500} variant='templateBody'>
                          {(invoiceData &&
                            invoiceData?.customer?.default_shipping_address
                              ?.attention) ||
                            ''}
                        </Typography>
                        <Typography fontWeight={500} variant='templateBody'>
                          {invoiceData &&
                            `${
                              invoiceData?.customer?.default_shipping_address
                                ?.address || ''
                            } ${
                              invoiceData?.customer?.default_shipping_address
                                ?.city || ''
                            } ${
                              invoiceData?.customer?.default_shipping_address
                                ?.state_name || ''
                            }`}
                        </Typography>
                        <Typography fontWeight={500} variant='templateBody'>
                          {invoiceData &&
                            `${
                              invoiceData?.customer?.default_shipping_address
                                ?.zipcode || ''
                            } ${
                              invoiceData?.customer?.default_shipping_address
                                ?.country_name || ''
                            } `}
                        </Typography>
                        <Typography fontWeight={500} variant='templateBody'>
                          {(invoiceData &&
                            invoiceData?.customer?.default_shipping_address
                              ?.phone) ||
                            ''}
                        </Typography>
                        <Typography fontWeight={500} variant='templateBody'>
                          {(invoiceData && invoiceData.customer?.email) || ''}
                        </Typography>
                      </Box>
                    </TableBodyCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <Grid item container mt={6} p={0}>
          <Grid sm={12}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: '#f0f0f0'
                    }}>
                    <TableHeadCell sx={{ padding: '6px 16px' }}>
                      <Typography variant='templateBody2'>No</Typography>
                    </TableHeadCell>
                    <TableHeadCell sx={{ padding: '6px 16px' }}>
                      <Typography variant='templateBody2'>
                        Items Description
                      </Typography>
                    </TableHeadCell>
                    <TableHeadCell sx={{ padding: '6px 16px' }}>
                      <Typography variant='templateBody2'>Qty</Typography>
                    </TableHeadCell>
                    <TableHeadCell sx={{ padding: '6px 16px' }}>
                      <Typography variant='templateBody2'>Rate(USD)</Typography>
                    </TableHeadCell>
                    <TableHeadCell sx={{ padding: '6px 16px' }}>
                      <Typography variant='templateBody2'>
                        Amount(USD)
                      </Typography>
                    </TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceData?.invoice_items?.map((item: any, indx: any) => (
                    <TableRow
                      key={indx}
                      sx={{
                        '&:last-child td, &:last-child th': {
                          border: 0,
                          borderBottom: '1px solid rgba(224, 224, 224, 1)'
                        }
                      }}>
                      <TableBodyCell component='th' scope='row'>
                        {indx + 1}
                      </TableBodyCell>
                      <TableBodyCell>
                        <Typography fontWeight={500} variant='templateBody'>
                          {item.item_name}
                        </Typography>
                      </TableBodyCell>
                      <TableBodyCell>
                        <Typography fontWeight={500} variant='templateBody'>
                          {Number(item.quantity || 0)}
                        </Typography>
                      </TableBodyCell>

                      <TableBodyCell>
                        <Typography fontWeight={500} variant='templateBody'>
                          ${item.rate}
                        </Typography>
                      </TableBodyCell>
                      <TableBodyCell>
                        <Typography fontWeight={500} variant='templateBody'>
                          ${(Number(item.quantity) * item.rate).toFixed(2)}
                        </Typography>
                      </TableBodyCell>
                    </TableRow>
                  ))}
                  {/* {invoiceData?.estimate_items.length === 0 && <Typography textAlign='center' bgcolor='red'>No Item Found</Typography>} */}
                  {invoiceData?.estimate_items?.length === 0 && (
                    <TableRow>
                      <TableBodyCell align='center' colSpan={10}>
                        No Data Found
                      </TableBodyCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {invoiceData?.invoice_items &&
          invoiceData?.invoice_items.length > 0 && (
            <Box width='100%' my={4}>
              <Grid container sx={{ mt: 1 }}>
                <GridRow title='Subtotal' value={invoiceData?.sub_total} />
                <GridRow
                  title='Tax'
                  value={parseFloat(invoiceData?.tax_amount)?.toFixed(2)}
                />
                <GridRow
                  title='Discount'
                  value={
                    invoiceData.discount_type == 'dollor'
                      ? invoiceData?.discount?.toFixed(2)
                      : (
                          (Number(
                            parseFloat(invoiceData?.discount || 0)?.toFixed(2)
                          ) /
                            100) *
                          invoiceData?.sub_total
                        )?.toFixed(2)
                  }
                />
                <GridRow
                  title='Shipping Charges'
                  value={parseFloat(invoiceData?.shipping_charges)?.toFixed(2)}
                />
                {parseFloat(invoiceData?.adjustment) ? (
                  <GridRow
                    title='Adjustments'
                    value={parseFloat(invoiceData?.adjustment)?.toFixed(2)}
                  />
                ) : (
                  ''
                )}
                <Grid item sm={12} mt={1}>
                  <Grid item container>
                    <Grid item sm={8}></Grid>
                    <Grid
                      item
                      p={1}
                      sm={4}
                      display='flex'
                      justifyContent='space-between'
                      bgcolor='#f0f0f0'>
                      <Typography variant='templateBody2' fontWeight={700}>
                        Total:
                      </Typography>
                      <Typography
                        variant='templateBody'
                        fontSize={14}
                        fontWeight={500}>
                        ${invoiceData?.total}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <GridRow
                  title='Paid Amount'
                  value={parseFloat(invoiceData?.paid_amount)?.toFixed(2)}
                />
                <GridRow
                  title='Due Amount'
                  value={
                    invoiceData?.status === 'unpaid' ||
                    invoiceData?.status === 'partially_paid'
                      ? parseFloat(invoiceData?.due_amount)?.toFixed(2)
                      : 0
                  }
                />
              </Grid>
            </Box>
          )}
      </Box>
      <Box
        width='100%'
        sx={{ padding: '0 1.5rem 1.5rem 1.5rem', marginBottom: '1rem' }}>
        <Grid container>
          <Grid item sm={12}>
            <Grid item container>
              <Grid item sm={4} display='flex' justifyContent='space-between'>
                <Typography variant='templateBody2' fontSize={16} pb={1}>
                  Bank Details
                </Typography>
              </Grid>
            </Grid>
            <Grid item container>
              <Grid item sm={2} display='flex' justifyContent='space-between'>
                <Typography
                  fontSize={13}
                  variant='templateBody2'
                  fontWeight={600}>
                  A/C Title :
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='templateBody' textAlign={'right'}>
                  Minnesota Computers LLC
                </Typography>
              </Grid>
            </Grid>
            <Grid item container>
              <Grid item sm={2} display='flex' justifyContent='space-between'>
                <Typography
                  fontSize={13}
                  variant='templateBody2'
                  fontWeight={600}>
                  A/C No :
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='templateBody' textAlign={'right'}>
                  2915400432
                </Typography>
              </Grid>
            </Grid>
            <Grid item container>
              <Grid item sm={2} display='flex' justifyContent='space-between'>
                <Typography
                  fontSize={13}
                  variant='templateBody2'
                  fontWeight={600}>
                  Routing :
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='templateBody' textAlign={'right'}>
                  075900575
                </Typography>
              </Grid>
            </Grid>
            <Grid item container>
              <Grid item sm={2} display='flex' justifyContent='space-between'>
                <Typography
                  variant='templateBody2'
                  fontSize={13}
                  fontWeight={600}>
                  Swift Code :
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='templateBody' textAlign={'right'}>
                  ABGBUS44
                </Typography>
              </Grid>
            </Grid>
            <Grid item container>
              <Grid item sm={2} display='flex' justifyContent='space-between'>
                <Typography
                  variant='templateBody2'
                  fontSize={13}
                  fontWeight={600}>
                  Bank :
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='templateBody' textAlign={'right'}>
                  Associated Bank
                </Typography>
              </Grid>
            </Grid>
            {invoiceData?.terms_and_condition && (
              <>
                <Grid item container>
                  <Grid
                    item
                    sm={4}
                    display='flex'
                    justifyContent='space-between'
                    mt={2}>
                    <Typography variant='templateBody2' pb={1} fontSize={16}>
                      Terms and conditions
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container>
                  <Grid
                    item
                    sm={12}
                    display='flex'
                    justifyContent='space-between'>
                    <Typography variant='templateBody'>
                      {invoiceData?.terms_and_condition}
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export const Ribbon = ({ status }: { status: string }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        height: 85,
        width: '133px',
        overflow: 'hidden'
      }}>
      <Typography
        sx={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          color: 'white',
          width: '100%',
          textAlign: 'center',
          transform: 'rotate(-39.5deg)',
          transformOrigin: 'bottom left',
          textTransform: 'capitalize',
          background: EstimateStatusColor(status)
        }}>
        {snakeCaseToPrettyText(status)}
      </Typography>
    </Box>
  );
};

const GridRow = ({ title = '--', value = '0.00' }: any) => {
  return (
    <Grid item sm={12}>
      <Grid item container>
        <Grid item sm={8}></Grid>
        <Grid
          item
          py={0.1}
          sm={4}
          display='flex'
          justifyContent='space-between'>
          <Typography variant='templateBody2' fontWeight={700}>
            {title}:
          </Typography>
          <Typography variant='templateBody' fontSize={14} fontWeight={500}>
            ${value}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
