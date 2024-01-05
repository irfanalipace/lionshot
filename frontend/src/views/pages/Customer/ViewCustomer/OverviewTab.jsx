/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import GridRow from '../../../Components/GridRow/GridRow';
import { Box } from '@mui/system';
import {
  AccountBox,
  AccountCircle,
  AddCircleOutline,
  Edit,
  ExpandMoreOutlined,
  LocalPhone,
  PhoneAndroid,
  Shortcut
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../Components/Modal/Dialog';
import AddressForm from '../../../Components/Address/AddressForm/AddressForm';
import CustomerContactsForm from '../../../Components/CustomerContacts/CustomerContactsForm';
import CustomerEditDetails from '../../../Components/CustomerContacts/CutomerEditDetailsModel';
import {
  formatDate,
  generateEncryptedID
} from '../../../../core/utils/helpers';

function OverviewTab({
  customerData,
  handleDelete,
  getsinglecustomer,
  setOpenConfirmDialog,
  setDialogProps
}) {
  const navigate = useNavigate();
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [addressType, setAddressType] = useState('');
  const [AddressModelTitle, setAddressModelTitle] = useState();
  const [openContactDialog, setopenContactDialog] = useState(false);
  const [openCustomerEdit, setopenCustomerEditDialog] = useState(false);
  const handleAddAddressForm = addressType => {
    setAddressFormOpen(!addressFormOpen);
    setAddressType(addressType);
  };
  const handleCloseMenu = () => {
    setAddressModelTitle(null);
    setSelectedAddress(null);
  };
  const handleContactPerson = e => {
    e.stopPropagation();
    setopenContactDialog(true);
  };
  const openContactModal = () => {
    setopenContactDialog(!openContactDialog);
  };
  const handleSendMail = id => {
    navigate(`/send-email/customer/${generateEncryptedID(id)}`);
  };

  return (
    <>
      <Grid container>
        <Grid
          item
          xs={4.5}
          sx={{ borderRight: 1, borderColor: 'divider' }}
          pt={1}>
          <Typography variant='body2' style={{ marginBottom: '10px' }}>
            <AccountCircle style={{ marginBottom: '-7px', color: '#707070' }} />
            {customerData?.first_name}
          </Typography>
          <Divider />
          <GridRow style={{ marginTop: '10px' }}>
            <Grid item xs={1.5}>
              <AccountBox fontSize='large' sx={{ color: '#C5C5C5' }} />
            </Grid>
            <Grid item xs={10.5}>
              <Typography variant='subtitle2'>
                {customerData?.display_name || 'N/A'}
              </Typography>
              <Typography variant='body2'>
                {customerData?.email || 'N/A'}
              </Typography>
              <Typography variant='body2'>
                <LocalPhone sx={{ marginBottom: '-3px', fontSize: '15px' }} />
                {customerData?.work_phone || 'N/A'}
              </Typography>
              <Typography variant='body2'>
                <PhoneAndroid
                  fontSize='small'
                  sx={{ marginBottom: '-3px', fontSize: '15px' }}
                />
                {customerData?.phone || 'N/A'}
              </Typography>
              <GridRow style={{ marginTop: '1px' }}>
                <Grid item style={{ paddingLeft: '24px' }}>
                  <Typography
                    color='primary'
                    variant='caption'
                    sx={{
                      borderRight: 1,
                      borderColor: 'divider',
                      paddingRight: '8px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setopenCustomerEditDialog(true)}>
                    Edit
                  </Typography>
                </Grid>
                <Grid item style={{ paddingLeft: '6px' }}>
                  <Typography
                    color='primary'
                    variant='caption'
                    sx={{
                      borderRight: 1,
                      borderColor: 'divider',
                      paddingRight: '8px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      handleSendMail(customerData?.id);
                    }}>
                    Send Email
                  </Typography>
                </Grid>
                {/* <Grid item style={{ paddingLeft: '6px' }}>
									<Typography
										color='primary'
										variant='caption'
										sx={{
											borderRight: 1,
											borderColor: 'divider',
											paddingRight: '8px',
										}}
									>
										Invite to Portal
									</Typography>
								</Grid> */}
                <Grid item style={{ paddingLeft: '6px' }}>
                  <Typography
                    color='primary'
                    variant='caption'
                    sx={{ paddingRight: '8px', cursor: 'pointer' }}
                    onClick={() => {
                      setOpenConfirmDialog(true);
                      setDialogProps({
                        onConfirm: () => handleDelete(customerData?.id)
                      });
                    }}>
                    Delete
                  </Typography>
                </Grid>
              </GridRow>
            </Grid>
          </GridRow>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
              <Typography>Address</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {customerData?.customer_billing_address?.length > 0 && (
                <GridRow style={{ marginBottom: '0' }}>
                  <Grid item xs={6}>
                    <Typography variant='body2'>Billing Address</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      textAlign: 'right',
                      paddingRight: '10px'
                    }}>
                    <Edit
                      color='primary'
                      fontSize='small'
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        handleCloseMenu();
                        handleAddAddressForm('billing');
                        setIsEdit(true);
                        setAddressModelTitle('Billing Address');
                        setSelectedAddress(
                          customerData?.customer_billing_address[0]
                        );
                      }}
                    />
                  </Grid>
                </GridRow>
              )}
              {customerData?.customer_billing_address?.map((row, index) => (
                <Box key={index}>
                  <Typography variant='subtitle2'>
                    {customerData?.customer_billing_address[index]?.attention ||
                      'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    {customerData?.customer_billing_address[index]?.address ||
                      'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    {customerData?.customer_billing_address[index]?.address2}{' '}
                  </Typography>
                  <Typography variant='body2' className='TextCapitalize'>
                    {' '}
                    {customerData?.customer_billing_address[index]?.city ||
                      'N/A'}
                    ,
                    {customerData?.customer_billing_address[index]?.state
                      ?.name || 'N/A'}
                    ,
                    {customerData?.customer_billing_address[index]?.zipcode ||
                      'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    Phone:
                    {customerData?.customer_billing_address[index]?.phone ||
                      'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    Fax:
                    {customerData?.customer_billing_address[index]?.fax}
                  </Typography>
                  <Typography variant='body2' className='TextCapitalize'>
                    {customerData?.customer_billing_address[index]?.country
                      ?.name || 'N/A'}
                  </Typography>
                </Box>
              ))}
            </AccordionDetails>
            <AccordionDetails>
              {customerData?.customer_shipping_address?.length > 0 && (
                <GridRow style={{ marginBottom: '0' }}>
                  <Grid item xs={6}>
                    <Typography variant='body2'>Shipping Address</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{ textAlign: 'right', paddingRight: '10px' }}>
                    <Edit
                      color='primary'
                      fontSize='small'
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        handleCloseMenu();
                        handleAddAddressForm('shipping');
                        setIsEdit(true);
                        setAddressModelTitle('Shipping Address');
                        setSelectedAddress(
                          customerData?.customer_shipping_address[0]
                        );
                      }}
                    />
                  </Grid>
                </GridRow>
              )}

              {customerData?.customer_shipping_address?.map((row, index) => (
                <Box key={index} mt={2}>
                  <Typography variant='subtitle2'>
                    {customerData?.customer_shipping_address[index]
                      ?.attention || 'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    {customerData?.customer_shipping_address[index]?.address ||
                      'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    {customerData?.customer_shipping_address[index]?.address2}
                  </Typography>
                  <Typography variant='body2' className='TextCapitalize'>
                    {customerData?.customer_shipping_address[index]?.city ||
                      'N/A'}
                    ,
                    {customerData?.customer_shipping_address[index]?.state
                      ?.name || 'N/A'}
                    ,
                    {customerData?.customer_shipping_address[index]?.zipcode ||
                      'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    Phone:
                    {customerData?.customer_shipping_address[index]?.phone ||
                      'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    Fax:
                    {customerData?.customer_shipping_address[index]?.fax ||
                      'N/A'}
                  </Typography>
                  <Typography variant='body2' className='TextCapitalize'>
                    {customerData?.customer_shipping_address[index]?.country
                      ?.name || 'N/A'}
                  </Typography>
                </Box>
              ))}

              <Button
                onClick={() => {
                  handleCloseMenu();
                  handleAddAddressForm('shipping');
                  setAddressModelTitle('Add Additional Address');
                }}>
                Add Additional Address
              </Button>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
              <Typography>Other Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <GridRow>
                <Grid item xs={6}>
                  <Typography variant='body2Grey' component={'p'}>
                    Customer Type
                  </Typography>
                  <Typography variant='body2Grey' component={'p'}>
                    Default Currency
                  </Typography>
                  <Typography variant='body2Grey' component={'p'}>
                    Payment Terms
                  </Typography>
                  <Typography variant='body2Grey' component={'p'}>
                    Tax Preference
                  </Typography>
                  <Typography variant='body2Grey' component={'p'}>
                    Portal Status
                  </Typography>
                  <Typography variant='body2Grey' component={'p'}>
                    Source
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant='body2'
                    sx={{ textTransform: 'capitalize' }}>
                    {customerData?.type || 'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    {customerData?.currency || 'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    {customerData?.term?.term_name || 'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    {customerData?.tax_preference === 'tax_exempt'
                      ? 'Tax Exempt'
                      : 'Taxable' || 'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    {customerData?.is_portal_access === 0
                      ? 'Disabled'
                      : 'Enabled' || 'N/A'}
                  </Typography>
                  <Typography variant='body2'>CSV</Typography>
                </Grid>
              </GridRow>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
              <Typography>
                Contact Person ({customerData?.customer_contacts.length})
              </Typography>
              <IconButton
                sx={{
                  position: 'absolute',
                  right: '40px',
                  marginTop: '-8px'
                }}
                onClick={handleContactPerson}>
                <AddCircleOutline color='primary' />
              </IconButton>
            </AccordionSummary>
            <AccordionDetails>
              {customerData?.customer_contacts?.map((row, index) => (
                <Box key={index} mb={1}>
                  <Typography variant='subtitle2'>
                    {customerData?.customer_contacts[index]?.salutation}
                    {customerData?.customer_contacts[index]?.first_name ||
                      'N/A'}
                    {customerData?.customer_contacts[index]?.last_name || 'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    {customerData?.customer_contacts[index]?.email || 'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    {customerData?.customer_contacts[index]?.designation ||
                      'Designation: N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    {customerData?.customer_contacts[index]?.department ||
                      'Department: N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    <LocalPhone
                      sx={{ marginBottom: '-3px', fontSize: '15px' }}
                    />
                    {customerData?.customer_contacts[index]?.work_phone ||
                      'Work Phone: N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    <PhoneAndroid
                      fontSize='small'
                      sx={{ marginBottom: '-3px', fontSize: '15px' }}
                    />
                    {customerData?.customer_contacts[index]?.mobile ||
                      'Mobile Number: N/A'}
                  </Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
          {/* {customerData?.is_portal_access === 0 && (
						<Box
							sx={{
								backgroundColor: '#BDE0FC',
								padding: '20px',
								margin: '20px 10px',
								borderRadius: '8px',
							}}
						>
							<GridRow>
								<Grid item xs={1.2} sx={{ marginTop: '-70px' }}>
									<Collections />
								</Grid>
								<Grid item xs={10.8}>
									<Typography variant='body2'>
										Customer Portal allows your customers to keep track of all
										the transactions between them and your business. Learn More
									</Typography>
									<Button
										variant='contained'
										size='small'
										sx={{ marginTop: '10px' }}
									>
										Enable Portal
									</Button>
								</Grid>
							</GridRow>
						</Box>
					)} */}
          {/* {customerData?.is_portal_access === 1 && (
						<Box
							sx={{
								backgroundColor: '#F2FFF0',
								padding: '20px',
								margin: '20px 10px',
								borderRadius: '8px',
							}}
						>
							<Grid container>
								<Grid item xs={1.2}>
									<ContactEmergency />
								</Grid>
								<Grid item xs={10.8}>
									<Typography variant='body2'>
										Would you like to know how much your customers like your
										service?
									</Typography>
									<Button
										variant='contained'
										size='small'
										sx={{ marginTop: '10px' }}
									>
										Request Review
									</Button>
								</Grid>
							</Grid>
						</Box>
					)} */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
              <Typography>Record Info</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <GridRow>
                <Grid item xs={6}>
                  <Typography variant='body2Grey' component={'p'}>
                    Customer ID
                  </Typography>
                  <Typography variant='body2Grey' component={'p'}>
                    Default Currency
                  </Typography>
                  <Typography variant='body2Grey' component={'p'}>
                    Created At
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2'>
                    {customerData?.id || 'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    {customerData?.currency || 'N/A'}
                  </Typography>
                  <Typography variant='body2'>
                    {formatDate(customerData?.created_at) || 'N/A'}
                  </Typography>
                </Grid>
              </GridRow>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={7.5} pt={2}>
          <Grid container>
            <Grid item xs={1.5} style={{ padding: '10px 15px' }}>
              <Box
                sx={{
                  border: '1px solid #1976D2',
                  textAlign: 'center',
                  borderRadius: '8px',
                  padding: '5px'
                }}>
                <Shortcut sx={{ color: '#1976D2' }} />
              </Box>
            </Grid>
            <Grid item xs={10.5}>
              <Typography variant='body1'>
                What's Next for Your Customer?
              </Typography>
              <Typography variant='body2' pr={5}>
                Your customer has been added. Create and send a price quote or
                an invoice to your customer for the items you want to sell to
                them.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant='contained'
                  size='small'
                  sx={{
                    margin: '10px 10px 0 0',
                    '&:hover': { backgroundColor: '#E0E0E0' },
                    backgroundColor: '#E0E0E0',
                    color: 'black'
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    navigate(
                      `/price-quote/new?customerId=${generateEncryptedID(
                        customerData?.id
                      )}`
                    );
                  }}>
                  New Price Quote
                </Button>
                <Button
                  variant='contained'
                  size='small'
                  sx={{ margin: '10px 10px 0 0' }}
                  onClick={e => {
                    e.stopPropagation();
                    navigate(
                      `/invoices/new?customerId=${generateEncryptedID(
                        customerData?.id
                      )}`
                    );
                  }}>
                  New Invoice
                </Button>
                {/* <Dropdown>
                                    <HeaderMenuButton
                                        onClick={e => e.stopPropagation()}
                                        sx={{
                                            '&:hover': { border: '1px solid #1976D2' },
                                            backgroundColor: 'transparent',
                                            border: '1px solid #1976D2',
                                            borderRadius: '8px',
                                            padding: '1px',
                                            marginTop: '8px'
                                        }}>
                                        <MoreVert sx={{ color: '#1976D2' }} />
                                    </HeaderMenuButton>
                                    <Menu slots={{ listbox: StyledListbox }}>
                                        <StyledMenuItem> Don't Show again</StyledMenuItem>
                                    </Menu>
                                </Dropdown> */}
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ margin: '20px 0' }} />
          <Box sx={{ padding: '0 10px' }}>
            <Typography variant='body2Grey'>Payable Due Period</Typography>
            <Typography variant='body2'>
              {customerData?.term?.term_name || 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ padding: '10px 10px' }} mt={2}>
            <Typography variant='body1bold'> Receivable</Typography>
          </Box>

          <Box pr={5}>
            {customerData ? (
              <>
                <Grid
                  container
                  style={{
                    margin: '0px 10px',
                    padding: '8px 5px 5px 8px',
                    borderBottom: '2px solid #E0E0E0',
                    backgroundColor: '#EEEEEE'
                  }}>
                  {/* <Grid item xs={4}>
										<Typography variant='body2'>Currency</Typography>
									</Grid>
									<Grid item xs={5}>
										<Typography variant='body2'>
											Out Standing Receivables
										</Typography>
									</Grid> */}
                  <Grid item xs={3}>
                    <Typography variant='body2'>Unused Credits</Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  style={{
                    margin: '0px 10px',
                    padding: '8px 5px 5px 8px',
                    borderBottom: '2px solid #E0E0E0'
                  }}>
                  {/* <Grid item xs={4}>
										<Typography component='p' variant='body2'>
											{customerData?.currency}
										</Typography>
									</Grid>
									<Grid item xs={5}>
										<Typography variant='body2'>
											${customerData?.invoice_number || 0}
										</Typography>
									</Grid> */}
                  <Grid item xs={3}>
                    <Typography variant='body2'>
                      ${customerData?.unused_credits || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Typography sx={{ textAlign: 'center', margin: '20px' }}>
                There are no Credit Memos
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
      <Modal
        title={AddressModelTitle}
        open={addressFormOpen}
        onClose={handleAddAddressForm}
        sx={{
          position: 'absolute',
          right: 20,
          top: 18
        }}>
        {/* Adding Address Form */}
        {addressFormOpen && (
          <AddressForm
            onClose={handleAddAddressForm}
            addressFormOpen={addressFormOpen}
            type={addressType}
            address={isEdit && selectedAddress}
            onSave={getsinglecustomer}
            userId={customerData?.id}
            userType={'customer'}
          />
        )}
      </Modal>
      <Modal
        title='Add contact person'
        open={openContactDialog}
        onClose={openContactModal}>
        {openContactDialog ? (
          <CustomerContactsForm
            onSave={getsinglecustomer}
            onClose={openContactModal}
            customer_id={customerData?.id}
          />
        ) : null}
      </Modal>
      <Modal
        title='Edit Customer'
        open={openCustomerEdit}
        onClose={() => setopenCustomerEditDialog(false)}>
        {openCustomerEdit ? (
          <CustomerEditDetails
            onSave={getsinglecustomer}
            onClose={() => setopenCustomerEditDialog(false)}
            customer_id={customerData?.id}
          />
        ) : null}
      </Modal>
    </>
  );
}

export default OverviewTab;
