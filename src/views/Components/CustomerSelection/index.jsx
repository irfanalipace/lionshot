import { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Link } from '@mui/material';
import CustomSelect from '../Select/Select';
import { getCustomersApi } from '../../../core/api/estimate';
import CustomDrawer from '../../Components/Drawer/Drawer';
import CustomerViewDrawer from '../../Components/CustomerViewDrawer/CustomerViewDrawer';

import Address from '../Address/Address/Address';
import TaxSection from '../TaxSection/TaxSection';
import { getVendorsName, vendorsSingleApi } from '../../../core/api/vendor';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  capitalizeFirstLetter,
  decryptId,
  snakeCaseToPrettyText
} from '../../../core/utils/helpers';
import { customersSingleApi } from '../../../core/api/customer';
import DeliveredTo from '../DeliveredTo/DeliveredTo';
import GridRow from '../GridRow/GridRow';
import InputLabel from '../InputLabel/InputLabel';

const API_ENUMS = {
  customer: {
    listing: getCustomersApi,
    details: customersSingleApi
  },
  vendor: {
    listing: getVendorsName,
    details: vendorsSingleApi
  }
};

const SEARCH_PARAM_ENUM = {
  customer: 'customerId',
  vendor: 'vendorId'
};
function CustomerSelection({
  type = 'customer',
  id = '',
  formik,
  onSelect,
  preSelected,
  showAddress = true,
  showTax = true,
  deliveredTo = false,
  customerPreSelect,
  edit,
  setIsLoadingOverlay
}) {
  const [selected, setSelected] = useState('');
  const [options, setOptions] = useState([]);
  //const [optionLoading, setOptionLoading] = useState(false);
  const [customerViewOpen, setCustomerViewOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState();

  const closeCustomerView = () => {
    setCustomerViewOpen(!customerViewOpen);
  };

  const mapOptions = () => {
    return options?.map(item => ({
      label: item?.display_name || '',
      value: item.id
    }));
  };

  const getDataFromApiResponse = resp => {
    switch (type) {
      case 'customer':
        return resp?.data?.Customers;
      case 'vendor':
        return resp;
      default:
        return [];
    }
  };
  const fetchDetails = async () => {
    try {
      setIsLoadingOverlay(true);
      const _id = formik.values[id];
      if (_id || preSelected) {
        let response = await API_ENUMS[type].details(_id || preSelected);

        setCustomerDetails(response);
        if (typeof onSelect === 'function') onSelect(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingOverlay(false);
    }
  };

  const handleSelectChange = newOption => {
    setSelected(newOption);
    formik.setFieldValue(id, newOption?.value || '');
  };
  const fetchOptions = async () => {
    try {
      //setIsLoadingOverlay(true);
      const resp = await API_ENUMS[type].listing();
      const data = getDataFromApiResponse(resp);
      //	console.log(data, '@@@@@@');
      if (data) setOptions(data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      //	setIsLoadingOverlay(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const customerId = decryptId(params.get(SEARCH_PARAM_ENUM[type]));

    if (preSelected && options?.length > 0) {
      const defaultVal = options?.find(item => item?.id == preSelected);
      setSelected({
        label: defaultVal?.display_name,
        value: defaultVal?.id
      });
      if (customerDetails?.id !== preSelected) fetchDetails();
    } else if (customerId && options?.length > 0) {
      const defaultVal = options?.find(item => item?.id == customerId);

      setSelected({
        label: defaultVal?.display_name,
        value: defaultVal?.id
      });
      if (customerDetails?.id !== customerId) fetchDetails();
      formik.setFieldValue(id, customerId);
    }
  }, [options, preSelected]);

  // tax section

  const labelStyle = {
    display: 'flex',
    alignItems: 'start'
  };

  return (
    <>
      <GridRow>
        <Grid item xs={2} sx={{ ...labelStyle }}>
          <InputLabel>
            {snakeCaseToPrettyText(type)} Name
            <span style={{ color: 'red' }}>*</span>
          </InputLabel>
        </Grid>
        <Grid item xs={4}>
          <CustomSelect
            id={id}
            placeholder={`Select or add a ${type}`}
            value={selected || ''}
            options={mapOptions()}
            isDisabled={''}
            loading={''}
            onChange={selected => handleSelectChange(selected)}
            isSearchable
            isClearable
            touched={formik.touched[id]}
            error={formik.touched[id] && formik.errors[id]}
          />

          {selected && (
            <Box display='flex' alignItems='center' my={1}>
              <AccountCircleIcon sx={{ color: '#1976d2' }} />
              <Link
                ml={1}
                sx={{
                  fontFamily: 'Roboto',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textDecoration: 'none'
                }}
                onClick={() => setCustomerViewOpen(!customerViewOpen)}>
                {`View ${capitalizeFirstLetter(type)} Details`}
              </Link>
            </Box>
          )}

          {showAddress && (
            <Grid container justifyContent={'space-between'}>
              <Grid item xs={6}>
                <Address
                  gettingCustomerDetails={fetchDetails}
                  billing
                  selectedCustomer={selected}
                  id={formik.values[id]}
                  customer_billing_address={
                    type === 'vendor'
                      ? customerDetails?.vendor_billing_address
                      : customerDetails?.customer_billing_address
                  }
                  customerDetails={customerDetails}
                  userType={type}
                />
              </Grid>
              <Grid item xs={6}>
                <Address
                  gettingCustomerDetails={fetchDetails}
                  shipping
                  selectedCustomer={selected}
                  customer_billing_address={
                    type === 'vendor'
                      ? customerDetails?.vendor_shipping_address
                      : customerDetails?.customer_shipping_address
                  }
                  customerDetails={customerDetails}
                  id={formik.values[id]}
                  userType={type}
                />
              </Grid>
            </Grid>
          )}

          {showTax && selected && type !== 'vendor' && (
            <TaxSection
              onSave={fetchDetails}
              // taxValues={taxValues}
              customerDetails={customerDetails}
            />
          )}
        </Grid>
      </GridRow>
      {deliveredTo && (
        <DeliveredTo formik={formik} preSelect={customerPreSelect} />
      )}

      {/* {
      deliveredTo &&  <DeliveredTo formik={formik}  options={type === 'customer' ?  mapOptions() : []} handleSelectChange={handleSelectChange} />
     }  */}

      <CustomDrawer open={customerViewOpen} onClose={closeCustomerView} dWidth>
        <CustomerViewDrawer
          type={type}
          onClose={closeCustomerView}
          customerDetails={customerDetails}
        />
      </CustomDrawer>
    </>
  );
}

export default memo(CustomerSelection);
CustomerSelection.propTypes = {
  type: PropTypes.oneOf(['customer', 'vendor']),
  id: PropTypes.string,
  formik: PropTypes.object.isRequired
};
