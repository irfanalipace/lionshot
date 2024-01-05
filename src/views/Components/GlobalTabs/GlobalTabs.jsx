import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Typography } from '@mui/material';
function TabGlobalComponent({ tabLabels, defaultTab, onChange, children }) {
	const [selectedTab, setSelectedTab] = useState(defaultTab || 0);
	const handleTabChange = (event, newValue) => {
		setSelectedTab(newValue);
		if (onChange) {
			onChange(newValue);
		}
	};
	return (
		<div>
			<Tabs
				value={selectedTab}
				onChange={handleTabChange}
				aria-label='outer-tabs'
			>
				{tabLabels.map((tab, index) => (
					<Tab
						label={tab.label}
						icon={
							<Typography component={'span'} style={{ marginBottom: '0' }}>
								{tab.icon}
							</Typography>
						}
						key={index}
						aria-label='inner-tabs'
						sx={tabStyle}
					/>
				))}
			</Tabs>
			{children[selectedTab]}
		</div>
	);
}
const tabStyle = {
	// backgroundColor: 'transparent',
	display: 'flex',
	flexWrap: 'wrap',
	flexDirection: 'row-reverse',
	borderRadius: '8px',

	'& .MuiSvgIcon-root': {
		margin: '0 8px',
	},
	// border:'1px solid',
	minHeight: '50px',
	textTransform: 'none',
	color: '#000',
	height: '40px',
	'&.Mui-selected': {
		// color: 'white',
		// backgroundColor: window.themeColors.primary,
		// border: 'none',
		// padding: '0 16px',
	},
};
// const outerofTabs = {
//   marginBottom: '10px',
//   borderBottom: '1px solid #E0E0E0',
//   '& .MuiTabs-indicator': {
//     display: 'none',
//   },
// }
TabGlobalComponent.propTypes = {
	tabLabels: PropTypes.arrayOf(PropTypes.object).isRequired,
	defaultTab: PropTypes.number,
	onChange: PropTypes.func,
	// children: PropTypes.node.isRequired,
};

export default TabGlobalComponent;
