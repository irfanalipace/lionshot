import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import TermsModal from '../../Components/TermsModal/TermsModal';
import { getPeymentTermsApi } from '../../../core/api/termsTaxesReasonsAuthorities';

function TestTerms() {
  const [isOpen, setIsOpen] = useState(false);
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      let response = await getPeymentTermsApi();
      setTerms(response?.data);
    } catch (error) {}
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <TermsModal
        terms={terms}
        isOpen={isOpen}
        onSave={fetchTerms}
        onClose={() => setIsOpen(false)}
      />
      <ul>
        {terms?.map(term => (
          <li key={term.id}>
            {term?.term_name} ---- {term?.number_of_days}
          </li>
        ))}
      </ul>
    </>
  );
}

export default TestTerms;
