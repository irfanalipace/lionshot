import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Logo from '../../../assets/images/logos/computer.png';
import { Ribbon } from '../common';
import TemplateTable from './TemplateTable';
import TemplateAddress from './TemplateAddress';
import TemplateOtherDetails from './TemplateOtherDetails';
import Download from '../../pages/CustomerPortal/DownloadCustomerTemplate';
import { organizationDetails } from '../../../core/utils/constants';
import { toFixed } from '../../../core/utils/helpers';

const ViewTemplates = ({
  data,
  itemsColumns,
  status,
  headerInfo,
  calculationInfo,
  title,
  apiData,
  bankDetails,
  addressData,
  paymentInfo,
  download,
  downloadingPdf,
  headings,
  titleStyles,
  extraCalculationsInfo = [],
  organizationAddress,
  termsAndConditions,
  showCalculations = true,
  showDiscountAndTax = true,
  showShippingCharges = true
}) => {
  const getLabel = item => {
    if (item.key === 'discount') {
      return item?.type === 'percent' && item.value > 0
        ? item.label + ' ' + item.value + '%:'
        : `${item.label}`;
    } else {
      return item.label;
    }
  };

  const getValue = item => {
    if (item.key === 'discount') {
      return item?.type !== 'percent'
        ? '$' + toFixed(item.value)
        : '$' + ((item?.value / 100) * item?.value)?.toFixed(2);
    } else {
      return toFixed(item.value);
    }
  };
  return (
    <Box>
      <>
        <Paper
          sx={{
            position: 'relative',
            border: '.5px solid grey',
            maxWidth: '1100px'
          }}>
          {download && <Download downloadingPdf={downloadingPdf} />}{' '}
          <Ribbon status={status || apiData?.status} />
          <Box sx={{ padding: '2rem 2rem 0' }}>
            <Grid item container>
              <Grid item sm={7}>
                <Grid item sm={8}>
                  <Grid item container>
                    <Box sx={{ width: '100%', height: '100px' }}>
                      <img
                        src={Logo}
                        alt='logo'
                        style={{ padding: 0, margin: 0 }}
                      />
                    </Box>

                    <Grid item sm={7.5}>
                      <Typography variant='templateBody' fontSize={10}>
                        {organizationDetails.address.address} <br />
                        {organizationDetails.address.city}
                        {', '}
                        {organizationDetails.address.stateAbbr}
                        {', '}
                        {organizationDetails.address.postalCode} <br />{' '}
                        {organizationDetails.address.country}
                      </Typography>
                    </Grid>

                    <Grid item sm={4.5}>
                      <Typography variant='templateBody' fontSize={10}>
                        {organizationDetails.website} <br />
                        {organizationDetails.email}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item mt={6} sm={5}>
                <Box>
                  <Box
                    sm={12}
                    display={'flex'}
                    justifyContent='flex-end'
                    width='100%'>
                    <Typography
                      variant='templateHead'
                      fontSize={34}
                      textTransform={'uppercase'}
                      sx={titleStyles}
                      textAlign={'right'}>
                      {title}
                    </Typography>
                  </Box>

                  <Box>
                    <Grid container justifyContent={'end'}>
                      <Grid
                        item
                        // sm={6.8}
                        textAlign={'right'}>
                        {headerInfo?.map((row, index) => (
                          <Typography
                            variant='templateBody2'
                            fontSize={13}
                            sx={{
                              textAlign: 'right',
                              display: 'block',
                              height: '20px'
                            }}
                            key={index}>
                            {row?.label}
                          </Typography>
                        ))}
                      </Grid>
                      {/* <Grid item sm={0.5}></Grid> */}
                      <Grid
                        item
                        ml={1}
                        // sm={4.7}
                        // sx={{ textAlign: 'right ' }}
                      >
                        {headerInfo?.map((row, index) => (
                          <Typography
                            variant='templateBody'
                            key={index}
                            sx={{ display: 'block', height: '20px' }}>
                            {row.value}
                          </Typography>
                        ))}
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                {/* {headerInfo?.map((row, index) => (
										<Grid item container key={index}>
											
										</Grid>
									))} */}
              </Grid>
            </Grid>
            {addressData && (
              <Grid item container mt={4}>
                <Grid item sm={12}>
                  <TemplateAddress
                    data={addressData}
                    title={title}
                    headings={headings}
                    paymentInfo={paymentInfo}
                    organizationAddress={organizationAddress}
                    emailAddress={
                      apiData?.customer?.email || apiData?.vendor?.email
                    }
                  />
                </Grid>
              </Grid>
            )}
            <Grid item container mt={6}>
              <Grid item sm={12}>
                <TemplateTable data={data} itemsColumns={itemsColumns} />
              </Grid>
            </Grid>
            {showCalculations &&
              (calculationInfo?.length ? (
                <Box width='100%' my={4}>
                  <Grid item container>
                    <Grid item sm={12}>
                      {calculationInfo.map((item, index) => {
                        return (
                          <Grid
                            key={index}
                            item
                            container
                            display={item?.hidden ? 'none' : ''}>
                            <Grid item sm={8}></Grid>
                            <Grid
                              item
                              sm={4}
                              display='flex'
                              justifyContent='space-between'
                              bgcolor={item?.primary ? '#f0f0f0' : ''}
                              paddingX={item?.primary ? '9px' : ''}>
                              <Typography variant='templateBody2'>
                                {getLabel(item)}
                              </Typography>
                              <Typography variant='templateBody' fontSize={14}>
                                {getValue(item)}
                              </Typography>
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Box width='100%' my={4}>
                  <Grid item container>
                    <Grid item sm={12}>
                      <Grid item container>
                        <Grid item sm={8}></Grid>
                        <Grid
                          item
                          sm={4}
                          display='flex'
                          justifyContent='space-between'>
                          <Typography variant='templateBody2'>
                            Subtotal:
                          </Typography>
                          <Typography variant='templateBody' fontSize={14}>
                            ${parseFloat(apiData?.sub_total ?? 0)?.toFixed(2)}
                          </Typography>
                        </Grid>
                      </Grid>
                      {showDiscountAndTax && (
                        <>
                          <Grid item container>
                            <Grid item sm={8}></Grid>
                            <Grid
                              item
                              sm={4}
                              display='flex'
                              justifyContent='space-between'>
                              <Typography variant='templateBody2'>
                                Discount
                                {(apiData?.discount_type === 'Percentage' ||
                                  apiData?.discount_type === 'percent') &&
                                apiData?.discount > 0
                                  ? ' ' + apiData?.discount + '%:'
                                  : ':'}
                              </Typography>
                              <Typography variant='templateBody' fontSize={14}>
                                {apiData?.discount_type !== 'Percentage' &&
                                apiData?.discount_type !== 'percent'
                                  ? '$' +
                                    parseFloat(apiData?.discount)?.toFixed(2)
                                  : '$' +
                                    (
                                      (apiData?.discount / 100) *
                                      apiData?.sub_total
                                    )?.toFixed(2)}
                              </Typography>
                              {/* <Typography variant='templateBody' fontSize={14}>
                              ${apiData?.discount_amount}
                            </Typography> */}
                            </Grid>
                          </Grid>
                          <Grid item container>
                            <Grid item sm={8}></Grid>
                            <Grid
                              item
                              sm={4}
                              display='flex'
                              justifyContent='space-between'>
                              <Typography variant='templateBody2'>
                                Tax:
                              </Typography>
                              <Typography variant='templateBody' fontSize={14}>
                                $
                                {parseFloat(apiData?.tax_amount ?? 0)?.toFixed(
                                  2
                                )}
                              </Typography>
                            </Grid>
                          </Grid>
                        </>
                      )}

                      {showShippingCharges && (
                        <Grid item container>
                          <Grid item sm={8}></Grid>
                          <Grid
                            item
                            sm={4}
                            display='flex'
                            justifyContent='space-between'>
                            <Typography variant='templateBody2'>
                              Shipping Charges:
                            </Typography>
                            <Typography variant='templateBody' fontSize={14}>
                              $
                              {parseFloat(
                                apiData?.shipping_charges ?? 0
                              )?.toFixed(2)}
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                      <Grid item container>
                        <Grid item sm={8}></Grid>
                        {apiData?.adjustment > 0 && (
                          <Grid
                            item
                            sm={4}
                            display='flex'
                            justifyContent='space-between'>
                            <Typography variant='templateBody2'>
                              Adjustments:
                            </Typography>
                            <Typography variant='templateBody' fontSize={14}>
                              $
                              {parseFloat(apiData?.adjustment ?? 0)?.toFixed(2)}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>

                    {/* <Grid item sm={12}> */}
                    <Grid item container my={1}>
                      <Grid item sm={7.9}></Grid>
                      <Grid
                        item
                        sm={4.1}
                        display='flex'
                        justifyContent='space-between'
                        bgcolor='#f0f0f0'
                        paddingX={'9px'}>
                        <Typography variant='templateBody2'>Total:</Typography>
                        <Typography variant='templateBody' fontSize={14}>
                          ${parseFloat(apiData?.total ?? 0)?.toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <>
                      {extraCalculationsInfo?.map((info, index) => (
                        <Grid key={index} item container>
                          <Grid item sm={8}></Grid>
                          <Grid
                            item
                            sm={4}
                            display='flex'
                            justifyContent='space-between'>
                            <Typography variant='templateBody2'>
                              {info.label}:
                            </Typography>
                            <Typography variant='templateBody' fontSize={14}>
                              $
                              {parseFloat(apiData?.[info?.key] ?? 0)?.toFixed(
                                2
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                      ))}
                    </>
                    {/* </Grid> */}
                  </Grid>
                </Box>
              ))}
          </Box>
          <TemplateOtherDetails
            bankDetails={bankDetails}
            termsAndConditions={termsAndConditions}
          />
        </Paper>
      </>
    </Box>
  );
};

export default ViewTemplates;
