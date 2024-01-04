import {
  Avatar,
  Box,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Typography
} from '@mui/material';
import { orange } from '@mui/material/colors';
import SouthWestIcon from '@mui/icons-material/SouthWest';

export default function InventorySummary({ summaryData, summaryLoding }) {
  return (
    <Paper
      sx={{
        height: '155px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'center',
        paddingX: '1.5rem',
        margin: '0.5em 0'
      }}>
      <Box sx={{ mb: 3 }}>
        <Typography color='text.secondary' variant='body1bold'>
          Inventory Summary
        </Typography>
      </Box>
      <Grid
        container
        spacing={2}
        direction='row'
        justifyContent='center'
        alignItems='center'>
        <Grid item xs={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Box sx={{ display: 'flex' }}>
              <Avatar
                sx={{
                  bgcolor: orange[300],
                  height: '50px',
                  width: '50px'
                }}>
                <SouthWestIcon sx={{ color: '#000000' }} fontSize='small' />
              </Avatar>
              <Box sx={{ ml: 2 }}>
                <Typography color='text.secondary' variant='body1'>
                  Total Inventory Value
                </Typography>
                {summaryLoding ? (
                  <LoadingState />
                ) : (
                  <Typography variant='h6' color={orange[500]}>
                    $
                    {parseFloat(
                      summaryData?.total_inventory_value || 0
                    ).toFixed(2)}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
        {/* <Divider orientation='vertical' flexItem sx={{ height: '60px' }} /> */}

        <Grid item xs>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Divider orientation='vertical' sx={{ height: '60px' }} />

            <Box>
              <Typography color='text.secondary' variant='body1'>
                Avg. Days to Sell Inventory
              </Typography>
              {summaryLoding ? (
                <LoadingState />
              ) : (
                <Typography variant='body1bold'>
                  {parseFloat(
                    summaryData?.avg_days_to_sell_inventory || 0
                  ).toFixed(2)}
                </Typography>
              )}
            </Box>
            <Divider orientation='vertical' flexItem sx={{ height: '60px' }} />
          </Box>
        </Grid>

        <Grid item xs>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Box>
              <Typography color='text.secondary' variant='body1'>
                No. of Items
              </Typography>
              {summaryLoding ? (
                <LoadingState />
              ) : (
                <Typography color='text.secondary' variant='body1bold'>
                  {parseFloat(summaryData?.no_of_items || 0).toFixed(2)}
                </Typography>
              )}
            </Box>

            <Divider orientation='vertical' flexItem sx={{ height: '60px' }} />
          </Box>
        </Grid>

        <Grid item xs>
          <Box sx={{ display: 'flex', justifyContent: 'space-end' }}>
            <Box>
              <Typography color='text.secondary' variant='body1'>
                Total Cost of Inventory
              </Typography>
              {summaryLoding ? (
                <LoadingState />
              ) : (
                <Typography color='text.secondary' variant='body1bold'>
                  {parseFloat(summaryData?.total_cost_value || 0).toFixed(2)}
                </Typography>
              )}
            </Box>
            <span style={{ height: '60px', display: 'hidden' }}></span>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

const LoadingState = () => (
  <Box sx={{ height: 32, display: 'flex', alignItems: 'center' }}>
    <Skeleton width={'100%'} variant='rounded' height={12} />
  </Box>
);
