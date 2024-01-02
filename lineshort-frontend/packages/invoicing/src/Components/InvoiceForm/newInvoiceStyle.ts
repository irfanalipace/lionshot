import { Margin } from "@mui/icons-material";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery"; 
import useResponsiveStyles from "../../hooks/useMedaiQuery";

export const MainLayout = styled('div')(({ theme }) => ({
    margin:'1rem 1rem 1rem 1rem',
  }));

  export const MainTitleStyled = styled(Paper)(({ theme }) => ({
    width: "100%",
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'flex-end',
    border: '8px',
    // background:'white',
    // boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.5)', // Simulated elevation
  }));

  export const FormLayout = styled(Paper)(({ theme }) => ({
    width: "100%",
    margin: '1.5rem 0',
    padding: '1.5rem 2rem 4rem 2rem',
  }));