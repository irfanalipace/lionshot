import { Box, Paper, Typography } from '@mui/material';
import React, { Component } from 'react';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

const withErrorBoundary = WrappedComponent => {
	return class ErrorBoundary extends Component {
		constructor(props) {
			super(props);
			this.state = { hasError: false };
		}

		componentDidCatch(error, errorInfo) {
			console.error('Error caught by error boundary:', error, errorInfo);
			this.setState({ hasError: true });
			// You can also log the error to a service or perform other actions here
		}

		render() {
			if (this.state.hasError) {
				// You can customize the fallback UI here
				return (
					<Box
						height={'100vh'}
						display={'flex'}
						alignItems={'center'}
						justifyContent={'center'}
					>
						<Paper
							elevation={24}
							sx={{ p: 3, display: 'flex', alignItems: 'center' }}
						>
							<Typography variant='h5'>Something went wrong.</Typography>
							<BrokenImageIcon color='red' sx={{ color: 'red', ml: 3 }} />
						</Paper>
					</Box>
				);
			}

			return <WrappedComponent {...this.props} />;
		}
	};
};

export default withErrorBoundary;
