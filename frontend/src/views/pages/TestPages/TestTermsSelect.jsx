import { useState, useEffect } from 'react';
import Select from 'react-select';
import { getPeymentTermsApi } from '../../../core/api/termsTaxesReasonsAuthorities';
import FormField from '../../Components/InputField/FormField';
import {
  addDaysToDate,
  formatDateToYYYYMMDD
} from '../../../core/utils/helpers';
import { Terms } from '../../../core/utils/constants';

function TestTermsSelect() {
  const [selectedTerm, setSelectedTerm] = useState();
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [terms, setTerms] = useState([]);

  const [estimateDate, setEstimateDate] = useState(
    formatDateToYYYYMMDD(new Date())
  );
  const fetchTerms = async () => {
    let response = await getPeymentTermsApi();
    setTerms(response?.data);
    let termsOptions = response?.data?.map(term => {
      return {
        label: term?.term_name,
        value: term?.number_of_days
      };
    });
    termsOptions = [...termsOptions, ...Terms];
    setPaymentTerms(termsOptions);
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleChange = selected => {
    setSelectedTerm(selected?.value);
    setEstimateDate(addDaysToDate(selected?.value));
  };

  return (
    <div style={{ height: '400px' }}>
      <Select
        name='colors'
        options={paymentTerms}
        className='basic-multi-select'
        classNamePrefix='select'
        onChange={handleChange}
      />

      <FormField
        name='estimateDate'
        value={estimateDate}
        onChange={e => setEstimateDate(e.target?.value)}
        size='small'
        fullWidth
        type='date'
      />
    </div>
  );
}

export default TestTermsSelect;
