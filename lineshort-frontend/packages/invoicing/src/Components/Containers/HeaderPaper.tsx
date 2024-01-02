// import { Paper } from "@mui/material";
// import React from "react";

// function HeaderPaper({ children, style, sx }) {
// 	const defaultSx = {
// 		padding: "1.2rem",
// 		marginBottom: "10px",
// 	};
// 	return <Paper sx={{ ...defaultSx, ...sx }}>{children}</Paper>;
// }

// export default HeaderPaper;
import { Paper, PaperProps } from '@mui/material';
import React, { ReactNode } from 'react';

interface HeaderPaperProps {
	children: ReactNode;
	style?: React.CSSProperties;
	sx?: PaperProps['sx'];
}

const HeaderPaper: React.FC<HeaderPaperProps> = ({
	children,
	style,
	sx,
}: HeaderPaperProps) => {
	const defaultSx: React.CSSProperties = {
		padding: '1.2rem',
		marginBottom: '10px',
	};
	return (
		<Paper sx={{ ...defaultSx, ...sx }} style={style}>
			{children}
		</Paper>
	);
};

export default HeaderPaper;
