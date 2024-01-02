import React, { ReactNode } from 'react';
import { Dialog, DialogProps } from '@mui/material';

interface CustomDialogProps {
	open: boolean;
	title: string;
	onClose: () => void;
	children: ReactNode;
	className?: string;
	size?: DialogProps['maxWidth'];
	hasCloseButton?: boolean;
	sx?: any;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
	open,
	onClose,
	children,
	className,
	title,
	sx,
	size,
	hasCloseButton = true,
}) => {
	return (
		<Dialog
			sx={sx}
			open={open}
			onClose={onClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
			className={className}
			fullWidth={true}
			maxWidth={size}>
			{children}
		</Dialog>
	);
};

export default CustomDialog;
