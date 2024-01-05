/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import vector from '../../../../../src/assets/images/Vector.png';

import {
  CircularProgress,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper
} from '@mui/material';
// mui components  && icon
import { Grid, Stack, Divider, Typography } from '@mui/material';
import MUIButton from '../../../Components/Button/MUIButton';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';

// styles
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

import { useNavigate } from 'react-router-dom';
import {
  addEstimatesFileApi,
  convertToSaleOrderApi,
  deleteEstimateApi,
  deleteEstimateFielsApi,
  downloadEstimateApi,
  showEstimateApi
} from '../../../../core/api/estimate';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { decryptId, formatDate } from '../../../../core/utils/helpers';
// import ActivityTimeLine from '../../../Components/ActivityTimeLine/ActivityTimeLine';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import ViewTemplates from '../../../Components/ViewTemplate/ViewTemplates';
import AttachmentCard from '../../../Components/FileUpload/AttachmentCard';
import { HighlightOff } from '@mui/icons-material';
import ConfirmDialog from '../../../Components/ConfirmDialog/ConfirmDialog';

const ViewPriceQuote = ({ id, setRefresh }) => {
  const decryptedId = decryptId(id);
  const TABS = {
    VIEW: 'VIEW',
    HISTORY: 'HISTORY'
  };

  const tabUnderlineStyles = {
    borderBottom: '2px solid #66B2FF',
    fontWeight: 550,
    cursor: 'pointer',
    borderRadius: '3px',
    color: '#66B2FF'
  };
  const [activeTab, setActiveTab] = useState(TABS.VIEW);
  const navigate = useNavigate();
  const [showMenuItem, setShowMenu] = useState(null);
  const [files, setFiles] = useState([]);
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
  const [estimateData, setEstimateData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});

  const showingMenu = event => {
    setShowMenu(event.currentTarget);
  };
  const hidingMenu = () => {
    setShowMenu(null);
  };

  // single estimate / show estimate / view
  useEffect(() => {
    fetchingSingleEstimate();
  }, [id]);

  const fetchingSingleEstimate = async () => {
    try {
      setIsLoadingOverlay(true);
      const resp = await showEstimateApi(decryptedId);
      setEstimateData(resp?.data);
      setFiles(resp?.data?.estimate_files);
    } catch (error) {
      navigate('/price-quote');
    } finally {
      setIsLoadingOverlay(false);
    }
  };
  const deleteEstimate = async idDelete => {
    try {
      const resp = await deleteEstimateApi(idDelete);
      if (resp) {
        navigate('/price-quote');
        notyf.success('Status Successfully changed to Void');
        setRefresh(prev => prev + 1);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const submitFilesToApi = newFiles => {
    return addEstimatesFileApi({
      attachments: newFiles,
      estimate_id: decryptedId
    });
  };

  const deleteFile = id => {
    return deleteEstimateFielsApi(id);
  };

  // mails menu

  // main page open
  const handleSendEstimateMain = id => {
    navigate(`/send-email/price-quote/${id}`);
  };

  // invoice conversion
  const convertingToSaleOrder = async id => {
    try {
      setIsLoading(true);
      const resp = await convertToSaleOrderApi({ id });
      notyf.success(resp?.message);
      navigate('/sales-orders');
      setRefresh(prev => prev + 1);
    } catch (error) {
      console.log('error', error);
    }
    setIsLoading(false);
  };

  const handlePdf = async () => {
    try {
      const resp = await downloadEstimateApi({ id: decryptedId });
      window.open(resp?.data?.url, '_blank');
    } catch (error) {
      console.log('error', error);
    }
  };

  const typoStyle = {
    color: '#333333',
    fontSize: '11pt',
    fontWeight: 400
  };

  const columns = [
    { id: '', label: 'No.', key: 'index' },
    { id: '', label: 'Items Description', key: 'item_name' },
    { id: '', label: 'Qty', key: 'quantity' },
    { id: '', label: 'Rate(USD)', key: 'rate' },
    { id: '', label: 'Amount(USD)', key: 'total' }
  ];
  const info = [
    { label: 'Price Quote Ref:', value: estimateData?.estimate_number },
    {
      label: 'Price Quote Date:',
      value:
        estimateData?.estimate_date && formatDate(estimateData?.estimate_date)
    },
    {
      label: 'Validity:',
      value: estimateData?.term?.term_name
    }
  ];

  return (
    <Box sx={{ padding: '0 1rem', position: 'relative' }}>
      <OverlayLoader open={isLoadingOverlay} />
      <HeaderPaper>
        <Grid item container>
          {/* view header left  */}
          <Grid item sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6'>
              {estimateData?.estimate_number}
            </Typography>
          </Grid>
          {/* view header right  */}
          <Grid
            item
            sm={6}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}>
            {estimateData?.status === 'draft' && (
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
            {/* <AttachmentCard
							deleteApi={deleteFile}
							submitFilesToApi={submitFilesToApi}
							setFiles={setFiles}
							files={files}
							showMenuItem={showMenuItem}
							hidingMenu={hidingMenu}
						/> */}
            <IconButton onClick={() => navigate('/price-quote')}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </HeaderPaper>

      <Grid item sm={12}>
        <Paper sx={{ padding: '1.5rem' }}>
          {estimateData?.status === 'draft' && (
            <MUIButton
              startIcon={<EditIcon fontSize='small' />}
              variant='outlined'
              sx={{ ...BtnStyles }}
              router
              to={`/price-quote/edit/${id}`}>
              Edit
            </MUIButton>
          )}
          <MUIButton
            startIcon={<EmailOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}
            onClick={() => handleSendEstimateMain(id)}>
            Send an email
          </MUIButton>

          <MUIButton
            startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}
            onClick={handlePdf}>
            Pdf/Print
          </MUIButton>
          {estimateData?.status === 'draft' && (
            <MUIButton
              startIcon={<HighlightOff fontSize='small' />}
              variant='outlined'
              sx={{ ...BtnStyles }}
              onClick={() => {
                setOpenConfirmDialog(true);
                setDialogProps({
                  onConfirm: () => deleteEstimate(estimateData.id)
                });
              }}>
              Void
            </MUIButton>
          )}
        </Paper>
      </Grid>

      <Paper sx={{ padding: '1.5rem', margin: '1rem 0' }}>
        <Grid item container my={4}>
          <Grid item xs={12} display='flex'>
            <Typography
              onClick={() => setActiveTab(TABS.VIEW)}
              sx={
                activeTab === TABS.VIEW
                  ? { ...tabUnderlineStyles, padding: '0 .5rem' }
                  : { cursor: 'pointer', padding: '0 .5rem' }
              }>
              {TABS.VIEW}
            </Typography>
            {/* <Typography
							onClick={() => setActiveTab(TABS.HISTORY)}
							sx={
								activeTab === TABS.HISTORY
									? { ...tabUnderlineStyles, padding: '0 .5rem' }
									: { cursor: 'pointer', padding: '0 .5rem' }
							}
						>
							{TABS.HISTORY}
						</Typography> */}
          </Grid>
        </Grid>
        {TABS.VIEW === activeTab && (
          <>
            {estimateData?.status === 'sent' && (
              <Paper sx={{ padding: '1rem' }}>
                <Grid item container>
                  <Grid item sm={9}>
                    <Stack
                      direction='row'
                      display='flex'
                      alignItems='center'
                      spacing={2}>
                      {/* <NoteOutlinedIcon /> */}
                      <img src={vector} alt='invoice' />
                      <Box>
                        <Typography>Convert to Sales order</Typography>
                        <Typography variant='caption'>
                          Create a Sales Order for this price quote to confirm
                          the sell and bill your customer
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
                      alignItems: 'center'
                    }}>
                    {isLoading ? (
                      <CircularProgress />
                    ) : (
                      <>
                        <MUIButton
                          sx={{ textTransform: 'capitalize' }}
                          onClick={() => convertingToSaleOrder(decryptedId)}>
                          Convert to Sales Order
                        </MUIButton>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* template  */}
            <Box mt={3} mb={3}>
              <ViewTemplates
                title='Price Quote'
                apiData={estimateData}
                data={estimateData?.estimate_items}
                itemsColumns={columns}
                headerInfo={info}
              />
            </Box>
            <Grid container>
              <Grid item xs={5} ml={'50px'}>
                <Typography variant='h6' fontWeight='500' fontSize='12pt'>
                  More Information
                </Typography>
                <Box my={3}>
                  <Typography
                    variant='subtitle2'
                    sx={{ ...typoStyle }}
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'>
                    Sales Person:{' '}
                    <span>{estimateData?.sales_person?.name}</span>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
        {/* {TABS.HISTORY === activeTab && (
					<Box ml={8}>
						<Paper>
							<ActivityTimeLine activityData={activityData} />
						</Paper>
					</Box>
				)} */}
        <ConfirmDialog
          title='Are you sure you want to Void'
          isOpen={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
          {...dialogProps}
        />
      </Paper>
    </Box>
  );
};

export default ViewPriceQuote;

const BtnStyles = {
  margin: '0 .2rem'
};
