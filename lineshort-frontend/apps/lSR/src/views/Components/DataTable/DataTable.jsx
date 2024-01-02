import { Suspense } from 'react';
import lazy from 'components/LazyLoadWithRetry/LazyLoadWithRetry.jsx';
// import ComponentLoader from '../../Components/Loaders/ComponentLoader';
const MReactTable = lazy(() => import('./MaterialReactTable'));
// const SkeletonSidebar = lazy(() => import('../Skeleton/SkeletonSidebar'));
import SkeletonSidebar from '../Skeleton/SkeletonSidebar';
import DataTableSkeleton from '../Skeleton/DataTableSkeleton';

const DataTable = props => {
  return (
    <Suspense
      fallback={props.collapsed ? <SkeletonSidebar /> : <DataTableSkeleton />}>
      <MReactTable {...props} />
    </Suspense>
  );
};

export default DataTable;
