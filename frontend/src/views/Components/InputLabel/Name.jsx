import { Box } from '@mui/material';

const Name = ({ children }) => (
  <Box sx={{ color: window.themeColors.primary }}>
    <span>{children}</span>
  </Box>
);
export default Name;
