import { MenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { styled } from '@mui/system';
import { MenuButton } from '@mui/base/MenuButton';
export const StyledListbox = styled('ul')(
  () => `
    font-family: 'roboto';
    font-size:16px;
    min-width: 150px;
    border-radius: 5px;
    overflow: auto;
    outline: 0px;
    background: white;
    box-shadow: 0px 4px 30px #d0d7de;
    z-index:1
    `
);

export const StyledMenuItem = styled(MenuItem)(
  () => `
    padding: 13px;
    border-radius: 8px;
    cursor: pointer;
    .MuiSvgIcon-root {
      color: ${window.themeColors.primary};
      margin-bottom:-5px;
      font-size: 20px;
    }
    &:hover:not(.${menuItemClasses.disabled}) {
      background-color: #F6FBFF;
    }
    `
);
export const TriggerButton = styled(MenuButton)(
  () => `
    // padding: 2px;
    background: ${window.themeColors.primary};
    color: #fff;
    border-radius:18px;
    border:none;
    transition-duration: 120ms;
    .MuiSvgIcon-root {
      margin-bottom: -3px;
    }
    &:hover {
      border-color: rgb(242, 242, 242);
    }
    `
);
export const HeaderMenuButton = styled(MenuButton)(
  () => `
    padding:5px 7px;
    border-radius:5px;
    border:none;
    transition-duration: 120ms;
    cursor:pointer;
    &:hover {
      border-color: rgb(242, 242, 242);
    }
    `
);
export const headerIconButton = {
  backgroundColor: '#EEEEEE',
  border: '1px solid #d1d1d1',
  borderRadius: '4px',
  textTransform: 'none',
  fontSize: '14px',
  padding: '5px'
};
export const headerMenuBox = {
  display: 'flex',
  alignItems: 'center'
};

export const VendorTypeEnum = {
  individual: {
    key: 'individual',
    label: 'Individual'
  },
  business: {
    key: 'business',
    label: 'Business'
  }
};
