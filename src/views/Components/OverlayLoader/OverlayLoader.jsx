import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
const OverlayLoader = ({ open }) => {
	return (
		<Backdrop
			sx={{
				backgroundColor: 'rgba(217, 230, 243, 0.3)',
				position: 'absolute',
				maxHeight: 'calc(100vh - 90px)',
				zIndex: theme => theme.zIndex.drawer + 1,
			}}
			open={open}
		>
			<CircularProgress color='inherit' />
		</Backdrop>
	);
};

export default OverlayLoader;
