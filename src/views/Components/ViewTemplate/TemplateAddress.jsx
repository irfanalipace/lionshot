import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';

import {
	TableBody,
	TableBodyCell,
	TableContainer,
	TableHead,
	TableHeadCell,
	TableRow,
} from '../Table/Table';
import { organizationDetails } from '../../../core/utils/constants';

const TemplateAddress = ({
	data,
	headings,
	organizationAddress,
	paymentInfo,
	emailAddress,
}) => {
	const billingAddress = data?.default_billing_address
		? data?.default_billing_address
		: data?.customer_billing_address &&
		  data?.customer_billing_address?.find(item => item.is_default == 1);
	const shipping_Address = data?.default_shipping_address
		? data?.default_shipping_address
		: data?.customer_shipping_address &&
		  data?.customer_shipping_address?.find(item => item.is_default == 1);
	return (
		<Grid item container>
			<Grid item sm={12}>
				<TableContainer>
					<Table sx={{ minWidth: 650 }} aria-label='simple table'>
						<TableHead>
							<TableRow sx={{ backgroundColor: '#f0f0f0' }}>
								<TableHeadCell sx={{ padding: '4px 10px' }}>
									<Typography variant='templateBody2'>
										{/* Bill To */}
										{headings?.first}
									</Typography>
								</TableHeadCell>
								{headings?.second && (
									<TableHeadCell sx={{ padding: '4px 0px' }}>
										<Typography variant='templateBody2'>
											{/* Ship To  */}
											{headings?.second}
										</Typography>
									</TableHeadCell>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableBodyCell
									sx={{ padding: '5px 10px', verticalAlign: 'top' }}
								>
									<Typography variant='body2' component='p'>
										{billingAddress?.attention || ''} <br />{' '}
										{billingAddress?.address || ''} <br />{' '}
										<Typography variant='body2' textTransform={'capitalize'}>
											{billingAddress?.city || ''}
											{', '}
											{billingAddress?.state?.name || 'MN'}
											{', '}
											{billingAddress?.zipcode || ''}{' '}
										</Typography>
										{billingAddress?.country?.name && (
											<Typography variant='body2' textTransform={'capitalize'}>
												{billingAddress?.country?.name || ''} <br />
											</Typography>
										)}
										{billingAddress?.phone && (
											<Typography variant='body2' component='p'>
												{billingAddress?.phone}
											</Typography>
										)}
										{emailAddress && (
											<Typography variant='body2' component='p'>
												{emailAddress}
											</Typography>
										)}
									</Typography>
								</TableBodyCell>

								{shipping_Address && (
									<TableBodyCell
										sx={{ padding: '0px', width: '40%', verticalAlign: 'top' }}
									>
										<Typography variant='body2' component='p'>
											{shipping_Address?.attention || ''} <br />{' '}
											{shipping_Address?.address || ''} <br />{' '}
											<Typography variant='body2' textTransform={'capitalize'}>
												{shipping_Address?.city || ''}
												{', '}
												{shipping_Address?.state?.name || 'MN'}
												{', '}
												{shipping_Address?.zipcode || ''}{' '}
											</Typography>
											{shipping_Address?.country?.name && (
												<Typography
													variant='body2'
													textTransform={'capitalize'}
												>
													{shipping_Address?.country?.name || ''} <br />
												</Typography>
											)}
											{shipping_Address?.phone && (
												<Typography variant='body2' component='p'>
													{shipping_Address?.phone}
												</Typography>
											)}
											{emailAddress && (
												<Typography variant='body2' component='p'>
													{emailAddress}
												</Typography>
											)}
										</Typography>
									</TableBodyCell>
								)}
								{organizationAddress && (
									<TableBodyCell
										sx={{
											padding: '5px 0',
											width: '40%',
											verticalAlign: 'top',
										}}
									>
										<Typography variant='body2'>
											{organizationDetails.address.address} <br />
											{organizationDetails.address.city}
											{', '}
											{organizationDetails.address.stateAbbr}
											{', '}
											{organizationDetails.address.postalCode} <br />{' '}
											{organizationDetails.address.country}
										</Typography>
									</TableBodyCell>
								)}
								{paymentInfo >= 0 && (
									<TableBodyCell
										sx={{ padding: '0px', width: '40%', verticalAlign: 'top' }}
									>
										<Typography variant='templateBody2' fontSize={'25px'}>
											${paymentInfo}
										</Typography>
									</TableBodyCell>
								)}
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</Grid>
	);
};

export default TemplateAddress;
