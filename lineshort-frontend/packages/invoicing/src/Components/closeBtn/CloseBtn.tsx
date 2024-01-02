import React, { FC } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";

interface CloseBtnProps {
  onClose: () => void;
}

const CloseBtn: FC<CloseBtnProps> = ({ onClose }) => {
  return (
    <Button onClick={onClose}>
      <CloseIcon />
    </Button>
  );
}

export default CloseBtn;
