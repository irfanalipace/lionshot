import { Stack, Box, Divider, Typography } from '@mui/material';
import React from 'react';
import { formatDate } from '../../../../core/utils/helpers';

export default function StockMainInfo({ data, sx }) {
  return (
    <Stack bgcolor={'white'} gap={1} sx={sx}>
      <InfoRow text='Invoice#:' value={data?.invoice_number} />
      <InfoRow text='Work Order#:' value={data?.work_order_number} />
      <InfoRow text='Creation Date:' value={formatDate(data?.date)} />
      <Divider sx={{ mt: 1 }} />
    </Stack>
  );
}

const InfoRow = ({ text, value }) => {
  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      direction='row'
      width={'320px'}>
      <Typography variant='body2' color={'rgba(0, 0, 0, 0.60)'}>
        {text}
      </Typography>
      <Box width={'200px'} textAlign={'left'}>
        <Typography variant='body2'>{value}</Typography>
      </Box>
    </Box>
  );
};
