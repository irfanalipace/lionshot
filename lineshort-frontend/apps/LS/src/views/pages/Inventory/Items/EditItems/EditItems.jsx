import { Grid, IconButton, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ItemsForm from '../ItemsForm/ItemsForm';
import HeaderPaper from '../../../../Components/Containers/HeaderPaper';
import { mapResponseAccordingToFormik } from '../utils';
import { itemsSingleApi } from '../../../../../core/api/items';
import { useParams } from 'react-router-dom';
import { decryptId, goBack } from '../../../../../core/utils/helpers';

const EditItems = () => {
	const navigate = useNavigate();
	const [items, setItems] = useState();
	const { id } = useParams();

	async function fetchItems() {
		let response = await itemsSingleApi(decryptId(id));
		const data = mapResponseAccordingToFormik(response);
		setItems(data);
	}
	useEffect(() => {
		fetchItems();
	}, [id]);

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
					<Typography variant='h6'>Edit Items </Typography>
					<IconButton onClick={() => goBack(() => navigate('/items'))}>
						<CloseIcon />
					</IconButton>
				</HeaderPaper>
			</Grid>
			<ItemsForm isEdit data={items} />
		</Grid>
	);
};

export default EditItems;
