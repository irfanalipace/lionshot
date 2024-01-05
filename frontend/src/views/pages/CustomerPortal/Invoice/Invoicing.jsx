import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { getAllInvoicesDashboardListApi } from '../../../../core/api/CustomerPortal/customerportal';
import './Invoicing.css';
import DataTable from '../../../Components/DataTable/DataTable';
import {
  StatusColor,
  formatDate,
  generateEncryptedID,
  snakeCaseToPrettyText
} from '../../../../core/utils/helpers';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import TableGrid from '../../../Components/Containers/TableGrid';
import { useTheme } from '@emotion/react';

function Invoicing() {
  const [refresh, setRefresh] = useState(0);
  const { customerId } = useParams();

  const customerRef = useRef({
    customer_id: customerId
  });

  useEffect(() => {
    console.log('ID from the URL:', customerId);
  }, [customerId]);

  var InvoiceNumberCell = function (_a) {
    var children = _a.children;
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          color: window.themeColors.primary,
          padding: '5px'
        }}>
        <span>{children}</span>
      </Box>
    );
  };
  const theme = useTheme();
  let intialColumns = [
    {
      accessorKey: 'invoice_date',
      header: 'Date',
      Cell: function (_a) {
        var renderedCellValue = _a.renderedCellValue,
          row = _a.row;
        return <DateCell>{renderedCellValue}</DateCell>;
      }
    },
    {
      accessorKey: 'invoice_number',
      header: 'Invoice#',
      Cell: function (_a) {
        var renderedCellValue = _a.renderedCellValue,
          row = _a.row;
        return <InvoiceNumberCell>{renderedCellValue}</InvoiceNumberCell>;
      }
    },

    {
      accessorKey: 'status',
      header: 'Invoice Status',
      Cell: function (_a) {
        var cell = _a.cell;
        var status = cell.getValue();
        var estStatusColor = StatusColor(status, theme);
        return (
          <Box
            component='span'
            sx={{
              color: estStatusColor,
              borderRadius: '0.25rem',
              textTransform: 'capitalize'
            }}>
            {snakeCaseToPrettyText(status)}
          </Box>
        );
      }
    },
    {
      accessorKey: 'due_amount',
      header: 'Due Amount',
      Cell: function (_a) {
        var renderedCellValue = _a.renderedCellValue,
          row = _a.row;
        return <AmountCell>${renderedCellValue}</AmountCell>;
      }
    },
    {
      accessorKey: 'sub_total',
      header: 'Paid Amount',
      Cell: function (_a) {
        var renderedCellValue = _a.renderedCellValue,
          row = _a.row;
        return <AmountCell>${renderedCellValue}</AmountCell>;
      }
    },
    {
      accessorKey: 'created_at',
      header: 'Last Update',
      Cell: function (_a) {
        var renderedCellValue = _a.renderedCellValue,
          row = _a.row;
        return <AmountCell>{formatDate(renderedCellValue)}</AmountCell>;
      }
    }
    //end
  ];

  var _s = useState(intialColumns),
    columns = _s[0],
    setColumns = _s[1];
  var _t = useState(false),
    viewCustomer = _t[0],
    setViewCustomer = _t[1];
  var _u = useState(false),
    openImport = _u[0],
    setOpenImport = _u[1];
  var _v = useState(false),
    openExport = _v[0],
    setOpenExport = _v[1];
  var _w = useState([]),
    summaryData = _w[0],
    setSummaryData = _w[1];

  var navigate = useNavigate();

  var handleRowClick = function (row) {
    var id = generateEncryptedID(row.id);
    var url = `/customer-portal/${customerId}/invoices/${id}`;
    navigate(url);
  };

  var AmountCell = function (_a) {
    var children = _a.children;
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '5px'
        }}>
        <Typography variant='body2'>{children}</Typography>
      </Box>
    );
  };
  var DateCell = function (_a) {
    var children = _a.children;
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
        <Typography variant='body2'>
          {children ? ''.concat(formatDate(children)) : '--'}
        </Typography>
      </Box>
    );
  };

  var _x = useState([]),
    selectedRows = _x[0],
    setSelectedRows = _x[1];

  return (
    <>
      <Grid container>
        <TableGrid sm={12}>
          <HeaderPaper>
            <Grid
              item
              container
              columnGap={2}
              display='flex'
              justifyContent='space-between'>
              <Grid item sm={6}>
                <Typography variant='h6'>Invoices</Typography>
              </Grid>
              <Grid item sm={4}>
                {/* <FormField
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder='Search  Invoices'
                /> */}
              </Grid>
            </Grid>
          </HeaderPaper>

          <Grid item sm={12}>
            <DataTable
              api={getAllInvoicesDashboardListApi}
              columns={columns}
              extraParams={customerRef.current}
              setSelectedRows={setSelectedRows}
              onRowClick={handleRowClick}
              collapsed={viewCustomer}
              refresh={refresh}
              isSelectable={false}
              showApiError={false}
              manualFilter

              //  extraParams={''}
              //  collapsed={viewCustomer}
            />
          </Grid>
        </TableGrid>
      </Grid>
    </>
  );
}
export default Invoicing;
