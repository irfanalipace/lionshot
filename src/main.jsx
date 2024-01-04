import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
const App = lazy(() => import('./App.jsx'));
import './index.css';
import AppLoader from './views/Components/Loaders/AppLoader';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback={<AppLoader />}>
    <App />
  </Suspense>
);
