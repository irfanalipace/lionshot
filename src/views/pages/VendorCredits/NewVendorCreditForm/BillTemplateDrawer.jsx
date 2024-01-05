import ContainerPaper from '../../../Components/Containers/ContainerPaper';
import ViewTemplates from '../../../Components/ViewTemplate/ViewTemplates';

const BillTemplateDrawer = () => {
	const columns = [
		{ id: '', label: 'No.', key: 'index' },
		{ id: '', label: 'Items Description', key: 'item_name' },
		{ id: '', label: 'Qty', key: 'quantity' },
		// { id: '', label: 'UOM', key: 'uom' },
		{ id: '', label: 'Rate(USD)', key: 'rate' },
		{ id: '', label: 'Amount(USD)', key: 'total' },
	];
	const info = [
		{ label: 'Bill #:', value: '0002' },
		{
			label: 'Bill Date:',
			value: 'Aud 2, 2023',
		},
		{
			label: 'Due Date:',
			value: 'Aud 2, 2023',
		},
		{
			label: 'Terms:',
			value: 'Net, 30',
		},
	];
	const headings = { first: 'From', second: 'To' };
	const data = {
		sub_total: 100,
		tax_amount: 0,
		discount: 50,
		shipping_charges: 20,
		adjustment: 30,
		total: 200,
		status: 'draft',
		vendor_credit_items: [
			{ item_name: 'something', quantity: '2', uom: 2, rate: 20, total: 40 },
			{ item_name: 'something', quantity: '2', uom: 2, rate: 20, total: 40 },
			{ item_name: 'something', quantity: '2', uom: 2, rate: 20, total: 40 },
		],
	};
	return (
		<>
			<ContainerPaper sx={{ padding: '1.5rem' }}>
				<ViewTemplates
					title='Bills'
					apiData={data}
					data={data?.vendor_credit_items}
					columns={columns}
					status={data?.status}
					headerInfo={info}
					addressData={data?.customer}
					showAddress
					bankDetails
					shippingAddress={true}
					headings={headings}
				/>
			</ContainerPaper>
		</>
	);
};

export default BillTemplateDrawer;
