import { useState, useEffect } from 'react';
import {
	Box,
	Card,
	Button,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Chip,
	CardActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FormField from '../InputField/FormField';
import {
	deleteTermsApi,
	getPeymentTermsApi,
	markTermAsDefaultApi,
	storePeymentTermsApi,
} from '../../../core/api/termsTaxesReasonsAuthorities';

function TermsBody({ terms, onClose, onSave }) {
	const [rows, setRows] = useState([
		{
			term_name: '',
			number_of_days: '',
			new: true,
		},
	]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		fetchTerms();
	}, [terms]);

	const fetchTerms = async () => {
		if (terms) {
			setRows(terms);
		}
		let response = await getPeymentTermsApi();
		setRows(response.data);
	};

	const handleAddRow = () => {
		const newRow = {
			term_name: '',
			number_of_days: '',
			new: true,
			is_default: false,
		};
		setRows(rows => [...rows, newRow]);
	};

	const handleDeleteRow = (rowId, rowIndex) => {
		if (rowId) deleteTermApi(rowId);
		else
			setRows(prevValues =>
				prevValues?.filter((row, index) => index !== rowIndex)
			);
	};

	const deleteTermApi = async id => {
		try {
			setIsLoading(true);
			await deleteTermsApi(id);
			setRows(prevValues => prevValues?.filter(row => row.id !== id));
		} catch (error) {
			console.log('error', error);
		}
		setIsLoading(false);
	};
	const handleSetDefault = (rowId, rowIndex) => {
		if (rowId) defaultTermApi(rowId);
		else
			setRows(prevValues => {
				prevValues?.find((row, index) => {
					return index === rowIndex;
				});
				let tempRows = prevValues?.map((prev, index) => {
					if (rowIndex !== index)
						return {
							...prev,
							is_default: false,
						};
					else
						return {
							...prev,
							is_default: true,
						};
				});
				return tempRows;
			});
	};

	const defaultTermApi = async id => {
		try {
			setIsLoading(true);
			await markTermAsDefaultApi({ id });
			setRows(prevValues => {
				let tempRows = prevValues?.map(prev => {
					if (id !== prev.id)
						return {
							...prev,
							is_default: false,
						};
					else
						return {
							...prev,
							is_default: true,
						};
				});
				return tempRows;
			});
		} catch (error) {
			console.log('error', error);
		}
		setIsLoading(false);
	};

	const handleSave = async () => {
		try {
			setIsLoading(true);
			await storePeymentTermsApi({ terms: rows });
			if (typeof onClose === 'function') onClose();
			if (typeof onSave === 'function') onSave();
		} catch (error) {
			console.log('error', error);
		}
		setIsLoading(false);
	};

	const handleChange = (key, value, rowIndex) => {
		setRows(prevValues => {
			let tempRows = [...prevValues];
			tempRows[rowIndex] = {
				...tempRows[rowIndex],
				[key]: value,
			};
			return tempRows;
		});
	};
	return (
		<Box bgcolor='#f3f3f3' padding='10px 10px'>
			<Card
				sx={{
					p: 1,
					boxShadow: 0,
					borderRadius: '10px',
				}}
			>
				<Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell sx={{ padding: 0 }}>
									<Typography variant='subtitle2'>Term Name</Typography>
								</TableCell>
								<TableCell sx={{ padding: 0 }}>
									<Typography variant='subtitle2' align='right'>
										Number Of Days
									</Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows?.map((row, index) => (
								<TableRow key={index}>
									<TableCell sx={{ padding: 0 }}>
										<FormField
											handleChange={e =>
												handleChange('term_name', e?.target?.value, index)
											}
											value={row?.term_name}
										/>
									</TableCell>
									<TableCell sx={{ padding: 0 }}>
										<FormField
											value={row?.number_of_days}
											handleChange={e =>
												handleChange('number_of_days', e?.target?.value, index)
											}
											inputProps={{
												min: 0,
												style: { textAlign: 'right', fontSize: '14px' },
											}}
										/>
									</TableCell>
									<TableCell
										sx={{
											minWidth: '230px',
										}}
									>
										<Box>
											{row?.is_default ? (
												<Chip
													sx={{ width: '110px' }}
													color='success'
													label='Default'
												/>
											) : (
												<Button disabled={isLoading}>
													<Typography
														variant='caption'
														onClick={() => handleSetDefault(row?.id, index)}
													>
														Set As Default
													</Typography>
												</Button>
											)}

											<Button
												startIcon={<DeleteIcon />}
												color='error'
												disabled={isLoading}
											>
												<Typography
													variant='caption'
													onClick={() => handleDeleteRow(row?.id, index)}
												>
													Delete
												</Typography>
											</Button>
										</Box>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>

				<Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddRow}>
					<Typography variant='caption'>Add New Row</Typography>
				</Button>
				<CardActions>
					<Button
						disabled={isLoading}
						onClick={handleSave}
						variant='contained'
						color='primary'
					>
						Save
					</Button>
					<Button
						onClick={onClose}
						variant='contained'
						disabled={isLoading}
						sx={{ backgroundColor: 'gray' }}
					>
						Cancel
					</Button>
				</CardActions>
			</Card>
		</Box>
	);
}

export default TermsBody;
