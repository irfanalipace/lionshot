import React, { ReactNode } from 'react';
import { useTheme } from "@mui/material/styles";
import { Button } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import useResponsiveStyles from '../hooks/useMedaiQuery';

interface MUIButtonProps {
  variant?: 'text' | 'contained' | 'outlined';
  children: ReactNode;
  size?: 'small' | 'medium' | 'large'; // Specify valid size values
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | void; // Updated onClick type
  router?: boolean;
  path?: string;
  sx?: object;
  endIcon?: React.ReactNode;
}

export default function MUIButton({
  variant,
  children,
  size,
  onClick,
  router,
  path,
  sx,
  ...otherProps
}: MUIButtonProps) {
  const theme = useTheme();
  const { isMobile, isMedium, isLarger } = useResponsiveStyles();

  let buttonFontSize = "0.7rem";
  if (isMobile) {
    buttonFontSize = "0.5rem";
  } else if (isMedium) {
    buttonFontSize = "0.6rem";
  }

  const ComponentProp = router ? RouterLink : 'button';

  return (
    <Button
      {...otherProps}
      component={ComponentProp}
      to={path ? path : ''}
      variant={variant || 'contained'}
      size={size ? size : 'medium'} // Use 'medium' as default size if not provided
      sx={{ fontSize: buttonFontSize, ...sx }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
