import { Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
const Profile = lazy(() => import('./Profile/Profile'));

const AccountInformation = lazy(() =>
  import('./AccountInformation/AccountInformation')
);
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerDetails } from '../../../../core/store/auth/customerPortalThunks';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();
  const customerDetails = useSelector(state => state.customer.customer);
  useEffect(() => {
    dispatch(getCustomerDetails({ customer_id: customerId, customerDetails }));
  }, []);

  return (
    <Grid container columnGap={1}>
      {/* left side  */}
      <Grid item lg={2.5}>
        <Grid item container>
          <Grid item xs={12}>
            <HeaderPaper>
              <Typography variant='h6'>Customer Information</Typography>
            </HeaderPaper>
          </Grid>
          {customerDetails?.id && (
            <Suspense fallback={<OverlayLoader open={true} />}>
              <Profile
                customerId={customerId}
                customerDetails={customerDetails}
              />
            </Suspense>
          )}
        </Grid>
      </Grid>
      {/* right side  */}
      <Grid item lg={9}>
        <HeaderPaper>
          <Typography variant='h6'>Account Information</Typography>
        </HeaderPaper>
        <Suspense fallback={<OverlayLoader open={true} />}>
          <AccountInformation customerId={customerId} />
        </Suspense>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
