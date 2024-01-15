import { Box, Button, Stack, Typography } from "@mui/material";
import FormField from "../InputField/FormField";
import { useEffect, useState } from "react";
import notyf from "../NotificationMessage/notyfInstance";
import { formatDateToYYYYMMDD } from "../../../core/utils/helpers";
import { Close } from "@mui/icons-material";
import { FilterList } from "@mui/icons-material";
import { Search } from "@mui/icons-material";
import MUIButton from "../Button/MUIButton";

function DateRangeHeader({ setSearchPram, setDateBtn, dateBtn }) {
  const [formValues, setFormValues] = useState({
    dateFrom: "",
    dateTo: "",
  });
  useEffect(() => {
   console.log("FormValues", formValues);

    try {
      // Set search parameters for the API call
      setSearchPram({
        fromDate: formValues.dateFrom,
        toDate: formValues.dateTo,
      });
       setRefresh(prev => prev + 1);
    } catch (error) {
      if (error?.data?.errors && Object.keys(error?.data?.errors)?.length > 0)
        console.log(error?.data?.errors);
      else notyf.error(error.data);
    } finally {
      ("empty");
    }
  }, [formValues]);

  // Handle changes in form fields
  const handleFormFieldChange = (fieldName, value) => {
  
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const handleDateOpen = () => {
    setDateBtn(true);
  };

  const handleDateClose = () => {
    setDateBtn(false);
  };


  const handleSearchClick = () => {
    // Validate the form fields if needed
    // ...
  
    // Convert the date values to "MM/DD/YYYY" format
    const formattedDateFrom = new Date(formValues.dateFrom).toLocaleDateString('en-US');
    const formattedDateTo = new Date(formValues.dateTo).toLocaleDateString('en-US');
    //alert(formattedDateFrom,'formattedDateFrom')
    // Trigger the API call by updating setSearchPram
    setSearchPram({
    
      fromDate: formattedDateFrom,
      toDate: formattedDateTo,
    });
  
    // Optionally, trigger a refresh if needed
    setRefresh((prev) => prev + 1);
  };
  
  return (
    <>
      {/* <Typography variant='body1' fontWeight={500} ml={3} mb={3} pt={2}>
				Date Range
			</Typography> */}
      <Button
        sx={{
          padding: "36px",
          "&:hover": {
            background: "none",
          },
        }}
        onClick={handleDateOpen}
      >
        <FilterList /> select dates
      </Button>
      {dateBtn && (
        <Stack direction={"row"} ml={3}>
          <Box>
            <Button onClick={handleDateClose} sx={{ marginTop: "6px" }}>
              <Close />
            </Button>
          </Box>
          <Box sx={{ width: "15%" }}>
            <FormField
              type="date"
              name="date_from"
              size="large"
              value={formValues.dateFrom}
              onChange={(e) =>
                handleFormFieldChange("dateFrom", e.target.value)
              }
              inputProps={{
                 //max: formValues.dateTo,
                // max: formatDateToYYYYMMDD(new Date()),
                max: new Date(formValues.dateFrom).toLocaleDateString('en-US')
                
              }}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              label="From"
            />
          </Box>
          <Box sx={{ width: "15%" }} ml={3}>
            <FormField
              type="date"
              name="date_to"
              size="large"
              inputProps={{
               // min: formValues.dateFrom,
                min: new Date(formValues.dateFrom).toLocaleDateString('en-US')
                // max: formatDateToYYYYMMDD(new Date()),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              value={formValues.dateTo}
              onChange={(e) => handleFormFieldChange("dateTo", e.target.value)}
              fullWidth
              label="To"
            />
          </Box>
          <Box>
            <MUIButton sx={{ padding: "15px", marginLeft: "9px" }} onClick={handleSearchClick}>
              <Typography>Search</Typography>
            </MUIButton>
          </Box>
        </Stack>
      )}
    </>
  );
}

export default DateRangeHeader;
