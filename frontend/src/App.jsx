import { BrowserRouter } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import {
  HeaderRoutes,
  AsideRoutes,
  PagesRoutes
} from './core/Routes/LayoutRoutes';
import { theme } from './core/theme/theme';
import services from './core/services/initServices';
import './App.css';
import store from './core/store/store';
import { Provider } from 'react-redux';
import AppWrapper from './AppWrapper';
import withErrorBoundary from './views/Components/ErrorBoundry';

function App() {
  services.init(); //initialize all services
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AppWrapper>
            <HeaderRoutes />
            <Grid container>
              <AsideRoutes />
              <PagesRoutes />
            </Grid>
          </AppWrapper>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default withErrorBoundary(App);
