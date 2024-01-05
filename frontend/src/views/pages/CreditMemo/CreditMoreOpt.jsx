import { Divider, IconButton } from '@mui/material';
import { useState } from 'react';
import { Menu as DropMenu } from '@mui/base/Menu';
import { Dropdown } from '@mui/base/Dropdown';
import MenuItem from '@mui/material/MenuItem';
import {
	HeaderMenuButton,
	StyledListbox,
} from '../Customer/CustomerStylesConst';
import { Cached, MoreHoriz, SaveAlt, UploadFile } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';

const CreditMoreOpt = ({
	setOpenImport,
	setOpenExport,
	refreshList,
	title,
}) => {
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
						{/* <MenuItem onClick={() => setOpenImport()}>
							<SaveAlt sx={{ color: window.themeColors.primary }} /> &ensp;Import {title}
						</MenuItem> */}
						<MenuItem onClick={() => setOpenExport()}>
							<UploadFile sx={{ color: window.themeColors.primary }} />{' '}
							&ensp;Export {title}
						</MenuItem>
						<Divider />
						<MenuItem onClick={() => refreshList()}>
							<Cached sx={{ color: window.themeColors.primary }} />
							&ensp; Refresh List
						</MenuItem>
					</DropMenu>
				</Dropdown>
			</IconButton>
		</>
	);
};

export default CreditMoreOpt;
