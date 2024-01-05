import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
// import Toolbar from "@mui/material/Toolbar";
import Typography from '@mui/material/Typography';
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import MenuItem from "@mui/material/MenuItem";
// import Menu from "@mui/material/Menu";
import { useSelector } from 'react-redux';
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import { Add } from "@mui/icons-material";
// import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
// import { Link } from "react-router-dom";
// import { logout } from "../../../core/store/auth/authThunks";
// import SearchBar from "../SearchBar/SearchBar";
// import HeaderDropDown from "../HeaderDropDown/HeaderDropDown";
import headerlogo from '../../../../public/customer-portal-dashboard.png';

export default function HeaderCustomer() {
	const customerDetails = useSelector(state => state.customer.customer);
	const profilePIC = useSelector(state => state?.customer?.profilePic);
	return (
		<Box sx={{ height: '60px' }}>
			<AppBar>
				<Grid container alignItems='center'>
					<Grid item sm={1.9} xs>
						<Typography
							variant='h6'
							component='div'
							sx={{
								borderRight: '1px solid white',
								height: '64px',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<img src={headerlogo} />
						</Typography>
					</Grid>
					<Grid item sm={10.1} container>
						<Grid item sm={6}></Grid>
						{customerDetails?.id && (
							<Grid
								item
								sm={6}
								container
								justifyContent={'end'}
								alignItems={'center'}
								pr={5}
							>
								<Grid item>
									<Avatar src={profilePIC}>{`${
										customerDetails?.first_name
											? customerDetails?.first_name[0]
											: ''
									}${
										customerDetails?.last_name
											? customerDetails?.last_name[0]
											: ''
									}`}</Avatar>
								</Grid>
								<Grid item pl={1}>
									<Typography
										variant='body1'
										component='div'
										sx={{ flexGrow: 1 }}
									>{`${customerDetails?.first_name || ''} ${
										customerDetails?.last_name || ''
									}`}</Typography>
								</Grid>
							</Grid>
						)}
					</Grid>
					{/* <Typography>
            <SearchBar />
          </Typography>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>

          <Button onClick={handleListClick} sx={{ position: "relative" }}>
            <Add sx={{ color: "white" }} />
          </Button>

          <Box>
            <Menu
              onClose={handleListClose}
              anchorEl={anchorE2}
              id="account-menu"
              open={Boolean(anchorE2)}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    left: 15, // arrow positionm
                    right: 14,
                    width: 15,
                    height: 15,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{
                horizontal: "left",
                vertical: "top",
              }}
              anchorOrigin={{
                horizontal: "left",
                vertical: "bottom",
              }}
            >
              <MenuItem onClick={handleListClose}>
                <Link
                  to="/items/new"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  New Item
                </Link>
              </MenuItem>
              <MenuItem onClick={handleListClose}>
                <Link
                  to="/price-lists"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  New Price List
                </Link>
              </MenuItem>

              <MenuItem onClick={handleListClose}>
                <Link
                  to="/customer/new"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  New Customer
                </Link>
              </MenuItem>
              <MenuItem onClick={handleListClose}>
                <Link
                  to="/price-quote/new"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  New Price Quote
                </Link>
              </MenuItem>
              <MenuItem onClick={handleListClose}>
                <Link
                  to="/sales-orders"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  New Sales Order
                </Link>
              </MenuItem>
              <MenuItem onClick={handleListClose}>
                <Link
                  to="/invoices/new"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  New Invoice
                </Link>
              </MenuItem>
              <MenuItem onClick={handleListClose}>
                <Link
                  to="/payment-links"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  New Payment Links
                </Link>
              </MenuItem>
              <MenuItem onClick={handleListClose}>
                <Link
                  to="/payment-received"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  New Receive Payment
                </Link>
              </MenuItem>
              <MenuItem onClick={handleListClose}>
                <Link
                  to="/credit-memo"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  New Credit Memo
                </Link>
              </MenuItem>
            </Menu>
          </Box>

          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ outline: "none", border: "none" }}
          >
            <Button sx={{ minWidth: "0px" }}>
              <NotificationsIcon sx={{ color: "white" }} />
            </Button>
          </IconButton>

          <HeaderDropDown />

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            style={{ outline: "none" }}
            onClick={handleMenu} // Define handleMenu
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose} // Define handleClose
          >
            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
          </Menu>
          <MenuItem value=""></MenuItem> */}
				</Grid>
			</AppBar>
		</Box>
	);
}
