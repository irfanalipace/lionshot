import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
const CloseBtn = ({onClose , sx})=> {
    return (
      <>
      <IconButton onClick={onClose} sx={sx}>
        <CloseIcon  fontSize="small" />
      </IconButton>
      </>
    )
  }

  export default CloseBtn