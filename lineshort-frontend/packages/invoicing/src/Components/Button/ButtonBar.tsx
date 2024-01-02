import { Button, ButtonProps } from '@mui/material';
import './ButtonBar.css';
import React from 'react';

interface ButtonBarProps {
	labelFir: string;
	labelSec: string;
	lableThird: string;
	iconFir: React.ReactNode;
	iconSec: React.ReactNode;
	iconThird: React.ReactNode;
	onClickFir: () => void;
	onClickSec: () => void;
	onClickThird: () => void;
	title?: string;
}

export default function ButtonBar({
	labelFir,
	labelSec,
	lableThird,
	iconFir,
	iconSec,
	iconThird,
	onClickFir,
	onClickSec,
	onClickThird,
	title,
}: ButtonBarProps) {
	return (
		<div className='top-container'>
			{title && <p> {title}</p>}
			<div className='btn-container'>
				<Button
					size='small'
					onClick={onClickFir}
					variant='contained'
					startIcon={iconFir}>
					{labelFir}
				</Button>
				<Button
					size='small'
					onClick={onClickSec}
					variant='outlined'
					startIcon={iconSec}>
					{labelSec}
				</Button>
				<Button
					size='small'
					onClick={onClickThird}
					variant='outlined'
					startIcon={iconThird}>
					{lableThird}
				</Button>
			</div>
		</div>
	);
}
