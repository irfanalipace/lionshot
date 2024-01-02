import React, { useState } from 'react';
import {
	TextField as MuiTextField,
	InputAdornment,
	IconButton,
	MenuItem,
	Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface Option {
	value: string;
	text: string;
}

interface FormFieldProps {
	id?: string;
	type?: string;
	name?: string;
	size?: 'small' | 'medium';
	variant?: 'standard' | 'outlined' | 'filled';
	error?: string;
	isTouched?: boolean;
	handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	fullWidth?: boolean;
	options?: Option[];
	password?: boolean;
	label?: string;
	select?: boolean;
	InputProps?: Record<string, any>;
	multiline?: boolean;
	rows?: number;
	sx?: any;
	style?: React.CSSProperties;
}

const FormField: React.FC<FormFieldProps> = ({
	id,
	type,
	name,
	size,
	variant,
	error,
	isTouched,
	handleChange,
	fullWidth,
	options,
	password,
	InputProps,
	style,
	...otherProps
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const configSelect = {
		id,
		name: name || id,
		select: true,
		fullWidth: fullWidth || false,
		onChange: handleChange,
		size: size || 'small',
		error: false,
		helperText: '',
		...otherProps,
	};

	if (isTouched && error) {
		configSelect.error = true;
		configSelect.helperText = error;
	}

	const configTextField = {
		id,
		name: name || id,
		fullWidth: true,
		onChange: handleChange,
		type: showPassword ? 'text' : type,
		size: size || 'small',
		error: false,
		helperText: '',
		...otherProps,
	};

	if (isTouched && error) {
		configTextField.error = true;
		configTextField.helperText = error;
	}

	return (
		<>
			{type === 'select' ? (
				<MuiTextField {...configSelect}>
					{options?.map(option => (
						<MenuItem key={option.value} value={option.value}>
							<Typography sx={{ textTransform: 'capitalize' }}>
								{option.text}
							</Typography>
						</MenuItem>
					))}
				</MuiTextField>
			) : (
				<MuiTextField
					{...configTextField}
					InputProps={{
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
					style={style}
				/>
			)}
		</>
	);
};

export default FormField;
