/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Box, Grid, Typography, Button, Alert, useTheme } from '@mui/material';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton } from '@mui/base/MenuButton';
import { Add, ArrowDropDown } from '@mui/icons-material';
import DataTable from '../../Components/DataTable/DataTable';
import {
  StatusColor,
  decryptId,
  formatDate,
  snakeCaseToPrettyText
} from '../../../core/utils/helpers';
// import CustomerListViewDetails from './CustomerListViewDetails';
import HeaderPaper from '../../Components/Containers/HeaderPaper';
import ConfirmDialog from '../../Components/ConfirmDialog/ConfirmDialog';
// import './Customer.css';
import { StyledListbox, StyledMenuItem } from '../Customer/CustomerStylesConst';
import DataTableContainer from '../../Components/Containers/DataTableContainer';
import {
  getAllPaymentLinks,
  deletePaymentLink
} from '../../../core/api/paymentLinks';
// import PaymentLinkDrawer from './ViewPamentLink/PaymentLinkDrawer';
const PaymentLinkDrawer = lazy(() =>
  import('./ViewPamentLink/PaymentLinkDrawer')
);
// import NewPaymentLinkModel from './NewPaymentLink/NewPaymentLinkModel';
const NewPaymentLinkModel = lazy(() =>
  import('./NewPaymentLink/NewPaymentLinkModel')
);
import { ContentCopy } from '@mui/icons-material';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';
const PaymentLinksTable = () => {
  const theme = useTheme();
  // const { id } = useParams();
  const [selectedRows, setSelectedRows] = useState([]);
  const [refresh, setRefresh] = useState(0);
  // const [id, setId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  // const [dialogProps, setDialogProps] = useState({});
  const [openNewPaymentModal, setopenNewPaymentModal] = useState();
  const [copySuccess, setCopySuccess] = useState(false);
  const [newPaymentLinkID, setNewPaymentLinkID] = useState();
  const CopyButtonCliked = PaymentLinkString => {
    navigator.clipboard.writeText(PaymentLinkString);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 1000);
  };
  const initialColumns = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      Cell: ({ cell }) => {
        const date = cell.getValue();
        const formatedDate = formatDate(date);
        return (
          <Typography
            variant='body2'
            component='span'
            sx={{ textTransform: 'capitalize' }}>
            {formatedDate}
          </Typography>
        );
      }
    },
    {
      accessorKey: 'reference',
      header: 'Reference#'
    },
    {
      accessorKey: 'customers.display_name',
      header: 'Customer Name'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ cell }) => {
        const status = cell.getValue();
        const estStatusColor = StatusColor(status, theme);

        return (
          <Typography
            variant='body2'
            component='span'
            sx={{
              color: estStatusColor,
              borderRadius: '0.25rem',
              textTransform: 'capitalize'
            }}>
            {snakeCaseToPrettyText(status)}
          </Typography>
        );
      }
    },
    // {
    //     accessorKey: 'status',
    //     header: 'Status',
    //     Cell: ({ renderedCellValue, row }) =>
    //         <Typography variant='body2' className="TextCapitalize">{row?.original?.status}</Typography>
    // },
    {
      accessorKey: 'payment_link',
      header: 'Payment Links',
      Cell: ({ row }) => (
        <Box>
          <Link
            onClick={e => {
              e.stopPropagation();
            }}
            to={row.original.payment_link}
            style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: window.themeColors.primary }}>
              {row.original.payment_link}
            </Typography>
          </Link>
          {row.original.payment_link && (
            <ContentCopy
              className='show-on-hover'
              sx={{
                color: window.themeColors.primary,
                fontSize: '15px',
                // margin: '0 0 -3px 10px',
                cursor: 'pointer',
                display: 'none'
              }}
              onClick={e => {
                e.stopPropagation();
                CopyButtonCliked(row.original.payment_link);
              }}
            />
          )}
        </Box>
      )
    },
    {
      accessorKey: 'link_expiration_date',
      header: 'Expiry Date',
      Cell: ({ cell }) => {
        const date = cell.getValue();
        const formatedDate = formatDate(date);
        return (
          <Typography
            variant='body2'
            component='span'
            sx={{ textTransform: 'capitalize' }}>
            {formatedDate}
          </Typography>
        );
      }
    },

    {
      accessorKey: 'payment_amount',
      header: 'Amount',
      Cell: ({ cell }) => (
        <Typography variant='body2'>${cell.getValue()}</Typography>
      )
    }
  ];

  // const [columns, setColumns] = useState(initialColumns);
  const [openPaymentDrwer, setopenPaymentDrwer] = useState();
  const [paymentLinkID, setpaymentLinkID] = useState();

  const handleDeletePaymentLink = async id => {
    console.log('delete id: ' + id);
    const res = await deletePaymentLink(id);
    console.log('res', res);
    setopenPaymentDrwer(false);
    setRefresh(prev => prev + 1);
  };

  const handleRowClick = row => {
    setopenPaymentDrwer(true);
    setpaymentLinkID(row?.id);
  };

  //  get customerId from url when user coming from view customer(new Payment Link btn)
  const params = new URLSearchParams(window.location.search);
  let customerId = params.get('customerId');
  customerId = decryptId(customerId);
  // console.log('customerId',customerId)

  useEffect(() => {
    if (customerId) {
      setopenNewPaymentModal(true);
      setNewPaymentLinkID(customerId);
    } else {
      setNewPaymentLinkID(null);
    }
  }, [customerId]);

  return (
    <>
      {copySuccess && (
        <Alert
          severity='success'
          sx={{ position: 'absolute', top: '10%', left: '50%', zIndex: '3' }}>
          Link Copied
        </Alert>
      )}
      <HeaderPaper>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={7}>
            <Dropdown>
              <MenuButton
                onClick={e => e.stopPropagation()}
                style={{ backgroundColor: 'transparent', border: 'none' }}>
                <Typography noWrap variant='h6' className='TextCapitalize'>
                  All payment Links
                  {/* <ArrowDropDown sx={{ margin: '0 -5px -5px 0' }} /> */}
                </Typography>
              </MenuButton>
              {/* <Menu slots={{ listbox: StyledListbox }}>
								<StyledMenuItem>All </StyledMenuItem>
								<StyledMenuItem>Generated </StyledMenuItem>
								<StyledMenuItem>Viewed</StyledMenuItem>
								<StyledMenuItem>Paid</StyledMenuItem>
								<StyledMenuItem>Expired</StyledMenuItem>
								<StyledMenuItem>Canceled</StyledMenuItem>
								<StyledMenuItem onClick={() => setRefresh(prev => prev + 1)}>
									Refresh list
								</StyledMenuItem>
							</Menu> */}
            </Dropdown>
          </Grid>
          <Grid item xs={5} sx={{ textAlign: 'right' }}>
            <Box>
              <Button
                size='medium'
                onClick={() => setopenNewPaymentModal(true)}
                variant='contained'
                sx={{ minWidth: '0', padding: '7px 10px' }}>
                <Add />
                New
              </Button>
            </Box>
          </Grid>
        </Grid>
      </HeaderPaper>
      <DataTableContainer>
        <DataTable
          api={getAllPaymentLinks}
          columns={initialColumns}
          setSelectedRows={setSelectedRows}
          onRowClick={handleRowClick}
          //   extraParams={extraParams}
          //   collapsed={viewCustomer}
          refresh={refresh}
          enableRowSelection={false}
          manualFilter
        />
      </DataTableContainer>
      {openPaymentDrwer && (
        <PaymentLinkDrawer
          handleDeletePaymentLink={handleDeletePaymentLink}
          paymentLinkID={paymentLinkID}
          open={openPaymentDrwer}
          onClose={() => setopenPaymentDrwer(false)}
          setRefresh={setRefresh}
        />
      )}
      {openNewPaymentModal && (
        <NewPaymentLinkModel
          isOpen={openNewPaymentModal}
          onClose={() => setopenNewPaymentModal(false)}
          setRefresh={setRefresh}
          newPaymentLinkID={newPaymentLinkID}
        />
      )}

      <ConfirmDialog
        title='Are you sure you want to delete'
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        // {...dialogProps}
      />
    </>
  );
};

export default PaymentLinksTable;
