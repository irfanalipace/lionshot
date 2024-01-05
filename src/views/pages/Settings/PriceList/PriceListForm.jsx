import React, { useState, useEffect } from "react";
import {
    Box,
    Divider,
    Switch,
    Typography,
    FormControlLabel,
    Grid,
    Radio,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Paper,
    MenuItem,
    Select,
    FormControl,
    RadioGroup,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import IosShareIcon from "@mui/icons-material/IosShare";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import PublishIcon from "@mui/icons-material/Publish";
import GetAppIcon from "@mui/icons-material/GetApp";
import { ImportExport } from "@mui/icons-material";
import ContainerPaper from "../../../Components/Containers/ContainerPaper";
import GridRow from "../../../Components/GridRow/GridRow";
import CustomSelect from "../../../Components/Select/Select";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PercentIcon from "@mui/icons-material/Percent";
import { useFormik } from "formik";
import InputLabel from "../../../Components/InputLabel/InputLabel";
import FormField from "../../../Components/InputField/FormField";
import SearchIcon from "@mui/icons-material/Search";
import ImportFileModal from "../../../Components/ImportFileModal/ImportFileModal";
import ImportFileBody from "../../../Components/ImportFileModal/importFIleBody";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup"; // Import Yup for validation
const label = { inputProps: { "aria-label": "Switch demo" } };
import {
    createPriceList,
    getCurrenciesApi,
    getRoundofApi,
    deletePriceItem,
    ShowPriceListApi,
    updatePriceList,
} from "../../../../core/api/items";
// import { values } from "lodash";
import { useParams } from "react-router-dom";
import { Error } from "@mui/icons-material";
import notyf from "../../../Components/NotificationMessage/notyfInstance";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { NewPriceListFormLayout } from "./PriceListTable/NewPriceListFormLayout";
import { LoadingButton } from "@mui/lab";
import MUIButton from "../../../Components/Button/MUIButton";

export const PriceListForm = ({ title }) => {
    const [AllCurrencies, setAllCurrencies] = useState([]);
    const [customRateBulkFormVisible, setCustomRateBulkFormVisible] =
        useState(false);
    const [additionalContainerVisible, setAdditionalContainerVisible] =
        useState(false);
    const [Allgetroundvalues, setAllgetroundvalues] = useState([]);
    const [listData, setListData] = useState([]);
    const { id } = useParams();
   
    const navigate = useNavigate();
    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        type: Yup.string().required("Type is required"),
        item_rate: Yup.string().required("Type is required"),

        percentage: Yup.number()
            .required("Percentage is required")
            .min(0, "Percentage must be greater than or equal to 0")
            .max(100, "Percentage must be less than or equal to 100"),
    });
    const formik = useFormik({
        initialValues: {
            name: "",
            type: "sale",
            description: " ",
            percentage_type: "markup",
            round_off: "",
            percentage: "0",
            item_rate: "mark-up-down",
            currency_id: 1,
        },
        validationSchema: validationSchema,

        onSubmit: async (values, { setSubmitting }) => {
            if ("currency" in values) {
                // extra field values set so it should be removed
                delete values.currency;
            }

            if (id) {
                try {
                    const resp = await updatePriceList({
                        ...values,
                        id,
                        _method: "PUT",
                    });
                    notyf.success(resp?.message);

                    navigate("/price-lists");
                } catch (error) {
                    setFieldError(error?.data?.errors);
                } finally {
                    setSubmitting(false);
                }
            } else {
                try {
                    setSubmitting(true);

                    const resp = await createPriceList(values);
                    notyf.success(resp?.message);
                    navigate("/price-lists");
                } catch (error) {
                    console.error("API Error:", error.message);
                    formik.setErrors(error?.data?.data);
                } finally {
                    setSubmitting(false);
                }
            }
        },
    });

    const getAllCurrencies = async () => {
        try {
            const currencies = await getCurrenciesApi();
            setAllCurrencies(
                currencies?.data?.map((currency_id) => {
                    return {
                        value: currency_id?.id,
                        text: currency_id?.code,
                    };
                })
            );
        } catch (e) { }
    };

    const AllroundofValue = async () => {
        try {
            const Allgetroundvalues = await getRoundofApi();
            setAllgetroundvalues(Allgetroundvalues?.data);
        } catch (e) { }
    };

    const fetchData = async () => {
        try {
            const response = await ShowPriceListApi(id);
           
            formik.setValues(response?.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const data = Allgetroundvalues?.RoundOffValues || [];

    const objectArray = data[0]?.map((value) => {
        return {
            label: value,
            value: value,
        };
    });

    useEffect(() => {
        // createPriceList();
        getAllCurrencies();
        AllroundofValue();
    }, []);

    //   const handleRateTypeChange = (event) => {
    //     const selectedValue = event.target.value;
    //     formik.handleChange("item_rate")(selectedValue);
    //     if (selectedValue === "mark-up-down") {
    //       setCustomRateBulkFormVisible(false);
    //     } else if (selectedValue === "individual") {
    //       setCustomRateBulkFormVisible(true);
    //     }
    //   };

    const toggleAdditionalContainer = () => {
        setAdditionalContainerVisible(!additionalContainerVisible);
    };

    const [percentage_type, setPercentageType] = React.useState("10");
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    //   const items = [
    //     {
    //       name: "Item 0",
    //       sku: "SKU:SKU 0",
    //       sgd: "SGD1",
    //     },
    //     {
    //       name: "Item 1",
    //       sku: "SKU:SKU 1",
    //       sgd: "SGD2",
    //     },
    //     {
    //       name: "Item 2",
    //       sku: "SKU:SKU 2",
    //       sgd: "SGD3",
    //     },
    //     {
    //       name: "Item 3",
    //       sku: "SKU:SKU 3",
    //       sgd: "SGD4",
    //     },
    //   ];
    //   const tableData = [
    //     {
    //       round_off: "Never Mined",
    //       inputValue: "1000.678",
    //       roundedValue: "1000.678",
    //     },
    //     {
    //       round_off: "Nearest Whole number",
    //       inputValue: "1000.678",
    //       roundedValue: "1001",
    //     },
    //     ,
    //     {
    //       round_off: "0.99",
    //       inputValue: "1000.678",
    //       roundedValue: "1000.99",
    //     },
    //     ,
    //     {
    //       round_off: "0.50",
    //       inputValue: "1000.678",
    //       roundedValue: "1000.50",
    //     },
    //     ,
    //     {
    //       round_off: "0.49",
    //       inputValue: "1000.678",
    //       roundedValue: "1000.49",
    //     },
    //   ];

    const [selectedMarkupValue, setSelectedMarkupValue] = useState("");
    const handleMarkupChange = (event) => {
        setSelectedMarkupValue(event.target.value);
    };

    const [selectedOption, setSelectedOption] = React.useState("");

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
        formik.setFieldValue("percentage_type", event.target.value);
    };

    const [tableVisible, setTableVisible] = useState(false);

    const toggleTable = () => {
        setTableVisible(!tableVisible);
    };

    const handleClose = () => {
        setTableVisible(false);
        setOpen(false);
    };

    const labelStyle = {
        display: "flex",
        alignItems: "start",
    };


    const RateTypes = {
        MARK_UP_DOWN: "mark-up-down",
        INDIVIDUAL: "individual",
    };


    return (
        // <form onSubmit={formik.handleSubmit}>
        //   <div style={{ position: "relative" }}>
        //     <Grid container paddingBottom={1}>
        //       <NewPriceListFormLayout>
        //         <Grid item container>
        //           <Grid item xs={1.5} sx={{ ...labelStyle }}>
        //             <InputLabel>
        //               Name<span style={{ color: "red" }}>*</span>
        //             </InputLabel>
        //           </Grid>

        //           <Grid item xs={4}>
        //             <FormField
        //               id='name'
        //               name='name'
        //               type='text'
        //               size='small'
        //               variant='outlined'
        //               value={formik.values.name}
        //               fullWidth
        //               handleChange={formik.handleChange}
        //               error={
        //                 formik.touched.name &&
        //                 formik.errors.name &&
        //                 formik.errors.name
        //               }
        //               isTouched={formik.touched.name}
        //             />
        //           </Grid>
        //         </Grid>
        //         <Grid item container mt={2}>
        //           <Grid item xs={1.5}>
        //             <InputLabel mt={1.5}>Type</InputLabel>
        //           </Grid>
        //           <Grid item xs={4}>
        //             <FormControlLabel
        //               id='type'
        //               control={
        //                 <Radio
        //                   name='type'
        //                   value='sale'
        //                   checked={formik?.values?.type === "sale"}
        //                   onChange={formik.handleChange}
        //                 />
        //               }
        //               label={<InputLabel>Sales</InputLabel>}
        //             />
        //             &ensp; &ensp; &ensp;
        //             <FormControlLabel
        //               id='type'
        //               control={
        //                 <Radio
        //                   name='type'
        //                   value='purchase'
        //                   checked={formik?.values?.type === "purchase"}
        //                   onChange={formik.handleChange}
        //                 />
        //               }
        //               label={<InputLabel>Purchase</InputLabel>}
        //             />
        //           </Grid>
        //         </Grid>
        //         <Grid item container mt={2}>
        //           <Grid item xs={1.5}>
        //             <InputLabel mt={1.5}>Item Rate</InputLabel>
        //           </Grid>
        //           <Grid item xs={6}>
        //             <FormControlLabel
        //               id='item_rate'
        //               control={
        //                 <Radio
        //                   name='item_rate'
        //                   value='mark-up-down'
        //                   checked={formik?.values?.item_rate === "mark-up-down"}
        //                   onChange={(e) => {
        //                     handleRateTypeChange(e);
        //                   }}
        //                 />
        //               }
        //               label={
        //                 <InputLabel>
        //                   Markup or Markdown the item rates by a percentage{" "}
        //                 </InputLabel>
        //               }
        //             />{" "}
        //             <br />
        //             <FormControlLabel
        //               id='item_rate'
        //               control={
        //                 <Radio
        //                   name='item_rate'
        //                   value='individual'
        //                   checked={formik?.values?.item_rate === "individual"}
        //                   onChange={(e) => {
        //                     console.log("Selected individual");
        //                     handleRateTypeChange(e);
        //                   }}
        //                 />
        //               }
        //               label={
        //                 <InputLabel>
        //                   Enter the rate individually for each item
        //                 </InputLabel>
        //               }
        //             />
        //           </Grid>
        //         </Grid>

        //         <Grid Item container mt={2}>
        //           <Grid item xs={1.5}>
        //             <InputLabel>Description</InputLabel>
        //           </Grid>
        //           <Grid item xs={4} alignItems='center'>
        //             <FormField
        //               id='description'
        //               type='textarea'
        //               placeholder='Write Description'
        //               value={formik?.values?.description} // Set the value from formik
        //               onChange={formik.handleChange} // Handle change using Formik
        //             />
        //           </Grid>
        //         </Grid>

        //         {formik.values.item_rate === "individual" ? null : (
        //           <Grid item container mt={4}>
        //             <Grid item xs={1.5}>
        //               <InputLabel>
        //                 Percentage<span style={{ color: "red" }}>*</span>
        //               </InputLabel>
        //             </Grid>
        //             <Grid item xs={4}>
        //               <FormField
        //                 variant='outlined'
        //                 type='number'
        //                 fullWidth
        //                 name='percentage'
        //                 value={formik.values.percentage}
        //                 onChange={formik.handleChange}
        //                 isTouched={formik.touched.percentage}
        //                 error={
        //                   formik.touched.percentage &&
        //                   formik.errors.percentage &&
        //                   formik.errors.percentage
        //                 }
        //                 inputProps={{ min: 0, max: 100 }}
        //                 InputProps={{
        //                   startAdornment: (
        //                     <InputAdornment
        //                       position='start'
        //                       sx={{
        //                         marginLeft: "-14px",
        //                         "&:hover": {
        //                           borderColor: "none",
        //                         },
        //                       }}>
        //                       <Select
        //                         sx={{ height: "38px", background: "#EEEEEE" }}
        //                         labelId='demo-controlled-open-select-label'
        //                         id='demo-controlled-open-select'
        //                         open={open}
        //                         onClose={handleClose}
        //                         onOpen={handleOpen}
        //                         value={formik?.values?.percentage_type} // Use percentage_type here
        //                         onChange={handleChange} // Call handleChange when the value changes
        //                         onBlur={formik.handleBlur}>
        //                         <MenuItem value='markup'>Markup</MenuItem>
        //                         <MenuItem value='markdown'>Mark Down</MenuItem>
        //                       </Select>
        //                     </InputAdornment>
        //                   ),
        //                   endAdornment: (
        //                     <InputAdornment
        //                       position='end'
        //                       sx={{ width: "50px", marginLeft: "0px" }}>
        //                       <Button
        //                         sx={{
        //                           background: "#EEEEEE",
        //                           height: "38px",
        //                           borderRadius: "0px",
        //                           "&:hover": {
        //                             background: "#EEEEEE",
        //                           },
        //                         }}>
        //                         <PercentIcon
        //                           fontSize='small'
        //                           sx={{ color: "gray" }}
        //                         />
        //                       </Button>
        //                     </InputAdornment>
        //                   ),
        //                 }}
        //               />
        //             </Grid>
        //           </Grid>
        //         )}

        //         {formik?.values?.item_rate === "mark-up-down" ? null : (
        //           <Grid item container mt={2}>
        //             <Grid item xs={1.5}>
        //               <InputLabel>Currency</InputLabel>
        //             </Grid>
        //             <Grid item xs={4}>
        //               <Select
        //                 sx={{ height: "40px" }}
        //                 labelId='currency_id-label'
        //                 id='currency_id'
        //                 name='currency_id'
        //                 value={formik?.values?.currency_id}
        //                 onChange={formik.handleChange}
        //                 variant='outlined'
        //                 fullWidth
        //                 IconComponent={ArrowDropDownIcon}>
        //                 {AllCurrencies?.map((item) => (
        //                   <MenuItem key={item.id} value={item?.value}>
        //                     {item?.text}
        //                   </MenuItem>
        //                 ))}
        //               </Select>
        //             </Grid>
        //           </Grid>
        //         )}

        //         <Box style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        //           <Paper elevation={3} sx={{ padding: "1rem 2.3rem" }}>
        //             <LoadingButton
        //               type='submit'
        //               variant='contained'
        //               disabled={formik.isSubmitting}
        //               loading={formik.isSubmitting}>
        //               Save
        //             </LoadingButton>
        //             <MUIButton
        //               sx={{ padding: "6px 6px", marginLeft: 3 }}
        //               variant='outlined'
        //               to='/price-lists'
        //               router>
        //               Cancel
        //             </MUIButton>
        //           </Paper>
        //         </Box>
        //       </NewPriceListFormLayout>
        //     </Grid>
        //   </div>
        // </form>


        <form onSubmit={formik.handleSubmit}>
            <div style={{ position: "relative" }}>
                <Grid item container paddingBottom={1}>
                    <NewPriceListFormLayout>
                        <Grid item container>
                            <Grid item xs={1.5} sx={{ ...labelStyle }}>
                                <InputLabel>
                                    Name<span style={{ color: "red" }}>*</span>
                                </InputLabel>
                            </Grid>

                            <Grid item xs={4}>
                                <FormField
                                    id='name'
                                    name='name'
                                    placeholder="Enter Name"
                                    type='text'
                                    size='small'
                                    variant='outlined'
                                    value={formik.values.name}
                                    fullWidth
                                    handleChange={formik.handleChange}
                                    error={
                                        formik.touched.name &&
                                        formik.errors.name &&
                                        formik.errors.name
                                    }
                                    isTouched={formik.touched.name}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container mt={2}>
                            <Grid item xs={1.5}>
                                <InputLabel mt={1.5}>Type</InputLabel>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControlLabel
                                    id='type'
                                    control={
                                        <Radio
                                            name='type'
                                            value='sale'
                                            checked={formik.values.type === "sale"}
                                            onChange={formik.handleChange}
                                        />
                                    }
                                    label={<InputLabel>Sales</InputLabel>}
                                />
                                &ensp; &ensp; &ensp;
                                <FormControlLabel
                                    id='type'
                                    control={
                                        <Radio
                                            name='type'
                                            value='purchase'
                                            checked={formik.values.type === "purchase"}
                                            onChange={formik.handleChange}
                                        />
                                    }
                                    label={<InputLabel>Purchase</InputLabel>}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container mt={2}>
                            <Grid item xs={1.5}>
                                <InputLabel mt={1.5}>Item Rate</InputLabel>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    id='item_rate-mark-up-down'
                                    control={
                                        <Radio
                                            name='item_rate'
                                            value={RateTypes.MARK_UP_DOWN}
                                            checked={formik.values.item_rate === RateTypes.MARK_UP_DOWN}
                                            onChange={formik.handleChange}
                                        />
                                    }
                                    label={
                                        <InputLabel>
                                            Markup or Markdown the item rates by a percentage{" "}
                                        </InputLabel>
                                    }
                                />{" "}
                                <br />
                                <FormControlLabel
                                    id='item_rate-individual'
                                    control={
                                        <Radio
                                            name='item_rate'
                                            value={RateTypes.INDIVIDUAL}
                                            checked={formik.values.item_rate === RateTypes.INDIVIDUAL}
                                            onChange={formik.handleChange}
                                        />
                                    }
                                    label={
                                        <InputLabel>
                                            Enter the rate individually for each item
                                        </InputLabel>
                                    }
                                />
                            </Grid>
                        </Grid>
                        <Grid item container mt={2}>
                            <Grid item xs={1.5}>
                                <InputLabel>Description</InputLabel>
                            </Grid>
                            <Grid item xs={4} alignItems='center'>
                                <FormField
                                    id='description'
                                  
                                    type='textarea'
                                   placeholder="Write Description"
                                    value={formik?.values?.description} // Set the value from formik
                                    onChange={formik.handleChange} // Handle change using Formik
                                />
                            </Grid>
                        </Grid>
                        {formik.values.item_rate === "individual" && (
                            <Grid item container mt={2}>
                                <Grid item xs={1.5}>
                                    <InputLabel>
                                        Percentage<span style={{ color: "red" }}>*</span>
                                    </InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormField
                                        variant='outlined'
                                        type='number'
                                        fullWidth
                                        name='percentage'
                                        value={formik.values.percentage}
                                        onChange={formik.handleChange}
                                        isTouched={formik.touched.percentage}
                                        error={
                                            formik.touched.percentage &&
                                            formik.errors.percentage &&
                                            formik.errors.percentage
                                        }
                                        inputProps={{ min: 0, max: 100 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment
                                                    position='start'
                                                    sx={{
                                                        marginLeft: "-14px",
                                                        "&:hover": {
                                                            borderColor: "none",
                                                        },
                                                    }}>
                                                    <Select
                                                        sx={{ height: "38px", background: "#EEEEEE" }}
                                                        labelId='demo-controlled-open-select-label'
                                                        id='demo-controlled-open-select'
                                                        open={open}
                                                        onClose={handleClose}
                                                        onOpen={handleOpen}
                                                        value={formik?.values?.percentage_type} // Use percentage_type here
                                                        onChange={handleChange} // Call handleChange when the value changes
                                                        onBlur={formik.handleBlur}>
                                                        <MenuItem value='markup'>Markup</MenuItem>
                                                        <MenuItem value='markdown'>Mark Down</MenuItem>
                                                    </Select>
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment
                                                    position='end'
                                                    sx={{ width: "50px", marginLeft: "0px" }}>
                                                    <Button
                                                        sx={{
                                                            background: "#EEEEEE",
                                                            height: "38px",
                                                            borderRadius: "0px",
                                                            "&:hover": {
                                                                background: "#EEEEEE",
                                                            },
                                                        }}>
                                                        <PercentIcon
                                                            fontSize='small'
                                                            sx={{ color: "gray" }}
                                                        />
                                                    </Button>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        )}

                        {formik.values.item_rate === "mark-up-down" && (
                            <Grid item container mt={2}>
                                <Grid item xs={1.5}>
                                    <InputLabel>Currency</InputLabel>
                                </Grid>
                                <Grid item xs={4}>
                                    <Select
                                        sx={{ height: "40px" }}
                                        labelId='currency_id-label'
                                        id='currency_id'
                                        name='currency_id'
                                        value={formik?.values?.currency_id}
                                        onChange={formik.handleChange}
                                        variant='outlined'
                                        fullWidth
                                        IconComponent={ArrowDropDownIcon}>
                                        {AllCurrencies?.map((item) => (
                                           
                                            <MenuItem key={item?.value} value={item?.value}>
                                               
                                                {item?.text}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            </Grid>
                        )}

                        <Box style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
                            <Paper elevation={3} sx={{ padding: "1rem 2.3rem" }}>
                                <LoadingButton
                                    type='submit'
                                    variant='contained'
                                    disabled={formik.isSubmitting}
                                    loading={formik.isSubmitting}>
                                    Save
                                </LoadingButton>
                                <MUIButton
                                    sx={{ padding: "6px 6px", marginLeft: 3 }}
                                    variant='outlined'
                                    to='/price-lists'
                                    router>
                                    Cancel
                                </MUIButton>
                            </Paper>
                        </Box>
                    </NewPriceListFormLayout>
                </Grid>
            </div>
        </form>
    );

};
