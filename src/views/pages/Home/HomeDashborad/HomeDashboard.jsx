import { Suspense } from 'react';
import Box from '@mui/material/Box';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';
import { receivablesInvoiceApi } from '../../../../core/api/dashboardhome';
import { useState } from 'react';
import { useEffect } from 'react';
const MyCard = lazy(() => import('../../../Components/Card/MyCard'));
const TopExpenses = lazy(() => import('../TopExpenses/TopExpenses'));
const IncomeExpensiveChart = lazy(() =>
	import('../IncomeExpensiveChart/IncomeExpensiveChart')
);
// const BankCreditCard = lazy(() => import('../BankCreditCard/BankCreditCard'));
const Chart = lazy(() => import('../LineChart/Chart'));

const HomeDashboard = () => {
	const [unpaidInvoices, setUnpaidInvoice] = useState([]);

	// Example of how to use the dashboardApi function
	const [dateObject, setDateObject] = useState({
		cash_flow_start_date: '',
		cash_flow_end_date: '',
		income_and_expense_start_date: '',
		income_and_expense_end_date: '',
		top_selling_items_start_date: '',
		top_selling_items_end_date: '',
	});
	const getInvoiceItem = async () => {
		const params = {
			cash_flow_start_date: dateObject?.cash_flow_start_date,
			cash_flow_end_date: dateObject?.cash_flow_end_date,
			income_and_expense_start_date: dateObject?.income_and_expense_start_date,
			income_and_expense_end_date: dateObject?.income_and_expense_end_date,
			top_selling_items_start_date: dateObject?.top_selling_items_start_date,
			top_selling_items_end_date: dateObject?.top_selling_items_end_date,
		};
		try {
			const listItem = await receivablesInvoiceApi(params);
			if (listItem?.data) {
				const resp = listItem.data;
				setUnpaidInvoice(resp);
			} else {
				console.error('Invalid API response:', listItem);
			}
		} catch (e) {
			console.error('Error fetching data:', e);
		}
	};
	const receivableObject = { ...unpaidInvoices?.total_receivables };
	const payableObject = { ...unpaidInvoices?.total_payables };
	const cashObject = { ...unpaidInvoices?.cash_flow };
	const incoming_and_outgoingObject = {
		...unpaidInvoices?.incoming_and_outgoing,
	};
	const top_selling_itemsObject = { ...unpaidInvoices?.top_selling_items };

	useEffect(() => {
		getInvoiceItem();
	}, [dateObject]);

	const onSave_CashFlow = (startDate, endDate) => {
		setDateObject({
			cash_flow_start_date: startDate,
			cash_flow_end_date: endDate,
		});
	};
	const onSave_IncomeExpense = (startDate, endDate) => {
		setDateObject({
			income_and_expense_start_date: startDate,
			income_and_expense_end_date: endDate,
		});
	};
	const onSave_TopExpenses = (startDate, endDate) => {
		setDateObject({
			top_selling_items_start_date: startDate,
			top_selling_items_end_date: endDate,
		});
	};
	// console.log('dateObject', dateObject);
	return (
		<Box>
			<Box sx={{ display: 'flex' }}>
				<Suspense>
					<MyCard
						title='Total Receivables'
						totalUnpaidInvoices={`Total Unpaid Invoices $${
							receivableObject.total_unpaid_invoices || 0
						}`}
						currentAmount={receivableObject.current_for_receivables || 0}
						overdueAmount={receivableObject.overdue_for_receivables || 0}
						progressValue={parseInt(receivableObject.percentage) || 0}
						option1='New Invoice'
						url1='/invoices/new'
						option2='New Customer Payment'
						url2=''
					/>
				</Suspense>
				<Box sx={{ marginLeft: '20px' }}>
					<Suspense>
						<MyCard
							title='Total Payables'
							totalUnpaidInvoices={`Total Unpaid Bills $${
								payableObject.total_unpaid_bills || 0
							} `}
							currentAmount={payableObject.current_payables || 0}
							overdueAmount={payableObject.overdue_payables || 0}
							progressValue={parseInt(payableObject.percentage) || 0}
							option1='New Bill'
							url1='/vendor/new'
							option2='New Vendor Payments'
						/>
					</Suspense>
				</Box>
			</Box>
			<Suspense>
				<Chart
					title='Cash Flow'
					dateMonth='Last 12 Months'
					fiscalYear='This Fiscal Year'
					priviousYear='Previous Fiscal Year'
					lastYear='Last 12 Months'
					cashDate='Case as on 01 Aug 2022'
					cashAmount='0.00'
					inComming='Incoming'
					inCommingAmmount={cashObject.incoming}
					outGoing='Outgoing'
					outGoingAmmount={cashObject.outgoing}
					cashLatestDate='Cash as on 23 Aug 2023'
					cashLatestAmmount='3,168,486.24'
					dataChart={cashObject.chart_data}
					onSave={onSave_CashFlow}
				/>
			</Suspense>
			<Box sx={{ display: 'flex' }}>
				<Suspense>
					<IncomeExpensiveChart
						title='Income and Expense'
						incoming_and_outgoingObject={incoming_and_outgoingObject}
						onSave={onSave_IncomeExpense}
					/>
				</Suspense>
				<Suspense>
					<TopExpenses
						title='Your Top Expenses'
						top_selling_itemsObject={top_selling_itemsObject}
						onSave={onSave_TopExpenses}
					/>
				</Suspense>
				{/* <Box ml={1.5}>
					
				</Box> */}
			</Box>
			{/* <Box variant='div' sx={{ display: 'flex' }}>
				<Suspense>
					<BankCreditCard
						title='Bank and Credit Cards'
						bankDetalis='Yet to add Bank and Credit Card details'
						addBankAccount='Add Bank Account'
					/>
				</Suspense>
			</Box> */}
		</Box>
	);
};

export default HomeDashboard;
