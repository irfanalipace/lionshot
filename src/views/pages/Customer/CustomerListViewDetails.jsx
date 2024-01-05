import { useState, useEffect } from 'react';
import { customersSingleApi, deleteCustomer } from '../../../core/api/customer';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { Grid, IconButton, Tab, Typography } from '@mui/material';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import GridRow from '../../Components/GridRow/GridRow';
import {
  HeaderMenuButton,
  StyledListbox,
  StyledMenuItem,
  headerMenuBox
} from './CustomerStylesConst';
import { Box } from '@mui/system';
import { ArrowDropDown, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';
import ContainerPaper from '../../Components/Containers/ContainerPaper';
import { TabPanel, TabList, TabContext } from '@mui/lab';
import Comment from './ViewCustomer/Comment';
import TransactionTab from './ViewCustomer/TransactionTab';
import OverviewTab from './ViewCustomer/OverviewTab';
import StatementsTab from './ViewCustomer/StatementsTab';
import OverlayLoader from '../../Components/OverlayLoader/OverlayLoader';
import {
  //  decryptId,
  generateEncryptedID
} from '../../../core/utils/helpers';

function CustomerListViewDetails({ id, setRefresh }) {
  // id = decryptId(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customerData, setcustomerData] = useState();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //  single customer api
  const getsinglecustomer = async () => {
    try {
      setLoading(true);
      const singleCustomer = await customersSingleApi(id);
      setcustomerData(singleCustomer);
      // eslint-disable-next-line no-empty
    } catch (e) {
      navigate('/customer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getsinglecustomer();
  }, [id]);

  const handleDelete = async id => {
    try {
      const res = await deleteCustomer(id);
      if (res) {
        navigate('/customer');
        setRefresh(prev => prev + 1);
      }
    } catch (err) {
      console.log('err', err);
    }
  };
  const handleSendMail = id => {
    navigate(`/send-email/customer/${generateEncryptedID(id)}`);
  };

  return (
    <Box sx={{ position: 'relative' }} pl={2}>
      <OverlayLoader open={loading} />
      <HeaderPaper>
        <GridRow style={{ marginBottom: '0px' }}>
          <Grid item xs={6}>
            <Typography variant='h6'>{customerData?.display_name}</Typography>
          </Grid>
          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
            <Box sx={headerMenuBox}>
              <IconButton
                sx={{
                  fontSize: '16px',
                  border: `1px solid ${window.themeColors.primary}`,
                  borderRadius: '3px',
                  padding: '5px 15px',
                  color: window.themeColors.primary
                }}
                onClick={() =>
                  navigate(
                    `/customer/edit/${generateEncryptedID(customerData?.id)}`
                  )
                }>
                Edit
              </IconButton>
              {/* <AttachmentPopper /> */}
              {/* <IconButton sx={headerIconButton} style={{ marginLeft: '10px' }}>
								<AttachFile sx={{ color: 'black', fontSize: '18px' }} />
							</IconButton> */}
              <Dropdown>
                <HeaderMenuButton
                  style={{
                    backgroundColor: window.themeColors.primary,
                    color: 'white',
                    padding: '10px 10px 10px 15px',
                    marginLeft: '10px'
                  }}>
                  New Transaction
                  <ArrowDropDown sx={{ margin: '-3px 0 -8px 0' }} />
                </HeaderMenuButton>
                <Menu slots={{ listbox: StyledListbox }}>
                  <StyledMenuItem disabled sx={{ color: 'grey' }}>
                    Sale
                  </StyledMenuItem>
                  <StyledMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      navigate(
                        `/price-quote/new?customerId=${generateEncryptedID(id)}`
                      );
                    }}>
                    Price Quote
                  </StyledMenuItem>
                  <StyledMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      navigate(
                        `/sales-orders/new?customerId=${generateEncryptedID(
                          id
                        )}`
                      );
                    }}>
                    Sales Order
                  </StyledMenuItem>
                  <StyledMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      navigate(
                        `/invoices/new?customerId=${generateEncryptedID(id)}`
                      );
                    }}>
                    Invoice
                  </StyledMenuItem>
                  <StyledMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      navigate(
                        `/payment-received/new?customerId=${generateEncryptedID(
                          id
                        )}`
                      );
                    }}>
                    Account Receivable
                  </StyledMenuItem>
                  <StyledMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      navigate(
                        `/payment-links?customerId=${generateEncryptedID(id)}`
                      );
                    }}>
                    Payment Links
                  </StyledMenuItem>
                  <StyledMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      navigate(
                        `/credit-memo/new?customerId=${generateEncryptedID(id)}`
                      );
                    }}>
                    Credit Memo
                  </StyledMenuItem>
                </Menu>
              </Dropdown>
              <Dropdown>
                <HeaderMenuButton
                  style={{
                    color: 'black',
                    padding: '10px 10px 10px 15px',
                    marginLeft: '10px'
                  }}>
                  More
                  <ArrowDropDown sx={{ margin: '-3px 0 -8px 0' }} />
                </HeaderMenuButton>
                <Menu slots={{ listbox: StyledListbox }}>
                  {/* <StyledMenuItem> Associate Template</StyledMenuItem>
									<StyledMenuItem> Configure Customer Portal</StyledMenuItem> */}
                  <StyledMenuItem
                    onClick={() => {
                      handleSendMail(id);
                    }}>
                    Email Customer
                  </StyledMenuItem>
                  {/* <StyledMenuItem> Stop All Reminders</StyledMenuItem>
									<StyledMenuItem>Add New Card</StyledMenuItem>
									<StyledMenuItem>Request Payment Information</StyledMenuItem>
									<StyledMenuItem>Re-sync Contact from IMS CRM</StyledMenuItem>
									<StyledMenuItem>Link to Vendor</StyledMenuItem>
									<StyledMenuItem>Clone</StyledMenuItem>
									<StyledMenuItem>Merge Customers</StyledMenuItem>
									<StyledMenuItem>Mark as Inactive</StyledMenuItem> */}
                  <StyledMenuItem
                    onClick={() => {
                      setOpenConfirmDialog(true);
                      setDialogProps({
                        onConfirm: () => handleDelete(customerData.id)
                      });
                    }}>
                    Delete
                  </StyledMenuItem>
                </Menu>
              </Dropdown>
              <IconButton onClick={() => navigate('/customer')}>
                <Close />
              </IconButton>
            </Box>
          </Grid>
        </GridRow>
      </HeaderPaper>
      <ContainerPaper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChange}
                aria-label='lab API tabs example'>
                <Tab sx={CustomerTabsStyle} label='Overview' value='1' />
                {/* <Tab sx={CustomerTabsStyle} label='Comments' value='2' /> */}
                <Tab sx={CustomerTabsStyle} label='Transactions' value='3' />
                <Tab sx={CustomerTabsStyle} label='Statement' value='4' />
                {/* <Tab sx={CustomerTabsStyle} label='IMS CRM' value='5' /> */}
              </TabList>
            </Box>
            <TabPanel
              value='1'
              araia-label='OverView-Tab'
              sx={{ padding: '0px 0 50px 0' }}>
              <OverviewTab
                customerData={customerData}
                handleDelete={handleDelete}
                getsinglecustomer={getsinglecustomer}
                setOpenConfirmDialog={setOpenConfirmDialog}
                setDialogProps={setDialogProps}
              />
            </TabPanel>

            <TabPanel
              value='2'
              araia-label='Comments-Tab'
              sx={{ padding: '20px 0' }}>
              <Comment Comments={customerData?.comments || 'No Comments yet'} />
            </TabPanel>

            <TabPanel
              value='3'
              araia-label='Transaction-Tab'
              sx={{ padding: '20px 0' }}>
              <TransactionTab customerID={customerData?.id} />
            </TabPanel>

            <TabPanel
              value='4'
              araia-label='Statement-Tab'
              sx={{ padding: '20px 0' }}>
              <StatementsTab customerID={customerData?.id} />
            </TabPanel>

            <TabPanel
              value='5'
              araia-label='IMS-CRM-Tab'
              sx={{ padding: '20px 0' }}>
              IMS CRM
            </TabPanel>
          </TabContext>
        </Box>
      </ContainerPaper>
      <ConfirmDialog
        title='Are you sure you want to delete'
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        {...dialogProps}
      />
    </Box>
  );
}
const CustomerTabsStyle = {
  textTransform: 'none',
  color: '#000',
  fontWeight: '400',
  '&.Mui-selected': {
    color: '#000',
    fontWeight: '500'
  }
};

export default CustomerListViewDetails;
