import { useEffect, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Close, FilterList } from "@mui/icons-material";
import FormField from "../InputField/FormField";
import { formatDateToDDMMYYYY } from "../../../core/utils/helpers";

function DateRangeHeader({ setSearchPram, setDateBtn, dateBtn }) {
  const defaultStartDate = "2023-01-07";
  const defaultToDate = "2023-04-07";

  const [formValues, setFormValues] = useState({
    fromDate: defaultStartDate, // Set default value for fromDate
    toDate: defaultToDate, // Set default value for toDate
  });

  // Load values into the states in-case the state is lost during transitions within components;
  useEffect(() => {
    if (!formValues.fromDate && !formValues.toDate) {
      setFormValues({
        fromDate: defaultStartDate, // Set default value for fromDate
        toDate: defaultToDate, // Set default value for toDate
      });
    }
  }, []);

  // Update the search parameters whenever either fromDate or toDate changes
  useEffect(() => {
    if (formValues.fromDate && formValues.toDate) {
      setSearchPram({
        fromDate: formatDateToDDMMYYYY(formValues.fromDate),
        toDate: formatDateToDDMMYYYY(formValues.toDate),
      });
    }
  }, [formValues.fromDate, formValues.toDate]);

  const handleFormFieldChange = (fieldName, value) => {
    // console.log("Raw Date Value:", value);
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
      {/* Show dateranges when the dateBtn is clicked */}
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
              onKeyDown = {(e) => {
                e.preventDefault();
             }}
            />
          </Box>

          <Box sx={{ width: "15%" }} ml={3}>
            <FormField
              type="date"
              name="toDate"
              size="large"
              onChange={(e) => handleFormFieldChange("toDate", e.target.value)}
              inputProps={{
                max: formatDateToDDMMYYYY(new Date()),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              value={formValues.toDate}
              fromDate
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
