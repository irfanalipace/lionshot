import {
	Box,
	Divider,
	Grid,
	IconButton,
	InputBase,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

export const RTIInvoicePDFInput = ({ onChange, value = '', width = 200 }) => {
	return (
		<Paper
			variant='outlined'
			component='form'
			sx={{
				p: '0px 2px',
				display: 'flex',
				alignItems: 'center',
				width: width,
				height: '30px',
				float: 'right',
			}}
		>
			<InputBase
				value={value}
				onChange={onChange}
				sx={{ ml: 1, flex: 1, height: '10px' }}
				placeholder='0.00'
				inputProps={{
					'aria-label': '0.00',
				}}
			/>

			<Divider sx={{ height: 27, m: 0.5 }} orientation='vertical' />

			<IconButton color='primary' sx={{ p: '1px' }} aria-label='directions'>
				<MonetizationOnIcon sx={{ color: 'gray' }} />
			</IconButton>
		</Paper>
	);
};

export const Calculation = ({
	text = true,
	bold = false,
	name = 'Name',
	border = true,
	children,
}) => {
	return (
		<Box
			sx={{
				borderBottom: `${border ? '1px solid lightGray' : 'none'} `,
				py: '10px',
			}}
			width={300}
		>
			<Box
				width={220}
				sx={{ float: 'right' }}
				display='flex'
				justifyContent='space-between'
				alignItems='center'
			>
				<Box textAlign={'right'} width={70}>
					<Typography variant={bold ? 'h6' : 'body2'}>{name}</Typography>
				</Box>
				{text ? <Typography variant='body2'>{children}</Typography> : children}
			</Box>
		</Box>
	);
};

export const Column = ({ sx = {}, take, name = '', value = '--' }) => {
	return (
		<Grid sx={sx} item xs={take} display={'flex'} flexDirection={'column'}>
			<Typography variant='body2Bold' fontWeight={700}>
				{name}
			</Typography>
			<Typography mt={1} variant='body2Grey' color='#000000'>
				{value}
			</Typography>
		</Grid>
	);
};

export const InvoiceInfo = ({ name = 'key', value = 'value' }) => {
	return (
		<Stack direction='row' spacing={1} justifyContent='space-between'>
			<Grid item sm={6} container direction='row'>
				<Typography fontSize={13} variant='templateBody2'>
					{`${name}`}
				</Typography>
			</Grid>

			<Grid
				item
				sm={6}
				display={'flex'}
				justifyContent={'end'}
				alignItems={'center'}
			>
				<Typography
					variant='body2'
					style={{
						textTransform: 'capitalize',
					}}
				>
					{value}
				</Typography>
			</Grid>
		</Stack>
	);
};
