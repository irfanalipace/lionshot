import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';
export default function BankCreditCard(props) {
	const { title, bankDetalis, addBankAccount } = props;

	return (
		<Box>
			<Card
				variant='outlined'
				sx={{ width: '520px', height: '548px', marginTop: '44px' }}
			>
				<CardContent>
					<Typography variant='h6'>
						{title}{' '}
						<HoverPopover text='Bank and Credit Cards'>
							<HelpOutlineIcon sx={{ color: 'gray', fontSize: '12px' }} />
						</HoverPopover>
					</Typography>
					<Divider sx={{ marginBottom: '12px', marginTop: '12px' }}></Divider>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							marginTop: '200px',
						}}
					>
						<Typography variant='h6' sx={{ textAlign: 'center' }}>
							{bankDetalis}
						</Typography>
						<Button sx={{ color: '#00afdced', padding: '0px', border: '0px' }}>
							{addBankAccount}
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
