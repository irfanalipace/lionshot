// import { Typography } from "@mui/material";
import { Box } from '@mui/system';
import React from 'react';
// import HeaderPaper from "../../Components/Containers/HeaderPaper";
import BillsTable from './BillsTable/BillsTable';

const Bills = () => {
	return (
		<Box>
			<Box>
				<BillsTable />
			</Box>
		</Box>
	);
};

export default Bills;
