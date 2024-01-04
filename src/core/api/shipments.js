import ApiService from '../services/apiService';

const getShipmentsTableData = {
	data: [
		{
			id: 5,
			tracking_id: '--',
			bill_id: 5,
			Work_order_number: '0847896547',
			invoice: 'INV-005',
			shipment_date: '2023-12-01',
			status: 'Ready for delivery',
			carrier_source: 'FedEx',
			label: 'Printed',
		},
		{
			id: 4,
			tracking_id: '2558547895',
			bill_id: 5,
			Work_order_number: 'WRO-1254',
			invoice: 'INV-002',
			shipment_date: '2023-12-01',
			status: 'Out for delivery',
			carrier_source: 'FedEx',
			label: 'Printed',
		},
		{
			id: 3,
			tracking_id: '9658745981',
			bill_id: 5,
			Work_order_number: 'WRO-9874',
			invoice: 'INV-003',
			shipment_date: '2023-12-01',
			status: 'Delivered',
			carrier_source: 'FedEx',
			label: 'Printed',
		},
		{
			id: 2,
			tracking_id: '3698574124',
			bill_id: 7,
			Work_order_number: 'WRO-6541',
			invoice: 'INV-004',
			shipment_date: '2023-11-30',
			status: 'Delivered',
			carrier_source: 'FedEx',
			label: 'Printed',
		},
		{
			id: 1,
			tracking_id: '--',
			bill_id: 5,
			Work_order_number: 'WRO-4578',
			invoice: 'INV-001',
			shipment_date: '2023-12-01',
			status: 'Ready for delivery',
			carrier_source: 'FedEx',
			label: 'Not Printed',
		},
	],
};

export function getShipmentsDataCall() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				status: 'success',
				data: getShipmentsTableData,
			});
			reject({
				status: 'error',
				message: 'Failed to fetch shipments data',
			});
		}, 1000);
	});
}

export function getShipmentsApiCall(params) {
	return new Promise((resolve, reject) => {
		ApiService.get(`/shipments`, null, params)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

const getFedExTableData = {
	data: [
		{
			id: 1,
			carrier: 'FedEx',
			serviceType: 'PRIORITY_OVERNIGHT',
			serviceName: 'FedEx Priority Overnight®',
			estimated_delivery_date: 'Mon, Nov 13',
			totalNetFedExCharge: 102.5,
		},
		{
			id: 2,
			carrier: 'FedEx',
			serviceType: 'INTL_GROUND_DISTRIBUTION',
			serviceName: 'International Ground® Distribution (IGD)',
			estimated_delivery_date: 'Mon, Nov 13',
			totalNetFedExCharge: 115.4,
		},
		{
			id: 3,
			carrier: 'FedEx',
			serviceType: 'GROUND_HOME_DELIVERY',
			serviceName: 'FedEx Home Delivery®',
			estimated_delivery_date: 'Mon, Nov 13',
			totalNetFedExCharge: 120.5,
		},
		{
			id: 4,
			carrier: 'FedEx',
			serviceType: 'FEDEX_GROUND',
			serviceName: 'FedEx International Ground®',
			estimated_delivery_date: 'Mon, Nov 20',
			totalNetFedExCharge: 110.5,
		},
		{
			id: 5,
			carrier: 'FedEx',
			serviceType: 'INTERNATIONAL_FIRST',
			serviceName: 'FedEx International First®',
			estimated_delivery_date: 'Mon, Nov 20',
			totalNetFedExCharge: 102.4,
		},
		{
			id: 6,
			carrier: 'FedEx',
			serviceType: 'INTERNATIONAL_ECONOMY',
			serviceName: 'FedEx International Economy®',
			estimated_delivery_date: 'Mon, Nov 20',
			totalNetFedExCharge: 129.7,
		},
	],
};

export function getFedExApiCall() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				status: 'success',
				data: getFedExTableData,
			});
			reject({
				status: 'error',
				message: 'Failed to fetch shipments data',
			});
		}, 1000);
	});
}

export function CreateShipmentPackageApi(data) {
	return new Promise((resolve, reject) => {
		ApiService.post('/shipments', data, '', true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export function getRatesFedexApi(data) {
	return new Promise((resolve, reject) => {
		ApiService.post('/get-rates-fedex', data, '', true)
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}


export function createShipment() {
	return new Promise((resolve, reject) => {
		ApiService.post('/create-shipment', '', '', "")
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}