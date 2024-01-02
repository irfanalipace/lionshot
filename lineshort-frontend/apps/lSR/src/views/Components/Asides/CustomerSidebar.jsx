import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import MainAside from './MainAside';
import { useParams } from 'react-router-dom';

export default function CustomerSidebar() {
  const { customerId } = useParams('customerId');
  const list = [
    {
      name: 'Dashboard',
      icon: <HomeIcon />,
      path: `/customer-portal/${customerId}/dashboard`
    },
    {
      name: 'Price Quotes',
      icon: <ShoppingBagOutlinedIcon />,
      path: `/customer-portal/${customerId}/price-quote`
    },
    {
      name: 'Sales Orders',
      icon: <ReceiptTwoToneIcon />,
      path: `/customer-portal/${customerId}/sales-orders`
    },
    {
      name: 'Invoices',
      icon: <ShoppingCartSharpIcon />,
      path: `/customer-portal/${customerId}/invoices`
    },
    {
      name: 'Refund Request',
      icon: <WorkIcon />,
      path: `/customer-portal/${customerId}/refund-request`
    }
  ];

  return <MainAside list={list} />;
}
