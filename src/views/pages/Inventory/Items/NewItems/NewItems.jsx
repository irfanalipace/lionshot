import { Grid, IconButton, Paper, Typography } from '@mui/material';
import React from 'react';

// common comp
import HeaderPaper from '../../../../Components/Containers/HeaderPaper';

// icons
import CloseIcon from '@mui/icons-material/Close';
import ItemsForm from '../ItemsForm/ItemsForm';
import { useNavigate } from 'react-router-dom';
import { goBack } from '../../../../../core/utils/helpers';

const NewItems = () => {
	const navigate = useNavigate();
	return (
		<Grid container>
			<Grid item sm={12}>
				<HeaderPaper
					sx={{
						paddingLeft: '2rem',
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Typography variant='h6'>New Item </Typography>
					<IconButton onClick={() => goBack(() => navigate('/items'))}>
						<CloseIcon />
					</IconButton>
				</HeaderPaper>
			</Grid>
			<ItemsForm />
		</Grid>
	);
};

export default NewItems;
