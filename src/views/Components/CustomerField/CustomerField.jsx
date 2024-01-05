import React, { useEffect, useState } from "react";
// mui
import { Grid } from "@mui/material";
// common
import InputLabel from "../InputLabel/InputLabel";
import CustomSelect from "../Select/Select";

// api
import { getCustomersApi } from "../../../core/api/estimate";
import { useParams } from "react-router-dom";
const CustomerField = ({
  onChange,
  setSelectedCustomer,
  selectedCustomer,
  touched,
  error,
  formik,
}) => {
  const { id } = useParams();
  const [customerOptions, setCustomerOptions] = useState([]);
  const [customerLoading, setCsutomerLoading] = useState(false);

  // customer options
  const getCustomerOptions = async () => {
    try {
      setCsutomerLoading(true);
      const resp = await getCustomersApi();
      setCustomerOptions((prev) => resp?.data?.Customers);
    } catch (error) {
    } finally {
      setCsutomerLoading(false);
    }
  };
  useEffect(() => {
    getCustomerOptions();
  }, []);

  //  set customer for specific id / for edit
  useEffect(() => {
    if (id && customerOptions?.length > 0 && formik.values.customer_id) {
      const defaultVal = customerOptions?.find(
        (item) => item.id === formik.values.customer_id
      );

      setSelectedCustomer({
        label: defaultVal?.display_name,
        value: defaultVal?.id,
      });
    }
  }, [formik.values.customer_id]);

  //   when user comes from customer /click on new estimate
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const customerId = params.get("customerId");
    formik.setFieldValue("customer_id", customerId);
    if (customerId && customerOptions?.length > 0) {
      const defaultVal = customerOptions?.find(
        (item) => item?.id == customerId
      );
      setSelectedCustomer({
        label: defaultVal?.display_name,
        value: defaultVal.id,
      });
    }
  }, [customerOptions, formik.values.customer_id]);

  // styles
  const labelStyle = {
    display: "flex",
    alignItems: "start",
  };

  return (
    <Grid item container>
      <Grid item xs={2} sx={{ ...labelStyle }}>
        <InputLabel>
          Customer Name<span style={{ color: "red" }}>*</span>
        </InputLabel>
      </Grid>
      <Grid item xs={4}>
        <CustomSelect
          options={customerOptions?.map((item) => ({
            label: item.display_name,
            value: item.id,
          }))}
          loading={customerLoading}
          onChange={onChange}
          error={touched && error && error}
          placeholder='Select or add a  Customer'
          id='customer_id'
          value={selectedCustomer}
        />
      </Grid>
    </Grid>
  );
};

export default CustomerField;
