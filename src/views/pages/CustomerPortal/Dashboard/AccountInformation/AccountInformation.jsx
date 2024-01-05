import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccountQuantity from './AccountQuantity';
import CustomerAccountChart from './CustomerAccountChart';
import { getCustomerDashboardApi } from '../../../../../core/api/customerportal';

const AccountInformation = ({ customerId }) => {
  const TABS = {
    OVERVIEW: 'Overview',
    STATEMENT: 'Statement'
  };
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [viewMore, setViewMore] = useState(false);
  const [dashData, setDashData] = useState([]);
  //   month menu close open /
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const filter = Boolean(anchorE2);
  const handleClick2 = event => {
    setAnchorE2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorE2(null);
  };

  //  styles
  const tabUnderlineStyles = {
    borderBottom: '2px solid #66B2FF',
    fontWeight: 550,
    cursor: 'pointer',
    borderRadius: '3px',
    color: '#66B2FF'
  };
  const statemnetStyle = {
    display: 'flex',
    justifyContent: 'space-between'
  };
  const th = {
    background: 'black',
    color: '#ffff'
  };
  const getDashBoard = async () => {
    try {
      const resp = await getCustomerDashboardApi({
        customer_id: customerId
      });
      setDashData(resp?.data);
    } catch (error) {}
  };
  useEffect(() => {
    if (TABS.OVERVIEW === activeTab) {
      getDashBoard();
    }
  }, [activeTab]);

  return (
    <Paper sx={{ padding: '2rem 1rem' }}>
      <Grid item container>
        <Grid item sm={12}>
          <Stack direction='row' spacing={2}>
            <Typography
              variant='body2'
              onClick={() => setActiveTab(TABS.OVERVIEW)}
              sx={
                activeTab === TABS.OVERVIEW
                  ? { ...tabUnderlineStyles, padding: '0 .5rem' }
                  : { cursor: 'pointer', padding: '0 .5rem' }
              }>
              {TABS.OVERVIEW}
            </Typography>
            {/* <Typography
              variant='body2'
              onClick={() => setActiveTab(TABS.STATEMENT)}
              sx={
                activeTab === TABS.STATEMENT
                  ? { ...tabUnderlineStyles, padding: "0 .5rem" }
                  : { cursor: "pointer", padding: "0 .5rem" }
              }>
              {TABS.STATEMENT}
            </Typography> */}
          </Stack>
          {TABS.OVERVIEW === activeTab && (
            <>
              {/* <Paper sx={{marginTop:'20px'}}>
                <Grid
                  item
                  container
                  display='flex'
                  justifyContent='space-between'>
                  <Grid item sm={5}>
                    <Stack padding={"2rem .8rem"} rowGap={4}>
                      <Typography variant='h6'>This Month</Typography>
                      <Stack direction='row' columnGap={3}>
                        <MonthStack />
                        <MonthStack />
                        <MonthStack />
                      </Stack>
                    </Stack>
                  </Grid>
                  <Divider orientation='vertical' flexItem />
                  <Grid item sm={6.5}>
                    <Stack padding={"2rem .8rem"} rowGap={4}>
                      <Typography variant='h6'>Overall</Typography>
                      <Stack
                        direction='row'
                        columnGap={3}
                        rowGap={2}
                        display='flex'
                        flexWrap='wrap'>
                        <AccountProgress />
                        <AccountProgress />
                        <AccountProgress />
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper> */}

              <StatsContainer>
                {/* ite will be dyanmic when data comes  , like in map */}
                <Grid item container rowGap={5} display='flex'>
                  <AccountQuantity
                    label='Decline Price Quote'
                    value={dashData?.decline_price_quote}
                  />
                  <Divider orientation='vertical' flexItem />

                  <AccountQuantity
                    label='Draft Price Quote'
                    value={dashData?.draft_price_quote}
                  />
                  <Divider orientation='vertical' flexItem />
                  <AccountQuantity
                    label='Pending Price Quote'
                    value={dashData?.pending_price_quote}
                  />
                  <Divider orientation='vertical' flexItem />

                  <AccountQuantity
                    label='Paid Invoice'
                    value={dashData?.paid_invoice}
                  />
                </Grid>
              </StatsContainer>

              <StatsContainer>
                <Grid item container rowGap={5} display='flex'>
                  <AccountQuantity
                    label='Price Quote'
                    value={dashData?.price_quote}
                  />
                  <Divider orientation='vertical' flexItem />
                  <AccountQuantity
                    label='Sales Order'
                    value={dashData?.sale_order}
                  />
                  <Divider orientation='vertical' flexItem />
                  <AccountQuantity
                    label='Unpaid Invoice'
                    value={dashData?.unpaid_invoice}
                  />
                </Grid>
              </StatsContainer>
              {/* {viewMore && */}
              {/* <MoreCustomerStats /> */}
              {/* } */}

              {/* <Grid container justifyContent={'end'} mt={2}>
              {
                viewMore ? <MUIButton variant="text" onClick={()=>setViewMore(false)}>View Less</MUIButton> : 
              <MUIButton variant="text" onClick={()=>setViewMore(true)}>View More</MUIButton> 
            }
            </Grid> */}
              <CustomerAccountChart />
            </>
          )}

          {/* {TABS.STATEMENT === activeTab && (
            <Paper sx={{ padding: "2rem 1rem 5rem 1rem" }}>
              <Grid item container>
                <Grid item sm={5}>
                  <Stack
                    direction='row'
                    display='flex'
                    justifyContent='space-around'>
                    <Paper>
                      <MUIButton
                        sx={{ border: "none", color: "black" }}
                        endIcon={<ArrowDropDownOutlinedIcon fontSize='small' />}
                        variant='outlined'
                        onClick={handleClick}>
                        <CalendarMonthOutlinedIcon fontSize='small' />
                        This Month
                      </MUIButton>{" "}
                      <Menu
                        id='basic-menu'
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}>
                        {monthDropDown.map((item, indx) => (
                          <React.Fragment key={indx}>
                            <MenuItem
                              onClick={() => {
                                handleClose();
                              }}>
                              {item.name}
                            </MenuItem>
                          </React.Fragment>
                        ))}
                      </Menu>
                    </Paper>
                    <Paper>
                      <MUIButton
                        sx={{ border: "none", color: "black" }}
                        endIcon={<ArrowDropDownOutlinedIcon fontSize='small' />}
                        variant='outlined'
                        onClick={handleClick2}>
                        <CalendarMonthOutlinedIcon fontSize='small' />
                        Filter By:
                      </MUIButton>{" "}
                      <Menu
                        id='basic-menu2'
                        anchorEl={anchorE2}
                        open={filter}
                        onClose={handleClose2}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}>
                        {filterData.map((item, indx) => (
                          <React.Fragment key={indx}>
                            <MenuItem
                              onClick={() => {
                                handleClose2();
                              }}>
                              {item.name}
                            </MenuItem>
                          </React.Fragment>
                        ))}
                      </Menu>
                    </Paper>
                  </Stack>
                </Grid>
                <Grid item sm={7}>
                  <Stack
                    direction='row'
                    display='flex'
                    justifyContent='flex-end'>
                    <IconButton>
                      <PrintIcon fontSize='small' />
                    </IconButton>
                    <IconButton>
                      <PictureAsPdfIcon fontSize='small' />
                    </IconButton>
                    <IconButton>
                      <PictureAsPdfIcon fontSize='small' />
                    </IconButton>
                    <MUIButton startIcon={<MailIcon />}>Send Mail</MUIButton>
                  </Stack>
                </Grid>
                <Grid
                  item
                  xs={12}
                  display='flex'
                  justifyContent='center'
                  my={5}>
                  <Stack textAlign='center'>
                    <Typography variant='body1'>
                      Customer statemnet for Atlanta Autos
                    </Typography>
                    <Typography variant='caption'>
                      From 01 Aug 2023 to 20 Aug 23
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item sm={12}>
                  <Paper sx={{ padding: "1rem 2rem" }}>
                    <Grid item container>
                      <Grid item xs={6} display='flex' alignItem='center'>
                        <img
                          src={Logo}
                          alt='logo'
                          style={{ height: "59px", width: "180px" }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        display='flex'
                        justifyContent='flex-end'
                        alignItem='center'>
                        <Stack
                          display='flex'
                          justifyContent='center'
                          alignItem='center'>
                          <Typography variant='caption'>2167</Typography>
                          <Typography variant='caption'>
                            Eagen Minnesota 55121
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={6} mt={5}>
                        <Stack>
                          <Typography variant='caption'>To</Typography>
                          <Typography variant='caption' color='primary'>
                            Atlanta Autos
                          </Typography>
                          <Typography variant='caption'>
                            United States
                          </Typography>
                          <Typography variant='caption'>+123456789</Typography>
                        </Stack>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        mt={5}
                        display='flex'
                        justifyContent='flex-end'>
                        <Stack textAlign='right'>
                          <Typography variant='h6'>
                            Statement of Accounts
                          </Typography>
                          <hr style={{ height: "2px", background: "black" }} />
                          <Typography variant='caption' mt={1}>
                            1 Aug 2023 to 31 Aug 2023
                          </Typography>
                          <hr style={{ height: "3px", background: "black" }} />
                        </Stack>
                      </Grid>
                      <Grid item xs={6} mt={4}></Grid>
                      <Grid item xs={6} mt={8}>
                        <Stack
                          direction='row'
                          sx={{ backgroundColor: "#f3f3f3" }}>
                          <Typography variant='caption' fontWeight='700' p={.5}>
                            Account Summary
                          </Typography>
                        </Stack>
                        <Stack direction='row' sx={{ ...statemnetStyle }}>
                          <Typography variant='caption'>
                            Pending Balance
                          </Typography>
                          <Typography variant='caption'>$0.00</Typography>
                        </Stack>
                        <Stack direction='row' sx={{ ...statemnetStyle }}>
                          <Typography variant='caption'>
                            Invoiced Amount
                          </Typography>
                          <Typography variant='caption'>$0.00</Typography>
                        </Stack>
                        <Stack direction='row' sx={{ ...statemnetStyle }}>
                          <Typography variant='caption'>
                            Amount Receieved
                          </Typography>
                          <Typography variant='caption'>$0.00</Typography>
                        </Stack>
                        <hr style={{ height: "2px", background: "black" }} />
                        <Stack direction='row' sx={{ ...statemnetStyle }}>
                          <Typography variant='caption'>Balance Due</Typography>
                          <Typography variant='caption'>$0.00</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} mt={10}>
                      <TableContainer>
                        <Table>
                          <TableHead
                            sx={{...th}}
                            >
                            <TableHeadCell sx={{...th }}>
                              Date
                            </TableHeadCell>
                            <TableHeadCell sx={{...th}}>
                              Invoice
                            </TableHeadCell>
                            <TableHeadCell sx={{...th}}>
                              Description
                            </TableHeadCell>
                            <TableHeadCell sx={{...th}}>
                              Debit(<Typography  variant='caption'>sales</Typography>)
                            </TableHeadCell>
                            <TableHeadCell sx={{...th}}>
                              Credit(<Typography  variant='caption'>payment</Typography>)
                            </TableHeadCell>
                            <TableHeadCell sx={{...th}}>
                              OutStanding(<Typography  variant='caption'>balance</Typography>)
                            </TableHeadCell>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableBodyCell>
                                101 Aug 2023
                              </TableBodyCell>
                              <TableBodyCell>
                                Opening Balance
                              </TableBodyCell>
                              <TableBodyCell >
                                ----
                              </TableBodyCell>
                              <TableBodyCell>
                                0.00
                              </TableBodyCell>
                              <TableBodyCell>
                                0.00
                              </TableBodyCell>
                              <TableBodyCell>
                                0.00
                              </TableBodyCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    <Grid item container mt={2}>
                      <Grid item xs={6}></Grid>
                      <Grid
                        item
                        xs={5}
                        display='flex'
                        justifyContent='space-between'>
                        <Typography variant='caption' fontWeight='700'>
                          OutStanding balance
                        </Typography>
                        <Typography variant='caption'>$123456</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          )} */}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AccountInformation;

function StatsContainer({ children }) {
  return (
    <Box mt={3}>
      <Paper sx={{ margin: '2re, 0', padding: '2rem .5rem' }}>{children}</Paper>
    </Box>
  );
}

function MoreCustomerStats() {
  return (
    <>
      <StatsContainer>
        <Grid item container>
          {/* ite will be dyanmic when data comes  , like in map */}
          <AccountQuantity />
          <Divider orientation='vertical' flexItem />

          <AccountQuantity />
          <Divider orientation='vertical' flexItem />

          <AccountQuantity />
          <Divider orientation='vertical' flexItem />
          <AccountQuantity />
        </Grid>
      </StatsContainer>
      <StatsContainer>
        <Grid item container>
          {/* ite will be dyanmic when data comes  , like in map */}
          <AccountQuantity sm={6} />
          <Divider orientation='vertical' flexItem />

          <AccountQuantity sm={4} />
        </Grid>
      </StatsContainer>
    </>
  );
}
