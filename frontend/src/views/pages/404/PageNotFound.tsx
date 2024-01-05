import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

export default function PageNotFound() {
	// Check if there is a previous state in the history

	return (
		<Suspense
			fallback={
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						minHeight: '100vh',
					}}
				>
					<CircularProgress
						sx={{
							width: '135px',
							height: '135px',
							'& svg': {
								strokeWidth: '24px',
							},
						}}
					/>
				</div>
			}
		>
			<div
				style={{
					height: '100vh',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<h1>404</h1>
				<h2>OOPS!</h2>
				<h3>Page Not Found</h3>
				<Button component={Link} to={'/'}>
					Go Back To Home Page
				</Button>
			</div>
		</Suspense>
	);
}
