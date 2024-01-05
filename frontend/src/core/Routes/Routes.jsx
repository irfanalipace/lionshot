// import React, { lazy } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';

const InvoiceForm = lazy(() =>
	import('../../views/pages/Invoice/NewInvoice/invoiceForm.jsx')
);

const Integrations = lazy(() =>
	import('../../views/pages/ItemsInegration/ItemsIntegration')
);

const Brand = lazy(() => import('../../views/pages/Settings/Brand/Brand'));

const Marketplaces = lazy(() =>
	import('../../views/pages/Settings/Marketplaces/Marketplaces')
);
const Categories = lazy(() =>
	import('../../views/pages/Settings/Categories/Categories')
);
const NewMarketplaces = lazy(() =>
	import('../../views/pages/Settings/Marketplaces/NewMarketplaces')
);
const EditCategories = lazy(() =>
	import('../../views/pages/Settings/Categories/EditCategories/EditCategories')
);

/* Test Pages Routes */

// const TestPage = lazy(() => import('../../views/pages/TestPages/TestPage'));
// const TestTerms = lazy(() =>
// 	import('../../views/pages/TestPages/TestTermsPage')
// );
// const TestTermsSelect = lazy(() =>
// 	import('../../views/pages/TestPages/TestTermsSelect')
// );
// const TestViewList = lazy(() =>
// 	import('../../views/pages/TestPages/TestViewList')
// );
const TestIntegrations = lazy(() =>
	import('../../views/pages/TestPages/TestIntegrations')
);

/* Test Pages Routes End */

const Home = lazy(() => import('../../views/pages/Home/Home'));
const LoginForm = lazy(() => import('../../views/pages/Auth/Login'));
const RegisterForm = lazy(() => import('../../views/pages/Auth/Register'));
const ForgotPassword = lazy(() =>
	import('../../views/pages/Auth/ForgetPassword')
);
////category

///marketplace

// const ItemImage = lazy(() => import('../../views/pages/ItemImage/ItemImage'));

const ResetPassword = lazy(() => import('../../views/pages/Auth/RestPassword'));
const Items = lazy(() => import('../../views/pages/Inventory/Items/Items.jsx'));
const Customer = lazy(() => import('../../views/pages/Customer/Customer'));
// estimate
const Estimate = lazy(() => import('../../views/pages/Estimate/PriceQuote'));

const NewPriceQuote = lazy(() =>
	import(
		'../../views/pages/Estimate/PriceQuoteForm/NewPriceQuote/NewPriceQuote'
	)
);

const Bills = lazy(() => import('../../views/pages/Bills/Bills'));

const BillsForm = lazy(() =>
	import('../../views/pages/Bills/NewBills/BillsForm')
);

// const Estimate = lazy(() => import('../../views/pages/Estimate/PriceQuote'));
const EditPriceQuote = lazy(() =>
	import(
		'../../views/pages/Estimate/PriceQuoteForm/EditPriceQuote/EditPriceQuote'
	)
);
const SendMail = lazy(() => import('../../views/Components/SendMail/SendMail'));
const PriceListFile = lazy(() =>
	import('../../views/pages/Settings/PriceList/PriceListFile')
);
const PageWrapper = lazy(() =>
	import('../../views/Components/PageWrapper/PageWrapper')
);
// const Banking = lazy(() => import('../../views/pages/Banking/Banking'));
// const BankingOverView = lazy(() =>
// 	import('../../views/pages/Banking/BankingOverView/BankingOverView')
// );
const NewCustomerPage = lazy(() =>
	import('../../views/pages/Customer/NewCustomer/NewCustomerPage')
);
const PaymentLinksTable = lazy(() =>
	import('../../views/pages/PaymentLinks/PaymentLinksTable')
);
const SalesOrderForm = lazy(() =>
	import('../../views/pages/SalesOrder/NewSalesOrder/SalesOrderForm')
);

const PaymentReceived = lazy(() =>
	import('../../views/pages/PaymentReceived/PaymentReceived')
);
// const PriceListNew = lazy(() =>
// 	import('../../views/pages/Settings/PriceList/PriceListNew')
// );
const PriceList = lazy(() =>
	import('../../views/pages/Settings/PriceList/PriceList')
);
// const ImportSalesPriceList = lazy(() =>
// 	import('../../views/pages/Settings/PriceList/ImportSalesPriceList')
// );
const ImportExportSalesPurchase = lazy(() =>
	import('../../views/pages/Settings/PriceList/ImportExportSalesPurchase')
);
const ImportPurchasePriceList = lazy(() =>
	import('../../views/pages/Settings/PriceList/ImportPurchasePriceList')
);
const EditPriceListForm = lazy(() =>
	import(
		'../../views/pages/Settings/PriceList/EditPriceListForm/EditPriceListForm'
	)
);

const PaymentForm = lazy(() =>
	import('../../views/pages/PaymentReceived/PaymentForm/PaymentForm')
);

const Dashboard = lazy(() =>
	import('../../views/pages/CustomerPortal/Dashboard/Dashboard')
);
const PriceQuoteCustomerPortal = lazy(() =>
	import('../../views/pages/CustomerPortal/PriceQuotes/PriceQuote')
);
const SalesOrderCustomerPortal = lazy(() =>
	import('../../views/pages/CustomerPortal/SalesOrder/SalesOrder')
);

const InvoicingCustomerPortal = lazy(() =>
	import('../../views/pages/CustomerPortal/Invoice/Invoicing')
);
const ViewInvoiceCustomerPortal = lazy(() =>
	import('../../views/pages/CustomerPortal/Invoice/ViewInvoice')
);
const Vendor = lazy(() => import('../../views/pages/Vendorr/Vendor'));
const NewVendorPage = lazy(() =>
	import('../../views/pages/Vendorr/NewVendor/NewVednorPage')
);
const CompaniesTable = lazy(() =>
	import('../../views/pages/Settings/Companies/CompaniesTable')
);
const Shipments = lazy(() =>
	import('../../views/pages/Inventory/Shipments/Shipments.jsx')
);
const NewShipments = lazy(() =>
	import('../../views/pages/Inventory/Shipments/NewShipments.jsx')
);
const StockOutTable = lazy(() =>
	import('../../views/pages/Inventory/StockOut/StockOutTable.jsx')
);
const WorkOrderTable = lazy(() =>
	import('../../views/pages/Inventory/StockOut/WorkOrderTable.jsx')
);
const RefundRequests = lazy(() =>
	import('../../views/pages/CustomerPortal/RefundRequests/RefundRequests.jsx')
);
const NewRefundRequests = lazy(() =>
	import(
		'../../views/pages/CustomerPortal/RefundRequests/NewRefundRequests.jsx'
	)
);
const ProductLabelingTable = lazy(() =>
	import('../../views/pages/Inventory/ProductLabeling/ProductLabelingTable.jsx')
);
const UsersTable = lazy(() =>
	import('../../views/pages/Settings/Users/UsersTable')
);
const DepartmentsTable = lazy(() =>
	import('../../views/pages/Settings/Departments/DepartmentsTable.jsx')
);
const VendorCredits = lazy(() =>
	import('../../views/pages/VendorCredits/VendorCredits.jsx')
);
const NewVendorCredit = lazy(() =>
	import(
		'../../views/pages/VendorCredits/NewVendorCreditForm/NewVendorCredit.jsx'
	)
);
const ViewSalesOrderCustomerPortal = lazy(() =>
	import('../../views/pages/CustomerPortal/SalesOrder/ViewSalesOrder')
);
const ViewPriceQuote = lazy(() =>
	import('../../views/pages/CustomerPortal/PriceQuotes/ViewPriceQuote')
);

const NewCondition = lazy(() =>
	import('../../views/pages/Settings/Condition/NewCondition')
);

const CustomerSidebar = lazy(() =>
	import('../../views/Components/Asides/CustomerSidebar')
);
const HeaderCustomer = lazy(() =>
	import('../../views/Components/Headers/HeaderCustomer')
);
const SalesOrderList = lazy(() =>
	import('../../views/pages/SalesOrder/SalesOrderList/SalesOrderList')
);
const PurchaseOrders = lazy(() =>
	import('../../views/pages/PurchaseOrders/PurchaseOrders')
);

const NewPurchaseOrders = lazy(() =>
	import(
		'../../views/pages/PurchaseOrders/PurchaseOrdersForm/NewPurchaseOrders/NewPurchaseOrders'
	)
);

const EditPurchaseOrders = lazy(() =>
	import(
		'../../views/pages/PurchaseOrders/PurchaseOrdersForm/EdirPurchaseOrder/EditPurchaseOrders'
	)
);
const CreditMemoList = lazy(() =>
	import('../../views/pages/CreditMemo/CreditMemoList/CreditMemoList')
);

const NewCreditMemo = lazy(() =>
	import('../../views/pages/CreditMemo/NewCreditMemo/NewCreditMemo')
);

const Condition = lazy(() =>
	import('../../views/pages/Settings/Condition/Condition')
);

// const SalesOrder = lazy(() =>
// 	import('../../views/pages/CustomerPortal/SalesOrder/SalesOrder')
// );
const NewItem = lazy(() =>
	import('../../views/pages/Inventory/Items/NewItems/NewItems')
);
const EditItem = lazy(() =>
	import('../../views/pages/Inventory/Items/EditItems/EditItems')
);

const AccountPayable = lazy(() =>
	import('../../views/pages/AccountPayable/AccountPayable.jsx')
);
const NewAccountPayable = lazy(() =>
	import(
		'../../views/pages/AccountPayable/NewAccountPayable/NewAccountPayable.jsx'
	)
);
const EditAccountPayable = lazy(() =>
	import(
		'../../views/pages/AccountPayable/EditAccountPayable/EditAccountPayable.jsx'
	)
);

const Invoice = lazy(() => import('../../views/pages/Invoice/Invoice'));
// import NewInvoice from '../../views/pages/Invoice//Pages/NewInvoice';
const PageNotFound = lazy(() => import('../../views/pages/404/PageNotFound'));
const AdminSidebar = lazy(() =>
	import('../../views/Components/Asides/AdminSidebar')
);
const MainFooter = lazy(() =>
	import('../../views/Components/Footers/MainFooter')
);
const MainHeader = lazy(() =>
	import('../../views/Components/Headers/MainHeader')
);
import HomeDashboardLineShort from '../../views/pages/Dashboard/HomeDashboardLineShort.jsx';

export const routes = [
	/* auth routes */
	{
		path: '/login',
		page: (
			<AuthRoute>
				<PageWrapper>
					<LoginForm />
				</PageWrapper>
			</AuthRoute>
		),
		header: null,
		footer: null,
		aside: null,
	},
	{
		path: '/register',
		page: (
			<AuthRoute>
				<PageWrapper>
					<RegisterForm />
				</PageWrapper>
			</AuthRoute>
		),
		header: null,
		footer: null,
		aside: null,
	},
	{
		path: '/forgot_password',
		page: (
			<AuthRoute>
				<PageWrapper>
					<ForgotPassword />
				</PageWrapper>
			</AuthRoute>
		),
		header: null,
		footer: null,
		aside: null,
	},

	{
		path: '/reset-password',
		page: (
			<AuthRoute>
				<PageWrapper>
					<ResetPassword />
				</PageWrapper>
			</AuthRoute>
		),
		header: null,
		footer: null,
		aside: null,
	},

	/*  All protected routes */
	// {
	// 	path: '/home',
	// 	page: (
	// 		<ProtectedRoute>
	// 			<PageWrapper isSidebar={true}>
	// 				<Home />
	// 			</PageWrapper>
	// 		</ProtectedRoute>
	// 	),
	// 	header: <MainHeader />,
	// 	footer: <MainFooter />,
	// 	aside: <AdminSidebar />,
	// },

	{
		path: '/home',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<HomeDashboardLineShort />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},




	/* Items All Routes Start From here*/
	// items module routes

	{
		path: '/items',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<Items />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/items/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewItem />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/items/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<EditItem />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	{
		path: '/shipments',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<Shipments />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/shipments/new/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewShipments />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	/* All Sales Routes Start From here */
	// customer module routes
	{
		path: '/customer',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<Customer />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	{
		path: '/customer/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewCustomerPage />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/customer/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewCustomerPage edit />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	// price quote routes
	{
		path: '/price-quote',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<Estimate />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/price-quote/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewPriceQuote />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	{
		path: '/price-quote/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<EditPriceQuote />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	// sales order routes
	{
		path: '/sales-orders',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<SalesOrderList />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/sales-orders/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<SalesOrderForm />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/sales-orders/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<SalesOrderForm edit />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	// routes for invoices workspace package
	{
		path: '/invoices',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<Invoice />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	{
		path: '/invoices/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<InvoiceForm edit={false} />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	{
		path: '/invoices/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<InvoiceForm edit={true} />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	// payment link routes

	{
		path: '/payment-links',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<PaymentLinksTable />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	// payment received routes
	{
		path: '/payment-received',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<PaymentReceived />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/payment-received/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<PaymentForm />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/payment-received/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<PaymentForm />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	{
		path: '/import-sales-price/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<ImportExportSalesPurchase />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	{
		path: '/import-purchase-price/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<ImportPurchasePriceList />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	{
		path: '/credit-memo',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<CreditMemoList />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/credit-memo/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewCreditMemo edit />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/credit-memo/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewCreditMemo />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	// {
	// 	path: '/inventory-adjustments',
	// 	page: (
	// 		<ProtectedRoute>
	// 			<PageWrapper isSidebar={true}>
	// 				<div>Inventory Adjustments</div>
	// 			</PageWrapper>
	// 		</ProtectedRoute>
	// 	),
	// 	header: <MainHeader />,
	// 	footer: <MainFooter />,
	// 	aside: <AdminSidebar />,
	// },

	/* Customer Portal Routes */

	{
		path: '/customer-portal/:customerId/dashboard',
		page: (
			<PageWrapper isSidebar={true}>
				<Dashboard />
			</PageWrapper>
		),
		header: <HeaderCustomer />,
		footer: null,
		aside: <CustomerSidebar />,
	},
	{
		path: '/customer-portal/:customerId/price-quote',
		page: (
			<PageWrapper isSidebar={true}>
				<PriceQuoteCustomerPortal />
			</PageWrapper>
		),
		header: <HeaderCustomer />,
		footer: null,
		aside: <CustomerSidebar />,
	},
	{
		path: '/customer-portal/:customerId/price-quote/:id',
		page: (
			<PageWrapper isSidebar={true}>
				<ViewPriceQuote />
			</PageWrapper>
		),
		header: <HeaderCustomer />,
		footer: null,
		aside: <CustomerSidebar />,
	},
	{
		path: '/customer-portal/:customerId/sales-orders',
		page: (
			<PageWrapper isSidebar={true}>
				<SalesOrderCustomerPortal />
			</PageWrapper>
		),
		header: <HeaderCustomer />,
		footer: null,
		aside: <CustomerSidebar />,
	},
	{
		path: '/customer-portal/:customerId/sales-orders/:id',
		page: (
			<PageWrapper isSidebar={true}>
				<ViewSalesOrderCustomerPortal />
			</PageWrapper>
		),
		header: <HeaderCustomer />,
		footer: null,
		aside: <CustomerSidebar />,
	},
	{
		path: '/customer-portal/:customerId/invoices',
		page: (
			<PageWrapper isSidebar={true}>
				<InvoicingCustomerPortal />
			</PageWrapper>
		),
		header: <HeaderCustomer />,
		footer: null,
		aside: <CustomerSidebar />,
	},
	{
		path: '/customer-portal/:customerId/invoices/:id',
		page: (
			<PageWrapper isSidebar={true}>
				<ViewInvoiceCustomerPortal />
			</PageWrapper>
		),
		header: <HeaderCustomer />,
		footer: null,
		aside: <CustomerSidebar />,
	},
	/* All Refund Request of Customer Portal Routes Start From here */
	{
		path: '/customer-portal/:customerId/refund-request',
		page: (
			// <ProtectedRoute>
			<PageWrapper isSidebar={true}>
				<RefundRequests />
			</PageWrapper>
			// </ProtectedRoute>
		),
		header: <HeaderCustomer />,
		footer: null,
		aside: <CustomerSidebar />,
	},
	// {
	// 	path: '/customer-portal/:customerId/refund-request/edit/:id',
	// 	page: (
	// 		<ProtectedRoute>
	// 			<PageWrapper isSidebar={true}>
	// 				<NewRefundRequests edit/>
	// 			</PageWrapper>
	// 		</ProtectedRoute>
	// 	),
	// 	header: <HeaderCustomer />,
	// 	footer: null,
	// 	aside: <CustomerSidebar />,
	// },
	{
		path: '/customer-portal/:customerId/refund-request/new',
		page: (
			// <ProtectedRoute>
			<PageWrapper isSidebar={true}>
				<NewRefundRequests />
			</PageWrapper>
			// </ProtectedRoute>
		),
		header: <HeaderCustomer />,
		footer: null,
		aside: <CustomerSidebar />,
	},
	/* Refund Request Routes end */
	{
		path: '/customer-portal/:customerId/setting',
		page: (
			<PageWrapper isSidebar={true}>
				{/* <Setting/> */}
				<Dashboard />
			</PageWrapper>
		),
		header: <HeaderCustomer />,
		footer: null,
		aside: <CustomerSidebar />,
	},
	/* Customer Portal Routes END */

	/* All Purchase Routes Start From here */
	{
		path: '/vendor',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<Vendor />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/vendor/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewVendorPage />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/vendor/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewVendorPage edit />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	// purchase order routes
	{
		path: '/purchase-orders',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<PurchaseOrders />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/purchase-orders/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewPurchaseOrders />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	{
		path: '/purchase-orders/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<EditPurchaseOrders />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	//bills modules routes
	{
		path: '/bills',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<Bills />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/bills/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<BillsForm />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	{
		path: '/bills/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<BillsForm edit />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	//account payable routes
	{
		path: '/account-payable',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<AccountPayable />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/account-payable/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewAccountPayable />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/account-payable/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<EditAccountPayable />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	//vendor credits routes
	{
		path: '/vendor-credits',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<VendorCredits />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/vendor-credits/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewVendorCredit />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/vendor-credits/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewVendorCredit edit />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	/*Settings Routes start from here */

	// price lists routes

	{
		path: '/price-lists',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<PriceList />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	{
		path: '/price-lists/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<PriceListFile />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	{
		path: '/price-lists/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<EditPriceListForm />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/marketplaces',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<Marketplaces />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/marketplaces/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewMarketplaces />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/marketplaces/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewMarketplaces edit />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/categories',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<Categories />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/categories/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<EditCategories />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/departments',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<DepartmentsTable />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/users',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<UsersTable />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/companies',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<CompaniesTable />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	// {
	// 	path: '/item-image',
	// 	page: (
	// 		<ProtectedRoute>
	// 			<PageWrapper isSidebar={true}>
	// 				<ItemImage />
	// 			</PageWrapper>
	// 		</ProtectedRoute>
	// 	),
	// 	header: <MainHeader />,
	// 	footer: <MainFooter />,
	// 	aside: <AdminSidebar />,
	// },
	{
		path: '/integrations',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<Integrations />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	{
		path: '/item-brand',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<Brand />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	///condtions
	{
		path: '/conditions',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<Condition />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/conditions/new',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewCondition />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/conditions/edit/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<NewCondition edit />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	{
		path: '/stock-out',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<StockOutTable />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	{
		path: '/stock-out/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<WorkOrderTable />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	// inventory pages
	/* Product Labeling */
	{
		path: '/product-labeling',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<ProductLabelingTable />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},
	/* send mail page */
	{
		path: '/send-email/:type/:id',
		page: (
			<ProtectedRoute>
				<PageWrapper isSidebar={true}>
					<SendMail />
				</PageWrapper>
			</ProtectedRoute>
		),
		header: <MainHeader />,
		footer: <MainFooter />,
		aside: <AdminSidebar />,
	},

	/* Page Not Found 404 */
	{
		path: '*',
		page: (
			<PageWrapper isSidebar={false}>
				<PageNotFound />
			</PageWrapper>
		),
		header: null,
		footer: null,
		aside: null,
	},

	/* Test Page */
	{
		path: 'test',
		page: (
			<PageWrapper isSidebar={true}>
				<TestIntegrations />
			</PageWrapper>
		),
		header: <MainHeader />,
		footer: null,
		aside: <AdminSidebar />,
	},
];

export function ProtectedRoute({ children }) {
	const location = useLocation();
	const isAuthenticated = useSelector(state => state?.auth?.isAuthenticated);

	if (!isAuthenticated) {
		const redirectURL = location.pathname;
		window.localStorage.setItem('redirectURL', redirectURL);
		return <Navigate to='/login' replace />;
	}

	return <>{children}</>;
}

export function AuthRoute({ children }) {
	const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
	let redirectRoute = '/home';

	if (isAuthenticated) {
		const redirectURL = localStorage.getItem('redirectURL');
		localStorage.removeItem('redirectURL');
		if (redirectURL) redirectRoute = redirectURL;
	}

	return isAuthenticated ? (
		<Navigate to={`${redirectRoute}`} replace />
	) : (
		children
	);
}
