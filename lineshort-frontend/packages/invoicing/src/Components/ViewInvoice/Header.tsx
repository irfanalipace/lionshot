import {
  Grid,
  Typography,
  Button,
  Menu,
  Box,
  MenuItem,
  Link,
  Divider,
  IconButton,
  CircularProgress
} from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import cvs from '../../assets/cvs.png';
import xlsx from '../../assets/xlsx.png';
import pdf from '../../assets/pdf.jpg';
import general from '../../assets/general-file.png';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
import {
  addInvoiceFileApi,
  deleteInvoiceFielsApi,
  downloadInvoiceApi
} from '@/apis/invoice';
import { shortenFileName } from '@/utils/helper';
import notyf from '../NotificationMessage/notyfInstance';
import OverlayLoader from '../OverLayLoader';

export default function Header({
  fetchingSingleInvoice,
  id,
  invoice_number,
  invoiceFiles
}) {
  const [showMenuItem, setShowMenu] = useState(null);
  const [fileUploading, setFileUploding] = useState<boolean>(false);

  const handleFileInputChange = event => {
    const files = event.target.files;

    if (files.length > 0) {
      const newFiles = Array.from(files);
      // console.log("newFiles", newFiles);
      submitFilesToApi(newFiles);
    }
  };
  const submitFilesToApi = async newFiles => {
    setFileUploding(true);
    try {
      const resp = await addInvoiceFileApi({
        attachments: newFiles,
        invoice_id: id
      });
      fetchingSingleInvoice();
      console.log('resp', resp);
      // setEstimatedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    } catch (error) {
      console.error(error);
    } finally {
      setFileUploding(false);
    }
  };

  const showingMenu = (event: any) => {
    setShowMenu(event.currentTarget);
  };

  const hidingMenu = () => {
    setShowMenu(null);
  };

  const deleteFile = async id => {
    setFileActionLoading(true);
    try {
      const resp: any = await deleteInvoiceFielsApi(id);
      notyf.success(resp?.message);
      fetchingSingleInvoice();
    } catch (error) {
      console.log('error', error);
    } finally {
      setFileActionLoading(false);
    }
  };

  const getFileIcon = file => {
    if (file.file_name.endsWith('.pdf')) return pdf;
    if (file.file_name.endsWith('.csv')) return cvs;
    if (file.file_name.endsWith('.xlsx')) return xlsx;
    else return general;
  };
  const [fileActionLoading, setFileActionLoading] = useState(false);

  const handlePdf = async () => {
    setFileActionLoading(true);
    try {
      const resp: any = await downloadInvoiceApi({ id });
      window.open(resp?.data?.url, '_blank');
    } catch (error) {
      console.log('error', error);
      notyf.error('Failed to downalod file.');
    } finally {
      setFileActionLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <Grid item container>
      <Grid sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h6'>{invoice_number || ''}</Typography>
      </Grid>
      <Grid
        sm={6}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
        <Button
          onClick={showingMenu}
          variant='outlined'
          sx={{
            fontSize: '12px',
            textTransform: 'capitalize',
            margin: '0 8px'
          }}
          startIcon={<AttachmentOutlinedIcon />}>
          Attachments
        </Button>
        <Menu
          anchorEl={showMenuItem}
          open={Boolean(showMenuItem)}
          onClose={hidingMenu}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
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
          <Box>
            <OverlayLoader open={fileActionLoading} />
            <Box
              sx={{
                width: 400,
                minHeight: 400,
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                flexDirection: 'column'
              }}>
              <MenuItem
                sx={{
                  width: '100%',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  maxHeight: '310px',
                  height: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}>
                {invoiceFiles?.map((file: any, index) => (
                  <Box key={index}>
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        margin: '30px 10px'
                      }}>
                      <Box sx={{ display: 'flex', marginRight: '15px' }}>
                        <img
                          src={getFileIcon(file)}
                          alt='PDF Icon'
                          style={{ width: '60px', height: '60px' }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}>
                        <Typography>
                          {shortenFileName(file.file_name, 30)}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-around'
                          }}>
                          <Link
                            component='span'
                            variant='caption'
                            onClick={handlePdf}>
                            Download
                          </Link>
                          {/* <Link component='span' variant='caption'>
														Remove
													</Link> */}

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
                  </Box>
                ))}
                {!invoiceFiles?.length && (
                  <Box
                    sx={{
                      height: '285px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                    <Typography variant='h6'>No File</Typography>
                  </Box>
                )}
              </MenuItem>

              <Box
                sx={{
                  display: 'flex',
                  position: 'fixed',
                  bottom: 0,
                  flexDirection: 'column',
                  height: '100px',
                  background: '#EEEEEE',
                  width: '100%'
                }}>
                <Typography
                  sx={{ paddingTop: '15px' }}
                  textAlign='center'
                  variant='body2Grey'>
                  You Can upload upto 10 files , 5mb each
                </Typography>

                <label htmlFor='file-input'>
                  <Button
                    startIcon={
                      fileUploading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <FileUploadOutlinedIcon />
                      )
                    }
                    sx={{
                      color: '#2196F3',
                      background: '#EEEEEE',
                      margin: '10px 0',
                      height: '90px',
                      padding: '25px 30px',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        background: '#EEEEEE'
                      }
                    }}
                    variant='contained'
                    component='span'>
                    {!fileUploading && 'Upload File'}
                  </Button>
                  <input
                    id='file-input'
                    type='file'
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                  />
                </label>
              </Box>
            </Box>
          </Box>
        </Menu>

        <IconButton sx={{ ml: 2 }} onClick={() => navigate('/invoices')}>
          <CloseIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
