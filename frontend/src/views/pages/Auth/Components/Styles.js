import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery"; 

export const AuthMainContainer = styled(Box)({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  maxHeight:'100vh'
});

export const AuthSection = styled(Paper)(({ theme }) => ({
  width: useMediaQuery(theme.breakpoints.up("md")) ? "38vw" : "70vw", 
  padding: "2.5rem 3rem",
  // border: ".5px solid #ccc", 
  // ".css-mhc70k-MuiGrid-root>.MuiGrid-item": {
  //   paddingLeft: "0px",
  // },
}));

export const FormContainer = styled(Box)({
  width: "100%",
});

export const AuthFooter = styled(Stack)(({ theme , justifyContent }) => ({
  flexDirection: "row",
  display: "flex",
  justifyContent: justifyContent ? 'flex-end' : 'space-between',
  alignItems: "center",
  marginTop: theme.spacing(1),
}));

 export const StyledCheckboxStack = styled(Stack)(({ theme }) => ({
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
  }));
  
  export const AuthTitle = styled(Typography)({
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    margin:'1rem 0',
    // padding: '0 .3rem',
    fontWeight: 500
  });

  export const AuthImg = styled(Grid)(({ theme })=>({
    display: "flex",
    justifyContent: "center",
    //height:'100px' , 
    "& img": {
      height: useMediaQuery(theme.breakpoints.down("md"))  ?  '80%' : 'auto', 

    },
  }));

  export const AuthSectionTwo = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // width: useMediaQuery(theme.breakpoints.up("md")) ? "30vw" : "70vw", 
    padding: "4rem",
  }));
  