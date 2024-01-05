import { useEffect, useState } from 'react';
import cvs from '../../../../../public/assets/cvs.png';
import xlsx from '../../../../../public/assets/xlsx.png';
import pdf from '../../../../../public/assets/pdf.jpg';

import { IconButton, Link, Menu, MenuItem, Paper } from '@mui/material';
// mui components  && icon
import { Grid, Divider, Typography } from '@mui/material';
// components
// common components
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
// import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';

// styles
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
// import EditIcon from '@mui/icons-material/Edit';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

import { useNavigate } from 'react-router-dom';
import MUIButton from 'invoicing/src/Components/MUIButton';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import ViewTemplate from '../../../Components/ViewTemplate/ViewTemplates';
// import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { billSingleApi, downloadBillPdfApi } from '../../../../core/api/bills';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import {
  StatusColor,
  decryptId,
  formatDate,
  goBack,
  snakeCaseToPrettyText
} from '../../../../core/utils/helpers';
import PaymentReceived from '../../../Components/PaymentReceived';
const columns = [
  { id: '', label: 'No.', key: 'index' },
  { id: '', label: 'Items Description', key: 'item_name' },
  { id: '', label: 'Qty', key: 'quantity' },
  { id: '', label: 'Rate(USD)', key: 'rate' },
  { id: '', label: 'Amount(USD)', key: 'total' }
];
const ViewBills = ({ id, setRefresh }) => {
  const navigate = useNavigate();

  const [estimateSubComponent, setEstimateSubComponent] = useState(true);
  const [estimateEmailOpen, setEstimateEmailOpen] = useState(false);
  const [showMenuItem, setShowMenu] = useState(null);
  const [billFiles, setBillFiles] = useState([]);
  const [billData, setBillData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleEstimateSubComp = () => {
    setEstimateSubComponent(true);
    setEstimateEmailOpen(false);
  };

  const handleSendMail = () => {
    setEstimateEmailOpen(true);
    setEstimateSubComponent(false);
  };

  const showingMenu = event => {
    setShowMenu(event.currentTarget);
  };
  const hidingMenu = () => {
    setShowMenu(null);
  };

  // single estimate / show estimate / view
  useEffect(() => {
    fetchingSingleBill();
  }, [id]);

  const fetchingSingleBill = async () => {
    setIsLoading(true);
    try {
      const resp = await billSingleApi(decryptId(id));
      setBillData(resp);
      setBillFiles(resp?.data?.estimate_files);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  // handling attachments files
  const handleFileInputChange = event => {
    const files = event.target.files;

    if (files.length > 0) {
      const newFiles = Array.from(files);
      // console.log("newFiles", newFiles);
      submitFilesToApi(newFiles);
    }
  };
  const submitFilesToApi = async newFiles => {
    try {
      //   const resp = await addEstimatesFileApi({
      //     attachments: newFiles,
      //     estimate_id: id
      //   });
      fetchingSingleBill();

      // setBillFiles((prevFiles) => [...prevFiles, ...newFiles]);
    } catch (error) {
      console.log('error', error);
    }
  };

  // const deleteFile = (file) => {
  //   setBillFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  // };
  const deleteFile = async id => {
    try {
      //   const resp = await deleteEstimateFielsApi(id);
      // notyf.success(resp.message);
      fetchingSingleBill();
    } catch (error) {
      console.error(error);
    }
  };

  // main page open
  const handleSendEstimateMain = id => {
    navigate(`/send-email/bill/${id}`);
  };

  const handlePdf = async () => {
    setIsLoading(true);
    try {
      const resp = await downloadBillPdfApi({ id: decryptId(id) });
      console.log('resp', resp);
      window.open(resp?.data, '_blank');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '0 1rem', position: 'relative' }}>
      <OverlayLoader open={isLoading} />
      <HeaderPaper>
        <Grid item container>
          {/* view header left  */}
          <Grid sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6'>{billData?.bill_number}</Typography>
          </Grid>
          {/* view header right  */}
          <Grid
            sm={6}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}>
            {/* <MUIButton
							onClick={showingMenu}
							variant='outlined'
							sx={{
								fontSize: '12px',
								textTransform: 'capitalize',
								margin: '0 8px',
							}}
							startIcon={<AttachmentOutlinedIcon />}
						>
							Attachments
						</MUIButton> */}
            <Menu
              anchorEl={showMenuItem}
              open={Boolean(showMenuItem)}
              onClose={hidingMenu}
              PaperProps={{
                elevation: 0,
                sx: {
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  maxHeight: 250,
                  overflowY: 'scroll',

                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    // left: 15, // arrow positionm
                    right: 50,
                    width: 15,
                    height: 15,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0
                  }
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
              <>
                <Box
                // sx={{
                //   width: 400,
                //   maxHeight: 400,
                //   overflow: 'auto',
                //   display: 'flex',
                //   justifyContent: 'center',
                //   alignItems: 'center',
                //   flexDirection: 'column'
                // }}
                >
                  <MenuItem
                    sx={{
                      width: '100%',
                      // height: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column'
                    }}>
                    {/* <List> */}
                    {billFiles?.map((file, index) => (
                      <>
                        <Box
                          key={index}
                          sx={{ display: 'flex', margin: '20px 0' }}>
                          <Box sx={{ display: 'flex' }}>
                            {file.file_name.endsWith('.pdf') ? (
                              <img
                                src={pdf}
                                alt='PDF Icon'
                                style={{ width: '60px', height: '60px' }}
                              />
                            ) : file.file_name.endsWith('.csv') ? ( // Corrected to .csv
                              <img
                                src={cvs}
                                alt='CSV Icon'
                                style={{ width: '60px', height: '60px' }}
                              />
                            ) : file.file_name.endsWith('.xlsx') ? (
                              <img
                                src={xlsx}
                                alt='XLSX Icon'
                                style={{ width: '60px', height: '60px' }}
                              /> // You should define xlsx variable
                            ) : null}
                          </Box>
                          <Box
                            sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography>{file.file_name}</Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-evenly'
                              }}>
                              <Link
                                component='span'
                                variant='caption'
                                onClick={handlePdf}>
                                Download
                              </Link>
                              <Link component='span' variant='caption'>
                                Remove
                              </Link>

                              <Link
                                component='span'
                                variant='caption'
                                onClick={() => deleteFile(file?.id)}>
                                Delete
                              </Link>
                            </Box>
                          </Box>
                        </Box>
                        <Divider sx={{ width: '100%' }} />
                      </>
                    ))}
                  </MenuItem>

                  <MenuItem
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%'
                    }}>
                    <Typography textAlign='center' variant='body2Grey'>
                      You can upload upto 10 files , 5mb each
                    </Typography>

                    <label htmlFor='file-input'>
                      <MUIButton
                        startIcon={<FileUploadOutlinedIcon />}
                        sx={{
                          background: '#EEEEEE',
                          color: window.themeColors.primary,
                          margin: '10px 0',
                          padding: '25px 30px',
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            background: '#EEEEEE'
                          }
                        }}
                        variant='contained'
                        component='span'>
                        Upload File
                      </MUIButton>
                      <input
                        id='file-input'
                        type='file'
                        multiple
                        accept='.pdf'
                        style={{ display: 'none' }}
                        onChange={handleFileInputChange}
                      />
                    </label>
                  </MenuItem>
                </Box>
              </>
            </Menu>
            <IconButton
              onClick={() => {
                navigate('/bills');
              }}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </HeaderPaper>
      <Grid item sm={12}>
        <Paper sx={{ padding: '1.5rem' }}>
          {/* {billData?.status !== 'sent' && (
						<MUIButton
							startIcon={<EditIcon fontSize='small' />}
							variant='outlined'
							sx={{ ...BtnStyles }}
							onClick={() => navigate(`/bills/edit/${id}`)}
						>
							Edit
						</MUIButton>
					)} */}

          <MUIButton
            startIcon={<EmailOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}
            onClick={() => {
              handleSendEstimateMain(id);
            }}>
            Send an Email
          </MUIButton>

          <MUIButton
            startIcon={<PictureAsPdfOutlinedIcon fontSize='small' />}
            variant='outlined'
            sx={{ ...BtnStyles }}
            onClick={handlePdf}>
            Pdf/Print
          </MUIButton>
        </Paper>
      </Grid>

      <Paper sx={{ padding: '1.5rem', mt: 2 }}>
        <Box mb={3}>
          <PaymentReceived
            title='Payments Paid'
            payment_receiveds={billData?.account_payable_paid_bills}
          />
        </Box>
        <ViewTemplate
          title=''
          data={billData?.bill_item}
          headings={{ first: 'Order From' }}
          apiData={billData}
          itemsColumns={columns}
          addressData={{
            default_billing_address: billData?.vendor?.default_billing_address
          }}
          showShippingCharges={false}
          termsAndConditions={billData?.terms_and_condition}
          headerInfo={[
            { label: 'Bill #:', value: billData?.bill_number },
            { label: 'Bill Date:', value: formatDate(billData?.bill_date) },
            { label: 'Terms:', value: billData?.term?.term_name },
            {
              label: 'Payment Mode:',
              value: billData?.mode_of_payment_value
            },
            { label: 'Delivery Terms:', value: 'Fedex' }
          ]}
          // titleStyles={titleStyles}
        />
      </Paper>
    </Box>
  );
};

export default ViewBills;

const BtnStyles = {
  margin: '0 .2rem'
};
const titleStyles = {
  marginRight: '15%'
};
