import { Box, Typography } from '@mui/material';
import { theme } from 'core/theme/theme';
import QRCode from 'react-qr-code';
import { StatusColor, snakeCaseToPrettyText } from 'core/utils/helpers';
import { formatDate } from 'core/utils/helpers';
import FormField from '../../../Components/InputField/FormField';

export const StockOutInitialColumns = [
  {
    accessorKey: 'created_at',
    header: 'Creation Date',
    Cell: ({ row }) => {
      // console.log(row.original.created_at);
      return <Typography> {formatDate(row?.original?.created_at)} </Typography>;
    }
  },
  {
    accessorKey: 'work_order_number',
    header: 'Work Order #'
  },
  {
    accessorKey: 'invoice.invoice_number',
    header: 'Invoice #'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    // size: 20,
    Cell: ({ renderedCellValue }) => {
      return (
        <Box sx={{ color: StatusColor(renderedCellValue, theme) }}>
          {snakeCaseToPrettyText(renderedCellValue)}
        </Box>
      );
    }
  }

  // {
  //   accessorKey: 'actions',
  //   header: 'Actions',
  //   enableColumnActions: false,
  //   enableColumnFilter: false,
  //   enableColumnOrdering: false,
  //   enableSorting: false,
  //   // size: 70,
  //   Cell: ''
  // }
];

export const collapsedColumns = [
  {
    accessorKey: 'image',
    header: '',
    enableColumnActions: false,
    enableColumnOrdering: false,
    size: 50,
    Cell: () => (
      <Box
        width='65px'
        height='65px'
        paddingY='2px'
        justifyContent='center'
        display={'flex'}
        bgcolor={'pink'}
        alignItems='center'
        overflow='hidden'
        border='1px solid #ccc'>
        <img
          src='https://picsum.photos/seed/picsum/200/300'
          alt='Centered Image'
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
    Cell: ({ row }) => <ItemCell data={row?.original} />
  },
  {
    accessorKey: 'item_number',
    header: 'Item #',
    size: 50
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    size: 50
  },
  {
    accessorKey: 'stock_location',
    header: 'Stock Location',
    size: 50
  },
  {
    accessorKey: 'qr_code',
    header: 'QR Code',

    Cell: () => <QRCode value='hey' size={50} />,
    enableColumnActions: false,
    enableColumnOrdering: false
  }
];

export const WorkOrderInitialColumns = [
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
          src={row?.original?.item?.image}
          alt='Item Image Image'
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
    Cell: ({ row, renderedCellValue }) => <ItemCell data={renderedCellValue} />
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
    Cell: (row, renderedCellValue) => (
      <CellInputField row={row} value={renderedCellValue} />
    )
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
// eslint-disable-next-line react-refresh/only-export-components
export const ItemCell = ({ data }) => (
  <Typography variant='body2' color='rgba(0, 0, 0, 0.60)'>
    {data}
  </Typography>
);

const CellInputStyles = {
  '& .MuiInputBase-input': {
    padding: '8px 5px'
  }
};

const handleQuantityChange = index => {};

function CellInputField({ handleQuantityChange, ...props }) {
  const index = props.row.row.index;
  return (
    <FormField
      {...props}
      sx={CellInputStyles}
      onChange={() => handleQuantityChange(index)}
      onClick={e => e.stopPropagation()}
      type='number'
    />
  );
}
