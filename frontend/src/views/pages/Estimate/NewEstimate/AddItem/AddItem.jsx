import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  styled,
  CircularProgress,
  Button,
  InputAdornment
} from '@mui/material';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ButtonComponent from '../../../../Components/Button/MUIButton';
import AddIcon from '@mui/icons-material/Add';
import CreatableSelect from 'react-select/creatable';
import FormField from '../../../../Components/InputField/FormField';
import Select from 'react-select';
import { getAllItems } from '../../../../../core/api/items';
import { getTaxesApi } from '../../../../../core/api/customer';
import InputLabel from '../../../../Components/InputLabel/InputLabel';
import HoverPopover from '../../../../Components/HoverPopover/ErrorOutlinePopover';
import NewTaxModal from './NewTaxModal';
import useResponsiveStyles from '../../../../../core/hooks/useMedaiQuery';
import { toFixed } from '../../../../../core/utils/helpers';
const createOption = label => ({
  label,
  value: label.toLowerCase().replace(/\W/g, '')
});

const AddRowTitle = styled(Typography)(() => ({
  fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
  margin: '1rem 1rem 1rem 1rem',
  fontWeight: '500'
}));

export const FieldTitle = styled(Typography)(({ fontWeight }) => ({
  fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
  margin: '1rem 0 .4rem 0',
  fontFamily: 'Roboto',
  fontWeight: fontWeight || 400
}));
const areEqual = (prevProps, nextProps) => {
  // Compare relevant props to decide whether to re-render
  return (
    prevProps.taxableCustomer === nextProps.taxableCustomer &&
    prevProps.taxIdCustomer === nextProps.taxIdCustomer &&
    prevProps.clicked === nextProps.clicked &&
    prevProps.isEdit === nextProps.isEdit &&
    prevProps.formik.submitCount === nextProps.formik.submitCount &&
    prevProps.formik.isValid === nextProps.formik.isValid &&
    prevProps.loading === nextProps.loading
  );
};
const AddItem = React.memo(
  ({
    initialValues,
    formik,
    isEdit,
    clicked,
    setClicked,
    taxIdCustomer,
    taxableCustomer,
    loading
  }) => {
    const [itemOptions, setItemOptions] = useState([]);
    const [isNewTaxModalOpen, setIsNewTaxModalOpen] = useState(false);
    const [isNewTaxAdded, setIsNewTaxAdded] = useState(false);

    const determineInitialValues = () => {
      if (initialValues?.estimate_items) return initialValues.estimate_items;
      if (initialValues?.sale_order_items)
        return initialValues.sale_order_items;
      return []; // default to an empty array if none of the above properties exist
    };
    const [values, setValues] = useState(determineInitialValues());
    const [isItemLoading, setIsItemLoading] = useState(values.map(() => false));
    // console.log("loadding values",values,"isItemLoading",isItemLoading)

    const [texValues, setTexValues] = useState([]);
    const [shippingCharges, setShippingCharges] = useState(
      initialValues.shipping_charges
    );
    const [numberValue, setNumberValue] = useState(0);
    const [selectedOption, setSelectedOption] = useState(
      initialValues.discount_type
    );
    const [fixedDiscountAmount, setFixedDiscountAmount] = useState(0);
    const [numberChange, setNumberChange] = useState(0);
    const [adjustmentValue, setAdjustmentValue] = useState(
      initialValues.adjustment
    );
    const [itemNameError, setItemNameError] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [rateError, setRateError] = useState('');

    const [selectedTaxValues, setSelectedTaxValues] = useState(
      Array(values?.length).fill({ label: 'Non-Taxable', value: 0 })
    );
    const [taxInclusiveOption, setTaxInclusiveOption] = useState(
      initialValues.items_rates_are
    );

    const DISCOUNT_TYPE = [
      {
        value: 'Percentage',
        text: '%'
      },
      {
        value: 'Dollar',
        text: '$'
      }
    ];

    const taxInclusiveOption_ = [
      {
        value: 'tax_inclusive',
        text: 'Tax Inclusive'
      },
      {
        value: 'tax_exclusive',
        text: 'Tax Exclusive'
      }
    ];

    useEffect(() => {
      //  console.log("taxableCustomer", taxableCustomer);
      if (taxableCustomer === 'taxable') {
        // console.log("taxableCustomer",taxableCustomer)
        setTaxInclusiveOption('tax_exclusive');
      } else {
        //  console.log("taxableCustomer",taxableCustomer).
        setTaxInclusiveOption('tax_inclusive');
      }
    }, [taxableCustomer]);

    useEffect(() => {
      console.log('values', values, 'taxIdCustomer', taxIdCustomer);

      if (isEdit) {
        const updatedItems = determineInitialValues().map((item, index) => {
          const quantity = parseFloat(item.quantity);
          const rate = parseFloat(item.rate);
          const amount = quantity * rate;
          if (isEdit) {
            const obj = {
              value: item?.tax?.id,
              label: item?.tax?.name,
              price: item?.tax?.rate
            };
            handleTaxChange(obj, index);
          }
          return { ...item, amount };
        });
        setValues(updatedItems);
      } else {
        const updatedItems = determineInitialValues().map(item => {
          const quantity = parseFloat(item.quantity);
          const rate = parseFloat(item.rate);
          const amount = quantity * rate;
          var tax_id;
          if (taxIdCustomer === null) {
            tax_id = 1;

            //      setIsTaxExempt(true); //setIsTaxExempt will use if tax field will required to disable
          } else {
            tax_id = taxIdCustomer;
            //     setIsTaxExempt(false); //setIsTaxExempt will use if tax field will required to disable
          }
          return { ...item, amount, tax_id };
        });
        if (
          values.length === 1 &&
          values[0]?.item_name === 'Type or click to select an item'
        ) {
          setValues(updatedItems);
        }
      }
    }, [taxIdCustomer]);

    useEffect(() => {
      // Call the handleNumberChange function here
      handleNumberChange(initialValues.discount);
    }, [initialValues?.discount]);

    useEffect(() => {
      if (isEdit) {
        const updatedItems = determineInitialValues().map((item, index) => {
          const quantity = parseFloat(item.quantity);
          const rate = parseFloat(item.rate);
          const amount = quantity * rate;
          if (isEdit) {
            const obj = {
              value: item?.tax?.id,
              label: item?.tax?.name,
              price: item?.tax?.rate
            };
            handleTaxChange(obj, index);
          }
          return { ...item, amount };
        });
        setValues(updatedItems);
      } else {
        const updatedItems = determineInitialValues().map(item => {
          const quantity = parseFloat(item.quantity);
          const rate = parseFloat(item.rate);
          const amount = quantity * rate;
          const tax_id = taxIdCustomer;
          return { ...item, amount, tax_id };
        });
        setValues(updatedItems);
      }

      //  console.log("texValues ", texValues);
      setShippingCharges(initialValues?.shipping_charges);
      setNumberValue(initialValues?.discount);
      setAdjustmentValue(initialValues?.adjustment);
      if (initialValues?.discount_type === 'dollar') {
        setSelectedOption('Dollar');
        setFixedDiscountAmount(initialValues.discount);
      } else {
        setSelectedOption('Percentage');
      }
      console.log('Item Rates Are ', initialValues?.items_rates_are);
      setTaxInclusiveOption(initialValues?.items_rates_are);
      calculateSubtotal();
    }, [initialValues]);

    const handleNumberChange = event => {
      var newValue;
      if (typeof event === 'number' && !(newValue < 0)) {
        newValue = parseFloat(event);
      } else if (typeof event === 'object') {
        newValue = parseFloat(event?.target?.value);
      }
      if (Number.isNaN(newValue)) newValue = 0;
      if (!(newValue < 0)) {
        //  console.log("value discount_ in", newValue);
        setNumberValue(newValue);

        if (selectedOption === 'Percentage') {
          // Handle the case when the option is % (percentage discount)
          const enteredPercentage = newValue;
          setNumberChange(enteredPercentage);
        } else if (selectedOption === 'Dollar') {
          // Handle the case when the option is $ (fixed discount)
          setNumberChange(newValue);
          setFixedDiscountAmount(newValue);
        }
      }
    };

    const handleOptionChange = event => {
      setSelectedOption(event.target.value);
      if (event.target.value === 'Dollar') {
        // Handle the case when the option is $ (fixed discount)
        if (!isNaN(numberChange) && numberChange >= 0) {
          setFixedDiscountAmount(numberChange);
        }
      }
    };

    const handleItemRateOptionChange = event => {
      setTaxInclusiveOption(event.target.value);
    };

    const handleCreate = (inputValue, rowIndex) => {
      setIsItemLoading(prevIsLoading => {
        console.log(
          'loading',
          prevIsLoading,
          'inputValue',
          inputValue,
          'rowIndex',
          rowIndex
        );
        const newIsLoading = [...prevIsLoading];
        newIsLoading[rowIndex] = true;
        return newIsLoading;
      });

      setTimeout(() => {
        const newOption = createOption(inputValue);
        setIsItemLoading(prevIsLoading => {
          const newIsLoading = [...prevIsLoading];
          newIsLoading[rowIndex] = false;
          return newIsLoading;
        });

        const newITem = {
          value: '',
          label: newOption.label,
          price: 0
        };
        // Add the newly created option to itemOptions with value string
        setItemOptions(prev => [...prev, newITem]);
        // Select the newly created option
        setValues(prevValues => {
          const updatedValues = prevValues.map((value, valueIndex) => {
            if (valueIndex === rowIndex) {
              return {
                ...value,
                item_name: newOption.label,
                rate: newOption.price || 0,
                amount: (newOption.price || 0) * 1,
                item_id: ''
              };
            }
            return value;
          });
          return updatedValues;
        });
      }, 1000);
    };

    const handleDeleteRow = (rowId, index) => {
      setValues(prevValues => {
        const updatedValues = [...prevValues];
        updatedValues.splice(index, 1);
        return updatedValues;
      });

      setSearchResults(prevItems =>
        prevItems.filter(item => item.id !== rowId)
      );

      setSelectedTaxValues(prevValues => {
        const updatedTaxValues = [...prevValues];
        updatedTaxValues.splice(index, 1);
        return updatedTaxValues;
      });

      if (initialValues.estimate_items) {
        // const filterDelete= values
        const updatedItems = [...formik.values.estimate_items];
        updatedItems.splice(index, 1);
        formik.setFieldValue('estimate_items', updatedItems);
      } else if (initialValues.sale_order_items) {
        const updatedItems = [...formik.values.sale_order_items];
        updatedItems.splice(index, 1);
        formik.setFieldValue('sale_order_items', updatedItems);
      }
    };

    const handleAddRow = () => {
      const texid = taxIdCustomer === null ? 1 : taxIdCustomer;

      const newRow = {
        //  item_id: 0,
        item_name: 'Type or click to select an item',
        quantity: 1,
        rate: 0,
        amount: 0,
        tax_id: texid
      };
      setValues(prevValues => [...prevValues, newRow]);
    };

    const calculateSubtotal = () => {
      const subtotal = values?.reduce(
        (total, value) => total + value?.amount,
        0
      );
      return subtotal;
    };

    const labelToTaxAmountMap = selectedTaxValues.reduce(
      (map, taxValue, index) => {
        // taxvalue.lable!== "non taxable"
        if (taxValue?.value !== 1) {
          if (!map[taxValue?.label]) {
            map[taxValue?.label] = 0;
          }
          map[taxValue?.label] +=
            (values[index]?.amount * taxValue?.price) / 100;
        }
        // console.log("val>? map", map, "taxValue", taxValue, "index", index);
        return map;
      },
      {}
    );

    const calculateTotal = () => {
      const subtotal = calculateSubtotal();
      let total = subtotal;

      if (taxInclusiveOption === 'tax_exclusive') {
        for (const label in labelToTaxAmountMap) {
          total += labelToTaxAmountMap[label];
        }
      }

      let discount = 0;
      if (selectedOption === 'Percentage') {
        if (typeof numberChange !== 'undefined') {
          discount = (subtotal * numberChange) / 100;
        }
      } else if (selectedOption === 'Dollar') {
        discount = fixedDiscountAmount;
      }

      // Add Shipping Charges if greater than zero
      if (isGreaterThanZero(shippingCharges)) {
        total += parseFloat(shippingCharges);
      }

      // Add Adjustment if greater than zero
      if (isGreaterThanZero(adjustmentValue)) {
        total += parseFloat(adjustmentValue);
      }

      console.log('total before discount:', total);

      total -= discount;

      // Ensure total is not negative
      total = Math.max(total, 0);

      console.log('total after discount:', total);

      return total;
    };

    useEffect(() => {
      const subTotalValue = toFixed(calculateSubtotal());
    //  const subTotalValue = calculateSubtotal()?.toFixed(2);
      formik.setFieldValue(`sub_total`, subTotalValue);
    }, [values]);

    useEffect(() => {
      if (clicked === true) {
        // console.log(
        //   "filtered values",
        //   values,
        // );
        console.log('clicked__>', values.length);

        const filteredItems = values.reduce((result, item) => {
          if (
            !(
              item.item_name === 'Type or click to select an item' ||
              item.amount === 0
            )
          ) {
            result.push(item);
          } else if (
            !result.some(
              i =>
                i.item_name === 'Type or click to select an item' ||
                i.amount === 0
            )
          ) {
            result.push(item);
          }
          // setSelectedTaxValues to to remove NaN value and undefind in subtotal div
          setSelectedTaxValues(prevValues => {
            const updatedTaxValues = [...prevValues];
            updatedTaxValues.splice(item, 1);
            return updatedTaxValues;
          });

          return result;
        }, []);

        console.log('clicked__filteredItems', filteredItems);

        if (filteredItems[0]?.amount == 0) {
          setRateError('Total Amount must be greater than zero');
        } else {
          setRateError('');
        }

        if (
          filteredItems.length === 1 &&
          values[0]?.item_name == 'Type or click to select an item'
        ) {
          setItemNameError('Enter the valid item name.');
        } else {
          setItemNameError('');
        }

        setValues(filteredItems);
        setClicked(false);
      }
    }, [clicked]);

    const handleAdjustmentChange = event => {
      const newAdjustmentValue = parseFloat(event.target.value);
      if (!(newAdjustmentValue < 0)) {
        setAdjustmentValue(newAdjustmentValue);
      }
    };

    // Validation function to check if a value is greater than zero
    const isGreaterThanZero = value => {
      return value >= 0;
    };

    const handleShippingChargesChange = event => {
      const newShippingCharges = parseFloat(event.target.value);
      if (!(newShippingCharges < 0)) {
        setShippingCharges(newShippingCharges);
      }
    };

    const handleTaxChange = (newValue, rowIndex) => {
      // console.log("handleTaxChange", newValue, rowIndex);
      var updatedValues = [...values];

      // Ensure that there are enough objects in the array up to the specified rowIndex
      while (updatedValues.length <= rowIndex) {
        updatedValues.push({
          item_name: 'Type or click to select an item',
          quantity: 1,
          rate: 0,
          //    tax_amount: 0,
          tax_id: taxIdCustomer,
          total: 0
        });
      }

      updatedValues[rowIndex].tax_id = newValue?.value;
      setValues(updatedValues);

      setSelectedTaxValues(prevValues => {
        const updatedValues = [...prevValues];
        updatedValues[rowIndex] = newValue;
        //   console.log("Tax changed to updatedValues:", updatedValues);
        return updatedValues;
      });
    };

    const labelValueMap = selectedTaxValues.reduce((map, taxValue) => {
      //taxValue?.label !== "Non Taxable"
      if (taxValue?.value !== 1) {
        if (!map[taxValue?.label]) {
          map[taxValue?.label] = taxValue?.value;
        }
      }
      return map;
    }, {});

    const labelToAmountMap = selectedTaxValues.reduce(
      (map, taxValue, index) => {
        if (!map[taxValue?.label]) {
          map[taxValue?.label] = {
            indices: [],
            accumulatedAmount: 0
          };
        }
        map[taxValue?.label].indices.push(index);
        return map;
      },
      {}
    );

    for (const label in labelToAmountMap) {
      const indices = labelToAmountMap[label].indices;

      indices.forEach(selectedIndex => {
        const correspondingValue = values[selectedIndex];
        if (correspondingValue) {
          labelToAmountMap[label].accumulatedAmount +=
            correspondingValue?.amount;
        }
      });
    }

    const { submitCount, isValid, values: formikValues } = formik;

    useEffect(() => {
      if (submitCount > 0 && isValid) {
        const valuesss = Object.entries(labelValueMap).map(([label, value]) => {
          
          const taxInclusiveAmount = toFixed(labelToTaxAmountMap[label]);

          if (
            taxInclusiveOption === 'tax_inclusive' &&
            taxInclusiveAmount !== undefined
          ) {
            return parseFloat(taxInclusiveAmount); // Parse to float to ensure numeric addition
          } else {
            const accumulatedAmount =
              labelToAmountMap[label]?.accumulatedAmount || 0;
            const result = toFixed((accumulatedAmount * value) / 100);
            return parseFloat(result); // Parse to float to ensure numeric addition
          }
        });

        // Calculate the sum of values in the array
        const sum = valuesss.reduce(
          (acc, currentValue) => acc + currentValue,
          0
        );

        const updateFormFields = () => {
          // items_rates_are
          formik.setFieldValue(`items_rates_are`, taxInclusiveOption);

          // Calculate SubTotal
          const subTotalValue = toFixed(calculateSubtotal());
          // console.log("values . subTotalValue ", subTotalValue);
          formik.setFieldValue(`sub_total`, subTotalValue);

          //////////////////// Discount conditional
          formik.setFieldValue(`discount`, numberValue);
          if (selectedOption === 'Percentage') {
            // Percentage or Fixed Discount
            formik.setFieldValue(`discount_type`, 'Percentage');
          } else if (selectedOption === 'Dollar') {
            // Fixed Discount
            formik.setFieldValue(`discount_type`, 'dollar');
          }

          // Calculate Shipping Charges
          const shippingChargesResult = toFixed(shippingCharges);
          formik.setFieldValue(`shipping_charges`, shippingChargesResult);
          const discount =
            selectedOption === 'Percentage'
              ? isNaN((calculateSubtotal() * numberChange) / 100)
                ? initialValues?.discount_amount
                : `${toFixed((calculateSubtotal() * numberChange) / 100)}`
              : isNaN(fixedDiscountAmount)
              ? initialValues?.discount_amount
              : `${toFixed(fixedDiscountAmount)}`;
          formik.setFieldValue(`discount_amount`, discount);

          // Calculate Adjustment
          const adjustmentResult = toFixed(adjustmentValue);
          formik.setFieldValue(`adjustment`, adjustmentResult);

          // Calculate Total
          const totalValue = toFixed(calculateTotal());
          formik.setFieldValue(`total`, totalValue);
          //   console.log("filteredValues values", values);

          //filter is use to delete all rows in values where item name == "Type or click to select an item" or item amout === 0
          // Item Table
          // console.log("values . before filtered", values);
          const itemCounter = {};

          const filteredItems = values.filter(item => {
            const condition1 =
              item.item_name === 'Type or click to select an item';
            const condition2 = item.amount === 0;

            if (condition1 || condition2) {
              // Increment the counter for this condition
              itemCounter[condition1 ? 'item_name' : 'amount'] =
                (itemCounter[condition1 ? 'item_name' : 'amount'] || 0) + 1;

              // If both conditions are true, only keep the last one
              if (itemCounter.item_name === 2 && itemCounter.amount === 2) {
                itemCounter.item_name = 1;
                itemCounter.amount = 1;
                return false;
              }

              // If one condition is true, remove the item
              return false;
            }

            return true;
          });
          // console.log("values . filtered", filteredItems);

          if (initialValues.estimate_items) {
            let totalTaxAmountAstimate = 0;
            filteredItems.forEach((item, index) => {
              //     console.log("item__", item);
              const newItemName = item?.item_name?.label || item.item_name;
              const tax_id = selectedTaxValues[index]?.value || taxIdCustomer;
              let tx;
              // Use a closure to capture the current item and index values
              const updateFieldValues = () => {
                // console.log("values . estimate_items", index, "item ", item);
                // console.log("values . item.item_id", item.item_id, "item ", item);

                if (item.item_id === null) {
                  const itemid = '';
                  formik.setFieldValue(
                    `estimate_items.${index}.item_id`,
                    itemid
                  );
                } else {
                  formik.setFieldValue(
                    `estimate_items.${index}.item_id`,
                    item.item_id
                  );
                }

                formik.setFieldValue(
                  `estimate_items.${index}.item_name`,
                  newItemName
                );
                if (item.quantity !== undefined && item.quantity !== null) {
                  formik.setFieldValue(
                    `estimate_items.${index}.quantity`,
                    item.quantity
                  );
                }

                if (item.rate !== undefined && item.rate !== null) {
                  formik.setFieldValue(
                    `estimate_items.${index}.rate`,
                    item.rate
                  );
                }
                if (item.amount !== undefined && item.amount !== null) {
                  formik.setFieldValue(
                    `estimate_items.${index}.total`,
                    item?.amount
                  );
                }

                if (
                  typeof tax_id !== 'number' ||
                  isNaN(tax_id) ||
                  tax_id === undefined ||
                  tax_id === null
                ) {
                  var txid = 1;
                  tx = txid;
                  formik.setFieldValue(`estimate_items.${index}.tax_id`, txid);
                } else {
                  tx = tax_id;
                  formik.setFieldValue(
                    `estimate_items.${index}.tax_id`,
                    tax_id
                  );
                }
                const matchingTax = texValues.find(tax => tax.value === tx);
                if (matchingTax) {
                  const taxRate = matchingTax.price;
                  const quantity = parseFloat(item.quantity);
                  const rate = parseFloat(item.rate);
                  const taxAmount = (quantity * rate * taxRate) / 100;
                  formik.setFieldValue(
                    `estimate_items.${index}.tax_amount`,
                    taxAmount
                  );
                  totalTaxAmountAstimate += taxAmount;
                }
              };

              updateFieldValues();
            });
            formik.setFieldValue(`tax_amount`, totalTaxAmountAstimate);
          } else if (initialValues.sale_order_items) {
            let totalTaxAmountSale = 0;
            filteredItems.forEach((item, index) => {
              // console.log("item__sale_order_items", item);
              const newItemName = item?.item_name?.label || item.item_name;
              const tax_id = selectedTaxValues[index]?.value || taxIdCustomer;
              let tx_;

              // Use a closure to capture the current item and index values
              const updateFieldValues = () => {
                if (item.item_id === null) {
                  const itemid = '';
                  formik.setFieldValue(
                    `sale_order_items.${index}.item_id`,
                    itemid
                  );
                } else {
                  formik.setFieldValue(
                    `sale_order_items.${index}.item_id`,
                    item.item_id
                  );
                }

                formik.setFieldValue(
                  `sale_order_items.${index}.item_name`,
                  newItemName
                );
                if (item.quantity !== undefined && item.quantity !== null) {
                  formik.setFieldValue(
                    `sale_order_items.${index}.quantity`,
                    item.quantity
                  );
                }

                if (item.rate !== undefined && item.rate !== null) {
                  formik.setFieldValue(
                    `sale_order_items.${index}.rate`,
                    item.rate
                  );
                }
                if (item.amount !== undefined && item.amount !== null) {
                  formik.setFieldValue(
                    `sale_order_items.${index}.total`,
                    item?.amount
                  );
                }
                if (
                  typeof tax_id !== 'number' ||
                  isNaN(tax_id) ||
                  tax_id === undefined ||
                  tax_id === null
                ) {
                  var txid = 1;
                  tx_ = txid;
                  formik.setFieldValue(
                    `sale_order_items.${index}.tax_id`,
                    txid
                  );
                } else {
                  tx_ = tax_id;
                  formik.setFieldValue(
                    `sale_order_items.${index}.tax_id`,
                    tax_id
                  );
                }
                const matchingTax = texValues.find(tax => tax.value === tx_);
                console.log('matchingTax', matchingTax);
                if (matchingTax) {
                  const taxRate = matchingTax.price;
                  const quantity = parseFloat(item.quantity);
                  const rate = parseFloat(item.rate);
                  const taxAmount = (quantity * rate * taxRate) / 100;
                  formik.setFieldValue(
                    `sale_order_items.${index}.tax_amount`,
                    taxAmount
                  );
                  totalTaxAmountSale += taxAmount;
                }
              };
              updateFieldValues();
            });
            formik.setFieldValue(`tax_amount`, totalTaxAmountSale);
          }
        };

        updateFormFields();
      }
    }, [submitCount, isValid, formikValues]);

    useEffect(() => {
      const respTax = getTaxesApi();
      respTax
        .then(data => {
          const repsTax = data.data;
          const updatedOptions_ = repsTax.map(({ id, name, rate }) => ({
            value: id,
            label: name,
            price: rate
          }));
          setTexValues(updatedOptions_);
        })
        .catch(error => {
          console.error(error.message);
        });
    }, [isNewTaxAdded]);

    useEffect(() => {
      const respTax = getTaxesApi();
      respTax
        .then(data => {
          const repsTax = data.data;
          const updatedOptions_ = repsTax.map(({ id, name, rate }) => ({
            value: id,
            label: name,
            price: rate
          }));
          setTexValues(updatedOptions_);
        })
        .catch(error => {
          console.error(error.message);
        });

      const resp = getAllItems();
      resp
        .then(data => {
          const reps = data.data.data;
          const updatedOptions = reps.map(({ id, title, selling_price }) => ({
            value: id,
            label: title,
            price: selling_price
          }));
          setItemOptions(updatedOptions);
        })
        .catch(error => {
          console.error(error.message);
        });
    }, []);
    // Initialize a render counter using useRef
    // const renderCounter = useRef(0);
    // // Increment the render counter on each render
    // renderCounter.current++;

    // Create an onChange function to handle changes to the input value
    const handleSearchInputChange = event => {
      const searchQuery = event.target.value;
      setSearchText(searchQuery);

      if (!searchQuery) {
        // Clear search results if the search query is empty
        setSearchResults([]);
        return;
      }

      // Filter items based on the searchQuery
      const filteredItems = values.filter(item =>
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredItems);
    };
    const itemsToMap = searchResults.length > 0 ? searchResults : values;

    return (
      <>
        <Grid item container>
          {/* Items Rates Are */}
          <Grid
            item
            xs={12}
            sx={{ mb: 2 }}
            display='flex'
            justifyContent='flex-start'>
            {/* <AddRowTitle>Render Count: {renderCounter.current}</AddRowTitle> */}
            <Grid item xs={2} display='flex' alignItems='center'>
              <InputLabel>Item Rates Are</InputLabel>
            </Grid>
            <Grid item xs={4}>
              <FormField
                type={'select'}
                value={taxInclusiveOption}
                onChange={handleItemRateOptionChange}
                options={taxInclusiveOption_}
                fullWidth
                fontSize='16px'
              />
            </Grid>
          </Grid>
          <Grid item xs={12} mt={1} mb={3}>
            <Divider />
          </Grid>
          <Grid item container mb={2} display='flex' justifyContent='flex-end'>
            <Grid item xs={4}>
              <FormField
                InputProps={{
                  readOnly: false,
                  value: searchText,
                  endAdornment: (
                    <InputAdornment position='end'>
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                onChange={handleSearchInputChange}
                placeholder='Search Item'
              />
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <AddRowTitle>Item Details</AddRowTitle>
          </Grid>

          <Grid item xs={2.25}>
            <AddRowTitle>Quantity</AddRowTitle>
          </Grid>

          <Grid item xs={2.25}>
            <AddRowTitle>Rate</AddRowTitle>
          </Grid>

          <Grid item xs={3}>
            <AddRowTitle>Tax</AddRowTitle>
          </Grid>

          <Grid item xs={1} display='flex' justifyContent='flex-start'>
            <AddRowTitle>Amount</AddRowTitle>
          </Grid>

          <Grid item xs={0.5} display='flex' justifyContent='center'>
            <AddRowTitle sx={{ textAlign: 'center' }}>Actions</AddRowTitle>
          </Grid>

          <Grid item xs={12} mt={0} mb={3}>
            <Divider />
          </Grid>
          {/* ///////////  Table ///////////*/}

          <InputLabel variant='caption' color='error' className='Mui-error'>
            {rateError}
          </InputLabel>

          {loading ? (
            <Grid
              item
              xs={12}
              sx={{ mb: 2 }}
              display='flex'
              justifyContent='center'>
              <CircularProgress />
            </Grid>
          ) : (
            itemsToMap.map((row, index) => (
              <Grid container columnSpacing={1} key={index}>
                {/* Item Details */}
                <Grid item xs={3}>
                  <CreatableSelect
                    key={index}
                    defaultValue={null}
                    isDisabled={isItemLoading[index]}
                    isLoading={isItemLoading[index]}
                    onChange={newValue => {
                      const val = texValues.find(
                        item => item.value === row?.tax_id
                      );
                      handleTaxChange(val, index);
                      const selectedOption = itemOptions.find(
                        option => option.value === newValue.value
                      );
                      setValues(prevValues => {
                        const updatedValues = prevValues.map(
                          (value, valueIndex) => {
                            if (valueIndex === index) {
                              const newRate = newValue?.price || 0;
                              return {
                                ...value,
                                item_name: newValue.label,
                                //  quantity: 1,
                                rate: newRate,
                                amount: newRate * 1,
                                item_id: selectedOption.value
                              };
                            }
                            return value;
                          }
                        );
                        return updatedValues;
                      });
                    }}
                    onCreateOption={inputValue => {
                      const val = texValues.find(
                        item => item.value === row?.tax_id
                      );
                      // console.log("val>?", val, index);
                      handleTaxChange(val, index);
                      handleCreate(inputValue, index);
                    }}
                    options={itemOptions}
                    value={{
                      label: row?.item_name
                      //         value: row?.item_id,
                    }}
                    // Apply font family through style attribute
                    styles={{
                      control: provided => ({
                        ...provided,
                        fontFamily: 'Roboto',
                        fontSize: '16px'
                      }),
                      option: baseStyles => ({
                        ...baseStyles,
                        fontFamily: 'Roboto',
                        fontSize: '16px'
                      })
                    }}
                  />
                  {index === 0 && (
                    <InputLabel
                      variant='caption'
                      color='error'
                      className='Mui-error'>
                      {itemNameError}
                    </InputLabel>
                  )}
                </Grid>

                {/* Quantity */}
                <Grid item xs={2.25}>
                  <FormField
                    key={index}
                    fullWidth
                    type='number'
                    value={values[index]?.quantity}
                    onBlur={e => {
                      const event = e.target.value;
                      if (event == '') {
                        const newQuantity = 1;
                        setValues(prevValues => {
                          const updatedValues = [...prevValues];
                          updatedValues[index].quantity = newQuantity;
                          updatedValues[index].amount =
                            newQuantity * updatedValues[index].rate;
                          return updatedValues;
                        });
                      }
                    }}
                    onChange={event => {
                      const newQuantity = parseInt(event.target.value);
                      if (!(newQuantity < 0)) {
                        setValues(prevValues => {
                          const updatedValues = [...prevValues];
                          updatedValues[index].quantity = newQuantity;
                          updatedValues[index].amount =
                            newQuantity * updatedValues[index].rate;
                          return updatedValues;
                        });
                      }
                    }}
                  />
                </Grid>

                {/* Rate */}
                <Grid item xs={2.25}>
                  <FormField
                    key={index}
                    type='number'
                    fullWidth
                    value={values[index]?.rate}
                    onBlur={e => {
                      const event = e.target.value;
                      if (event == '') {
                        const newRate = 0;
                        setValues(prevValues => {
                          const updatedValues = [...prevValues];
                          updatedValues[index].rate = newRate;
                          updatedValues[index].amount =
                            newRate * updatedValues[index].quantity;
                          return updatedValues;
                        });
                      }
                    }}
                    onChange={event => {
                      const newRate = parseFloat(event.target.value);
                      if (!(newRate < 0)) {
                        setValues(prevValues => {
                          const updatedValues = [...prevValues];
                          updatedValues[index].rate = newRate;
                          updatedValues[index].amount =
                            newRate * updatedValues[index].quantity;
                          return updatedValues;
                        });
                      }
                    }}
                  />
                </Grid>

                {/* Tax */}
                <Grid item xs={3}>
                  <Select
                    key={index}
                    //  onChange={(newValue) => handleTaxChange(newValue, index)}
                    onChange={newValue => {
                      // Check if the newValue is not the "button" option
                      // console.log("newvalue___", newValue);
                      if (newValue.value !== 'Add Modal Button') {
                        handleTaxChange(newValue, index);
                      }
                    }}
                    isSearchable
                    name='tax'
                    options={[
                      // ...texValues ?? [].map(item => ({
                      // 	label: item?.label,
                      // 	value: item?.value,
                      // 	price: item?.price,
                      //   })),
                      ...texValues.map(item => ({
                        label: item?.label ?? '',
                        value: item?.value ?? '',
                        price: item?.price ?? ''
                      })),
                      {
                        label: (
                          <>
                            <Divider style={{ marginBottom: '5px' }} />
                            <Button
                              onClick={() => setIsNewTaxModalOpen(true)}
                              size='small'
                              startIcon={<AddIcon />}>
                              New Tax
                            </Button>
                          </>
                        ),
                        isDisabled: true,
                        value: 'Add Modal Button'
                      }
                    ]}
                    // options={[ ...texValues,
                    //   { value: "toggle", label: <ToggleButton onClick={handleToggleClick} /> },
                    // ]}
                    value={texValues.find(item => item.value === row?.tax_id)}
                    styles={{
                      control: provided => ({
                        ...provided,
                        fontFamily: 'Roboto',
                        fontSize: '16px'
                      }),
                      option: baseStyles => ({
                        ...baseStyles,
                        fontFamily: 'Roboto',
                        fontSize: '16px'
                      })
                    }}
                  />
                </Grid>

                {/* Amount */}
                <Grid item xs={1} display='flex' justifyContent='flex-start'>
                  <InputLabel mt={1} ml={2}>
                    ${' '}
                    {toFixed(values[index]?.amount)}
                  </InputLabel>
                </Grid>

                {/* Actions */}
                <Grid item xs={0.5} display='flex' justifyContent='center'>
                  <Box mt={1}>
                    {/* <Box key={index} sx={{ textAlign: "end", my: 1, mt: 4 }}> */}
                    {values.length < 2 && (
                      <DeleteIcon
                        style={{ cursor: 'pointer' }}
                        color='primary'
                        onClick={() => {
                          setValues(prevValues => {
                            const updatedValues = [...prevValues];
                            updatedValues[index] = {
                              ...updatedValues[index],
                              itemDetails: itemOptions[0],
                              // quantity: 1,
                              // rate: 0,
                              // amount: 0,
                              item_name: 'Type or click to select an item',
                              quantity: 1,
                              rate: 0,
                              amount: 0,
                              total: 0
                            };
                            return updatedValues;
                          });
                        }}
                        fontSize='small'
                      />
                    )}
                    {values.length > 1 && (
                      <DeleteIcon
                        style={{ cursor: 'pointer' }}
                        color='primary'
                        onClick={() => {
                          handleDeleteRow(row.id, index);
                        }}
                        fontSize='small'
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} mt={1} mb={3}>
                  <Divider />
                </Grid>
              </Grid>
            ))
          )}
          {/*//////////// Table End ///////////// */}
          <Grid item xs={12} my={2} mt={0}>
            <ButtonComponent onClick={handleAddRow} endIcon={<AddIcon />}>
              Add row
            </ButtonComponent>
          </Grid>
        </Grid>

        {/*//////////// Sub Total Div ////////////*/}

        <Grid
          container
          sx={{ marginTop: '2rem' }}
          display='flex'
          justifyContent='flex-end'>
          <Grid item xs={12} md={5}></Grid>
          <Grid item xs={12} md={7}>
            <Paper
              elevation={1}
              sx={{
                display: 'flex',
                '& > :not(style)': {
                  p: 3,
                  paddingTop: 3,
                  paddingBottom: 3,
                  backgroundColor: '#F5F5F5',
                  borderRadius: 2
                }
              }}>
              <Grid container>
                {/* Sub Total */}
                <Grid
                  item
                  xs={12}
                  display='flex'
                  justifyContent='space-between'>
                  <Grid item xs={4}>
                    <InputLabel variant='body2' sx={{ fontSize: 16 }}>
                      Sub Total
                    </InputLabel>
                  </Grid>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={4} display='flex' justifyContent='flex-end'>
                    <InputLabel sx={{ fontSize: 16 }} variant='body2'>
                      ${' '}
                      {toFixed(calculateSubtotal())}
                    </InputLabel>
                  </Grid>
                </Grid>

                {/* Discount */}
                <Grid
                  item
                  xs={12}
                  display='flex'
                  justifyContent='space-between'
                  sx={{ marginTop: '2rem' }}>
                  <Grid item xs={4}>
                    <InputLabel sx={{ fontSize: 16 }} variant='body2'>
                      Discount
                    </InputLabel>
                  </Grid>
                  <Grid item xs={4} display='flex' justifyContent='flex-end'>
                    <FormField
                      type='number'
                      value={numberValue || ''}
                      onChange={handleNumberChange}
                      placeholder='0'
                      onBlur={e => {
                        if (e.target.value == '') {
                          setNumberValue(0);
                        }
                      }}
                      variant='outlined'
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '4px 0 0 4px',
                        marginTop: '0px'
                      }}
                    />
                    <FormField
                      type={'select'}
                      value={selectedOption}
                      onChange={handleOptionChange}
                      options={DISCOUNT_TYPE}
                      SelectProps={{ IconComponent: () => null }}
                      fontSize='16px'
                    />
                  </Grid>
                  <Grid item xs={4} display='flex' justifyContent='flex-end'>
                  <InputLabel sx={{ fontSize: 16 }} variant='body2'>
                      ${' '}
                      {selectedOption === 'Percentage'
                        ? isNaN((calculateSubtotal() * numberChange) / 100)
                          ? initialValues?.discount_amount
                          : toFixed(
                            (calculateSubtotal() * numberChange) / 100
                            
                          )
                        : isNaN(fixedDiscountAmount)
                        ? initialValues?.discount_amount
                        :toFixed(fixedDiscountAmount)}
                    </InputLabel>
                  </Grid>
                </Grid>
                {/* Text Sale */}
                {Object.entries(labelValueMap).map(([label, value], index) =>
                  (label !== undefined) & (value !== 0) ? (
                    <Grid
                      item
                      xs={12}
                      display='flex'
                      justifyContent='space-between'
                      sx={{ marginTop: '2rem' }}
                      key={index}>
                      <Grid item xs={4}>
                        <InputLabel sx={{ fontSize: 16 }} variant='body2'>
                          {label}
                        </InputLabel>
                      </Grid>
                      <Grid item xs={4}></Grid>
                      <Grid
                        item
                        xs={4}
                        display='flex'
                        justifyContent='flex-end'>
                        <InputLabel sx={{ fontSize: 16 }} variant='body2'>
                          $ {toFixed(labelToTaxAmountMap[label])}
                        </InputLabel>
                      </Grid>
                    </Grid>
                  ) : (
                    ''
                  )
                )}

                {/* Shipping Charges */}
                <Grid
                  item
                  xs={12}
                  display='flex'
                  justifyContent='space-between'
                  sx={{ marginTop: '2rem' }}>
                  <Grid item xs={4}>
                    <InputLabel sx={{ fontSize: 16 }} variant='body2'>
                      Shipping Charges
                    </InputLabel>
                  </Grid>
                  <Grid item xs={4} display='flex' justifyContent='flex-end'>
                    <FormField
                      type='number'
                      fullWidth
                      placeholder='0'
                      //      label="Shipping Charges"
                      value={shippingCharges || ''}
                      onChange={handleShippingChargesChange}
                      onBlur={e => {
                        if (e.target.value == '') {
                          setShippingCharges(0);
                        }
                      }}
                      sx={{ backgroundColor: '#FFFFFF' }}
                    />
                    <Box pl={0.5} pt={1} pb={1}>
                      <HoverPopover text='Amount spent on shipping the goods' />
                    </Box>
                  </Grid>
                  <Grid item xs={4} display='flex' justifyContent='flex-end'>
                    <InputLabel sx={{ fontSize: 16 }} variant='body2'>
                      ${' '}
                      {isGreaterThanZero(shippingCharges)
                        ? shippingCharges
                        : '0.00'}
                    </InputLabel>
                  </Grid>
                </Grid>
                {/* Adjustment */}
                <Grid
                  item
                  xs={12}
                  display='flex'
                  justifyContent='space-between'
                  sx={{ marginTop: '2rem' }}>
                  <Grid item xs={4}>
                    <InputLabel sx={{ fontSize: 16 }} variant='body2'>
                      Adjustment
                    </InputLabel>
                  </Grid>
                  <Grid item xs={4} display='flex' justifyContent='flex-end'>
                    <FormField
                      type='number'
                      fullWidth
                      value={adjustmentValue || ''}
                      placeholder='0'
                      handleChange={handleAdjustmentChange}
                      onBlur={e => {
                        if (e.target.value === '') {
                          setAdjustmentValue(0);
                        }
                      }}
                      sx={{ backgroundColor: '#FFFFFF' }}
                    />
                    <Box pl={0.5} pt={1} pb={1}>
                      <HoverPopover text='Add any other charges that need to be applied to adjust the total amount' />
                    </Box>
                  </Grid>

                  <Grid item xs={4} display='flex' justifyContent='flex-end'>
                    <InputLabel sx={{ fontSize: 16 }} variant='body2'>
                      ${' '}
                      {isGreaterThanZero(adjustmentValue)
                        ? adjustmentValue
                        : '0.00'}
                    </InputLabel>
                  </Grid>
                </Grid>
                {/* Total */}
                <Grid
                  item
                  xs={12}
                  display='flex'
                  justifyContent='space-between'>
                  <FieldTitle
                    sx={{ fontSize: 16 }}
                    variant='body2'
                    fontWeight={700}>
                    Total ( $ )
                  </FieldTitle>
                  <FieldTitle sx={{ fontSize: 16 }} fontWeight={700}>
                    ${' '}
                    {toFixed(calculateTotal())}
                  </FieldTitle>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <br />
        <NewTaxModal
          setIsNewTaxAdded={setIsNewTaxAdded}
          open={isNewTaxModalOpen}
          onClose={() => setIsNewTaxModalOpen(false)}
          newTax={isNewTaxAdded}
        />
      </>
    );
  },
  areEqual
);

export default AddItem;
