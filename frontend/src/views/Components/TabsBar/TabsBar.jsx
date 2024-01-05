import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Paper from '@mui/material/Paper';
import HomeDashboard from '../../pages/Home/HomeDashborad/HomeDashboard';
const TabsBar = () => {
	const [value, setValue] = useState('1');

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%', typography: 'body1' }}>
			<Paper sx={{ width: '100%' }}>
				<TabContext value={value}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<TabList onChange={handleChange} aria-label='lab API tabs example'>
							<Tab label='Dashboard' value='1' />
							<Tab label='GETTING STARTED' value='2' />
							<Tab label='RECENT UPDATES' value='3' />
						</TabList>
					</Box>
					<TabPanel value='1'>
						<HomeDashboard />
					</TabPanel>
					<TabPanel value='2'>Item Two</TabPanel>
					<TabPanel value='3'>Item Three</TabPanel>
				</TabContext>
			</Paper>
		</Box>
	);
};

export default TabsBar;
