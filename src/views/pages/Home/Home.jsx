import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import TabsBar from '../../Components/TabsBar/TabsBar';
import { useSelector } from 'react-redux';
// import { generateInvoice } from 'invoicing';
const rtiData = {
	company_name: 'Package Test 1',
	company_address:
		'70 Washington Square South, New York, NY 10012, United States',
	company_phone: '262 798-3040',
	sold_to: 'Lexi Renarje 1525 99th LN NE Blaine, MN 23897',
	bol_number: 123,
	origin: 'rti',
	invoice_date: '2023-09-07',
	invoice_number: 'Invoice501',
	discount: 50,
	total: 500,
	tax_amount: 100,
	sub_total: 400,
	button_type: 'save_as_draft',
	invoice_items: [
		{
			item_id: null,
			rti_item_id: '',
			item_name: 'RTI Item11',
			quantity: 1,
			rate: 45,
			total: 90,
			weight: 20,
		},
		{
			item_id: null,
			rti_item_id: '',
			item_name: 'RTI Item22',
			quantity: 1,
			rate: 5,
			total: 10,
			weight: 10,
		},
	],
};
export default function Home() {
	const userData = useSelector(state => state.auth.user);

	return (
		<div>
			<Box>
				<Paper
					sx={{ padding: '1.2rem', marginTop: '0px', marginBottom: '12px' }}
				>
					<Stack spacing={2} direction='row'>
						<AccountBoxIcon sx={{ height: '40px', width: '2em' }} />
						{/* <button
							onClick={async () => {
								let res = await generateInvoice(rtiData);
								console.log('Res on button call', res);
							}}
						>
							Generate invoice
						</button> */}
						<Typography>
							Hello, {userData?.name}
							<Typography sx={{ fontSize: '12px' }}>
								Minnesota Computer
							</Typography>
						</Typography>
					</Stack>
				</Paper>

				<Box>
					<Stack>
						<TabsBar />
					</Stack>
				</Box>
			</Box>
		</div>
	);
}
