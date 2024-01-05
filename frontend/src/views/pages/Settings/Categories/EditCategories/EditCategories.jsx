import { Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// common comp
import HeaderPaper from '../../../../Components/Containers/HeaderPaper';

// icons
import CloseIcon from '@mui/icons-material/Close';
import CategoriesForm from '../CategoryForm';

const EditCategories = () => {
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
					<Typography variant='h6'>Edit Categories</Typography>
					<IconButton onClick={() => navigate('/categories')}>
						<CloseIcon />
					</IconButton>
				</HeaderPaper>
			</Grid>
			<Grid item sm={12}>
				<CategoriesForm />
			</Grid>
		</Grid>
	);
};

export default EditCategories;
