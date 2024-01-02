import { MenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { styled } from '@mui/system';
import { MenuButton } from '@mui/base/MenuButton';

export const StyledMenuItem = styled(MenuItem)(
  ({ theme }) => `
    padding: 13px 30px;
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
export const PriceList = styled('table')(
  ({ theme }) => `
    border-top:  1px solid #EBEAF2;
    border-bottom:  1px solid #EBEAF2;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    width: 85%;
    `
);
export const HistoryList = styled('table')(
  ({ theme }) => `
    border-top:  1px solid #EBEAF2;
    border-bottom:  1px solid #EBEAF2;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    width: 102%;
    `
);
export const PriceListRow = styled('tr')(
  ({ theme }) => `
   display: flex;
   padding: 4px 50px 4px 10px;
  
    `
);

export const PriceListHeader = styled('td')(
  ({ theme }) => `
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-size: 12px;
    color: #6C7184;
    max-width: 100%;
    min-width: 30%;
    line-height: 17.6px; 
    text-transform: uppercase;
    `
);
export const PriceListHeader2 = styled('tr')(
  ({ theme }) => `
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    display: flex;
    font-size: 12px;
    width: 35%;
    line-height: 17.6px; 

    `
);
