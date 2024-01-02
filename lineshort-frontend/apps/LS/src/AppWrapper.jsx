import useTheme from '@mui/material/styles/useTheme';
function AppWrapper({ children }) {
  const theme = useTheme();
  window.themeColors = {
    primary: theme.palette.primary.main
    // primary: '#ee1818',
  };

  return children;
}

export default AppWrapper;
