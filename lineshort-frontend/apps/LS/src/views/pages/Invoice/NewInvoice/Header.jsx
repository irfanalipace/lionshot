import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Typography } from '@mui/material';
import HeaderPaper from 'components/Containers/HeaderPaper';
import { goBack } from 'core/utils/helpers';

export default function Header({ edit }) {
	return (
		<HeaderPaper
			sx={{
				paddingLeft: '2rem',
				display: 'flex',
				justifyContent: 'space-between',
			}}
		>
			<Typography variant='h6'>
				{edit ? 'Edit Invoice' : 'New Invoice'}
			</Typography>
			<IconButton onClick={goBack} aria-label='delete'>
				<CloseIcon fontSize='medium' htmlColor='#0000008F' />
			</IconButton>
		</HeaderPaper>
	);
}
