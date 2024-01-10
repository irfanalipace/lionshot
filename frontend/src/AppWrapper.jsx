import useTheme from '@mui/material/styles/useTheme';
import services from './core/services/initServices';
import { useDispatch } from 'react-redux';
import { LOGOUT } from './core/store/auth/authSlice';
 
function AppWrapper({ children }) {
  const dispatch = useDispatch();
  const logout = () => {
    dispatch({ type: LOGOUT });
  };
  const theme = useTheme();
  services.init(logout); //initialize all services
  window.themeColors = {
    primary: theme.palette.primary.main
  };
 
  return children;
}
 
export default AppWrapper;