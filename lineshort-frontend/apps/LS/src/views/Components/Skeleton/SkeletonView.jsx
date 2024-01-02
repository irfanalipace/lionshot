import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
export default function SkeletonView() {
	return (
		<Box style={{ display: 'flex', justifyContent: 'center' }}>
			<Stack
				spacing={1}
				style={{ width: '100%', padding: '50px', marginTop: '100px' }}
			>
				{/* Single skeleton in the first line */}
				<Skeleton
					variant='text'
					style={{
						fontSize: '1rem',
						width: '100%',

						marginBottom: '100px',
					}}
				/>

				{/* Second line with two rectangular skeletons and space between them */}

				<Stack spacing={1} direction='row'>
					<Skeleton variant='rectangular' width={550} height={100} />

					{/* Add space between the rectangular skeletons */}
					<div style={{ marginRight: '10px' }} />

					<Skeleton variant='rectangular' width={460} height={100} />
				</Stack>
				<Skeleton
					variant='text'
					style={{
						marginTop: '35px',
						height: '14px',
					}}
				/>
				<Skeleton
					variant='text'
					style={{
						height: '14px',
						marginTop: '30px',
					}}
				/>
				<Skeleton
					variant='text'
					style={{
						height: '14px',
						marginTop: '30px',
					}}
				/>
				<Skeleton
					variant='text'
					style={{
						height: '14px',
						marginTop: '30px',
					}}
				/>
			</Stack>
		</Box>
	);
}
