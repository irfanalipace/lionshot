import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button } from '@mui/material';
import FormField from '../../../Components/InputField/FormField';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import {
  CreateDepartment,
  UpdateDepartment,
  getDepartmentNameApi
} from '../../../../core/api/department';

function DepartmentForm({
  setOpenVerifyModal,
  rowId,
  setRefresh,
  DialogTitle
}) {
  const [fieldError, setFieldError] = useState('');
  const validationSchema = Yup.object().shape({
    department: Yup.string().required('Department Name is required')
  });
  const formik = useFormik({
    initialValues: {
      department: ''
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      try {
        if (rowId && DialogTitle === 'Edit') {
          const param = { id: rowId, name: values.department };
          const res = await UpdateDepartment(param);
          if (res) {
            setOpenVerifyModal(false);
            notyf.success('Department Updated Successfully');
            setRefresh(prev => prev + 1);
          } else {
            notyf.error('Something Went Wrong');
          }
        } else {
          const param = { name: values.department, parent_id: '1' };
          const res = await CreateDepartment(param);
          if (res) {
            setOpenVerifyModal(false);
            setRefresh(prev => prev + 1);
            notyf.success('Department Created Successfully');
            console.log('setRefresh', setRefresh());
          } else {
            notyf.error('Something Went Wrong');
          }
        }
      } catch (error) {
        console.log('error', error);
        setFieldError(error.data.errors);
      }
    }
  });
  React.useEffect(() => {
    formik.setFieldError('department', fieldError?.name || {});
    console.log('fieldError', fieldError);
  }, [fieldError]);

  React.useEffect(() => {
    const fetchDepartmentName = async () => {
      const res = await getDepartmentNameApi(rowId);
      formik.setFieldValue('department', res?.name);
    };

    if (rowId && DialogTitle === 'Edit') {
      fetchDepartmentName();
    }
  }, [rowId]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box padding={3}>
        <FormField
          id='department'
          fullWidth
          label={'Department Name'}
          required
          value={formik.values.department}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isTouched={formik.touched.department}
          error={formik.errors.department}
        />
        <Button
          variant='contained'
          sx={{ paddingX: '30px', marginTop: '20px' }}
          onClick={e => {
            e.stopPropagation();
            formik.handleSubmit();
          }}>
          Save
        </Button>
        <Button
          variant='outlined'
          sx={{ marginLeft: '10px', marginTop: '20px' }}
          onClick={() => setOpenVerifyModal(false)}>
          Cancel
        </Button>
      </Box>
    </form>
  );
}

export default DepartmentForm;
