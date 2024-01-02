import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
// import { getInvoiceDetailsApi, updateInvoiceApi } from '@/apis/invoice';
// import MinnesotaPDF from '@/Components/ViewInvoice/PDF';
// import MinnesotaHeader from '@/Components/ViewInvoice/Header';
// import PaymentReceived from '@/Components/ViewInvoice/PaymentReceived';
// import notyf from '@/Components/NotificationMessage/notyfInstance';
// import { OriginValue } from '@/config/enum';
// import MinnesotaSubHeader from '@/Components/ViewInvoice/SubHeader';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import ViewTemplate from '../../../Components/ViewTemplate/ViewTemplates';
import {
	getInvoiceDetailsApi,
	updateInvoiceApi,
} from '../../../../core/api/Invoice';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { formatDate } from '../../../../core/utils/helpers';
import PaymentReceived from '../../../Components/PaymentReceived';
import SubHeader from './SubHeader';
import Header from './Header';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import ContainerPaper from '../../../Components/Containers/ContainerPaper';

const columns = [
	{ id: '', label: 'No.', key: 'index' },
	{ id: '', label: 'Items Description', key: 'name' },
	{ id: '', label: 'Qty', key: 'quantity' },
	{ id: '', label: 'Rate(USD)', key: 'rate' },
	{ id: '', label: 'Amount(USD)', key: 'total' },
];

const ViewInvoice = ({ id }) => {
	const navigate = useNavigate();

	const [invoiceFiles, setInvoiceFiles] = useState([]);
	const [invoiceData, setInvoiceData] = useState();
	const [isEdit, setIsEdit] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleRTIInvoiceInput = (e, index) => {
		const rtiDataCopy = { ...invoiceData };
		if (index === 'discount') {
			rtiDataCopy.discount = e.target.value;
			setInvoiceData({ ...rtiDataCopy });
		} else if (index === 'total') {
			rtiDataCopy.total = e;
			setInvoiceData({ ...rtiDataCopy });
		} else {
			rtiDataCopy.invoice_items[index].total = e.target.value;
			setInvoiceData({ ...rtiDataCopy });
		}
	};

	// single estimate / show estimate / view
	useEffect(() => {
		fetchingSingleInvoice();
	}, [id]);

	const fetchingSingleInvoice = async () => {
		setLoading(true);
		try {
			const resp = await getInvoiceDetailsApi(id);
			console.log('singel invoice details', resp);
			// This is static email should replace it with real email that we will be reciveing from rti json
			// resp.data.customer_email = 'umar.zahir@99technologies.co';

			resp.data.data.detail = JSON.parse(resp.data.data.detail);
			setInvoiceData(resp?.data.data);
			setInvoiceFiles(resp?.data?.data.invoice_files);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleNewInvoice = () => {
		navigate(`/invoices/edit/${id}`);
	};

	const [draftLoading, setDraftLoading] = useState(false);
	const [sendLoading, setSendLoading] = useState(false);

	const [headers, setHeaders] = useState([]);
	const [calculationInfo, setCalculationInfo] = useState([]);

	const invoiceCalculationsInfo = [
		{
			label: 'Paid Amount',
			value: invoiceData?.paid_amount,
		},
		{
			label: 'Due Amount',
			value: invoiceData?.due_amount,
		},
	];

	useEffect(() => {
		const head = [
			{ label: 'Invoice Number:', value: invoiceData?.invoice_number },
			{
				label: 'Invoice Date:',
				value: formatDate(invoiceData?.invoice_date),
			},

			{ label: 'Terms:', value: invoiceData?.term },
			{
				label: 'Payment Mode:',
				value: invoiceData?.detail?.mode_of_payment?.label,
			},
			{ label: 'Delivery Terms:', value: 'Fedex' },
		];

		if (invoiceData?.po_reference) {
			head.splice(2, 0, {
				label: 'PO.Reference:',
				value: invoiceData?.po_reference,
			});
		}

		const calc = [
			{ label: 'Subtotal:', value: invoiceData?.subTotal },
			{
				key: 'discount',
				label: 'Discount:',
				value: invoiceData?.discount_value,
				type: invoiceData?.discount_key,
			},

			{ label: 'Tax:', value: invoiceData?.tax },
			{
				label: 'Adjustment:',
				value: invoiceData?.detail?.adjustment,
				hidden: !invoiceData?.detail?.adjustment,
			},
			{
				label: 'Shipping Charges:',
				value: invoiceData?.detail?.shipping_charges,
			},
			{ label: 'Total:', value: invoiceData?.total, primary: true },
			{ label: 'Paid Amount:', value: invoiceData?.paid_amount },
			{ label: 'Due Amount:', value: invoiceData?.due_amount },
		];

		setCalculationInfo(calc);
		setHeaders(head);
	}, [invoiceData]);

	return (
		<Box
			sx={{
				position: 'relative',
				padding: '0 0.5rem',
				width: '100%',
			}}
		>
			<OverlayLoader open={loading} />
			<HeaderPaper>
				<Header invoiceFiles={invoiceFiles} setInvoiceFiles={setInvoiceFiles} />
			</HeaderPaper>
			<SubHeader id={id} status={invoiceData?.status} />
			<ContainerPaper>
				<Box mb={3}>
					<PaymentReceived
						title='Payments Paid'
						payment_receiveds={invoiceData?.account_payable_paid_bills}
					/>
				</Box>
				<ViewTemplate
					title='INVOICE'
					data={invoiceData?.invoice_items}
					headings={{ first: 'Bill To', second: 'Ship To' }}
					apiData={invoiceData}
					itemsColumns={columns}
					addressData={{
						default_billing_address: {
							address: invoiceData?.billing_address,
							city: invoiceData?.billing_city,
							country: invoiceData?.billing_country,
							zipcode: invoiceData?.billing_zip,
							state: { name: invoiceData?.billing_state },
							attention: invoiceData?.customer_name,
						},
						default_shipping_address: {
							address: invoiceData?.shipping_address,
							city: invoiceData?.shipping_city,
							country: invoiceData?.shipping_country,
							zipcode: invoiceData?.shipping_zip,
							state: { name: invoiceData?.shipping_state },
							attention: invoiceData?.customer_name,
						},
					}}
					headerInfo={headers}
					calculationInfo={calculationInfo}
					extraCalculationsInfo={invoiceCalculationsInfo}
					// titleStyles={titleStyles}
				/>
			</ContainerPaper>
		</Box>
	);
};

export default ViewInvoice;
