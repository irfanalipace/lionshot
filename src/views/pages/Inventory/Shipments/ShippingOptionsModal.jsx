import React from 'react';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import DataTable from '../../../Components/DataTable/DataTable';
import Modal from '../../../Components/Modal/Dialog';
import MUIButton from '../../../Components/Button/MUIButton';

const ShippingOptionsModal = ({
	open,
	onClose,
	setSelectedRows,
	setFieldValue,
	fedExApiResState,
}) => {
	const Columns = [
		{ accessorKey: 'carrier', header: 'Carrier' },
		{ accessorKey: 'serviceName', header: 'Shipping Services' },
		{
			accessorKey: 'estimated_delivery_date',
			header: 'Estimated Delivery Date',
		},
		{
			accessorKey: 'totalNetFedExCharge',
			header: 'Delivery Charges',
			Cell: ({ renderedCellValue }) => (
				<Typography variant='body2'>${renderedCellValue}</Typography>
			),
		},
	];

	const updateFormikFields = row => {
		if (!row.getIsSelected()) {
			setFieldValue('serviceType', row.original.serviceType, true);
			setFieldValue('shipment_price', row.original.totalNetFedExCharge, true);
		} else {
			setFieldValue('serviceType', '', true);
			setFieldValue('shipment_price', 0, true);
		}
	};

	return (
		<Modal open={open} onClose={onClose} size={'md'} title='Shipping Options'>
			<Box position={'relative'}>
				<DataTable
					data={fedExApiResState}
					columns={Columns}
					showApiError={true}
					enableMultiRowSelection={false}
					setSelectedRows={setSelectedRows}
					onRowClick={row => {
						const select = row.getToggleSelectedHandler();
						select(row);
						updateFormikFields(row);
					}}
				/>

				<Divider />
				<Grid
					container
					justifyContent='flex-end'
					sx={{ padding: '1.2rem 1.2rem 1rem 1.2rem' }}
				>
					<Stack direction='row' spacing={2}>
						<MUIButton variant='outlined' onClick={() => onClose()}>
							Confirm
						</MUIButton>
					</Stack>
				</Grid>
			</Box>
		</Modal>
	);
};

export default ShippingOptionsModal;
