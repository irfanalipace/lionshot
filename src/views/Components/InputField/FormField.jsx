import { useState } from 'react';
import MuiTextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

const maxValue = 100000;

const FormField = ({
	id,
	type,
	name,
	size,
	error,
	isTouched,
	handleChange,
	fullWidth,
	options,
	password,
	icon,
	InputProps,
	style,
	selectbutton,
	SelectProps,
	sx,
	disabled, // Add disabled prop
	characterCount = 255,
	onChange,
	...otherProps
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const configSelect = {
		id,
		name: name || id,
		select: true,
		fullWidth: fullWidth || false,
		onChange: typeof handleChange === 'function' ? handleChange : onChange,
		size: size || 'small',
		disabled: disabled || false, // Set the disabled prop
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
		onChange: e => {
			let inputValue = e.target.value;

			if (type === 'number') {
				const regex = /^\d*\.?\d{0,2}$/;
				if (!regex.test(inputValue) || inputValue > maxValue) {
					// If the input is not valid, prevent updating the state
					return;
				} else {
					if (typeof handleChange === 'function') handleChange(e);
					if (typeof onChange === 'function') onChange(e);
				}
			} else {
				if (typeof handleChange === 'function') handleChange(e);
				if (typeof onChange === 'function') onChange(e);
			}
		},
		type: showPassword ? 'text' : type,
		size: size || 'small',
		InputProps: {
			style: {
				fontSize: style?.fontSize ? style?.fontSize : '16px',
				backgroundColor: disabled ? '#e0e0e0' : '#ffffff',
				// color:'grey'
			},
			...InputProps,
		},
		disabled: disabled || false, // Set the disabled prop
		InputLabelProps: {
			style: {
				fontSize: '16px',
			},
		},
		maxLength: characterCount,
		...otherProps,
	};

	if (isTouched && error) {
		configTextField.error = true;
		configTextField.helperText = error;
	}

	return (
		<>
			{type === 'select' ? (
				<MuiTextField
					{...configSelect}
					// SelectProps={{ IconComponent: () => null }}
					SelectProps={{
						MenuProps: { PaperProps: { style: { maxHeight: '250px' } } },
						...SelectProps,
					}}
					InputLabelProps={{
						style: {
							fontSize: '16px',
						},
					}}
					sx={{
						'& .MuiInputBase-root': {
							// top: "3px",
							'& .MuiSelect-select': {
								padding: '8.5px 14px',
								fontSize: '14px',
							},
						},
						...sx,
					}}
				>
					{options?.map(option => (
						<MenuItem key={option?.value} value={option?.value}>
							<Typography
								sx={{ textTransform: 'capitalize', fontSize: '16px' }}
							>
								{option?.text}
							</Typography>
						</MenuItem>
					))}
					{selectbutton && (
						<Typography
							sx={{
								position: 'sticky',
								bottom: '0',
								width: '100%',
								backgroundColor: 'white',
							}}
						>
							{selectbutton}
						</Typography>
					)}
				</MuiTextField>
			) : type === 'textarea' ? (
				<MuiTextField
					multiline
					rows={2}
					inputProps={{
						maxLength: characterCount,
						...configTextField.InputProps,
					}}
					style={style}
					sx={{
						'& .MuiOutlinedInput-root': {
							padding: 0,
							fontSize: '16px !important',
						},
						'& .MuiInputBase-input': {
							padding: '7px',
							fontSize: '16px !important',
						},
						color: 'red',
						...sx,
					}}
					{...configTextField}
				/>
			) : (
				<MuiTextField {...configTextField} style={style} sx={sx} />
			)}
		</>
	);
};

export default FormField;
