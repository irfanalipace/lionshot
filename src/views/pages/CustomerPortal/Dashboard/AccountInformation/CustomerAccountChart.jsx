import React, { Suspense, useEffect, useState } from 'react';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';

import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HoverPopover from '../../../../Components/HoverPopover/ErrorOutlinePopover';
const ChartContent = lazy(() => import('./ChartContent'));
import { snakeCaseToPrettyText } from '../../../../../core/utils/helpers';
import { getCustomerGraphApi } from '../../../../../core/api/customerportal';
import { useParams } from 'react-router-dom';
const CustomerAccountChart = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedYear, setSelectedYear] = useState('current_year');
  const [dataa, setData] = useState([]);

  const { customerId } = useParams();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleYearChange = year => {
    setSelectedYear(year);
    handleClose();
  };

  const menuItems = [
    { name: 'Current year', flow: 'current_year', id: 'current_year' },
    { name: 'Last year', flow: 'last_year', id: 'last_year' }
  ];

  const gettingGraphData = async () => {
    try {
      const resp = await getCustomerGraphApi({
        customer_id: customerId,
        flow: selectedYear
      });
      setData(resp?.data);
    } catch (error) {}
  };
  useEffect(() => {
    gettingGraphData();
  }, [selectedYear]);
  return (
    <Grid item container mt={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Stack
              direction='row'
              sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>
                Cash Flow{' '}
                <HoverPopover text='Total Cash'>
                  <HelpOutlineIcon />
                </HoverPopover>
              </Typography>

              <Button
                onClick={handleClick}
                sx={{
                  color: '#9b9494ed',
                  '&:hover': {
                    backgroundColor: 'white'
                  }
                }}>
                {snakeCaseToPrettyText(selectedYear)} <ArrowDropDownIcon />
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                {menuItems.map(item => (
                  <MenuItem
                    key={item.id}
                    onClick={() => handleYearChange(item.flow)}>
                    {item.name}
                  </MenuItem>
                ))}
              </Menu>
            </Stack>
            <Divider />
          </CardContent>
          {dataa?.length > 0 && (
            <Suspense>
              <ChartContent data={dataa} />
            </Suspense>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default CustomerAccountChart;
