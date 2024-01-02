import React, { useEffect, useState } from 'react';
import useTheme from '@mui/material/styles/useTheme';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import CloseIcon from '@mui/icons-material/Close';
import { formatDate } from '../../../../core/utils/helpers';
import { useNavigate, useParams } from 'react-router-dom';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import {
	acceptPriceQuoteApi,
	declinePriceQuoteApi,
	downloadCustomerPriceQuoteApi,
	showCustomerPriceQuoteApi,
} from '../APIs/CustomerPortalAPIs';
import ViewTemplates from '../../../Components/ViewTemplate/ViewTemplates';
import CustomerStatus from '../CustomerStatus/CustomerStatus';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';

const ViewPriceQuote = () => {
	const [priceQuote, setPriceQuote] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const [btnLoading, setbtnLoading] = useState(false);
	const [btnLoading2, setbtnLoading2] = useState(false);

	const navigate = useNavigate();
	const { customerId, id } = useParams();

	const theme = useTheme();
	const [errors, setErrors] = useState(null);

	useEffect(() => {
		getSpecificPriceQuote();
	}, [id]);
	const getSpecificPriceQuote = async () => {
		try {
			setIsLoading(true);
			const resp = await showCustomerPriceQuoteApi({
				estimate_id: id,
				customer_id: customerId,
			});
			setPriceQuote(resp?.data);
		} catch (error) {
			navagating();
		} finally {
			setIsLoading(false);
		}
	};
	const navagating = () => {
		navigate(`/customer-portal/${customerId}/price-quote`);
	};

	const accept = async () => {
		try {
			setbtnLoading2(true);
			const resp = await acceptPriceQuoteApi({
				estimate_id: id,
				customer_id: customerId,
			});
			notyf.success('Price Quotes Accepted');
			navigate(`/customer-portal/${customerId}/sales-orders`);
			getSpecificPriceQuote();
		} catch (error) {
			console.log('errors', error?.data?.message.error);
			setErrors(error?.data?.message?.error);
		} finally {
			setbtnLoading2(false);
		}
	};

	const decline = async () => {
		try {
			setbtnLoading(true);
			const resp = await declinePriceQuoteApi({
				estimate_id: id,
				customer_id: customerId,
			});
			notyf.success('Price Quotes Declined');
			getSpecificPriceQuote();
		} catch (error) {
			console.log('errors', error?.data?.message.error);
			setErrors(error?.data?.message?.error);
		} finally {
			setbtnLoading2(false);
		}
	};

	const downloadingPdf = async () => {
		try {
			// const decId =  decryptId(id);
			const resp = await downloadCustomerPriceQuoteApi({
				id,
				customer_id: customerId,
			});
			window.open(resp?.data?.url, '_blank');
		} catch (error) {}
	};

	const columns = [
		{ id: '', label: 'No.', key: 'index' },
		{ id: '', label: 'Items Description', key: 'item_name' },
		{ id: '', label: 'Qty', key: 'quantity' },
		{ id: '', label: 'Rate(USD)', key: 'rate' },
		{ id: '', label: 'Amount(USD)', key: 'total' },
	];
	const info = [
		{ label: 'Price Quote Ref:', value: priceQuote?.estimate_number || '' },
		{
			label: 'Price Quote Date:',
			value: priceQuote?.estimate_date && formatDate(priceQuote?.estimate_date),
		},
		{
			label: 'Validity:',
			value: priceQuote?.term?.term_name || '--',
		},
	];

	return (
		<Grid ccontainer>
			<Grid item sm={12}>
				<HeaderPaper
					sx={{
						paddingLeft: '2rem',
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Typography variant='h6'>Price Quote</Typography>
					<IconButton onClick={() => navagating()}>
						<CloseIcon />
					</IconButton>
				</HeaderPaper>
			</Grid>
			{isLoading ? (
				<OverlayLoader open={isLoading} />
			) : (
				<Paper>
					<Grid item container my={2} display='flex' justifyContent='center'>
						<CustomerStatus
							errors={errors}
							status={priceQuote?.status}
							accept={accept}
							decline={decline}
							btnLoading={btnLoading}
							btnLoading2={btnLoading2}
						/>
					</Grid>
					<Grid
						item
						container
						sx={{ position: 'relative' }}
						display='flex'
						justifyContent='center'
					>
						<Grid item sm={9} mt={2}>
							<ViewTemplates
								title='Price Quote'
								apiData={priceQuote}
								data={priceQuote?.estimate_items}
								itemsColumns={columns}
								headerInfo={info}
								downloadingPdf={downloadingPdf}
								download
							/>
						</Grid>
					</Grid>
				</Paper>
			)}
		</Grid>
	);
};

export default ViewPriceQuote;
