import { Typography } from '@mui/material';
import { ErrorMessage } from 'formik';
import React from 'react';
import Select, { StylesConfig } from 'react-select';

interface CustomSelectProps {
	id: string;
	value: any;
	label?: string; // You can add a type for label if needed
	isDisabled?: boolean;
	placeholder: string;
	options: any[];
	onChange: (value: any) => void;
	touched?: boolean | undefined;
	error?: any; // Error message is optional
	loading: boolean | undefined;
	[key: string]: any; // Allow otherProps to have any additional properties
}

const CustomSelect: React.FC<CustomSelectProps> = ({
	id,
	value,
	label,
	isDisabled,
	placeholder,
	options,
	onChange,
	touched,
	error,
	loading,
	...otherProps
}) => {
	const isError = touched && error;

	// const placeholderStyle = isError ? { color: '#d32f2f' } : {};

	const customStyles: StylesConfig = {
		control: (baseStyles, state) => ({
			...baseStyles,
			fontFamily: 'Roboto',
			background: state.isDisabled ? 'rgba(0,0,0,0.0.1)' : 'transparent',
			borderColor: isError ? '#d32f2f' : 'rgba(0, 0, 0, 0.2)',
		}),

		menu: baseStyles => ({
			...baseStyles,
			zIndex: 9999,
			fontFamily: 'Roboto',
			fontSize: '16px',
		}),
		placeholder: baseStyles => ({
			...baseStyles,
			// ...placeholderStyle,
		}),
	};

	return (
		<>
			<Select
				{...otherProps} // other props like multi searchable etc
				id={id}
				isLoading={loading}
				placeholder={placeholder}
				isSearchable={true}
				value={value}
				// label={label}
				isDisabled={isDisabled}
				options={options}
				onChange={onChange}
				styles={customStyles}
			/>
			{error && (
				<Typography
					pt={0.5}
					className='Mui-error'
					color='error'
					variant='caption'
				>
					{touched && error ? error : null}
				</Typography>
			)}
		</>
	);
};

export default CustomSelect;
