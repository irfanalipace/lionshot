import { Routes, Route, Link } from 'react-router-dom';
import Invoicing from './Invoicing';
import NewInvoice from '@/Pages/NewInvoice';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ApiService from '@/utils/apiService';
import './App.module.css';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import React from 'react';
import SendInvoiceEmailForm from '@/Pages/ViewInvoice/SendInvoiceMailForm';
import { Container, Typography, Button, CssBaseline, Box } from '@mui/material';
import { createInvoiceApi } from './apis/invoice';
import { OriginValue } from './config/enum';

const NotFound = () => {
	return (
		<Container component='main' maxWidth='sm'>
			<CssBaseline />
			<Box
				display={'flex'}
				height={'100vh'}
				justifyContent={'center'}
				alignItems={'center'}
				flexDirection={'column'}
				gap={2}
			>
				<Typography component='h1' variant='h4'>
					404 - Page Not Found
				</Typography>
				<Typography variant='body1'>
					The page you are looking for does not exist or has been moved.
				</Typography>
				<Link to='/invoices'>
					<Button variant='contained' color='primary'>
						Go back to the home page
					</Button>
				</Link>
			</Box>
		</Container>
	);
};
declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		body2Grey: true;
		subtitle2Grey: true;
		body1bold: true;
		templateBody: true;
		templateBody2: true;
		templateHead: true;
		body2Bold: true;
	}
}

type Origins = OriginValue.Minnesota | OriginValue.Rti;

interface InvoiceProps {
	theme?: any;
	origin?: Origins;
	token?: string; // Assuming 'token' is a string, update the type if necessary
	getToken: () => string;
}

console.log('MODE IS: ', import.meta.env.MODE);
console.log('isDev: ', import.meta.env.DEV);
console.log('isProd: ', import.meta.env.PROD);
console.log('BaseUrl: ', import.meta.env.VITE_APP_BASE_URL);
console.log('package env: ', import.meta.env.VITE_APP_PACKAGE_ENVIRONMENT);

const themes = createTheme({
	typography: {
		fontFamily: 'Roboto, Arial',
		h1: {
			fontSize: '96px',
			fontWeight: 300,
		},
		h2: {
			fontWeight: 300,
			fontSize: '60px',
		},
		h3: {
			fontWeight: 400,
			fontSize: '48px',
		},
		h4: {
			fontWeight: 400,
			fontSize: '34px',
		},
		h5: {
			fontWeight: 400,
			fontSize: '24px',
		},
		h6: {
			fontWeight: 500,
			fontSize: '20px',
		},
		subtitle1: {
			fontWeight: 400,
			fontSize: '16px',
		},
		subtitle2: {
			fontWeight: 500,
			fontSize: '14px',
		},
		// @ts-ignore
		subtitle2Grey: {
			fontFamily: 'roboto',
			fontWeight: 500,
			fontSize: '14px',
			color: '#707070',
			lineHeight: '20.02px',
			letterSpacing: '0.17px',
		},
		body1: {
			fontWeight: 400,
			fontSize: '16px',
			lineHeight: '24px',
			letterSpacing: '0.15px',
		},
		body1bold: {
			fontFamily: 'roboto',
			fontWeight: 500,
			fontSize: '16px',
			lineHeight: '24px',
			letterSpacing: '0.15px',
		},
		body2: {
			fontWeight: 400,
			fontSize: '14px',
		},
		body2Bold: {
			fontWeight: 500,
			fontSize: '14px',
			fontFamily: 'roboto',
		},
		body2Grey: {
			fontFamily: 'roboto',
			fontWeight: 400,
			fontSize: '14px',
			color: '#707070',
			lineHeight: '20.02px',
			letterSpacing: '0.17px',
		},
		caption: {
			fontWeight: 400,
			fontSize: '12px',
		},
		captionGrey: {
			fontFamily: 'roboto',
			fontWeight: 400,
			fontSize: '12px',
			lineHeight: '19.92px',
			letterSpacing: '0.4px',
			color: '#707070',
		},
		overline: {
			fontWeight: 500,
			fontSize: '12px',
		},
		formikError: {
			fontFamily: 'roboto',
			fontWeight: 500,
			fontSize: '14px',
			color: 'red',
			lineHeight: '20.02px',
			letterSpacing: '0.17px',
		},
		templateBody: {
			fontFamily: 'Poppins',
			fontSize: '12px',
		},
		templateBody2: {
			fontFamily: 'Poppins',
			fontWeight: '600',
		},
		templateHead: {
			fontFamily: 'Rajdhani',
		},
	},
});

let Invoice: React.FC<InvoiceProps> = () => {
	return <></>;
};

// Development

if (import.meta.env.DEV && import.meta.env.VITE_APP_PACKAGE_ENVIRONMENT) {
	const getToken = () => import.meta.env.VITE_APP_AUTH_TOKEN || '';
	ApiService.init(getToken);

	ReactDOM.createRoot(document.getElementById('root')).render(
		<BrowserRouter>
			<ThemeProvider theme={themes}>
				<Routes>
					<Route
						path='/'
						element={<Invoicing origin={OriginValue.Minnesota} />}
					/>
					<Route path='/new' element={<NewInvoice edit={false} />} />
					<Route path='/edit/:id' element={<NewInvoice edit={true} />} />
					<Route
						path='/send-email/:type/:id'
						element={<SendInvoiceEmailForm />}
					/>
					<Route path='*' element={<NotFound />} />
				</Routes>
			</ThemeProvider>
		</BrowserRouter>
	);
}

// Build
else {
	Invoice = ({
		theme = themes,
		getToken,
		origin = OriginValue.Minnesota,
	}: InvoiceProps) => {
		const tokenRecivedByCallingGetToken = getToken();
		console.log(
			'🚀 ~ file: Main.tsx:220 ~ tokenRecivedByCallingGetToken:',
			tokenRecivedByCallingGetToken
		);

		ApiService.init(getToken);
		return (
			<ThemeProvider theme={theme}>
				<Routes>
					<Route path='/' element={<Invoicing origin={origin} />} />
					{['minnesota'].includes(origin) && (
						<Route path='/new' element={<NewInvoice edit={false} />} />
					)}
					{['minnesota'].includes(origin) && (
						<Route path='/edit/:id' element={<NewInvoice edit={true} />} />
					)}
					<Route
						path='/send-email/:type/:id'
						element={<SendInvoiceEmailForm />}
					/>
					<Route path='*' element={<NotFound />} />
				</Routes>
			</ThemeProvider>
		);
	};
}

export const generateInvoice = async data => {
	const isObjectEmpty = Object.keys(data).length === 0;
	if (isObjectEmpty) {
		return {
			message: 'No data to proceed, Make sure to send the required data',
			success: false,
		};
	} else {
		try {
			const resp: any = await createInvoiceApi({
				...data,
				button_type: 'save_as_draft',
			});
			return {
				success: true,
				response: resp,
			};
		} catch (error) {
			return {
				success: false,
				error: error,
			};
		}
	}
};

export default Invoice;

declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		body2Grey: true;
	}
}
