import { Box, Stack, Typography } from '@mui/material';
import FormField from '../InputField/FormField';
import { useEffect, useState } from 'react';
import notyf from '../NotificationMessage/notyfInstance';
import { formatDateToYYYYMMDD } from '../../../core/utils/helpers';
function DateRangeHeader({ setSearchPram }) {
	const [formValues, setFormValues] = useState({
		dateFrom: '',
		dateTo: '',
	});
	useEffect(() => {
		console.log('FormValues', formValues);

		try {
			// Set search parameters for the API call
			setSearchPram({
				start_date: formValues.dateFrom,
				end_date: formValues.dateTo,
			});
			// setRefresh(prev => prev + 1);
		} catch (error) {
			if (error?.data?.errors && Object.keys(error?.data?.errors)?.length > 0)
				console.log(error?.data?.errors);
			else notyf.error(error.data);
		} finally {
			('empty');
		}
	}, [formValues]);

	// Handle changes in form fields
	const handleFormFieldChange = (fieldName, value) => {
		setFormValues(prevValues => ({
			...prevValues,
			[fieldName]: value,
		}));
	};

	return (
		<>
			<Typography variant='body1' fontWeight={500} ml={3} mb={3} pt={2}>
				Date Range
			</Typography>
			<Stack direction={'row'} ml={3}>
				<Box sx={{ width: '15%' }}>
					<FormField
						type='date'
						name='date_from'
						size='small'
						value={formValues.dateFrom}
						onChange={e => handleFormFieldChange('dateFrom', e.target.value)}
						inputProps={{
							// max: formValues.dateTo,
							max: formatDateToYYYYMMDD(new Date()),
						}}
						InputLabelProps={{
							shrink: true,
						}}
						fullWidth
						label='From'
					/>
				</Box>
				<Box sx={{ width: '15%' }} ml={3}>
					<FormField
						type='date'
						name='date_to'
						size='small'
						inputProps={{
							min: formValues.dateFrom,
							max: formatDateToYYYYMMDD(new Date()),
						}}
						InputLabelProps={{
							shrink: true,
						}}
						value={formValues.dateTo}
						onChange={e => handleFormFieldChange('dateTo', e.target.value)}
						fullWidth
						label='To'
					/>
				</Box>
			</Stack>
		</>
	);
}

export default DateRangeHeader;
