import React, { Suspense } from 'react';
import Box from '@mui/system/Box';
import { lazy } from 'react';
import ComponentLoader from '../Loaders/ComponentLoader';
// const SkeletonView = lazy(() => import('../Skeleton/SkeletonView'));
import SkeletonView from '../Skeleton/SkeletonView';

function DetailViewContainer({ children }) {
	return (
		<Box
			sx={{
				width: '100%',
				height: 'calc(100vh - 80px)',
				overflow: 'auto',
			}}
		>
			<Suspense fallback={<SkeletonView />}>{children}</Suspense>
		</Box>
	);
}

export default DetailViewContainer;
