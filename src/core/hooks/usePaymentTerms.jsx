import { useState, useEffect } from 'react';
import { getPeymentTermsApi } from '../api/customer';

const usePaymentTerms = () => {
    const [terms, setTerms] = useState([]);
    const [termsLoading, setTermsLoading] = useState(true);

    const fetchTerms = async () => {
        try {
            setTermsLoading(true);
            let response = await getPeymentTermsApi(); 
            let termsOptions = response?.data?.map(term => ({
                text: term?.term_name,
                value: term?.id,
                id: term?.id,
            }));
            setTerms(termsOptions);
        } catch (error) {
        } finally {
            setTermsLoading(false);
        }
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    return { terms, termsLoading , setTerms };
};

export default usePaymentTerms;
