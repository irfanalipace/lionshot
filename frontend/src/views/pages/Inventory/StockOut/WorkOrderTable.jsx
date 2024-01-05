import { useEffect, useState } from 'react';
import { Grid, Box, Button, CircularProgress } from '@mui/material';
import DataTable from 'components/DataTable/DataTable';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import { decryptId } from 'core/utils/helpers';
import HeaderPaper from 'components/Containers/HeaderPaper';
import DataTableContainer from 'components/Containers/DataTableContainer';
import TableGrid from 'components/Containers/TableGrid';
import { ItemCell, WorkOrderInitialColumns } from './columns';
import StockHeader from './Headers/StockHeader';
import OverlayLoader from 'components/OverlayLoader/OverlayLoader';
import StockMainInfo from './StockMainInfo';
import {
  StockSingleApi,
  createWorkOrderApi
} from '../../../../core/api/stockOut';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import FormField from '../../../Components/InputField/FormField';
import { useNavigate } from 'react-router-dom';
import notyf from '../../../Components/NotificationMessage/notyfInstance';

const WorkOrderTable = () => {
  const id = useParams();
  const navigate = useNavigate();
  //   const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState({
    work_order_id: null,
    invoice_item: []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const dID = decryptId(id.id);
      const resp = await StockSingleApi(dID);
      setData(resp);
      setApiData({
        work_order_id: resp.id,
        invoice_item: [...resp.invoice.invoice_items]
      });
    } catch (error) {
      notyf.error('Work Order Not Found');
      navigate('/stock-out');
    }
    setLoading(false);
  };

  const handleStockOut = async () => {
    try {
      setLoading(true);
      const items = apiData.invoice_item.map(invoiceItem => ({
        invoice_item_id: invoiceItem.item_id,
        quantity: parseInt(invoiceItem.quantity)
      }));
      const payload = {
        ...apiData,
        invoice_item: items
      };
      const resp = await createWorkOrderApi(payload);
      notyf.success('Work Order Item Updated Successfully');
      navigate('/shipments');
    } catch (error) {
      console.log('error', error);
    }
    setLoading(false);
  };

  const handleQuantityChange = (e, index) => {
    setApiData(prev => {
      let value = e.target.value;
      const items = prev.invoice_item;
      const originalQuantity = data?.invoice?.invoice_items[index].quantity;
      if (value > 0 && value < originalQuantity) {
        items[index] = {
          ...items[index],
          quantity: value
        };
        return {
          ...prev,
          invoice_item: items
        };
      }
      return prev;
    });
  };
  function CellInputField({ row, ...props }) {
    const index = row.row.index;
    const modifiedQuantity = parseInt(apiData.invoice_item[index]?.quantity);

    return (
      <FormField
        {...props}
        sx={CellInputStyles}
        value={modifiedQuantity}
        onChange={e => handleQuantityChange(e, index)}
        onClick={e => e.stopPropagation()}
        type='number'
      />
    );
  }

  const columns = [
    {
      accessorKey: 'item.image',
      header: 'Item image',
      Cell: ({ row }) => (
        <Box
          width='65px'
          height='65px'
          paddingY='2px'
          justifyContent='center'
          display={'flex'}
          alignItems='center'
          overflow='hidden'
          border='1px solid #ccc'>
          <img
            src={row?.original?.item?.image || 'https://placehold.co/100x100'}
            alt='Item Image'
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
        </Box>
      )
    },
    {
      accessorKey: 'item_name',
      header: 'Item Name',
      size: 50,
      Cell: ({ row, renderedCellValue }) => (
        <ItemCell data={renderedCellValue} />
      )
    },
    {
      accessorKey: 'item_id',
      header: 'Item #',
      size: 50
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      size: 50,
      Cell: (row, renderedCellValue) => <CellInputField row={row} />
    },
    {
      accessorKey: 'item.sku',
      header: 'Stock Location',
      size: 50
    },
    {
      accessorKey: 'status',
      header: 'QR Code',
      Cell: () => <QRCode value='hey' size={50} />,
      enableColumnActions: false,
      enableColumnOrdering: false
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid container sx={{ position: 'relative' }}>
      <OverlayLoader open={loading} />
      <TableGrid sm={12}>
        <HeaderPaper>
          <StockHeader viewStock={true} />
        </HeaderPaper>
        <StockMainInfo
          data={{
            invoice_number: data?.invoice?.invoice_number,
            work_order_number: data?.work_order_number,
            date: data?.created_at
          }}
          sx={{ pt: 5, px: 2 }}
        />
        <DataTableContainer takenHeight='300'>
          <DataTable
            takenHeight='360'
            data={data?.invoice?.invoice_items || []}
            columns={columns}
            enableRowSelection={false}
            enableColumnActions={false}
            enableColumnOrdering={false}
            enablePagination={false}
            enableTopToolbar={false}
            enableRowNumbers={true}
          />
        </DataTableContainer>
        <Grid container justifyContent={'end'}>
          <Button
            sx={{
              position: 'absolute',
              bottom: '10px',
              right: '100px',
              height: '45px',
              zIndex: '1'
            }}
            disabled={loading}
            onClick={handleStockOut}
            variant='contained'>
            Stock Out
          </Button>
        </Grid>
      </TableGrid>
    </Grid>
  );
};

export default WorkOrderTable;

const CellInputStyles = {
  '& .MuiInputBase-input': {
    padding: '8px 5px'
  }
};
