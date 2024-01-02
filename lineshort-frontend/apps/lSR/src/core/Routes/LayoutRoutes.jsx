import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute, routes } from './Routes';
import AsideWrapper from '../../views/Components/Asides/AsideWrapper';

export const PagesRoutes = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={'pageRoute-' + index}
          path={route.path}
          element={route.page}
        />
      ))}
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Navigate to='/home' />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export const HeaderRoutes = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={'headerRoute-' + index}
          path={route.path}
          element={route.header || <></>}
        />
      ))}
    </Routes>
  );
};

export const FooterRoutes = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={'footerRoute-' + index}
          path={route.path}
          element={route.footer || <></>}
        />
      ))}
    </Routes>
  );
};

export const AsideRoutes = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={'asideRoute-' + index}
          path={route.path}
          element={
            route?.aside ? <AsideWrapper>{route.aside}</AsideWrapper> : <></>
          }
        />
      ))}
    </Routes>
  );
};
