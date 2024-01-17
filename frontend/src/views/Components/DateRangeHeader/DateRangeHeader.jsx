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
    if (formValues.fromDate && formValues.toDate) {
      setSearchPram({
       fromDate: formatDateToDDMMYYYY(formValues.fromDate),
      toDate: formatDateToDDMMYYYY(formValues.toDate),
        // fromDate: "07/01/2023",
        // toDate: "07/04/2023"
      });
    }
      // setRefresh(prev => prev + 1); // Assuming setRefresh is defined elsewhere
   
  }, [formValues.toDate]);


  // useEffect(() => {
  //   // Check if fromDate is available
  //   if (formValues.fromDate) {
  //     // Calculate one month later date
  //     const oneMonthLaterDate = new Date(formValues.fromDate);
  //     oneMonthLaterDate.setMonth(oneMonthLaterDate.getMonth() + 1);
  
  //     // Update toDate in the state only if it is not manually filled
  //     if (!formValues.toDate) {
  //       setFormValues((prevValues) => ({
  //         ...prevValues,
  //         toDate: formatDateToDDMMYYYY(oneMonthLaterDate),
  //       }));
  //     }
  //   }
  // }, [formValues.fromDate, formValues.toDate]);
  
  // // Update the search parameters whenever either fromDate or toDate changes
  // useEffect(() => {
  //   if (formValues.fromDate && formValues.toDate) {
  //     setSearchPram({
  //       fromDate: formatDateToDDMMYYYY(formValues.fromDate),
  //       toDate: formatDateToDDMMYYYY(formValues.toDate),
  //       // fromDate: "07/01/2023",
  //       // toDate: "07/04/2023"
  //     });
  //   }
  // }, [formValues.fromDate, formValues.toDate]);
  
  





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
              onChange={e => handleFormFieldChange('fromDate', e.target.value)}
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
              onChange={e => handleFormFieldChange('toDate', e.target.value)}
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


// import React, { useEffect, useState } from "react";
// import { Box, Button, Stack } from "@mui/material";
// import { Close, FilterList } from "@mui/icons-material";
// import FormField from "../InputField/FormField";
// import notyf from "../NotificationMessage/notyfInstance";
// import { formatDateToDDMMYYYY } from "../../../core/utils/helpers";

// function DateRangeHeader({ setSearchPram, setDateBtn, dateBtn }) {
//   const defaultDate = new Date();
//   const defaultFormattedDate = formatDateToDDMMYYYY(defaultDate);
//   const [formValues, setFormValues] = useState({
//     fromDate: defaultFormattedDate,
//     toDate: defaultFormattedDate,
//   });

//   const isBothDatesSelected = formValues.fromDate && formValues.toDate;

//   useEffect(() => {
//     if (isBothDatesSelected) {
//       try {
//         setSearchPram({
//           fromDate: formatDateToDDMMYYYY(formValues.fromDate),
//           toDate: formatDateToDDMMYYYY(formValues.toDate),
//         });
//         // Make the API call or trigger any necessary actions here
//       } catch (error) {
//         if (error?.data?.errors && Object.keys(error?.data?.errors)?.length > 0)
//           console.log(error?.data?.errors);
//         else notyf.error(error.data);
//       } finally {
//         // ("empty"); // Not sure what this line is for, it seems commented out
//       }
//     }
//   }, [formValues, isBothDatesSelected]);

//   const handleFormFieldChange = (fieldName, value) => {
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [fieldName]: value,
//     }));
//   };

//   const handleDateOpen = () => {
//     setDateBtn(true);
//   };

//   const handleDateClose = () => {
//     setDateBtn(false);
//   };

//   return (
//     <>
//       <Button
//         sx={{
//           padding: "36px",
//           "&:hover": {
//             background: "none",
//           },
//         }}
//         onClick={handleDateOpen}
//       >
//         <FilterList /> Select Dates
//       </Button>
//       {dateBtn && (
//         <Stack direction={"row"} ml={3}>
//           <Box>
//             <Button onClick={handleDateClose} sx={{ marginTop: "6px" }}>
//               <Close />
//             </Button>
//           </Box>
//           <Box sx={{ width: "15%" }}>
//             <FormField
//               type="date"
//               name="fromDate"
//               size="large"
//               value={formValues.fromDate}
//               onChange={(e) => handleFormFieldChange("fromDate", e.target.value)}
//               inputProps={{
//                 min: formatDateToDDMMYYYY(new Date()),
//               }}
//               InputLabelProps={{
//                 shrink: true,
//               }}
//               fullWidth
//               label="From"
//             />
//           </Box>
//           <Box sx={{ width: "15%" }} ml={3}>
//             <FormField
//               type="date"
//               name="toDate"
//               size="large"
//               inputProps={{
//                 max: formatDateToDDMMYYYY(new Date()),
//               }}
//               InputLabelProps={{
//                 shrink: true,
//               }}
//               value={formValues.toDate}
//               onChange={(e) => handleFormFieldChange("toDate", e.target.value)}
//               fullWidth
//               label="To"
//             />
//           </Box>
//         </Stack>
//       )}
//     </>
//   );
// }

// export default DateRangeHeader;
