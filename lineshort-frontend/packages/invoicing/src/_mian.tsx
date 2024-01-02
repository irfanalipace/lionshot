import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './Main';
import React from 'react';

declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		// body2Grey: true;
		// body1bold: true;
		// subtitle2Grey: true;
	}
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<BrowserRouter>{/* <App /> */}</BrowserRouter>
);
