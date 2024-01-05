import { useEffect, useState } from 'react';

// mui components
import {
  Grid,
  Typography,
  Box,
  TextField,
  Divider,
  IconButton,
  Paper,
  Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Settings } from '@mui/icons-material';

// yup
import * as Yup from 'yup';

import { useFormik } from 'formik';

// apis
import {
  getPriceListApi,
  getSalesPersonApi,
  getSingeSaleOrderApi
} from '../../../../core/api/estimate';
import { getPeymentTermsApi } from '../../../../core/api/customer';
// common
import InputLabel from '../../../Components/InputLabel/InputLabel';
import FormField from '../../../Components/InputField/FormField';
import AddItem from '../../Estimate/NewEstimate/AddItem/AddItem';
import MUIButton from '../../../Components/Button/MUIButton';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import {
  decryptId,
  formatDateToYYYYMMDD,
  goBack
} from '../../../../core/utils/helpers';
import CustomerContactsList from '../../../Components/CustomerContacts/CustomerContactsList';
import {
  createSaleOrderApi,
  deleteSalesOrderFielApi,
  updateSaleOrderApi
} from '../../../../core/api/salesorders';
import { useNavigate, useParams } from 'react-router-dom';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { LoadingButton } from '@mui/lab';
import { useGenerateNumber } from '../../../Components/GenerateNumber/GenerateNumber';
import FilesModule from '../../../Components/FileUpload/FilesModule';
import CustomerSelection from '../../../Components/CustomerSelection';
import {
  PAYMENT_METHODS,
  terms_and_conditions
} from '../../../../core/utils/constants';
import TermsModal from '../../../Components/TermsModal/TermsModal';
import SalesPersons from '../../../Components/SalesPerson/SalesPersons';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';

const SalesOrderForm = ({ edit }) => {
  const navigate = useNavigate();
  let { id } = useParams();
  const saleOrderID = decryptId(id);
  const [customerList, setCustomerList] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [customerLoading, setCsutomerLoading] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [taxIdCustomer, setTaxIdCustomer] = useState(1);
  const [taxableCustomer, setTaxableCustomer] = useState('taxable');
  const [btnType, setBtnType] = useState('');
  const [singleSaleOrder, setSingleSaleOrder] = useState('');
  const [clicked, setClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
  const [saveAsDraftLoading, setSaveAsDraftLoading] = useState(false);
  const [saveAndSendLoading, setSaveAndSendLoading] = useState(false);

  // formikmode of payent : wire, cc, ach, square, cheque
  const initialValues_ = {
    customer_id: '',
    sales_person_id: '',
    sale_order_number: '',
    reference_number: '',
    sale_order_date: formatDateToYYYYMMDD(new Date()), // current Date,
    mode_of_payment: '',
    term_id: '',
    adjustment_description: '',
    discount_amount: 0,
    customer_note: '',
    terms_and_condition: terms_and_conditions,
    sale_order_files: [],
    email_to: [],
    sub_total: 0,
    discount: 0,
    tax_amount: 0,
    discount_type: 'Percentage',
    shipping_charges: 0,
    adjustment: 0,
    items_rates_are:
      taxableCustomer === 'taxable' ? 'tax_exclusive' : 'tax_inclusive',
    total: 0,
    sale_order_items: [
      {
        // item_id: '' ,
        item_name: 'Type or click to select an item',
        quantity: 1,
        rate: 0,
        tax_amount: 0,
        tax_id: { taxIdCustomer },
        total: 0
      }
    ]
  };
  const [initialValues, setInitialValues] = useState(initialValues_);
  const validationSchema = Yup.object().shape({
    customer_id: Yup.string().required('Customer  is required'),
    sales_person_id: Yup.string().required('Sale person is required'),
    term_id: Yup.string().required('This field  is required'),
    mode_of_payment: Yup.string().required('Payment mode is required')
  });

  const handleButtonClick = type => {
    setBtnType(type);
    setClicked(true);
  };

  function returningType(type) {
    if (type === 'save_as_draft') {
      setSaveAsDraftLoading(true);
    } else if (type === 'save_and_send') {
      setSaveAndSendLoading(true);
    }
  }

  function runningFinally() {
    setSaveAsDraftLoading(false);
    setSaveAndSendLoading(false);
    setSubmitting(false);
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (edit && saleOrderID) {
        try {
          returningType(btnType);

          const resp = await updateSaleOrderApi({
            ...values,
            button_type: btnType,
            _method: 'PUT'
          });
          notyf.success(resp?.message);
          navigate('/sales-orders');
        } catch (error) {
          if (
            error?.data?.errors &&
            Object.keys(error?.data?.errors)?.length > 0
          )
            formik.setErrors(error?.data?.errors);
          else notyf.error(error.data || 'Something went wrong');
          // formik.setErrors(error?.data?.errors);
        } finally {
          runningFinally();
        }
      } else {
        if (
          values.sale_order_items.length === 1 &&
          values.sale_order_items[0]?.total === 0
        ) {
          console.log('onSubmit values at 0 index amount is 0');
        } else {
          try {
            returningType(btnType);
            const resp = await createSaleOrderApi({
              ...values,
              //       sale_order_items: formik.values?.estimate_items,
              button_type: btnType
            });

            navigate('/sales-orders');
            notyf.success(resp?.message);
          } catch (error) {
            if (
              error?.data?.errors &&
              Object.keys(error?.data?.errors)?.length > 0
            )
              formik.setErrors(error?.data?.errors);
            else notyf.error(error.data);
            // formik.setErrors(error.data.errors);
          } finally {
            runningFinally();
          }
        }
      }
    }
  });

  const gettingCustomersList = resp => {
    if (resp) {
      if (!edit) {
        const termObject = {
          label: resp.term.term_name,
          value: resp.term.id,
          number_of_days: resp.term.number_of_days,
          id: resp.term.id,
          due_date: resp.term.due_date
        };
        formik.setFieldValue('term_id', resp.term.id);

        formik.setFieldValue(
          'mode_of_payment',
          resp.mode_of_payment.toLowerCase()
        );
        setSelectedTerm(termObject);
      }

      setSelectedEmails(resp?.customer_contacts);
      setCustomerList(resp);
      setTaxIdCustomer(resp?.tax_id);
      setTaxableCustomer(resp.tax_preference);
    }
  };
  useEffect(() => {
    if (initialValues?.term_id) {
      const preSelectedTerms = paymentTerms.find(
        item => item.id === initialValues.term_id
      );
      setSelectedTerm(preSelectedTerms);
    }
  }, [initialValues?.term_id]);

  const updatingContacts = newContacts => {
    setSelectedEmails(prev => [...prev, ...newContacts]);
  };

  // generate sale order number
  useGenerateNumber('sale_order', 'sale_order_number', formik, edit, id);

  // delete/remove added files from list
  const deleteFileFromApi = async fileId => {
    try {
      const resp = await deleteSalesOrderFielApi(fileId);
      notyf.success(resp.message);
      formik.setFieldValue(
        'sale_order_files',
        formik.values?.sale_order_files.filter(f => f.id !== fileId)
      );
    } catch (error) {}
  };
  const deletingFile = file => {
    if (file.id) {
      deleteFileFromApi(file?.id);
    } else {
      // setEstimatedFiles(prevFiles => prevFiles.filter(f => f !== file));
      formik.setFieldValue(
        'sale_order_files',
        formik.values?.sale_order_files.filter(f => f !== file)
      ); //delete uploaded file from formik key
    }
  };

  // payement paymentTerms
  const fetchTerms = async () => {
    try {
      const response = await getPeymentTermsApi();
      const termsData = response?.data;
      if (termsData) {
        const termsOptions = termsData.map(term => ({
          text: term?.term_name,
          value: term.id,
          number_of_days: term.number_of_days,
          id: term.id,
          due_date: term.due_date
        }));

        setPaymentTerms([...termsOptions]);
      }
    } catch (error) {
      console.error('Error fetching payment terms:', error);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  useEffect(() => {
    const selectedEmailss = selectedEmails
      ?.filter(item => item.is_selected === 1)
      .map(item => item.email);
    formik.setFieldValue(
      'email_to',
      (selectedEmailss.length > 0 && selectedEmailss) || 'null'
    );
  }, [formik.values?.customer_id, selectedEmails]);

  const fetchingingSingleSaleOrder = async () => {
    try {
      const resp = await getSingeSaleOrderApi(saleOrderID);
      setSingleSaleOrder(resp?.data);
      formik.setValues(resp?.data);
      setInitialValues(resp?.data);
      formik.setFieldValue('sale_order_files', resp?.data?.sale_order_file);
    } catch (error) {}
  };

  useEffect(() => {
    if (saleOrderID) {
      fetchingingSingleSaleOrder();
    }
  }, [saleOrderID]);

  const MyDivider = () => (
    <Grid item xs={12} mt={3}>
      <Divider />
    </Grid>
  );

  //   styles

  const labelStyle = {
    display: 'flex',
    alignItems: 'start'
  };

  useEffect(() => {
    if (formik.dirty === true) {
      const el = document.querySelector('.Mui-error, [data-error]');
      (el?.parentElement ?? el)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [formik.isSubmitting]);
  return (
    <>
      <OverlayLoader open={isLoadingOverlay} />
      <form onSubmit={formik.handleSubmit}>
        <div style={{ position: 'relative' }}>
          <Grid container>
            <Grid item sm={12}>
              <HeaderPaper
                sx={{
                  paddingLeft: '2rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                <Typography variant='h6'>
                  {edit ? 'Edit Sales Order' : 'New Sales Order'}
                </Typography>
                <IconButton
                  onClick={() => goBack(() => navigate('/sales-orders'))}>
                  <CloseIcon />
                </IconButton>
              </HeaderPaper>
            </Grid>

            <Paper sx={{ width: '100%', padding: '1.5rem 2rem 10rem 2rem' }}>
              <CustomerSelection
                id='customer_id'
                type='customer'
                formik={formik}
                onSelect={resp => gettingCustomersList(resp)}
                preSelected={formik.values.customer_id}
                setIsLoadingOverlay={setIsLoadingOverlay}
              />

              {/* sales order  */}
              <Grid item container mt={2}>
                <Grid item xs={2} sx={{ ...labelStyle }}>
                  <InputLabel>
                    Sales Order#<span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                </Grid>
                <Grid item sm={4}>
                  <FormField
                    name='sale_order_number'
                    size='small'
                    fullWidth
                    value={formik.values?.sale_order_number}
                    handleChange={formik.handleChange}
                    isTouched={formik.touched?.sale_order_number}
                    disabled
                    error={
                      formik.touched?.sale_order_number &&
                      formik.errors?.sale_order_number &&
                      formik.errors?.sale_order_number
                    }
                  />
                </Grid>
              </Grid>

              <Grid item container mt={2}>
                <Grid item xs={2} sx={{ ...labelStyle }}>
                  <InputLabel>
                    Sales Order Date<span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                </Grid>
                <Grid item sm={4}>
                  <TextField
                    name='sale_order_date'
                    value={formik.values?.sale_order_date}
                    onChange={formik.handleChange}
                    size='small'
                    fullWidth
                    type='date'
                    inputProps={{ min: formatDateToYYYYMMDD(new Date()) }}
                  />
                </Grid>
              </Grid>

              <Grid item container mt={2}>
                <Grid item xs={2}>
                  <InputLabel sx={{ ...labelStyle }}>
                    Mode of Payments
                  </InputLabel>
                </Grid>
                <Grid item xs={4}>
                  <FormField
                    id='mode_of_payment'
                    value={formik.values?.mode_of_payment}
                    handleChange={formik.handleChange}
                    error={formik.errors?.mode_of_payment}
                    label={'Select mode of payments'}
                    type={'select'}
                    options={PAYMENT_METHODS}
                    fullWidth
                    isTouched={formik.touched?.mode_of_payment}
                  />
                </Grid>
              </Grid>

              <Grid item container mt={2}>
                <Grid item xs={2}>
                  <InputLabel sx={{ ...labelStyle }}>Payment Terms</InputLabel>
                </Grid>
                <Grid item xs={4}>
                  <FormField
                    id='term_id'
                    value={formik.values?.term_id}
                    handleChange={formik.handleChange}
                    error={
                      formik.touched?.term_id &&
                      formik?.errors?.term_id &&
                      formik?.errors?.term_id
                    }
                    label={'Payment Terms'}
                    isTouched={formik.touched?.term_id}
                    type={'select'}
                    fullWidth
                    options={paymentTerms}
                    selectbutton={
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                        <MUIButton
                          variant={'outlined'}
                          fullWidth
                          onClick={() => setIsOpen(true)}>
                          <Settings /> Configure Terms
                        </MUIButton>
                      </Box>
                    }
                  />
                  <TermsModal
                    terms={paymentTerms}
                    isOpen={isOpen}
                    onSave={fetchTerms}
                    onClose={() => setIsOpen(false)}
                  />
                </Grid>
              </Grid>
              <Grid item container mt={2}>
                <Grid item xs={2}>
                  <InputLabel sx={{ ...labelStyle }}>
                    Reference Number
                  </InputLabel>
                </Grid>
                <Grid item xs={4}>
                  <FormField
                    id='reference_number'
                    value={formik.values?.reference_number}
                    onChange={formik.handleChange}
                    error={
                      formik.touched?.reference_number &&
                      formik?.errors?.reference_number &&
                      formik?.errors?.reference_number
                    }
                    label={'Reference Number'}
                    isTouched={formik.touched?.reference_number}
                  />
                </Grid>
              </Grid>
              <MyDivider />

              <SalesPersons
                id='sales_person_id'
                formiks={{
                  values: {
                    sales_person_id: formik.values?.sales_person_id
                  },
                  errors: {
                    sales_person_id: formik?.errors?.sales_person_id
                  },
                  touched: {
                    sales_person_id: formik.touched?.sales_person_id
                  },
                  handleChange: formik.handleChange,
                  setFieldValue: formik.setFieldValue
                }}
              />
              <MyDivider />

              <Grid item container spacing={2} my={7}>
                <Grid item sm={12}>
                  {/* formik.values?.sale_order_items.length > 0 */}
                  <AddItem
                    initialValues={initialValues}
                    formik={formik}
                    isEdit={edit}
                    clicked={clicked}
                    setClicked={setClicked}
                    taxIdCustomer={taxIdCustomer}
                    taxableCustomer={taxableCustomer}
                    loading={customerLoading}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Grid item xs={12}>
                    <InputLabel>Customer Notes</InputLabel>
                    <TextField
                      fullWidth
                      label='Notes'
                      multiline
                      rows={3}
                      id='customer_note'
                      value={formik.values?.customer_note}
                      onChange={formik.handleChange}
                      // variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel>Terms and conditions</InputLabel>
                    <TextField
                      fullWidth
                      label='Terms and conditions'
                      multiline
                      rows={3}
                      id='terms_and_condition'
                      onChange={formik.handleChange}
                      value={formik.values?.terms_and_condition}
                      // variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid item xs={6} container justifyContent='center' mt={3}>
                  <Box>
                    <FilesModule
                      files={formik.values?.sale_order_files || []}
                      onDelete={deletingFile}
                      setFiles={files =>
                        formik.setFieldValue('sale_order_files', files)
                      }
                    />
                  </Box>

                  <Box
                    sx={{
                      width: '60%'
                    }}></Box>
                </Grid>
              </Grid>

              {formik.values?.customer_id && (
                <CustomerContactsList
                  setSelectedEmails={setSelectedEmails}
                  gettingCustomerList={gettingCustomersList}
                  selectedEmails={selectedEmails}
                  customerDetails={customerList}
                  onSave={updatingContacts}
                />
              )}
            </Paper>

            {/* footer  */}
            <Box
              style={{
                position: 'sticky',
                bottom: 0,
                left: 0,
                right: 0,
                width: '100%',
                zIndex: '1000'
              }}>
              <Paper elevation={10} sx={{ padding: '1rem 2.3rem' }}>
                <LoadingButton
                  type='submit'
                  variant='contained'
                  onClick={() => handleButtonClick('save_as_draft')}
                  disabled={saveAsDraftLoading}
                  loading={saveAsDraftLoading}>
                  Save as Draft
                </LoadingButton>
                <LoadingButton
                  sx={{ marginX: '.5rem' }}
                  variant='contained'
                  type='submit'
                  onClick={() => handleButtonClick('save_and_send')}
                  disabled={saveAndSendLoading}
                  loading={saveAndSendLoading}>
                  Save and send
                </LoadingButton>

                <MUIButton
                  sx={{ marginX: '.5rem' }}
                  variant='outlined'
                  router
                  to='/sales-orders'>
                  Cancel
                </MUIButton>
              </Paper>
            </Box>
          </Grid>
        </div>
      </form>
    </>
  );
};

export default SalesOrderForm;
