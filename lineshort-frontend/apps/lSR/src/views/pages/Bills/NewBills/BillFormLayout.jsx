import { Margin } from "@mui/icons-material";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery"; 
// import useResponsiveStyles from "../../../../core/hooks/useMedaiQuery";



// export const NewEstimateMainLayout = styled('div')(({ theme }) => ({
//     // margin:'5rem 2rem 1rem 2rem',
//   }));
export const BillFormLayout = styled(Paper)(({ theme }) => ({
    width: "100%",
    // margin: '.5rem 0',
    padding: '1.5rem 2rem 10rem 2rem',
    // background:'red'

  }));


  export const Layout = styled(Paper)(({ theme , padding }) => ({
    padding: padding && '2rem'
  }));




//   export const EstimateFormTitle = styled(Typography)(({ theme }) => ({
//     fontSize: useResponsiveStyles().upMedium ? "14px" : ".6rem",
//     margin:'1rem 0 .4rem 0' 
//   }));