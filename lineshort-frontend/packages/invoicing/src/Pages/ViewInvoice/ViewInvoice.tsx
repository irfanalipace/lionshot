import { useEffect, useState } from 'react';
import { Paper } from '@mui/material';
import HeaderPaper from '@/Components/Containers/HeaderPaper';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { getInvoiceDetailsApi, updateInvoiceApi } from '@/apis/invoice';
import RTIPDF from '@/Components/RTI/Invoice';
import RTIHeader from '@/Components/RTI/RTIHeader';
import MinnesotaPDF from '@/Components/ViewInvoice/PDF';
import MinnesotaHeader from '@/Components/ViewInvoice/Header';
import PaymentReceived from '@/Components/ViewInvoice/PaymentReceived';
import notyf from '@/Components/NotificationMessage/notyfInstance';
import { OriginValue } from '@/config/enum';
import MinnesotaSubHeader from '@/Components/ViewInvoice/SubHeader';
import OverlayLoader from '@/Components/OverLayLoader';
// interface invoieDataInterface {
// 	estimate_number?: string;
// 	estimate_items: any;
// 	invoice_items: any;
// 	invoice_number: string;
// 	invoice_date?: any;
// 	estimate_date?: any;
// 	payment_method: string;
// 	terms_and_condition: string;
// 	total: any;
// 	sub_total: any;
// 	payment_receiveds: any;
// 	reference_number: any;
// 	term: any;
// 	id: any;
// 	status: string;
// 	customer: {
// 		customer_billing_address: any;
// 		customer_shipping_address: any;
// 		email: string;
// 	};
// }

const ViewInvoice = ({ id, origin }: any) => {
	const navigate = useNavigate();

	const [invoiceFiles, setInvoiceFiles] = useState([]);
	const [invoiceData, setInvoiceData] = useState<any>();
	const [isEdit, setIsEdit] = useState(false);
	const [loading, setLoading] = useState<boolean>(false);

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
			const resp: any = await getInvoiceDetailsApi(id);
			console.log('singel invoice details', resp);
			// This is static email should replace it with real email that we will be reciveing from rti json
			resp.data.customer_email = 'umar.zahir@99technologies.co';
			setInvoiceData(resp?.data);
			setInvoiceFiles(resp?.data?.invoice_files);
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

	const updateRTIInvoice = async (state: string) => {
		try {
			if (state === 'save_as_draft') {
				setDraftLoading(true);
			} else {
				setSendLoading(true);
			}

			await updateInvoiceApi({
				...invoiceData,
				button_type: state,
				id,
				_method: 'PUT',
			});
			notyf.success('Invoice update successfully');
		} catch (err) {
			console.error(err);
			notyf.error('Failed to Update Invoice');
		} finally {
			setIsEdit(false);
			setDraftLoading(false);
			setSendLoading(false);
		}
	};

	const HEADER = {
		[OriginValue.Rti]: (
			<RTIHeader
				handleSave={updateRTIInvoice}
				onChangeEdit={e => setIsEdit(e)}
				isEdit={isEdit}
				draftLoading={draftLoading}
				sendLoading={sendLoading}
				id={id}
			/>
		),
		[OriginValue.Minnesota]: (
			<MinnesotaHeader
				id={id}
				fetchingSingleInvoice={fetchingSingleInvoice}
				invoiceFiles={invoiceFiles}
				invoice_number={invoiceData?.invoice_number}
			/>
		),
	};

	const SubHeader = {
		[OriginValue.Minnesota]: (
			<MinnesotaSubHeader
				status={invoiceData?.status}
				handleNewInvoice={handleNewInvoice}
				id={id}
			/>
		),
	};

	const Payment = {
		[OriginValue.Minnesota]: (
			<PaymentReceived payment_receiveds={invoiceData?.payment_receiveds} />
		),
	};

	const InvoicePDF = {
		[OriginValue.Minnesota]: <MinnesotaPDF invoiceData={invoiceData} />,
		[OriginValue.Rti]: (
			<RTIPDF
				isEdit={isEdit}
				data={invoiceData}
				onChange={handleRTIInvoiceInput}
			/>
		),
	};

	return (
		<Box sx={{ padding: '0 0.5rem', width: '100%' }}>
			<OverlayLoader open={loading} />
			<HeaderPaper>{HEADER[origin]}</HeaderPaper>
			{SubHeader[origin]}
			<Paper sx={{ padding: '1.5rem', margin: '1rem 0' }}>
				{Payment[origin]}
				{InvoicePDF[origin]}
			</Paper>
		</Box>
	);
};

export default ViewInvoice;
