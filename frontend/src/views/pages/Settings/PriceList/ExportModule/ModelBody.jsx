import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, InputLabel, Divider, MenuItem, FormControl, Select, TextField } from '@mui/material';
import FormField from '../../../../Components/InputField/FormField';
import GridRow from '../../../../Components/GridRow/GridRow';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import HoverPopover from '../../../../Components/HoverPopover/ErrorOutlinePopover';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Add } from '@mui/icons-material';
const ModelBody = ({ open, onClose }) => {
    const [selectedOption, setSelectedOption] = useState("id"); // Set the default selected value here
    const [selectedExportFormat, setSelectedExportFormat] = useState('csv');

    const handleExportFormatChange = (event) => {
        setSelectedExportFormat(event.target.value);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };


    return (
        <Box>
            <Dialog open={open} onClose={onClose} maxWidth="md" // Set your desired max-width here, e.g., '857px'
                fullWidth
                PaperProps={{
                    sx: {

                        borderRadius: '4px',
                        boxShadow: '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
                    },
                }} >
                <DialogTitle>
                    <Typography sx={{ display: 'flex', justifyContent: 'space-between', background: '#FAFAFA' }}>
                        <Typography variant="h5">Export</Typography>
                        <Button onClick={onClose} color="primary" sx={{ color: 'black', padding: '0px' }}>
                            <CloseIcon />
                        </Button>
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontSize: '14px', marginBottom: '24px' }}>You can export your data from IMS in CSV or XLS format.</Typography>
                    <GridRow>
                        <Grid item xs={3.4}>
                            <InputLabel required sx={{ color: 'red', paddingTop: '6px' }}>
                                Select Module
                            </InputLabel>
                        </Grid>
                        <Grid item xs={8.6}>
                            <FormControl fullWidth sx={{ width: '400' }}>


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
                                        <em style={{ color: 'gray' }}>Purchase Price List</em>
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
                    </GridRow>

                    <GridRow>
                        <Grid item xs={12}>
                            <Divider></Divider>
                        </Grid>
                    </GridRow>
                    <GridRow>
                        <Grid item xs={3.4}>
                            <InputLabel sx={{ fontSize: "14px", paddingTop: '6px', color: 'black' }}>
                                Fields Export File <HoverPopover text="Fields Export File">
                                    <HelpOutlineIcon sx={{ color: 'gray', fontSize: '12px' }} />
                                </HoverPopover>
                            </InputLabel>
                        </Grid>
                        <Grid item xs={8.6}>
                            <FormControl fullWidth sx={{ width: '400' }}>
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
    <em style={{ color: 'gray' }}>Select an Export Template</em>
</MenuItem>
<MenuItem value={10}>No Result Found</MenuItem>
<MenuItem value={10}><Button><Add /> {"Add New"}</Button></MenuItem>

</Select>
                            </FormControl>

                        </Grid>
                    </GridRow>

                    <GridRow >
                        <Grid item xs={12}>
                            <Typography sx={{ color: 'red' }} required>Export As*</Typography>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    aria-label="Export Format"
                                    name="exportFormat"
                                    value={selectedExportFormat}
                                    onChange={handleExportFormatChange}
                                >
                                    <FormControlLabel value="csv" control={<Radio />} label="CSV (Comma Separated Value)" />
                                    <FormControlLabel value="xls" control={<Radio />} label="XLS (Microsoft Excel 1997-2004 Compatible)" />
                                    <FormControlLabel value="xlsx" control={<Radio />} label="XLSX (Microsoft Excel)" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </GridRow>

                    <GridRow>
                        <Grid item xs={3.4}>
                            <Typography>


                                Password to protect the file

                            </Typography>
                        </Grid>
                        <Grid item xs={8.4}>
                            <FormField id="name" sx={{ fontSize: "16px" }} placeholder="*****" />
                        </Grid>
                    </GridRow>

                    <Typography sx={{ fontSize: '14px' }}>NOTE: You can export only the first 25,000 rows. If you have more rows, please initiate a backup for the data in your Zoho Books organization, and download it. <Button sx={{ padding: '0px' }}>Backup Your Data.</Button></Typography>


                    <Grid item xs={12}>
                        <Box sx={{ paddingTop: '16px' }}>
                            <Button sx={{
                                background: '#1976d2', color: 'white', '&:hover': {
                                    background: '#1976d2'
                                }
                            }}>Export</Button>
                            <Button sx={{ color: '#1976d2', border: '1px solid #1976d2', marginLeft: '10px' }} >Cancel</Button>
                        </Box>
                    </Grid>
                </DialogContent>
                <DialogActions>

                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ModelBody;
