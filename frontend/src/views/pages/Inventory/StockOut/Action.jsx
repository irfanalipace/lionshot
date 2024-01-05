import { IconButton } from '@mui/material';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';

export default function Action({ onClick }) {
  return (
    <IconButton aria-label='delete' onClick={onClick}>
      <LocalPrintshopOutlinedIcon sx={{ color: window.themeColors.primary }} />
    </IconButton>
  );
}
