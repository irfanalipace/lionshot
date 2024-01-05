// SalesPersons.js

import React, { useEffect, useState } from 'react';
import { getSalesPersonApi } from '../../../core/api/estimate';
import { Grid } from '@mui/material';
import GridRow from '../GridRow/GridRow';
import FormField from '../InputField/FormField';
import InputLabel from '../InputLabel/InputLabel';

const SalesPersons = ({ id, formiks }) => {
  const [salesPersonOptions, setSalesPersonOptions] = useState([]);

  useEffect(() => {
    fetchSalesPersonList();
  }, []);

  const fetchSalesPersonList = async () => {
    try {
      const resp = await getSalesPersonApi();
      const salesList = resp?.data?.SalesPersons.map((item) => ({
        label: item.name,
        value: item.id,
        text: item.name,
      }));
      setSalesPersonOptions([...salesList]);
    } catch (error) {
      console.error("Something went wrong in sales list", error);
    }
  };

  return (
    <Grid item container mt={3}>
              <Grid item xs={2} display='flex' alignItems='center'>
                {" "}
                <InputLabel>Sales Person</InputLabel>
              </Grid>
              <Grid item xs={4}>

    <FormField
      id={id}
      value={formiks.values.sales_person_id}
      handleChange={formiks.handleChange}
      error={
        formiks.touched.sales_person_id &&
        formiks.errors.sales_person_id &&
        formiks.errors.sales_person_id
      }
      label="Select sales person"
      isTouched={formiks.touched.sales_person_id}
      type="select"
      fullWidth
      options={salesPersonOptions}
    />
    </Grid>
    </Grid>

  );
};

export default SalesPersons;