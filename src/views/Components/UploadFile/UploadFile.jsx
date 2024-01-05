import React, { useRef, useState } from 'react';
import { Button, Typography, Paper } from '@mui/material';

const UploadFile = ({
	id,
	name,
	accept,
	label,
	value,
	onChange,
	isUrl,
	setUrl,
}) => {
	const fileInputRef = useRef(null);
	const [newImageUrl, setNewImageUrl] = useState('');

	const handleFileInputChange = event => {
		const selectedFile = event.target.files[0];
		if (isUrl) {
			console.log('isUrl', isUrl);
			// If isUrl is true, set the new URL to the state variable
			if (onChange) {
				onChange(selectedFile);
			}
			if (setUrl && selectedFile) {
				const imageUrl = URL.createObjectURL(selectedFile);
				setUrl(imageUrl);
			}
		} else if (!isUrl) {
      
			if (onChange) {
				onChange(selectedFile);
			}
		}
		// else {
		// 	// If isUrl is true, the user is trying to upload a new image URL
		// 	// You can handle setting the URL using the setUrl function
		// 	if (setUrl && selectedFile) {
		// 		const imageUrl = URL.createObjectURL(selectedFile);
		// 		setUrl(imageUrl);
		// 	}
		// }
	};

	const handleFileInputClick = () => {
		fileInputRef.current.click();
	};

	return (
		<div>
			<input
				type='file'
				id={id}
				name={name}
				accept={accept}
				ref={fileInputRef}
				style={{ display: 'none' }}
				onChange={handleFileInputChange}
			/>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Button
					variant='contained'
					color='primary'
					onClick={handleFileInputClick}
				>
					{label}
				</Button>
				{value && value instanceof File && (
					<Paper
						elevation={1}
						style={{
							display: 'flex',
							alignItems: 'center',
							maxWidth: '40px',
							maxHeight: '40px',
						}}
					>
						<img
							src={URL.createObjectURL( value)}
							//     alt="Uploaded File"
							style={{ maxWidth: '100%', maxHeight: '100%' }}
						/>
					</Paper>
				)}
				{isUrl && (
					<Paper
						elevation={1}
						style={{
							display: 'flex',
							alignItems: 'center',
							maxWidth: '40px',
							maxHeight: '40px',
						}}
					>
						<img
							src={value}
							//   alt="Uploaded File"
							style={{ maxWidth: '100%', maxHeight: '100%' }}
						/>
					</Paper>
				)}
			</div>
		</div>
	);
};

export default UploadFile;
