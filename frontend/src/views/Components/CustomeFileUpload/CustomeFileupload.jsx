import React from "react";

// common
import InputLabel from "../InputLabel/InputLabel";
import MUIButton from "../Button/MUIButton";

// mui icons
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
// mui
import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  Typography,
} from "@mui/material";

const CustomFileupload = ({
  title,
  onChange,
  deletingFile,
  estimateFiles,
  id,
}) => {
  return (
    <>
      <InputLabel textAlign='center'>Attach file(s) to {title}</InputLabel>
      <label htmlFor='file-input'>
        <MUIButton
          startIcon={<SendIcon />}
          sx={{
            border: "1px solid grey",
            color: "black",
            textTransform: "capitalize",
          }}
          variant='outlined'
          component='span'
          fullWidth>
          Upload File
        </MUIButton>

        <input
          id='file-input'
          type='file'
          multiple
          style={{ display: "none" }}
          onChange={onChange}
        />
      </label>

      <List>
        {estimateFiles?.map((file, index) => (
          <ListItem key={index}>
            <Typography>{(id && file.file_name) || file.name}</Typography>
            <ListItemSecondaryAction>
              <IconButton
                edge='end'
                aria-label='delete'
                onClick={() => deletingFile(file)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default CustomFileupload;
