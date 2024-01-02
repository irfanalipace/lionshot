import { useState, useEffect } from 'react';
import { vendorOptionApi } from '../api/purchase';

const useVendorOptions = () => {
    const [vendorOptions, setVendorOPtions] = useState([]);
    const [vendorOptionsLoading, setVendoLoading] = useState(true);

    const fetchVendorOptions = async () => {
        try {
            setVendoLoading(true);
            let response = await  vendorOptionApi(); 
            console.log('response' , response)

            let termsOptions = response?.map(vendor => ({
                text: vendor?.display_name,
                value: vendor?.id,
                id: vendor?.id,
            }));
            setVendorOPtions(termsOptions);
        } catch (error) {
        } finally {
            setVendoLoading(false);
        }
    };

    useEffect(() => {
        fetchVendorOptions();
    }, []);

    return { vendorOptions, vendorOptionsLoading , setVendorOPtions };
};

export default useVendorOptions;