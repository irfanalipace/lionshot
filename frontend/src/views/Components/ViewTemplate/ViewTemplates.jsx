import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Logo from '../../../assets/images/logos/computer.png';
import { Ribbon } from '../common';
import TemplateTable from './TemplateTable';
import TemplateAddress from './TemplateAddress';
import TemplateOtherDetails from './TemplateOtherDetails';
import Download from '../../pages/CustomerPortal/DownloadCustomerTemplate';
import { organizationDetails } from '../../../core/utils/constants';
import { toFixed } from '../../../core/utils/helpers';
import SimpleTable from '../CORTable/SimpleTable';

const ViewTemplates = ({
  data,
  itemsColumns,
  status,
  headerInfo,
  calculationInfo,
  title,
  apiData,
  bankDetails,
  addressData,
  paymentInfo,
  download,
  downloadingPdf,
  headings,
  titleStyles,
  extraCalculationsInfo = [],
  organizationAddress,
  termsAndConditions,
  showCalculations = true,
  showDiscountAndTax = true,
  showShippingCharges = true
}) => {
  const getLabel = item => {
    if (item.key === 'discount') {
      return item?.type === 'percent' && item.value > 0
        ? item.label + ' ' + item.value + '%:'
        : `${item.label}`;
    } else {
      return item.label;
    }
  };

  const getValue = item => {
    if (item.key === 'discount') {
      return item?.type !== 'percent'
        ? '$' + toFixed(item.value)
        : '$' + ((item?.value / 100) * item?.value)?.toFixed(2);
    } else {
      return toFixed(item.value);
    }
  };
  
  return (
    <Box>
      <>
      <Box>
      <Typography sx={{
fontSize: '16px',
fontWeight: 600,
lineHeight: '26px',
letterSpacing: '0.46000000834465027px',
textAlign: 'left'
}}>
        Request Of:
       </Typography>
       <Typography sx={{fontSize: '15px',
fontWeight: 600,
lineHeight: '26px',
letterSpacing: '0.46000000834465027px',
marginTop:'6px',
textAlign: 'left'}}>
       CITY OF {data?.city}
       </Typography>
      </Box>
      <Box sx={{marginTop:'16px'}}>
      <Typography sx={{color:'black', fontWeight:'bold'}}>
        Address:
       </Typography>
       <Typography sx={{color:'black', marginTop:'7px'}}>
       CITY OF {data?.addr1}
       </Typography>
       <Typography sx={{color:'black', marginTop:'7px'}}>
       CITY OF: {data?.addr2}
       </Typography>
      </Box>
      <Box>
      <SimpleTable data={data}/>
      </Box>
      </>
    </Box>
  );
};

export default ViewTemplates;
