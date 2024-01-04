import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import TestViewList from './TestViewList';
import TestListViewDetails from './TestListViewDetails';

function TestViewRoutes() {
  const location = useLocation();
  const { pathname } = location;
  return (
    <Routes>
      <Route path={'/'} element={<TestViewList />} />
      <Route path={pathname + '/:id'} element={<TestListViewDetails />} />
    </Routes>
  );
}

export default TestViewRoutes;
