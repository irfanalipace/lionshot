import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import Folder from '@mui/icons-material/Folder'
import MainAside from './MainAside';

export const list = [
  { name: 'Dashboard', icon: <SpaceDashboardIcon  />, path: '/home' },
  {
    name: 'Reports',
    icon: <Folder />,
    subItems: [
      { name: 'COR', path: '/purchase-orders' },
      // { name: 'Product Labeling', path: '/product-labeling' },
      // { name: 'Stock Out', path: '/stock-out' },
      // { name: 'Shipments', path: '/shipments' }
    ]
  },
  // {
  //   name: 'Sales',
  //   icon: <ShoppingCartIcon />,
  //   subItems: [
  //     { name: 'Customers', path: '/customer' },
  //     { name: 'Price Quotes', path: '/price-quote' },
  //     { name: 'Sales Orders', path: '/sales-orders' },
  //     { name: 'Invoices', path: '/invoices' },
  //     { name: 'Payment Links', path: '/payment-links' },
  //     { name: 'Account Receivable', path: '/payment-received' },
  //     { name: 'Credit Memos', path: '/credit-memo' }
  //   ]
  // },
  // {
  //   name: 'Purchases',
  //   icon: <ReceiptIcon />,
  //   subItems: [
  //     { name: 'Vendors', path: '/vendor' },
  //     { name: 'Purchase Orders', path: '/purchase-orders' },
  //     { name: 'Bills', path: '/bills' },
  //     { name: 'Accounts Payable', path: '/account-payable' },
  //     { name: 'Vendor Credits', path: '/vendor-credits' }
  //   ]
  // },
  {
    name: 'Settings',
    icon: <SettingsIcon />,
    // subItems: [
    //   { name: 'Brands', path: '/item-brand' },
    //   { name: 'Conditions', path: '/conditions' },
    //   { name: 'Marketplaces', path: '/marketplaces' },
    //   { name: 'Categories', path: '/categories' },
    //   { name: 'Integrations', path: '/integrations' },
    //   { name: 'Departments', path: '/departments' },
    //   { name: 'Users', path: '/users' },
    //   { name: 'Companies', path: '/companies' }
    // ]
  }

];
export default function AdminSidebar() {
  return <MainAside list={list} />;
}
