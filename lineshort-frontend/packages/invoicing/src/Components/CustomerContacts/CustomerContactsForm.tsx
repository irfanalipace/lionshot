import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';

// import useResponsiveStyles from "../../../hooks/useMedaiQuery";
import { Grid, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// import FormField from '../InputField/FormField';
import FormField from '@/Components/InputField/FormField';
import MUIButton from '@/Components/Button/MUIButton';
// apis
import { addCustomerContactApi } from '@/apis/invoice';
import notyf from '@/Components/NotificationMessage/notyfInstance';
import React from 'react';

const salutionOPtions = [
  {
    id: 1,
    label: 'Mr.',
    value: 'Mr',
  },
  {
    id: 2,
    label: 'Mrs.',
    value: 'Mr',
  },
  {
    id: 1,
    label: 'Ms.',
    value: 'Mrs',
  },
  {
    id: 1,
    label: 'Miss.',
    value: 'Miss',
  },
  {
    id: 1,
    label: 'Dr.',
    value: 'Dr',
  },
];
export default function CustomerContactsForm({
  onClose,
  setCustomerEmailsList,
  customer_id,
  gettingCUstomerList,
}) {
  const [error, setError] = useState('');

  // schama
  const validationSchema = Yup.object().shape({
    salutation: Yup.string().required('Salutation is required'),
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    mobile: Yup.string()
      .matches(/^[0-9]+$/, 'Mobile must contain only numbers')
      .min(11, 'Mobile Number be at least 11 characters')
      .max(14, 'Mobile Number cannot be greater than 14 characters')
      .required('Mobile is required'),
    work_phone: Yup.string().matches(
      /^[0-9]+$/,
      'Work Phone must contain only numbers'
    ),
  });

  const formik = useFormik({
    initialValues: {
      salutation: '',
      first_name: '',
      last_name: '',
      email: '',
      work_phone: '',
      mobile: '',
      skypeNumber: '',
      designation: '',
      department: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const resp: any = await addCustomerContactApi({
          ...values,
          customer_id,
        });
        notyf.success(resp?.message);
        // console.log('resp++++' , resp.data)
        onClose();
        gettingCUstomerList();
        setCustomerEmailsList((prev) => [...prev, ...resp.data]);
      } catch (error) {
        setError(error?.data?.errors);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // handle select
  const handleSelectChange = (selected, type) => {
    console.log('selected', selected, type);
    if (selected !== undefined && type === 'salutation') {
      formik.setFieldValue('salutation', selected.value);
    }
  };

  useEffect(() => {
    return () => {
      setError('');
    };
  }, []);

  //   api error
  useEffect(() => {
    if (error) {
      for (const field in error as any) {
        if (error.hasOwnProperty(field)) {
          formik.setFieldError(field, error[field][0]);
        }
      }
    }
  }, [error]);

  //   useEffect(() => {
  //     if (!Object.keys(formik.errors).length && error) {
  //       formik.setErrors({ genericError: "Something went Wromg" });
  //     }
  //   }, [error, formik.errors]);

  console.log('formik@@@', formik.errors);
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container p={3}>
          {/* <Grid item xs={12} textAlign='center'>
  { formik.errorsformik.errors.genericError && (
    <Typography variant="caption" color="error">
      {formik.errors.genericError}
    </Typography>
  )}
</Grid> */}

          <Grid item container spacing={3}>
            <Grid item xs={12} sm={12}>
              <Select
                name='salutation'
                placeholder='Salutation'
                options={salutionOPtions?.map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
                onChange={(selected) =>
                  handleSelectChange(selected, 'salutation')
                }
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor:
                      formik.touched.salutation && formik.errors.salutation
                        ? 'red'
                        : 'rgba(0, 0, 0, 0.2)', // Customize border color based on error state
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    zIndex: 9999,
                    fontFamily: 'Roboto',
                    // Adjust the z-index value as needed
                  }),
                }}
              />

              {formik.touched.salutation && formik.errors.salutation && (
                <Typography variant='caption' color='error'>
                  {formik.errors.salutation}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormField
                type='text'
                fullWidth
                label=' First Name'
                name='first_name'
                value={formik.values.first_name}
                onChange={formik.handleChange}
                isTouched={formik.touched.first_name}
                error={
                  formik.touched.first_name &&
                  formik.errors.first_name &&
                  formik.errors.first_name
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                fullWidth
                type='text'
                label=' Last Name'
                name='last_name'
                value={formik.values.last_name}
                onChange={formik.handleChange}
                isTouched={formik.touched.last_name}
                error={
                  formik.touched.last_name &&
                  formik.errors.last_name &&
                  formik.errors.last_name
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
                type='text'
                fullWidth
                name='email'
                label='Email'
                value={formik.values.email}
                onChange={formik.handleChange}
                isTouched={formik.touched.email}
                error={
                  formik.touched.email &&
                  formik.errors.email &&
                  formik.errors.email
                }
              />
            </Grid>
            <Grid item xs={6}>
              <FormField
                id='work_phone'
                fullWidth
                type='text'
                label=' Work Phone'
                name='work_phone'
                value={formik.values.work_phone}
                isTouched={formik.touched.work_phone}
                onChange={formik.handleChange}
                error={
                  formik.touched.work_phone &&
                  formik.errors.work_phone &&
                  formik.errors.work_phone
                }
              />
            </Grid>
            <Grid item xs={6}>
              <FormField
                fullWidth
                type='text'
                name='mobile'
                label='Phone'
                value={formik.values.mobile}
                isTouched={formik.touched.mobile}
                onChange={formik.handleChange}
                error={
                  formik.touched.mobile &&
                  formik.errors.mobile &&
                  formik.errors.mobile
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormField
                fullWidth
                type='text'
                label='Skype Number'
                name='skypeNumber'
                value={formik.values.skypeNumber}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormField
                fullWidth
                type='text'
                label='Designation'
                name='designation'
                value={formik.values.designation}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormField
                fullWidth
                type='text'
                label='Department'
                name='department'
                value={formik.values.department}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='flex-end'>
              <Stack direction='row' padding='0 1.5rem' spacing={2}>
                <LoadingButton
                  variant='contained'
                  type='submit'
                  disabled={formik.isSubmitting}
                  loading={formik.isSubmitting}
                >
                  Add
                </LoadingButton>
                <MUIButton variant='outlined' onClick={onClose}>
                  Cancel
                </MUIButton>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
