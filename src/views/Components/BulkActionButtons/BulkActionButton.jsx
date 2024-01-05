import { Button, ButtonGroup, Grid, IconButton, Stack } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import MUIButton from "../Button/MUIButton";
import { headerIconButton } from "../../pages/Customer/CustomerStylesConst";
import pdf from "../../../../public/assets/pdf.png";
import printer from "../../../../public/assets/Printer.png";

// eslint-disable-next-line react/prop-types
const BulkActionButton = ({ handleClick, refresh }) => {
  const [showMenuItem, setShowMenu] = useState(null);
  const showingMenu = (event) => {
    setShowMenu(event.currentTarget);
  };
  const hidingMenu = () => {
    setShowMenu(null);
  };

  return (
    <>
      <Grid item container>
        <Grid item sm={12}>
          <Grid item container>
            <Grid item sm={10} sx={{ display: "flex", alignItems: "center" }}>
              <Stack
                direction="row"
                display="felx"
                alignItems="center"
                spacing={2}
              >
                <ButtonGroup>
                  <IconButton
                    sx={{
                      backgroundColor: "#EEEEEE",
                      ...headerIconButton,
                    }}
                  >
                    <img src={printer} alt="printer" />
                  </IconButton>
                  <IconButton
                    sx={{
                      ...headerIconButton,
                      backgroundColor: "#EEEEEE",
                    }}
                  >
                    <img src={pdf} alt="pdf" />
                  </IconButton>
                </ButtonGroup>
                <Button
                  size="medium"
                  sx={{
                    ...headerIconButton,
                    color: "black",
                    padding: "6px 16px",
                  }}
                >
                  Bulk Update
                </Button>
                <IconButton
                  onClick={showingMenu}
                  sx={{
                    ...headerIconButton,
                    color: "black",
                    padding: "6px 16px",
                  }}
                >
                  <MoreHorizIcon />
                </IconButton>
                <Menu
                  anchorEl={showMenuItem}
                  open={Boolean(showMenuItem)}
                  onClose={hidingMenu}
                >
                  <MenuItem sx={{ padding: "2px 4px", borderRadius: "4px" }}>
                    <MUIButton
                      onClick={() => {
                        handleClick();
                      }}
                      size="medium"
                      fullWidth
                    >
                      Delete
                    </MUIButton>
                  </MenuItem>
                </Menu>
              </Stack>
            </Grid>
            <Grid
              item
              sm={2}
              sx={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              <IconButton onClick={refresh}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default BulkActionButton;
