import React, { useState } from "react";
import { Box, Menu, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import MUIButton from "./MUIButton";

interface DropdownMenuProps {
	name: string;
	list: { id: number; name: string }[];
	selected: number[];
	dlt: boolean;
	deletingBulk: (selected: number[]) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
	name,
	list,
	selected,
	dlt,
	deletingBulk,
}) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

	const handleMenuOpen = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleMenuItemClick = () => {
		if (selected && selected.length > 0) {
			deletingBulk(selected);
			handleMenuClose();
		}
	};

	return (
		<Box>
			<MUIButton
				aria-controls="dropdown-menu"
				aria-haspopup="true"
				onClick={handleMenuOpen}
				variant="contained"
			>
				{name}&ensp;
				<ExpandMoreIcon />
			</MUIButton>
			<Menu
				id="dropdown-menu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
			>
				{list?.map((row) => (
					<MenuItem
						onClick={handleMenuItemClick} // Using the wrapper function
						sx={{
							color: "#2196F3",
							width: "165px",
							display: "flex",
							justifyContent: "space-between",
						}}
						key={row.id}
					>
						{row.name} {dlt && <DeleteIcon fontSize="small" />}
					</MenuItem>
				))}
			</Menu>
		</Box>
	);
};

export default DropdownMenu;
