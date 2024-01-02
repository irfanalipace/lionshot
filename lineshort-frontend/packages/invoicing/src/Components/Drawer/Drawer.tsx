import React from 'react';
import { Drawer } from '@mui/material';
import useResponsiveStyles from '../../hooks/useMedaiQuery'; // You might need to fix the import path
import { ReactNode } from 'react';

interface CustomDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}
const CustomDrawer: React.FC<CustomDrawerProps> = ({ open, onClose, children }) => {
  const { isMobile, isMedium } = useResponsiveStyles();

  let drawerWidth = '60vw'; // Default width for larger devices

  if (isMobile) {
    drawerWidth = '90vw';
  } else if (isMedium) {
    drawerWidth = '80vw';
  }

  const drawerStyle = {
    backgroundColor: '#f3f3f3',
    width: drawerWidth,
  };

  return (
    <Drawer
      className='view-customer'
      anchor='right'
      open={open}
      onClose={onClose}
      PaperProps={{ style: drawerStyle }}
    >
      {open && <>{children}</>}
    </Drawer>
  );
};

export default CustomDrawer;
