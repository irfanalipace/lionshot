import React, { useRef, useState } from "react";
import {
    Button, Grid, Typography, Box, Divider, Input, FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import HeaderPaper from "../../../Components/Containers/HeaderPaper";
import SettingsIcon from "@mui/icons-material/Settings";
import CircleNumber from "../../../Components/CircleNumber/CircleNumber";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ContainerPaper from "../../../Components/Containers/ContainerPaper";
import GridRow from "../../../Components/GridRow/GridRow";
import StarIcon from '@mui/icons-material/Star';
import FormField from "../../../Components/InputField/FormField";

function ImportSalesPriceList({ title }) {
    console.log(title, 'title')
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedOption, setSelectedOption] = useState("id"); // Set the default selected value here

    const handleFileSelect = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        // Do something with the selected file, e.g., upload it
    };


    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <Box>
            <HeaderPaper sx={{ height: '670px' }}>
                <GridRow>
                    <Grid item sm={12}>

                        <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        >
                            <Grid item xs={12}>
                                <Typography variant="h5" className="TextCapitalize" sx={{ marginLeft: '-28px' }}>
                                    <Button sx={{ padding: '0px', marginRight: '-18px' }}> <SettingsIcon /></Button> {title}
                                </Typography>
                            </Grid>

                        </Grid>


                    </Grid>
                </GridRow>

                <GridRow>
                    <Grid item sm={12} sx={{ marginTop: '16px' }}>
                        <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            alignItems="center"
                        >
                            <Grid item xs={0.8}>
                                <CircleNumber
                                    number={1}
                                    borderColor="#1976d2"
                                    backgroundColor="#e1f5fe"
                                    color="#1976d2"
                                />
                                <Typography
                                    sx={{ color: "#1976d2", padding: "4px", marginLeft: "6px", fontSize: '12px', }}
                                >
                                    Configure
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Divider variant="middle" sx={{ height: "2px" }} />
                            </Grid>
                            <Grid item xs={1}>
                                <CircleNumber
                                    number={2}
                                    borderColor="#d5d5c5e0"
                                    color="#d5d5c5e0"
                                />
                                <Typography
                                    sx={{
                                        color: "#d5d5c5e0",
                                        fontSize: '12px',
                                        padding: "4px",
                                    }}
                                >
                                    Maps Fields
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Divider variant="middle" sx={{ height: "2px", color: 'red' }} />
                            </Grid>

                            <Grid item xs={0.4}>
                                <CircleNumber
                                    number={3}
                                    borderColor="#d5d5c5e0"
                                    color="#d5d5c5e0"
                                />
                                <Typography
                                    sx={{
                                        color: "#d5d5c5e0",
                                        marginLeft: "7px",
                                        padding: "4px",
                                        fontSize: '12px',
                                    }}
                                >
                                    Preview
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </GridRow>

                <GridRow                     >
                    <Grid item xs={6.4}>

                        <Typography

                        >
                            Download a <Button sx={{ padding: '0px' }}>sample csv file</Button> or <Button sx={{ padding: '0px' }}>sample xls file</Button> and compare it to your import file to ensure you have the file perfect for the import.
                        </Typography>

                        <Typography sx={{ color: 'red', marginTop: '22px' }} required>Upload file*</Typography>

                        <Box sx={{ textAlign: 'end' }}>
                            <Input
                                type="file"
                                accept=".csv, .xlsx"
                                style={{ display: "none" }}
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                id="file-input" /* Add an id to the input */
                            />
                            <label htmlFor="file-input"> {/* Use a label element with "for" attribute */}
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{
                                        background: '#1976d2',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#1976d2',
                                        },
                                    }}
                                >
                                    Choose File
                                </Button>
                            </label>
                            {selectedFile ? (
                                <Button variant="body1" color="textSecondary" >
                                    Selected file: {selectedFile.name}
                                </Button>
                            ) : (
                                <Button variant="body1" color="textSecondary">
                                    No file selected
                                </Button>
                            )}

                            <Typography sx={{ marginTop: '18px', marginLeft: '20px', fontSize: '13px' }}>
                                maximum file Size: 5MB | File Format: CSV or XLS
                            </Typography>
                            <Typography sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ color: 'red', marginTop: '22px' }} required>Character Encoding*</Typography>
                                <Typography sx={{ color: 'red', marginTop: '22px' }} required>
                                    <FormControl fullWidth sx={{ width: '300px' }}>
                                        <Select
                                            sx={{
                                                textAlign: 'left', height: '44px',
                                                '&.MuiSelect-root': {
                                                    color: 'black',
                                                },
                                            }}
                                            value={selectedOption}
                                            onChange={handleOptionChange}
                                            startIcon={<ArrowDropDownIcon />}
                                            endIcon={<div style={{ marginLeft: "8px" }}>{selectedOption}</div>}
                                        >
                                            <MenuItem value="id" >URF-8 (Unicode)</MenuItem>
                                            <MenuItem value="option1">URF-7 (Unicode)</MenuItem>
                                            <MenuItem value="option1">URF-6 (Unicode)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Typography>
                            </Typography>
                        </Box>

                    </Grid>
                    <Grid item xs={0.2}>
                        <Divider
                            orientation="vertical" // Set the orientation to "vertical"
                            flexItem // Make it a flex item to control its positioning
                            variant="middle" // You can choose "middle" or "fullWidth" variant
                            style={{ height: "100%", margin: "0 8px", borderLeft: "1px solid #ccc" }} // Custom styling
                        />
                    </Grid>
                    <Grid item xs={5}>




                        <Typography><StarIcon sx={{ color: 'orange', paddingTop: '6px' }} /> Page Tips</Typography>
                        <Box sx={{ marginLeft: '24px' }}>
                            <ul >
                                <li style={{ marginBottom: '11px', fontSize: '15px' }}>You can download the <Button sx={{ padding: '0px' }}> sample xls file </Button> to get detailed information about the data fields used while importing...
                                </li>
                                <li style={{ marginBottom: '11px', fontSize: '15px' }}>If you have files in other formats, you can convert it to an accepted file format using any online/offline converter.</li>
                                <li style={{ fontSize: '15px' }}>You can configure your import settings and save them for future too!</li>
                            </ul>
                        </Box>
                    </Grid>
                </GridRow>
                <GridRow>
                    <Grid item xs={12}>
                        <Box sx={{ paddingBottom: '16px' }}>
                            <Button sx={{
                                background: '#1976d2', color: 'white', '&:hover': {
                                    background: '#1976d2'
                                }
                            }}>Next</Button>
                            <Button sx={{ color: '#1976d2', border: '1px solid #1976d2', marginLeft: '10px' }}>Cancel</Button>
                        </Box>
                    </Grid>
                </GridRow>
            </HeaderPaper>
        </Box>
    );
}

export default ImportSalesPriceList;
