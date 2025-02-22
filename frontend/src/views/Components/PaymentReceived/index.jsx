import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Grid,
	Table,
	TableBody,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { TableBodyCell, TableHeadCell } from '../Table/Table';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import { formatDate } from '../../../core/utils/helpers';

export default function PaymentReceived({
	title = 'Payment Receivable',
	payment_receiveds,
}) {
	return (
		<Accordion>
			<AccordionSummary
				expandIcon={<ArrowDropDown />}
				aria-controls='panel2a-content'
				id='panel2a-header'
			>
				<Typography variant='body1'>{title}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Grid item container>
					<Grid sm={12}>
						<TableContainer>
							<Table sx={{ minWidth: 650 }} aria-label='simple table'>
								<TableHead>
									<TableRow>
										<TableHeadCell>Date</TableHeadCell>
										<TableHeadCell>Payment#</TableHeadCell>
										<TableHeadCell>Reference#</TableHeadCell>
										<TableHeadCell>Payment Mode</TableHeadCell>
										<TableHeadCell>Amount</TableHeadCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{payment_receiveds?.map((item, indx) => {
										return (
											<TableRow
												key={indx}
												sx={{
													'&:last-child td, &:last-child th': {
														border: 0,
													},
												}}
											>
												<TableBodyCell component='th' scope='row'>
													{formatDate(item?.account_payable?.payment_date)}
												</TableBodyCell>

												<TableBodyCell component='th' scope='row'>
													{item?.account_payable?.payment_number}
												</TableBodyCell>

												<TableBodyCell component='th' scope='row'>
													{item?.account_payable?.reference_number}
												</TableBodyCell>

												<TableBodyCell component='th' scope='row'>
													{item?.account_payable?.payment_mode_value}
												</TableBodyCell>

												<TableBodyCell component='th' scope='row'>
													${item.amount}
												</TableBodyCell>
											</TableRow>
										);
									})}

									{payment_receiveds?.length === 0 && (
										<TableRow>
											<TableBodyCell align='center' colSpan={10}>
												<Typography variant='body1'>No Data Found</Typography>
											</TableBodyCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
				</Grid>
			</AccordionDetails>
		</Accordion>
	);
}
