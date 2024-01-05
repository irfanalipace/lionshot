import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {
	Button,
	CardActions,
	Grid,
} from '@mui/material';

const CardItems = ({ img, handleClick, name, loading, disabled }) => {
	return (
		<Card
			sx={{
				width: 360,
				padding: '20px 20px 0px 20px',
				backgroundColor: '#f6f6f6',
				height: 275,
			}}
		>
			<div
				style={{
					boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
					borderRadius: '8px',
					backgroundColor: '#fff',
				}}
			>
				<CardMedia
					style={{
						borderRadius: '8px',
						padding: 50,
						backgroundColor: '#fff',
						objectFit: 'cover',
					}}
					component='img'
					alt='green iguana'
					height='180'
					image={img}
				/>
			</div>
			<CardActions>
				<Grid container justifyContent='space-between'>
					<Grid item  mt={2}>
						<Typography variant='h6' sx={{ color: '#00000099' }}>
							{name}
						</Typography>
					</Grid>
					<Grid item mt={2}>
						<Button
							variant='contained'
							size='small'
							onClick={handleClick}
							disabled={loading || disabled}
						>
							{loading ? 'Loading...' : `Add`}
						</Button>
					</Grid>
				</Grid>
			</CardActions>
		</Card>
	);
};

export default CardItems;
