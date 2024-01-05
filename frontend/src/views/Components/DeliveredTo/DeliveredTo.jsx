import React, { useEffect } from 'react'
import GridRow from '../GridRow/GridRow'
import { FormControlLabel, Grid, Radio, Stack, Typography } from '@mui/material'
import InputLabel from '../InputLabel/InputLabel'
import CustomSelect from '../Select/Select'
import { useState } from 'react'
import { getCustomersApi } from '../../../core/api/estimate'
import { customersSingleApi } from '../../../core/api/customer'
import Address from '../Address/Address/Address'
import { organizationDetails } from '../../../core/utils/constants'

const DeliveredTo = ({formik , preSelect}) => {
    const [selected, setSelected] = useState("");
    const [options, setOptions] = useState([]);
    const [shippingAddress, setShippingAddress] = useState([]);
    const [customerDetails, setCustomerDetails] = useState();
    const [optionLoading, setOptionLoading] = useState(false);
  const deliverType = {
    ORAGANIZATION: "organization",
    CUSTOMER: "customer",
  };
   
  const handleSelectChange = (newOption) => {
    setSelected(newOption);
    formik.setFieldValue('customer_delivered_id', newOption?.value || "");
  };
   const fetchOptions = async()=> {
    try {
      setOptionLoading(true)
      const resp = await getCustomersApi();
      if (resp) setOptions(resp?.data?.Customers);
    } catch (error) {
      
    }finally{
      setOptionLoading(false)
    }
  
   }

  useEffect(()=> {
    fetchOptions()

  } ,[])
  
    const gettingCustomerDetails = async()=> {
    
      try {
        if(preSelect){
          const addresp = await customersSingleApi(preSelect)
          console.log('addresp' , addresp)
          setCustomerDetails(addresp)
          const addresses= addresp?.customer_shipping_address.find(item => item.is_default ===1)
          setShippingAddress([addresses])
          const addressId = addresses.id
          formik.setFieldValue('customer_address_id' , addressId)
        }
      } catch (error) {
        
      }
    }
    useEffect(()=> {
      if(preSelect){
        gettingCustomerDetails()
      }

    } , [preSelect])

  useEffect(() => {
    if (preSelect) {
      const defaultVal = options?.find((item) => item?.id == preSelect);
      setSelected({
        label: defaultVal?.display_name,
        value: defaultVal?.id,
      });
    } 
  }, [options, preSelect]);

  useEffect(() => {
    if (formik.values.deliver_type === deliverType.ORAGANIZATION) {
      formik.setFieldValue('customer_delivered_id', '');
      formik.setFieldValue('customer_address_id', null);
      setSelected(null)
      formik.setFieldValue('deliver_to', `${organizationDetails.address.address}, ${organizationDetails.address.city}, ${organizationDetails.address.stateAbbr}, ${organizationDetails.address.postalCode}`)
    } else if (formik.values.deliver_type === deliverType.CUSTOMER) {
      formik.setFieldValue('deliver_to', '');
    }
  }, [formik.values.deliver_type]);
 
  const labelStyle = {
    display: "flex",
    alignItems: "start",
  };
  console.log('formik.values.customer_delivered_id' , formik.values.customer_delivered_id)
  return (
    <>
    <GridRow>
    <Grid item xs={2} sx={{ ...labelStyle }}>
      <InputLabel>
        Deliver to <span style={{ color: "red" }}>*</span>
      </InputLabel>
    </Grid>
    <Grid item sm={4}>
      <Stack
        direction='row'
        display='flex'
        pl={0}
        ml={0}
        justifyContent='start'
        alignItems='center'>
        <FormControlLabel
          control={
            <Radio
            name='deliver_type'
            value={deliverType.ORAGANIZATION}
              checked={
                formik.values.deliver_type === deliverType.ORAGANIZATION
              }
              onChange={formik.handleChange}
            />
          }
          label={<InputLabel>Organization</InputLabel>}
        />
        &ensp; &ensp; &ensp;
        <FormControlLabel
          control={
            <Radio
            name='deliver_type'
            value={deliverType.CUSTOMER}
              checked={
                formik.values?.deliver_type === deliverType.CUSTOMER
              }
              onChange={formik.handleChange}
            />
          }
          label={<InputLabel>Customer</InputLabel>}
        />
      </Stack>
      {formik.values.deliver_type === deliverType.ORAGANIZATION ? (
        <>
          <Stack>
            <Typography variant='caption'>
             {organizationDetails.address.address}
            </Typography>
            <Typography variant='caption'>
              {/* {'Eagan MN 55121'} */}
              {organizationDetails.address.city}{', '}{organizationDetails.address.stateAbbr}{', '}{organizationDetails.address.postalCode}
            </Typography>
            <Typography variant='caption'>
              {organizationDetails.address.country}
            </Typography>
            {/* <Typography variant='caption'>
              {'55121'}
            </Typography> */}
          </Stack>
        </>
      ) :formik.values.deliver_type === deliverType.CUSTOMER ? (
        <>
           <CustomSelect
            id='customer_delivered_id'
            placeholder={'Select or add a customer'}
            value={selected || ""}
            options={options?.map(item => ({
              label: item.display_name,
              value: item.id,
            }))}
            isDisabled={optionLoading}
            loading={optionLoading}
            onChange={(selected) => handleSelectChange(selected)}
            isSearchable
            isClearable
            touched={formik.touched.customer_delivered_id}
            error={formik.touched.customer_delivered_id &&  formik.errors.customer_delivered_id}
          />
                <Address
                gettingCustomerDetails={gettingCustomerDetails}
                shipping
                selectedCustomer={selected}
                customer_billing_address={shippingAddress}
                customerDetails={customerDetails}
                id={formik.values.customer_delivered_id}
                userType={'customer'}
              />
        </>
        
      ) : null}

    </Grid>
  </GridRow> 
  </>
  )
}

export default React.memo(DeliveredTo)