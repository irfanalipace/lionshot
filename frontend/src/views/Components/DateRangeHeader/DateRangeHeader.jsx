import { useEffect, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Close, FilterList } from "@mui/icons-material";
import FormField from "../InputField/FormField";
import notyf from "../NotificationMessage/notyfInstance";
import { formatDateToDDMMYYYY } from "../../../core/utils/helpers";

function DateRangeHeader({ setSearchPram, setDateBtn, dateBtn }) {
  const defaultDate = new Date();
const defaultFormattedDate = formatDateToDDMMYYYY(defaultDate);
  const [formValues, setFormValues] = useState({
    fromDate: defaultFormattedDate, // Set default value for fromDate
    toDate: defaultFormattedDate,   // Set default value for toDate
  });
  console.log("FormValuesssd", formValues);

  useEffect(() => {
    console.log("FormValues", formValues);

    try {
      // Set search parameters for the API call
      setSearchPram({
        fromDate: formatDateToDDMMYYYY(formValues.fromDate),
        toDate: formatDateToDDMMYYYY(formValues.toDate),
      });
      // setRefresh(prev => prev + 1); // Assuming setRefresh is defined elsewhere
    } catch (error) {
      if (error?.data?.errors && Object.keys(error?.data?.errors)?.length > 0)
        console.log(error?.data?.errors);
      else notyf.error(error.data);
    } finally {
      // ("empty"); // Not sure what this line is for, it seems commented out
    }
  }, [formValues]);

  const handleFormFieldChange = (fieldName, value) => {
    // console.log("Raw Date Value:", value);
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value
    }));
  };

  const handleDateOpen = () => {
    setDateBtn(true);
  };

  const handleDateClose = () => {
    setDateBtn(false);
  };

  return (
    <>
      <Button
        sx={{
          padding: "36px",
          "&:hover": {
            background: "none",
          },
        }}
        onClick={handleDateOpen}
      >
        <FilterList /> Select Dates
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
              name="fromDate"
              size="large"
              value={formValues.fromDate}
              onChange={(e) =>
                handleFormFieldChange("fromDate", e.target.value)
              }
              inputProps={{
                min: formatDateToDDMMYYYY(new Date()),
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
              name="toDate"
              size="large"
              inputProps={{
                max: formatDateToDDMMYYYY(new Date()),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              value={formValues.toDate}
              onChange={(e) => handleFormFieldChange("toDate", e.target.value)}
              fullWidth
              label="To"
            />
          </Box>
        </Stack>
      )}
    </>
  );
}

export default DateRangeHeader;
