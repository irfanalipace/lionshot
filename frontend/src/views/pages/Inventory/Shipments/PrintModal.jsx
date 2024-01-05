import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Stack } from '@mui/material';
import Modal from '../../../Components/Modal/Dialog';
import MUIButton from '../../../Components/Button/MUIButton';
import Close from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';

// Utility function to generate base64 image source
export function generateBase64ImageSrc(src) {
  return 'data:image/png;base64,' + src;
}

const PrintModal = ({ open, onClose, onSubmit, barCode }) => {
    const [loading, setLoading] = useState(false);


    const handleCancel = () => {
        onClose();
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = generateBase64ImageSrc(barCode); // Convert base64 to a data URL
        link.download = 'barCodeImage.png'; // Specify the file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = async () => {
        try {
            setLoading(true);
            // Additional logic if needed
            await onSubmit();
            // Additional logic after submission if needed
        } catch (error) {
            console.error('Error during form submission:', error);
        }
        // finally {
        //     setLoading(false);
        //     onClose();
        // }
    };

    return (
        <Modal size={'sm'} open={open} onClose={handleCancel}>
            <div style={{ textAlign: 'center' }}>
                <img src={generateBase64ImageSrc(barCode)} alt='barCode' style={{ maxWidth: '100%', maxHeight: '100%' }}/>
                <div>
                    <Grid
                        container
                        justifyContent='flex-end'
                        sx={{ padding: '1.2rem 1.2rem 1rem 1.2rem' }}
                    >
                        <Stack direction='row' spacing={2}>
                            <MUIButton
                                startIcon={<DownloadIcon />}
                                disabled={loading}
                                onClick={handleDownload}
                            >
                                {loading ? <CircularProgress size={20} /> : 'Download'}
                            </MUIButton>
                            <MUIButton
                                startIcon={<PrintIcon />}
                                disabled={loading}
                                onClick={handlePrint}
                            >
                                {loading ? <CircularProgress size={20} /> : 'Print'}
                            </MUIButton>
                            <MUIButton
                                startIcon={<Close />}
                                variant='outlined'
                                onClick={handleCancel}
                            >
                                Cancel
                            </MUIButton>
                        </Stack>
                    </Grid>
                </div>
            </div>
        </Modal>
    );
};

export default PrintModal;
