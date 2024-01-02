import { useState, useEffect } from 'react';
import { vendorsSingleApi, deleteVendor } from '../../../core/api/vendor';
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
} from './VendorStylesConst';
import { Box } from '@mui/system';
import { ArrowDropDown, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';
import ContainerPaper from '../../Components/Containers/ContainerPaper';
import { TabPanel, TabList, TabContext } from '@mui/lab';
import Comment from './ViewVendor/Comment';
import TransactionTab from './ViewVendor/TransactionTab';
import OverviewTab from './ViewVendor/OverviewTab';
import StatementsTab from './ViewVendor/StatementsTab';
import OverlayLoader from '../../Components/OverlayLoader/OverlayLoader';
import {
  //  decryptId,
  generateEncryptedID
} from '../../../core/utils/helpers';

function VendorListViewDetails({ id, setRefresh }) {
  // id = decryptId(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendorData, setvendorData] = useState();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //  single vendor api
  const getsinglevendor = async () => {
    try {
      setLoading(true);
      const singleVendor = await vendorsSingleApi(id);
      setvendorData(singleVendor);
      // eslint-disable-next-line no-empty
    } catch (e) {
      navigate('/vendor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getsinglevendor();
  }, [id]);

  const handleDelete = async id => {
    try {
      const res = await deleteVendor(id);
      if (res) {
        navigate('/vendor');
        setRefresh(prev => prev + 1);
      }
    } catch (err) {
      console.log('err', err);
    }
  };
  const handleSendMail = id => {
    navigate(`/send-email/vendor/${generateEncryptedID(id)}`);
  };

  return (
    <Box sx={{ position: 'relative' }} pl={2}>
      <OverlayLoader open={loading} />
      <HeaderPaper>
        <GridRow style={{ marginBottom: '0px' }}>
          <Grid item xs={6}>
            <Typography variant='h6'>{vendorData?.display_name}</Typography>
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
                    `/vendor/edit/${generateEncryptedID(vendorData?.id)}`
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
                    Purchase Order
                  </StyledMenuItem>
                  <StyledMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      navigate(
                        `/purchase-orders/new?vendorId=${generateEncryptedID(
                          id
                        )}`
                      );
                    }}>
                    Purchase Order
                  </StyledMenuItem>
                  {/* <StyledMenuItem
										onClick={e => {
											e.stopPropagation();
											navigate(
												`/bills/new?vendorId=${generateEncryptedID(id)}`
											);
										}}
									>
										Bill
									</StyledMenuItem> */}
                  <StyledMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      navigate(
                        `/account-payable/new?vendorId=${generateEncryptedID(
                          id
                        )}`
                      );
                    }}>
                    Account Payable
                  </StyledMenuItem>
                  <StyledMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      navigate(
                        `/vendor-credits/new?vendorId=${generateEncryptedID(
                          id
                        )}`
                      );
                    }}>
                    Vendor Credit
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
                  <StyledMenuItem
                    onClick={() => {
                      handleSendMail(id);
                    }}>
                    Email Vendor
                  </StyledMenuItem>
                  <StyledMenuItem
                    onClick={() => {
                      setOpenConfirmDialog(true);
                      setDialogProps({
                        onConfirm: () => handleDelete(vendorData.id)
                      });
                    }}>
                    Delete
                  </StyledMenuItem>
                </Menu>
              </Dropdown>
              <IconButton onClick={() => navigate('/vendor')}>
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
                <Tab sx={VendorTabsStyle} label='Overview' value='1' />
                {/* <Tab sx={VendorTabsStyle} label='Comments' value='2' /> */}
                <Tab sx={VendorTabsStyle} label='Transactions' value='3' />
                <Tab sx={VendorTabsStyle} label='Statement' value='4' />
                {/* <Tab sx={VendorTabsStyle} label='IMS CRM' value='5' /> */}
              </TabList>
            </Box>
            <TabPanel
              value='1'
              araia-label='OverView-Tab'
              sx={{ padding: '0px 0 50px 0' }}>
              <OverviewTab
                vendorData={vendorData}
                handleDelete={handleDelete}
                getsinglevendor={getsinglevendor}
                setOpenConfirmDialog={setOpenConfirmDialog}
                setDialogProps={setDialogProps}
              />
            </TabPanel>

            <TabPanel
              value='2'
              araia-label='Comments-Tab'
              sx={{ padding: '20px 0' }}>
              <Comment Comments={vendorData?.comments || 'No Comments yet'} />
            </TabPanel>

            <TabPanel
              value='3'
              araia-label='Transaction-Tab'
              sx={{ padding: '20px 0' }}>
              <TransactionTab vendorID={vendorData?.id} />
            </TabPanel>

            <TabPanel
              value='4'
              araia-label='Statement-Tab'
              sx={{ padding: '20px 0' }}>
              <StatementsTab vendorID={vendorData?.id} />
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
const VendorTabsStyle = {
  textTransform: 'none',
  color: '#000',
  fontWeight: '400',
  '&.Mui-selected': {
    color: '#000',
    fontWeight: '500'
  }
};

export default VendorListViewDetails;
