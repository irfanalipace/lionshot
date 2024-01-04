import React, { useState } from 'react';
import { TextareaAutosize } from '@mui/base';

const TextArea = ({ placeholder, name, value, onChange, minRows = 2 }) => {
	const [isFocused, setIsFocused] = useState(false);

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};
	return (
		<TextareaAutosize
			minRows={minRows}
			aria-label='textarea'
			className='textarea-autosize'
			style={{
				width: '100%',
				fontSize: '16px',
				fontFamily: 'Roboto',
				border: isFocused
					? '2px solid #1976D2'
					: '1px solid rgba(0, 0, 0, 0.2)',
				padding: '10px',
				outline: 'none',
			}}
			placeholder={placeholder}
			name={name}
			value={value || ''}
			onChange={onChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
		/>
	);
};

export default TextArea;
