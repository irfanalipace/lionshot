import React from 'react';
import InvoiceForm from '@/Pages/NewInvoice/InvoiceForm';
import { Box } from '@mui/material';

interface NewInvoiceProps {
	edit: boolean;
}

function NewInvoice({ edit }: NewInvoiceProps) {
	return (
		<Box>
			<InvoiceForm edit={edit} />
		</Box>
	);
}

export default NewInvoice;
