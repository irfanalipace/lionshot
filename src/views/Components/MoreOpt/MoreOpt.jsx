import { Divider, IconButton } from '@mui/material';
import { useState } from 'react';
import { Menu as DropMenu } from '@mui/base/Menu';
import { Dropdown } from '@mui/base/Dropdown';
import MenuItem from '@mui/material/MenuItem';

import { Cached, MoreHoriz, SaveAlt, UploadFile } from '@mui/icons-material';
import {
	HeaderMenuButton,
	StyledListbox,
} from '../../pages/Customer/CustomerStylesConst';

const MoreOpt = ({ moreList }) => {
	const [anchorE2, setAnchorE2] = useState(null);
	const handleMoreClick = event => {
		setAnchorE2(event.currentTarget);
	};
	const openMore = Boolean(anchorE2);
	return (
		<>
			<IconButton onClick={event => handleMoreClick(event)}>
				<Dropdown>
					<HeaderMenuButton sx={{ padding: '6px 10px' }}>
						<MoreHoriz />
					</HeaderMenuButton>
					<DropMenu slots={{ listbox: StyledListbox }}>
						{moreList.map((list, index) => (
							<MenuItem key={index} onClick={() => list?.onClick()}>
								{list?.icon} &ensp;
								{list?.name}
							</MenuItem>
						))}
					</DropMenu>
				</Dropdown>
			</IconButton>
		</>
	);
};

export default MoreOpt;
