import { Button, Paper, Typography } from "@mui/material";
import "./ButtonBar.css";

export default function ButtonBar({
  labelFir,
  labelSec,
  lableThird,
  iconFir,
  iconSec,
  iconThird,
  onClickFir,
  onClickSec,
  onClickThird,
  title,
}) {
  return (
    <Paper sx={{padding: '1.2rem'}}>
      {title &&
        <Typography variant="h6" className="TextCapitalize">
          {title}
        </Typography>}
      <div className="btn-container">
        <Button
          size="small"
          onClick={onClickFir}
          variant="contained"
          startIcon={iconFir}
        >
          {labelFir}
        </Button>
        <Button
          size="small"
          onClick={onClickSec}
          variant="outlined"
          startIcon={iconSec}
        >
          {labelSec}
        </Button>
        <Button
          size="small"
          onClick={onClickThird}
          variant="outlined"
          startIcon={iconThird}
        >
          {lableThird}
        </Button>


        
      </div>
    </Paper>
  );
}
