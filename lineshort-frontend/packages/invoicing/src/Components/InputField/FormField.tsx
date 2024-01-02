import React, { useState } from 'react';
import {
	TextField as MuiTextField,
	InputAdornment,
	IconButton,
	MenuItem,
	Typography,
	TextFieldProps,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import Skeleton from '@mui/material/Skeleton';

interface Option {
	value: string;
	text: string;
}

interface FormFieldProps {
	id?: string;
	type?: 'text' | 'select' | 'number' | 'date';
	name?: string;
	fullWidth?: boolean;
	label?: string;
	multiline?: boolean;
	size?: 'small' | 'medium';
	rows?: number;
	placeholder?: string;
	options?: Option[];
	error?: any;
	password?: boolean;
	isTouched?: boolean;
	InputProps?: any;
	value?: any;
	sx?: any;
	disabled?: any;
	SelectProps?: any;
	handleChange?: any;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	style?: React.CSSProperties;
	variant?: any; // You can adjust this type accordingly
	fontSize?: string;
	loading?: boolean;
	minDate?: any;
	onBlur?: (e: any) => void;
}

const FormField: React.FC<FormFieldProps> = ({
	id,
	type,
	minDate = '',
	name,
	size,
	variant,
	error,
	isTouched,
	handleChange,
	onBlur,
	fullWidth,
	options,
	password,
	placeholder,
	InputProps,
	disabled,
	sx,
	style,
	loading,
	...otherProps
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const configSelect: TextFieldProps = {
		id,
		name: name || id,
		select: true,
		fullWidth: fullWidth || false,
		onChange: handleChange,
		onBlur: onBlur,
		size: size || 'small',
		...otherProps,
	};

	if (isTouched && error) {
		configSelect.error = true;
		configSelect.helperText = error;
	}

	const configTextField: TextFieldProps = {
		id,
		name: name || id,
		fullWidth: true,
		onChange: handleChange,
		onBlur: onBlur,
		type: showPassword
			? 'text'
			: type === 'text'
			? 'text'
			: type === 'number'
			? 'number'
			: 'password',
		size: size || 'small',
		...otherProps,
	};

	if (isTouched && error) {
		configTextField.error = true;
		configTextField.helperText = error;
	}

	return (
		<>
			{
				type === 'select' ? (
					<MuiTextField sx={{ ...sx }} {...configSelect}>
						{options?.map(option => (
							<MenuItem key={option?.value} value={option?.value}>
								<Typography sx={{ textTransform: 'capitalize' }}>
									{option?.text}
								</Typography>
							</MenuItem>
						))}
					</MuiTextField>
				) : (
					//for show sketon while data is fetching in case of edit form

					<MuiTextField
						placeholder={placeholder}
						{...configTextField}
						disabled={disabled}
						type={type}
						InputProps={{
							inputProps: { min: minDate || '' },
							...(password
								? {
										endAdornment: (
											<InputAdornment position='end'>
												<IconButton
													onClick={() => setShowPassword(prevShow => !prevShow)}
													edge='end'
												>
													{showPassword ? (
														<VisibilityIcon />
													) : (
														<VisibilityOffIcon />
													)}
												</IconButton>
											</InputAdornment>
										),
								  }
								: {}),
							...InputProps,
						}}
						sx={sx}
						style={{ ...style }}
					/>
				)

				//for show sketon while data is fetching in case of edit form
				// : (
				// 	<Skeleton variant='text' sx={{ fontSize: '2.1rem' }} />
				// )
			}
		</>
	);
};

export default FormField;
