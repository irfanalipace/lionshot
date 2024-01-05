import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, InputLabel, Divider, MenuItem, FormControl, Select, TextField } from '@mui/material';

import GridRow from '../GridRow/GridRow';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import HoverPopover from '../HoverPopover/ErrorOutlinePopover';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Add } from '@mui/icons-material';
import FormField from '../InputField/FormField';
import { Navigate } from 'react-router-dom';
const SearchBox = ({ open, onClose }) => {

    const [selectedOption, setSelectedOption] = useState("id"); // Set the default selected value here
   

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

const handleChnage = () => {
    Navigate('/bills')
}
    return (
        <Box>

            <Dialog open={open} onClose={onClose} maxWidth='lg'// Set your desired max-width here, e.g., '857px'
                fullWidth
                PaperProps={{
                    sx: {

                        borderRadius: '4px',
                        boxShadow: '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
                    },
                }} >
                <DialogTitle sx={{ background: '#E0E0E0' }}>

                    <Typography sx={{ display: 'flex', justifyContent: 'space-between', }}>
                        <Grid item container sx={{ marginLeft: '142px' }}>
                            <Grid item xs={1} >
                                <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px' }}>
                                    Search
                                </InputLabel>
                            </Grid>

                            <Grid item xs={5}>
                                <FormControl fullWidth sx={{ width: '350px' }}>


                                    <Select

                                        sx={{
                                            textAlign: 'left', height: '44px', // Set the height to 100% to match the desired height
                                            '&.MuiSelect-root': {
                                                // Remove default CSS classes
                                                color: 'black', // Change text color if needed
                                            },
                                        }}
                                        labelId="roundOffTo-label"
                                        id="roundOffTo"
                                        value={selectedOption}
                                        onChange={handleOptionChange}
                                        variant="outlined"
                                        fullWidth
                                        IconComponent={ArrowDropDownIcon}
                                    >
                                        <MenuItem value="">
                                            <FormField
                                                fullWidth
                                                variant="outlined"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </MenuItem>
                                        <MenuItem disabled value="id">
                                            <em style={{ color: 'gray' }}>Bills</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Stock on Fire</MenuItem>
                                        <MenuItem value={20}>Stolen Goods</MenuItem>
                                        <MenuItem value={30}>Damages Goods</MenuItem>
                                        <MenuItem value={40}>Stock Written Off</MenuItem>
                                        <MenuItem value={10}>Stock Transfer</MenuItem>
                                        <MenuItem value={20}>Stock Take</MenuItem>
                                        <MenuItem value={30}>StockTake</MenuItem>
                                        <MenuItem value={40}>Non-inventory items</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Button onClick={onClose} color="primary" sx={{ color: 'black', padding: '0px' }}>
                            <CloseIcon />
                        </Button>
                    </Typography>

                </DialogTitle>
                <DialogContent>

                    <Grid item container sx={{ marginTop: '8px' }} >
                        <GridRow >
                            <Grid item xs={1.5} >
                                <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px' }}>
                                    Bill#
                                </InputLabel>
                            </Grid>

                            <Grid item xs={4.3}>
                                <FormField id="name" sx={{ fontSize: "16px" }} />
                            </Grid>
                            <Grid item xs={1.5} >
                                <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px' }}>
                                    P.O#
                                </InputLabel>
                            </Grid>

                            <Grid item xs={4.3}>
                                <FormField id="name" sx={{ fontSize: "16px" }} />
                            </Grid>
                        </GridRow>

                    </Grid>
                    <Grid container spacing={2} sx={{ marginTop: '8px' }}>
                        <Grid item xs={1.5}>
                            <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px' }}>
                                Date Range
                            </InputLabel>
                        </Grid>

                        <Grid item xs={2}>
                            <FormField
                                id="start-date"

                                type="date"
                                sx={{ fontSize: '16px' }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={0}>
                            _
                        </Grid>
                        <Grid item xs={2}>
                            <FormField
                                id="end-date"

                                type="date"
                                sx={{ fontSize: '16px' }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={1.5} sx={{ marginLeft: '10px' }}>
                            <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px' }}>
                                Due Date
                            </InputLabel>
                        </Grid>

                        <Grid item xs={2}>
                            <FormField
                                id="start-date"

                                type="date"
                                sx={{ fontSize: '16px' }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={0}>
                            _
                        </Grid>
                        <Grid item xs={2}>
                            <FormField
                                id="end-date"

                                type="date"
                                sx={{ fontSize: '16px' }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ marginTop: '8px' }}>
                        <Grid item xs={1.5}>
                            <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px' }}>
                                Created Between
                            </InputLabel>
                        </Grid>

                        <Grid item xs={2}>
                            <FormField
                                id="start-date"

                                type="date"
                                sx={{ fontSize: '16px' }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={0}>
                            _
                        </Grid>
                        <Grid item xs={2}>
                            <FormField
                                id="end-date"

                                type="date"
                                sx={{ fontSize: '16px' }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={1.6} >
                            <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px', marginLeft: '10px' }}>
                                Status
                            </InputLabel>
                        </Grid>

                        <Grid item xs={4.3}>
                            <FormControl fullWidth >


                                <Select

                                    sx={{
                                        textAlign: 'left', height: '44px', // Set the height to 100% to match the desired height
                                        '&.MuiSelect-root': {
                                            // Remove default CSS classes
                                            color: 'black', // Change text color if needed
                                        },
                                    }}
                                    labelId="roundOffTo-label"
                                    id="roundOffTo"
                                    value={selectedOption}
                                    onChange={handleOptionChange}
                                    variant="outlined"
                                    fullWidth
                                    IconComponent={ArrowDropDownIcon}
                                >
                                    <MenuItem value="">
                                        <FormField
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </MenuItem>
                                    <MenuItem disabled value="id">

                                    </MenuItem>
                                    <MenuItem value={10}>Stock on Fire</MenuItem>
                                    <MenuItem value={20}>Stolen Goods</MenuItem>
                                    <MenuItem value={30}>Damages Goods</MenuItem>
                                    <MenuItem value={40}>Stock Written Off</MenuItem>
                                    <MenuItem value={10}>Stock Transfer</MenuItem>
                                    <MenuItem value={20}>Stock Take</MenuItem>
                                    <MenuItem value={30}>StockTake</MenuItem>
                                    <MenuItem value={40}>Non-inventory items</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                    </Grid>
                    <Grid item container sx={{ marginTop: '22px' }} >
                        <GridRow >
                            <Grid item xs={1.5} >
                                <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px' }}>
                                    Item Name
                                </InputLabel>
                            </Grid>

                            <Grid item xs={4.3}>
                                <FormControl fullWidth >


                                    <Select

                                        sx={{
                                            textAlign: 'left', height: '44px', // Set the height to 100% to match the desired height
                                            '&.MuiSelect-root': {
                                                // Remove default CSS classes
                                                color: 'black', // Change text color if needed
                                            },
                                        }}
                                        labelId="roundOffTo-label"
                                        id="roundOffTo"
                                        value={selectedOption}
                                        onChange={handleOptionChange}
                                        variant="outlined"
                                        fullWidth
                                        IconComponent={ArrowDropDownIcon}
                                    >
                                        <MenuItem value="">
                                            <FormField
                                                fullWidth
                                                variant="outlined"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </MenuItem>
                                        <MenuItem disabled value="id">

                                        </MenuItem>
                                        <MenuItem value={10}>Stock on Fire</MenuItem>
                                        <MenuItem value={20}>Stolen Goods</MenuItem>
                                        <MenuItem value={30}>Damages Goods</MenuItem>
                                        <MenuItem value={40}>Stock Written Off</MenuItem>
                                        <MenuItem value={10}>Stock Transfer</MenuItem>
                                        <MenuItem value={20}>Stock Take</MenuItem>
                                        <MenuItem value={30}>StockTake</MenuItem>
                                        <MenuItem value={40}>Non-inventory items</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={1.5} >
                                <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px' }}>
                                    Item Description
                                </InputLabel>
                            </Grid>

                            <Grid item xs={4.3}>
                                <FormField id="name" sx={{ fontSize: "16px" }} />
                            </Grid>
                        </GridRow>
                        <Grid container spacing={2} sx={{ marginTop: '2px' }}>
                            <Grid item xs={1.5}>
                                <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px' }}>
                                    Total Range
                                </InputLabel>
                            </Grid>

                            <Grid item xs={2}>
                                <FormField
                                    id="start-date"

                                    sx={{ fontSize: '16px' }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={0}>
                                _
                            </Grid>
                            <Grid item xs={2}>
                                <FormField
                                    id="end-date"


                                    sx={{ fontSize: '16px' }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={1.6} >
                                <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px', marginLeft: '10px' }}>
                                    Notes
                                </InputLabel>
                            </Grid>

                            <Grid item xs={4.3}>
                                <FormField id="name" sx={{ fontSize: "16px" }} />
                            </Grid>

                        </Grid>
                    </Grid>


                    <Grid container spacing={2} sx={{ marginTop: '8px' }}>
                        <Grid item xs={1.5}>
                            <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px' }}>
                                Vendor
                            </InputLabel>
                        </Grid>

                        <Grid item xs={4.3}>
                            <FormControl fullWidth >


                                <Select

                                    sx={{
                                        textAlign: 'left', height: '44px', // Set the height to 100% to match the desired height
                                        '&.MuiSelect-root': {
                                            // Remove default CSS classes
                                            color: 'black', // Change text color if needed
                                        },
                                    }}
                                    labelId="roundOffTo-label"
                                    id="roundOffTo"
                                    value={selectedOption}
                                    onChange={handleOptionChange}
                                    variant="outlined"
                                    fullWidth
                                    IconComponent={ArrowDropDownIcon}
                                >
                                    <MenuItem value="">
                                        <FormField
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </MenuItem>
                                    <MenuItem disabled value="id">

                                    </MenuItem>
                                    <MenuItem value={10}>Stock on Fire</MenuItem>
                                    <MenuItem value={20}>Stolen Goods</MenuItem>
                                    <MenuItem value={30}>Damages Goods</MenuItem>
                                    <MenuItem value={40}>Stock Written Off</MenuItem>
                                    <MenuItem value={10}>Stock Transfer</MenuItem>
                                    <MenuItem value={20}>Stock Take</MenuItem>
                                    <MenuItem value={30}>StockTake</MenuItem>
                                    <MenuItem value={40}>Non-inventory items</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={1.6} >
                            <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px', marginLeft: '10px' }}>
                                Account
                            </InputLabel>
                        </Grid>

                        <Grid item xs={4.3}>
                            <FormControl fullWidth >


                                <Select

                                    sx={{
                                        textAlign: 'left', height: '44px', // Set the height to 100% to match the desired height
                                        '&.MuiSelect-root': {
                                            // Remove default CSS classes
                                            color: 'black', // Change text color if needed
                                        },
                                    }}
                                    labelId="roundOffTo-label"
                                    id="roundOffTo"
                                    value={selectedOption}
                                    onChange={handleOptionChange}
                                    variant="outlined"
                                    fullWidth
                                    IconComponent={ArrowDropDownIcon}
                                >
                                    <MenuItem value="">
                                        <FormField
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </MenuItem>
                                    <MenuItem disabled value="id">

                                    </MenuItem>
                                    <MenuItem value={10}>Stock on Fire</MenuItem>
                                    <MenuItem value={20}>Stolen Goods</MenuItem>
                                    <MenuItem value={30}>Damages Goods</MenuItem>
                                    <MenuItem value={40}>Stock Written Off</MenuItem>
                                    <MenuItem value={10}>Stock Transfer</MenuItem>
                                    <MenuItem value={20}>Stock Take</MenuItem>
                                    <MenuItem value={30}>StockTake</MenuItem>
                                    <MenuItem value={40}>Non-inventory items</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                    </Grid>
                    <Grid container spacing={2} sx={{ marginTop: '8px' }}>
                        <Grid item xs={1.5}>
                            <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px' }}>
                                Customer Name
                            </InputLabel>
                        </Grid>

                        <Grid item xs={4.3}>
                            <FormControl fullWidth >


                                <Select

                                    sx={{
                                        textAlign: 'left', height: '44px', // Set the height to 100% to match the desired height
                                        '&.MuiSelect-root': {
                                            // Remove default CSS classes
                                            color: 'black', // Change text color if needed
                                        },
                                    }}
                                    labelId="roundOffTo-label"
                                    id="roundOffTo"
                                    value={selectedOption}
                                    onChange={handleOptionChange}
                                    variant="outlined"
                                    fullWidth
                                    IconComponent={ArrowDropDownIcon}
                                >
                                    <MenuItem value="">
                                        <FormField
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </MenuItem>
                                    <MenuItem disabled value="id">

                                    </MenuItem>
                                    <MenuItem value={10}>Stock on Fire</MenuItem>
                                    <MenuItem value={20}>Stolen Goods</MenuItem>
                                    <MenuItem value={30}>Damages Goods</MenuItem>
                                    <MenuItem value={40}>Stock Written Off</MenuItem>
                                    <MenuItem value={10}>Stock Transfer</MenuItem>
                                    <MenuItem value={20}>Stock Take</MenuItem>
                                    <MenuItem value={30}>StockTake</MenuItem>
                                    <MenuItem value={40}>Non-inventory items</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={1.6} >
                            <InputLabel sx={{ color: 'black', marginTop: '5px', fontSize: '16px', marginLeft: '10px' }}>
                                Project Name
                            </InputLabel>
                        </Grid>

                        <Grid item xs={4.3}>
                            <FormControl fullWidth >


                                <Select

                                    sx={{
                                        textAlign: 'left', height: '44px', // Set the height to 100% to match the desired height
                                        '&.MuiSelect-root': {
                                            // Remove default CSS classes
                                            color: 'black', // Change text color if needed
                                        },
                                    }}
                                    labelId="roundOffTo-label"
                                    id="roundOffTo"
                                    value={selectedOption}
                                    onChange={handleOptionChange}
                                    variant="outlined"
                                    fullWidth
                                    IconComponent={ArrowDropDownIcon}
                                >
                                    <MenuItem value="">
                                        <FormField
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </MenuItem>
                                    <MenuItem disabled value="id">

                                    </MenuItem>
                                    <MenuItem value={10}>Stock on Fire</MenuItem>
                                    <MenuItem value={20}>Stolen Goods</MenuItem>
                                    <MenuItem value={30}>Damages Goods</MenuItem>
                                    <MenuItem value={40}>Stock Written Off</MenuItem>
                                    <MenuItem value={10}>Stock Transfer</MenuItem>
                                    <MenuItem value={20}>Stock Take</MenuItem>
                                    <MenuItem value={30}>StockTake</MenuItem>
                                    <MenuItem value={40}>Non-inventory items</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                    </Grid>

                    <Divider sx={{ padding: '12px' }}></Divider>
                    <Grid item xs={12}>
                        <Box sx={{ paddingTop: '16px', textAlign: 'center' }}>
                            <Button sx={{
                                background: '#1976d2', color: 'white', '&:hover': {
                                    background: '#1976d2'
                                }
                            }}>Search</Button>
                            <Button sx={{ color: '#1976d2', border: '1px solid #1976d2', marginLeft: '10px' }} to="/bills">Cancel</Button>
                        </Box>
                    </Grid>
                </DialogContent>
                <DialogActions>

                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default SearchBox;
