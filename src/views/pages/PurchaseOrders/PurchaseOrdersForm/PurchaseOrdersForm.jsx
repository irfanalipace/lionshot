import {
  Grid,
  Paper,
  TextField,
  Box,
  FormControlLabel,
  Stack,
  Radio,
  Typography
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import GridRow from '../../../Components/GridRow/GridRow';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Settings } from '@mui/icons-material';

import {
  decryptId,
  formatDateToYYYYMMDD
} from '../../../../core/utils/helpers';
import AddItem from '../../../Components/AddItemNew';
import CustomerContactsList from '../../../Components/CustomerContacts/CustomerContactsList';
import { vendorsSingleApi } from '../../../../core/api/vendor';
import { getPeymentTermsApi } from '../../CustomerPortal/APIs/CustomerPortalAPIs';
import usePaymentTerms from '../../../../core/hooks/usePaymentTerms';
import {
  createPurchaseOrdersApi,
  deletePurchaseOrdersFielsApi,
  purchaseOrdersSingleApi,
  updatePurchaseOrdersApi
} from '../../../../core/api/purchase';
import { LoadingButton } from '@mui/lab';
import MUIButton from '../../../Components/Button/MUIButton';
import { useParams } from 'react-router-dom';
import CustomerSelection from '../../../Components/CustomerSelection';
import TermsModal from '../../../Components/TermsModal/TermsModal';
import FormField from '../../../Components/InputField/FormField';
import { useNavigate } from 'react-router-dom';
import { useGenerateNumber } from '../../../Components/GenerateNumber/GenerateNumber';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import FilesModule from '../../../Components/FileUpload/FilesModule';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import { terms_and_conditions } from '../../../../core/utils/constants';
``;
const labelStyle = {
  display: 'flex',
  alignItems: 'start'
};
const PAYMENT_METHODS = [
  { value: 'cc', text: 'Credit Card' },
  { value: 'cheque', text: 'Cheque' },
  { value: 'ach', text: 'ACH' },
  { value: 'square', text: 'Square' }
];
const PurchaseOrdersForm = ({ edit }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const purchaseID = decryptId(id);
  const addItemRef = useRef();
  const [selectedVendor, setSlectedVendor] = useState(null);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const { terms, termsLoading } = usePaymentTerms();
  // const { vendorOptions } = useVendorOptions();
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [taxIdCustomer, setTaxIdCustomer] = useState(1);
  const [btnType, setBtnType] = useState('');
  const [saveAsDraftLoading, setSaveAsDraftLoading] = useState(false);
  const [saveAndSendLoading, setSaveAndSendLoading] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState();
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vendorList, setVendorList] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [preSelectedCustomer, setPreSelectedCustomer] = useState(null);
  const [pageLoader, setPageLoader] = useState(false);
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
  const initialValues_ = {
    vendor_id: '',
    deliver_to: '',
    deliver_type: 'organization',
    customer_delivered_id: '',
    customer_address_id: '',
    invoice_ref_number: '',
    purchase_order_number: '',
    purchase_order_date: formatDateToYYYYMMDD(new Date()),
    mode_of_payment: '',
    term_id: '',
    expected_delivery_date: formatDateToYYYYMMDD(new Date()),
    customer_note: '',
    terms_and_condition: terms_and_conditions,
    purchase_order_files: '',
    shipment_preference: '',
    email_to: '',
    sub_total: 0,
    discount: 0,
    tax_amount: 0,
    discount_type: 'Percentage',
    shipping_charges: 0,
    adjustment: 0,
    total: 0,
    purchase_order_items: !edit
      ? [
          {
            item_name_object: '',
            item_id: '',
            item_name: '',
            quantity: 1,
            item_rate: 0,
            amount: 0,
            rate: 0,
            tax_id: 1,
            tax_amount: 0,
            // tax_id: taxIdCustomer,
            tax: '',
            total: 0,
            customer_details: ''
          }
        ]
      : []
  };

  const discountCalculate = (type, value, parentValue) => {
    return type === 'Percentage'
      ? isNaN((parentValue * value) / 100)
        ? '0.00'
        : `-${((parentValue * value) / 100).toFixed(2)}`
      : isNaN(value) || value === ''
      ? '0.00'
      : `-${value.toFixed(2)}`;
  };

  const validationSchema = Yup.object().shape({
    customer_delivered_id: Yup.string().when('deliver_type', {
      is: 'customer',
      then: () => Yup.string().required('Customer is required'),
      otherwise: () => Yup.string().notRequired()
    }),
    vendor_id: Yup.string().required('Vendor is required'),
    purchase_order_number: Yup.string().required(
      'Purchase orders are required'
    ),
    // invoice_ref_number: Yup.string().required('Invoice ref is required'),
    purchase_order_date: Yup.string().required('Date is required'),
    // .test("date-validation", "Date must not be less than the current date", currentDateValidation),
    mode_of_payment: Yup.string().required('Payment mode is required'),
    term_id: Yup.string().required('This is required'),
    expected_delivery_date: Yup.string().required('Date is required'),
    // .test("date-validation", "Date must not be less than the current date", currentDateValidation),
    discount: Yup.number()
      .min(0, 'Discount must be greater then 0 ')
      .test(
        'lessThanOrEqual',
        'Discount must be less than or equal to Sub Total',
        function (value) {
          const subTotalValue = this.parent?.sub_total;
          const discountType = this.parent?.discount_type;
          return (
            Math.abs(discountCalculate(discountType, value, subTotalValue)) <=
            parseInt(subTotalValue, 10)
          );
        }
      ),
    adjustment: Yup.string().min(0, 'Adjustment must be greater then 0 '),
    shipping_charges: Yup.string().min(
      0,
      'Shipping charges must be greater then 0 '
    ),
    purchase_order_items: Yup.array(
      Yup.object({
        item_name: Yup.string().required('Item name is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .min(1, 'Quantity must be greater than 0'),
        rate: Yup.number()
          .required('Rate is a required field')
          .min(1, 'Must be greater than 0'),
        tax: Yup.object().required('Tax is required')
      })
    )
  });

  const handleButtonClick = type => {
    // setIsSubmit(true);
    setBtnType(type);
    // setClicked(true);
  };
  const [initialValues, setInitialValues] = useState(initialValues_);

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
    // setSubmitting(false);
  }

  const deliverType = {
    ORAGANIZATION: 'organization',
    CUSTOMER: 'customer'
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      if (values.total === '0.00' || values.total === 'NaN') {
        addItemRef.current?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (edit && purchaseID) {
        try {
          returningType(btnType);
          const resp = await updatePurchaseOrdersApi({
            ...values,
            button_type: btnType,
            _method: 'PUT'
          });
          notyf.success('Purchase Orders Updated successfully');
          navigate('/purchase-orders');
        } catch (error) {
          if (error?.data?.errors) formik.setErrors(error?.data?.errors);
          else notyf.error('Something went wrong');
        } finally {
          runningFinally();
        }
      } else {
        try {
          returningType(btnType);
          const resp = await createPurchaseOrdersApi({
            ...values,
            button_type: btnType
          });
          notyf.success('Purchase Orders Created successfully');
          navigate('/purchase-orders');
        } catch (error) {
          if (error?.data?.errors) formik.setErrors(error?.data?.errors);
          else notyf.error('Something went wrong');
        } finally {
          runningFinally();
        }
      }
    }
  });

  const gettingVendorList = resp => {
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

      setSelectedEmails(resp?.vendor_contacts);
      setVendorList(resp);
    }
  };
  // useEffect(() => {
  //   if (formik.values?.vendor_id) {
  //     gettingVendorList();
  //   }
  // }, [formik.values?.vendor_id]);

  useGenerateNumber(
    'purchase_order',
    'purchase_order_number',
    formik,
    edit,
    id
  );

  const shipment = [
    { value: '1', text: 'Shippment 1' },
    { value: '2', text: 'Shippment 2' },
    { value: '3', text: 'Shippment 3' }
  ];

  const fetchSinglePurchaseOrders = async () => {
    try {
      setPageLoader(true);
      const resp = await purchaseOrdersSingleApi(purchaseID);
      const responseData = { ...resp };

      responseData?.purchase_order_items?.forEach(item => {
        item.item_name_object = {
          label: item.item_name,
          value: item.item_id,
          price: item?.rate || 0
        };
      });

      setInitialValues(responseData);

      formik.setValues(responseData);
      // formik.setFieldValue(
      //   "mode_of_payment",
      //   resp?.mode_of_payment.toLowerCase()
      // );
      formik.setFieldValue('purchase_order_files', resp?.purchase_order_file);
      formik.setFieldValue(
        'purchase_order_date',
        formatDateToYYYYMMDD(resp?.purchase_order_date)
      );
      formik.setFieldValue(
        'customer_delivered_id',
        resp?.customer_address?.customer_id
      );

      // formik.setFieldValue(
      //   "mode_of_payment",
      //   resp?.mode_of_payment.toLowerCase()
      // );
      formik.setFieldValue('purchase_order_files', resp?.purchase_order_file);
      formik.setFieldValue(
        'customer_delivered_id',
        resp?.customer_address?.customer_id
      );
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoader(false);
    }
  };
  useEffect(() => {
    if (purchaseID) {
      fetchSinglePurchaseOrders(purchaseID);
    }
  }, []);

  // selected vendor emails
  useEffect(() => {
    const selectedEmailss = selectedEmails
      ?.filter(item => item.is_selected === 1)
      .map(item => item.email);
    formik.setFieldValue(
      'email_to',
      (selectedEmailss?.length > 0 && selectedEmailss) || 'null'
    );
  }, [formik.values?.vendor_id, selectedEmails]);

  useEffect(() => {
    if (initialValues?.term_id) {
      const preSelectedTerms = paymentTerms.find(
        item => item.id === initialValues.term_id
      );
      setSelectedTerm(preSelectedTerms);
    }
  }, [initialValues?.term_id]);

  const fetchTerms = async () => {
    try {
      const response = await getPeymentTermsApi();
      const termsData = response?.data;
      if (termsData) {
        // Process the response and set state variables
        const termsOptions = termsData.map(term => ({
          text: term?.term_name,
          value: term.id,
          number_of_days: term.number_of_days,
          id: term.id,
          due_date: term.due_date
        }));

        // Set the state variables
        setPaymentTerms([...termsOptions]);
      }
    } catch (error) {
      console.error('Error fetching payment terms:', error);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const deleteFileFromApi = async fileId => {
    try {
      const resp = await deletePurchaseOrdersFielsApi(fileId);
      notyf.success('Files Deleted Successfully');
      formik.setFieldValue(
        'purchase_order_files',
        formik.values?.purchase_order_files.filter(f => f.id !== fileId)
      );
    } catch (error) {}
  };
  const deletingFile = file => {
    if (file.id) {
      deleteFileFromApi(file?.id);
    } else {
      formik.setFieldValue(
        'purchase_order_files',
        formik.values?.purchase_order_files.filter(f => f !== file)
      );
      notyf.success('Files Deleted Successfully');
    }
  };

  useEffect(() => {
    formik.setFieldValue('expected_delivery_date', selectedTerm?.due_date);
  }, [selectedTerm?.id]);

  useEffect(() => {
    if (formik.dirty === true && Object.keys(formik?.errors).length !== 0) {
      const el = document.querySelector('.Mui-error, [data-error]');
      (el?.parentElement ?? el)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [formik.isSubmitting]);

  // when term changes
  useEffect(() => {
    if (formik.values?.term_id) {
      const selectedTerm = paymentTerms.find(
        term => term.id === formik.values.term_id
      );
      if (selectedTerm) {
        formik.setFieldValue('expected_delivery_date', selectedTerm.due_date);
      }
    }
  }, [formik.values.term_id, paymentTerms]);

  const updatingContacts = newContacts => {
    setSelectedEmails(prev => [...prev, ...newContacts]);
  };
  return (
    <>
      <OverlayLoader open={pageLoader} />
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <div style={{ position: 'relative' }}>
            <Paper sx={{ padding: '1.5rem 2rem 10rem 2rem' }}>
              <CustomerSelection
                id='vendor_id'
                formik={formik}
                type='vendor'
                preSelected={formik.values?.vendor_id}
                onSelect={resp => gettingVendorList(resp)}
                deliveredTo={'true'}
                customerPreSelect={formik.values?.customer_delivered_id}
                setIsLoadingOverlay={setIsLoadingOverlay}
              />

              <GridRow>
                <Grid item xs={2} sx={{ ...labelStyle }}>
                  <InputLabel>
                    Invoice Reference<span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                </Grid>
                <Grid item xs={4}>
                  <FormField
                    name='invoice_ref_number'
                    size='small'
                    fullWidth
                    label={'Invoice Reference'}
                    value={formik.values?.invoice_ref_number}
                    handleChange={formik.handleChange}
                    isTouched={formik.touched?.invoice_ref_number}
                    error={
                      formik.touched?.invoice_ref_number &&
                      formik?.errors?.invoice_ref_number &&
                      formik?.errors?.invoice_ref_number
                    }
                  />
                </Grid>
              </GridRow>

              <GridRow>
                <Grid item xs={2} sx={{ ...labelStyle }}>
                  <InputLabel>
                    Purchase Order#<span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                </Grid>
                <Grid item sm={4}>
                  <FormField
                    name='purchase_order_number'
                    size='small'
                    fullWidth
                    value={formik.values?.purchase_order_number}
                    handleChange={formik.handleChange}
                    isTouched={formik.touched?.purchase_order_number}
                    disabled={true}
                    error={
                      formik.touched?.purchase_order_number &&
                      formik?.errors?.purchase_order_number &&
                      formik?.errors?.purchase_order_number
                    }
                  />
                </Grid>
              </GridRow>
              <GridRow>
                <Grid item xs={2} display='flex' alignItems='center'>
                  <InputLabel>
                    Purchase Orders Date<span style={{ color: 'red' }}>*</span>
                  </InputLabel>{' '}
                </Grid>
                <Grid item xs={4}>
                  <FormField
                    name='purchase_order_date'
                    value={formik.values?.purchase_order_date}
                    onChange={formik.handleChange}
                    isTouched={formik.touched?.purchase_order_date}
                    size='small'
                    fullWidth
                    type='date'
                    InputProps={{
                      min: formatDateToYYYYMMDD(new Date())
                    }}
                    error={
                      formik.touched?.purchase_order_date &&
                      formik?.errors?.purchase_order_date &&
                      formik?.errors?.purchase_order_date
                    }
                  />
                </Grid>
              </GridRow>
              <GridRow>
                <Grid item xs={2}>
                  <InputLabel sx={{ ...labelStyle }}>
                    Mode of Payments<span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                </Grid>
                <Grid item xs={4}>
                  <FormField
                    id='mode_of_payment'
                    value={formik.values?.mode_of_payment}
                    handleChange={formik.handleChange}
                    error={formik?.errors?.mode_of_payment}
                    label={'Select mode of payments'}
                    isTouched={formik.touched?.mode_of_payment}
                    type={'select'}
                    options={PAYMENT_METHODS}
                    fullWidth
                  />
                </Grid>
              </GridRow>
              <GridRow>
                <Grid item xs={2}>
                  <InputLabel sx={{ ...labelStyle }}>
                    Payments Terms<span style={{ color: 'red' }}>*</span>
                  </InputLabel>
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
                <Grid item xs={2}>
                  <InputLabel sx={{ ...labelStyle }}>
                    Expected Delivery Date
                  </InputLabel>
                </Grid>
                <Grid item xs={4}>
                  <FormField
                    name='expected_delivery_date'
                    value={formik.values?.expected_delivery_date}
                    onChange={formik.handleChange}
                    isTouched={formik.touched?.expected_delivery_date}
                    size='small'
                    fullWidth
                    type='date'
                    InputProps={{
                      min: formatDateToYYYYMMDD(new Date())
                    }}
                    error={
                      formik.touched?.expected_delivery_date &&
                      formik?.errors?.expected_delivery_date &&
                      formik?.errors?.expected_delivery_date
                    }
                  />
                </Grid>
              </GridRow>
              {/* <GridRow>
              <Grid item xs={2}>
                <InputLabel>Shipment Preferences</InputLabel>
              </Grid>
              <Grid item xs={4}>
                <FormField
                  id='shipment_preference'
                  value={formik.values?.shipment_preference}
                  handleChange={formik.handleChange}
                  error={formik?.errors?.shipment_preference}
                  label={"Select Shipment Preference "}
                  isTouched={formik.touched?.shipment_preference}
                  type={"select"}
                  options={shipment}
                  fullWidth
                />
              </Grid>
            </GridRow> */}
              <Grid item container spacing={2} my={7}>
                <Grid item sm={12}>
                  <Box ref={addItemRef}>
                    <AddItem
                      itemName={'purchase_order_items'}
                      // loading={loading}
                      formiks={{
                        values: {
                          total: formik.values?.total,
                          sub_total: formik.values?.sub_total,
                          items: formik.values?.purchase_order_items,
                          adjustment: formik.values?.adjustment,
                          discount: formik.values?.discount,
                          shipping_charges: formik.values?.shipping_charges,
                          discount_type: formik.values?.discount_type,
                          items_rates_are: 'tax_exclusive'
                        },
                        errors: {
                          total: formik?.errors?.total,
                          sub_total: formik?.errors?.sub_total,
                          items: formik?.errors?.purchase_order_items,
                          adjustment: formik?.errors?.adjustment,
                          discount: formik?.errors?.discount,
                          shipping_charges: formik?.errors?.shipping_charges,
                          discount_type: formik?.errors?.discount_type,
                          items_rates_are: formik?.errors?.items_rates_are
                        },
                        touched: {
                          items: formik.touched?.purchase_order_items,
                          adjustment: formik.touched?.adjustment,
                          discount: formik.touched?.discount,
                          shipping_charges: formik.touched?.shipping_charges,
                          discount_type: formik.touched?.discount_type
                        },
                        handleChange: formik.handleChange,
                        setFieldValue: formik.setFieldValue
                      }}
                      customerTax={null}
                      isEdit={edit}
                      // taxIdCustomer={taxIdCustomer}
                      taxId={1}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid item container>
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
                  {/* <Grid item xs={12}>
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
									</Grid> */}
                </Grid>

                <Grid item xs={6} display='flex' justifyContent='center' mt={1}>
                  <Box
                    sx={{
                      width: '60%'
                    }}>
                    <FilesModule
                      files={formik.values?.purchase_order_files || []}
                      onDelete={deletingFile}
                      setFiles={files =>
                        formik.setFieldValue('purchase_order_files', files)
                      }
                    />
                  </Box>
                </Grid>
              </Grid>

              <CustomerContactsList
                setSelectedEmails={setSelectedEmails}
                gettingCustomerList={gettingVendorList}
                selectedEmails={selectedEmails}
                customerDetails={vendorList}
                onSave={updatingContacts}
              />
            </Paper>

            <Box
              style={{
                position: 'sticky',
                bottom: 2,
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
                  to='/purchase-orders'>
                  Cancel
                </MUIButton>
              </Paper>
            </Box>
          </div>
        </form>
      </FormikProvider>
      <OverlayLoader open={isLoadingOverlay} />
    </>
  );
};

export default PurchaseOrdersForm;
