import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import AccordianTable from '../ViewTemplate/AccordianTable';

function TableAccordian({ data, columns, title }) {
	return (
		<Accordion>
			<AccordionSummary
				expandIcon={<ArrowDropDown />}
				aria-controls='panel2a-content'
				id='panel2a-header'
			>
				<Typography variant='body1'>{title}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Grid item container>
					<AccordianTable data={data} columns={columns} />
				</Grid>
			</AccordionDetails>
		</Accordion>
	);
}

export default TableAccordian;
