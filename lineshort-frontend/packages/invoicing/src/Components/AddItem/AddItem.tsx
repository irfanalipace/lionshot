import { useState } from 'react';
import { Box, Grid, Typography, Paper, styled } from '@mui/material';
import useResponsiveStyles from '../../hooks/useMedaiQuery';
import Divider from '@mui/material/Divider';
import FormField from '../Common/Input';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '../MUIButton';
import AddIcon from '@mui/icons-material/Add';
import CreatableSelect from 'react-select/creatable';
import React from 'react';

interface Option {
	readonly label: string;
	readonly value: string;
}

const createOption = (label: string) => ({
	label,
	value: label.toLowerCase().replace(/\W/g, ''),
});

const defaultOptions = [
	createOption('Item One'),
	createOption('Item Two'),
	createOption('Item Three'),
];

const AddRowTitle = styled(Typography)(({ theme }) => ({
	fontSize: useResponsiveStyles().upMedium ? '14px' : '.6rem',
	margin: '1rem 0',
}));

export default function AddItem() {
	const [rows, setRows] = useState([
		{
			id: 1,
		},
	]);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [options, setOptions] = useState(defaultOptions);
	const [value, setValue] = useState<Option | null>();

	const handleCreate = (inputValue: string) => {
		setIsLoading(true);
		setTimeout(() => {
			const newOption = createOption(inputValue);
			setIsLoading(false);
			setOptions(prev => [...prev, newOption]);
			setValue(newOption);
		}, 1000);
	};

	const handleDeleteRow = (rowId: number | string) => {
		setRows(prevRows => prevRows.filter(row => row.id !== rowId));
	};

	const handleAddRow = () => {
		const newRow = {
			id: Date.now(),
			itemQuntatiy: 10,
			itemRate: 10,
		};
		setRows(prevRows => [...prevRows, newRow]);
	};

	return (
		<Grid item xs={12}>
			<Grid container spacing={2} sx={{ marginTop: '5rem' }}>
				<Grid item xs={3}>
					<AddRowTitle>Item Details</AddRowTitle>
				</Grid>

				<Grid item xs={2}>
					<AddRowTitle>Qauntity</AddRowTitle>
				</Grid>

				<Grid item xs={2}>
					<AddRowTitle>Rate</AddRowTitle>
				</Grid>

				<Grid item xs={2}>
					<AddRowTitle>Tax</AddRowTitle>
				</Grid>

				<Grid item xs={2}>
					<AddRowTitle>Amount</AddRowTitle>
				</Grid>

				<Grid item xs={1}>
					<AddRowTitle sx={{ textAlign: 'end' }}>Actions</AddRowTitle>
				</Grid>
			</Grid>
			<Divider />
			<Grid container spacing={2}>
				<Grid item xs={3}>
					{rows.map((row, index) => (
						<CreatableSelect
							styles={{
								container: base => ({
									...base,
									padding: 9,
								}),
							}}
							key={index}
							isClearable
							isDisabled={isLoading}
							isLoading={isLoading}
							onChange={newValue => setValue(newValue)}
							onCreateOption={handleCreate}
							options={options}
							value={value}
						/>
					))}
				</Grid>

				<Grid item xs={2}>
					{rows.map((row, index) => (
						<FormField key={index} fullWidth sx={{ my: 1 }} />
					))}
				</Grid>

				<Grid item xs={2}>
					{rows.map((row, index) => (
						<FormField key={index} fullWidth sx={{ my: 1 }} />
					))}
				</Grid>

				<Grid item xs={2}>
					{rows.map((row, index) => (
						<Typography key={index} sx={{ my: 1, mt: 4 }}>
							345
						</Typography>
					))}
				</Grid>

				<Grid item xs={2}>
					{rows.map((row, index) => (
						<Typography key={index} sx={{ my: 1, mt: 4 }}>
							345
						</Typography>
					))}
				</Grid>

				<Grid item xs={1}>
					{rows.map((row, index) => (
						<Box key={index} sx={{ textAlign: 'end', my: 1, mt: 4 }}>
							{rows.length > 1 && (
								<DeleteIcon
									style={{ cursor: 'pointer' }}
									color='primary'
									onClick={() => handleDeleteRow(row.id)}
									fontSize='small'
								/>
							)}
						</Box>
					))}
				</Grid>

				<Grid item xs={12} display='flex' justifyContent='flex-end'>
					{/* @ts-ignore */}
					<Button onClick={handleAddRow} endIcon={<AddIcon />}>
						Add row
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
}
